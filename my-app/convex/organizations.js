import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Organization schema for multi-tenancy
export const createOrganization = mutation({
  args: {
    name: v.string(),
    plan: v.union(v.literal("starter"), v.literal("professional"), v.literal("enterprise")),
    ownerId: v.string(),
    customBranding: v.optional(v.object({
      logo: v.string(),
      primaryColor: v.string(),
      companyName: v.string(),
      customDomain: v.optional(v.string()),
    })),
    features: v.optional(v.object({
      maxUsers: v.number(),
      maxSessions: v.number(),
      customAgents: v.boolean(),
      apiAccess: v.boolean(),
      whiteLabel: v.boolean(),
      voiceCloning: v.boolean(),
      analytics: v.boolean(),
      certification: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const organizationId = await ctx.db.insert("organizations", {
      ...args,
      createdAt: Date.now(),
      status: "active",
      usage: {
        sessions: 0,
        minutes: 0,
        users: 1,
      },
      billing: {
        stripeCustomerId: null,
        subscriptionId: null,
        currentPeriodEnd: null,
      },
    });
    
    // Create default team
    await ctx.db.insert("teams", {
      organizationId,
      name: "Default Team",
      members: [args.ownerId],
      createdAt: Date.now(),
    });
    
    return organizationId;
  },
});

export const getOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.organizationId);
  },
});

export const updateSubscription = mutation({
  args: {
    organizationId: v.id("organizations"),
    stripeCustomerId: v.string(),
    subscriptionId: v.string(),
    plan: v.string(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const { organizationId, ...billing } = args;
    
    await ctx.db.patch(organizationId, {
      billing: {
        stripeCustomerId: billing.stripeCustomerId,
        subscriptionId: billing.subscriptionId,
        currentPeriodEnd: billing.currentPeriodEnd,
      },
      plan: billing.plan,
    });
  },
});

export const trackUsage = mutation({
  args: {
    organizationId: v.id("organizations"),
    type: v.union(v.literal("session"), v.literal("minutes")),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.organizationId);
    if (!org) return;
    
    const usage = { ...org.usage };
    if (args.type === "session") {
      usage.sessions += 1;
    } else if (args.type === "minutes") {
      usage.minutes += args.amount;
    }
    
    await ctx.db.patch(args.organizationId, { usage });
    
    // Check usage limits
    const limits = getFeatureLimits(org.plan);
    if (usage.sessions > limits.maxSessions || usage.minutes > limits.maxMinutes) {
      // Trigger upgrade notification
      await ctx.db.insert("notifications", {
        organizationId: args.organizationId,
        type: "usage_limit",
        message: "You've reached your plan limits. Upgrade for continued access.",
        createdAt: Date.now(),
      });
    }
  },
});

function getFeatureLimits(plan) {
  const limits = {
    starter: { maxSessions: 100, maxMinutes: 500, maxUsers: 5 },
    professional: { maxSessions: 1000, maxMinutes: 5000, maxUsers: 50 },
    enterprise: { maxSessions: -1, maxMinutes: -1, maxUsers: -1 },
  };
  return limits[plan] || limits.starter;
}