import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// AI Agent Marketplace
export const createCustomAgent = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    systemPrompt: v.string(),
    voiceSettings: v.object({
      voice: v.string(),
      speed: v.number(),
      pitch: v.number(),
      language: v.string(),
    }),
    knowledgeBase: v.optional(v.array(v.string())),
    skills: v.array(v.string()),
    pricing: v.object({
      model: v.union(v.literal("free"), v.literal("paid"), v.literal("subscription")),
      price: v.optional(v.number()),
      currency: v.optional(v.string()),
      revenueShare: v.optional(v.number()), // percentage for creator
    }),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const agentId = await ctx.db.insert("customAgents", {
      ...args,
      createdAt: Date.now(),
      downloads: 0,
      rating: 0,
      reviews: [],
      earnings: 0,
      version: "1.0.0",
      status: "draft",
    });

    // Create agent analytics entry
    await ctx.db.insert("agentAnalytics", {
      agentId,
      organizationId: args.organizationId,
      views: 0,
      installs: 0,
      sessions: 0,
      totalMinutes: 0,
      revenue: 0,
      userSatisfaction: 0,
    });

    return agentId;
  },
});

export const publishAgent = mutation({
  args: {
    agentId: v.id("customAgents"),
    marketplaceListing: v.object({
      featured: v.boolean(),
      tags: v.array(v.string()),
      screenshots: v.array(v.string()),
      demoVideo: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.agentId, {
      status: "published",
      published: true,
      publishedAt: Date.now(),
      marketplaceListing: args.marketplaceListing,
    });

    // Notify marketplace moderators for review
    await ctx.db.insert("marketplaceReview", {
      agentId: args.agentId,
      status: "pending",
      submittedAt: Date.now(),
    });
  },
});

export const searchMarketplace = query({
  args: {
    query: v.optional(v.string()),
    category: v.optional(v.string()),
    priceRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
    })),
    sortBy: v.optional(v.union(
      v.literal("popular"),
      v.literal("recent"),
      v.literal("rating"),
      v.literal("price")
    )),
  },
  handler: async (ctx, args) => {
    let agents = await ctx.db
      .query("customAgents")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    // Apply filters
    if (args.query) {
      agents = agents.filter(agent => 
        agent.name.toLowerCase().includes(args.query.toLowerCase()) ||
        agent.description.toLowerCase().includes(args.query.toLowerCase())
      );
    }

    if (args.category) {
      agents = agents.filter(agent => agent.category === args.category);
    }

    if (args.priceRange) {
      agents = agents.filter(agent => {
        const price = agent.pricing.price || 0;
        return price >= args.priceRange.min && price <= args.priceRange.max;
      });
    }

    // Sort results
    switch (args.sortBy) {
      case "popular":
        agents.sort((a, b) => b.downloads - a.downloads);
        break;
      case "recent":
        agents.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "rating":
        agents.sort((a, b) => b.rating - a.rating);
        break;
      case "price":
        agents.sort((a, b) => (a.pricing.price || 0) - (b.pricing.price || 0));
        break;
    }

    return agents;
  },
});

export const installAgent = mutation({
  args: {
    agentId: v.id("customAgents"),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    
    // Process payment if required
    if (agent.pricing.model === "paid") {
      // Verify payment before installation
      const payment = await ctx.db
        .query("agentPurchases")
        .filter((q) => 
          q.eq(q.field("agentId"), args.agentId) &&
          q.eq(q.field("organizationId"), args.organizationId)
        )
        .first();
      
      if (!payment) {
        throw new Error("Payment required for this agent");
      }
    }

    // Create installation record
    await ctx.db.insert("agentInstallations", {
      agentId: args.agentId,
      organizationId: args.organizationId,
      installedAt: Date.now(),
      version: agent.version,
      active: true,
    });

    // Update agent stats
    await ctx.db.patch(args.agentId, {
      downloads: agent.downloads + 1,
    });

    // Update analytics
    const analytics = await ctx.db
      .query("agentAnalytics")
      .filter((q) => q.eq(q.field("agentId"), args.agentId))
      .first();
    
    if (analytics) {
      await ctx.db.patch(analytics._id, {
        installs: analytics.installs + 1,
      });
    }

    return { success: true, agentId: args.agentId };
  },
});

export const rateAgent = mutation({
  args: {
    agentId: v.id("customAgents"),
    userId: v.string(),
    rating: v.number(),
    review: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    
    const newReview = {
      userId: args.userId,
      rating: args.rating,
      review: args.review,
      createdAt: Date.now(),
    };

    const reviews = [...agent.reviews, newReview];
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await ctx.db.patch(args.agentId, {
      reviews,
      rating: avgRating,
    });
  },
});

// API access for external developers
export const generateAPIKey = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = `pk_${generateRandomString(32)}`;
    const secretKey = `sk_${generateRandomString(48)}`;

    await ctx.db.insert("apiKeys", {
      organizationId: args.organizationId,
      name: args.name,
      publicKey: apiKey,
      secretKeyHash: hashSecret(secretKey),
      permissions: args.permissions,
      createdAt: Date.now(),
      lastUsed: null,
      requests: 0,
      active: true,
    });

    return { apiKey, secretKey }; // Return secret key only once
  },
});

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function hashSecret(secret) {
  // In production, use proper hashing like bcrypt
  return Buffer.from(secret).toString('base64');
}