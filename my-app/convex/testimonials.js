import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new testimonial
export const createTestimonial = mutation({
    args: {
        name: v.string(),
        role: v.string(),
        content: v.string(),
        rating: v.number(),
        userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("testimonials", {
            name: args.name,
            role: args.role,
            content: args.content,
            rating: args.rating,
            isApproved: false, // Needs admin approval
            isFeatured: false,
            userId: args.userId || null,
            createdAt: new Date().toISOString(),
        });
    },
});

// Get all approved testimonials
export const getApprovedTestimonials = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("testimonials")
            .withIndex("by_approved", (q) => q.eq("isApproved", true))
            .collect();
    },
});

// Get featured testimonials
export const getFeaturedTestimonials = query({
    handler: async (ctx) => {
        const testimonials = await ctx.db
            .query("testimonials")
            .withIndex("by_featured", (q) => q.eq("isFeatured", true))
            .collect();
        
        // If no featured testimonials, return empty array
        if (testimonials.length === 0) {
            return [];
        }
        
        return testimonials;
    },
});

// Approve a testimonial (admin function)
export const approveTestimonial = mutation({
    args: {
        testimonialId: v.id("testimonials"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.testimonialId, {
            isApproved: true,
        });
    },
});

// Feature a testimonial (admin function)
export const featureTestimonial = mutation({
    args: {
        testimonialId: v.id("testimonials"),
        isFeatured: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.testimonialId, {
            isFeatured: args.isFeatured,
        });
    },
});

// Get testimonials for landing page (max 3 featured)
export const getLandingPageTestimonials = query({
    handler: async (ctx) => {
        const featured = await ctx.db
            .query("testimonials")
            .withIndex("by_featured", (q) => q.eq("isFeatured", true))
            .take(3);
        
        if (featured.length < 3) {
            // If not enough featured, get some approved ones
            const approved = await ctx.db
                .query("testimonials")
                .withIndex("by_approved", (q) => q.eq("isApproved", true))
                .take(3 - featured.length);
            
            return [...featured, ...approved];
        }
        
        return featured;
    },
});

// Get user's testimonial
export const getUserTestimonial = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("testimonials")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();
    },
});

// Update testimonial
export const updateTestimonial = mutation({
    args: {
        testimonialId: v.id("testimonials"),
        content: v.optional(v.string()),
        rating: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const updates = {};
        if (args.content !== undefined) updates.content = args.content;
        if (args.rating !== undefined) updates.rating = args.rating;
        
        if (Object.keys(updates).length > 0) {
            await ctx.db.patch(args.testimonialId, updates);
        }
    },
});

// Delete testimonial
export const deleteTestimonial = mutation({
    args: {
        testimonialId: v.id("testimonials"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.testimonialId);
    },
});