import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Initialize platform stats (run once)
export const initializePlatformStats = mutation({
    handler: async (ctx) => {
        const existing = await ctx.db.query("platformStats").first();
        if (!existing) {
            return await ctx.db.insert("platformStats", {
                totalUsers: 0,
                activeUsers: 0,
                totalSessions: 0,
                totalMinutes: 0,
                averageRating: 0,
                totalReviews: 0,
                satisfactionRate: 0,
                dailyActiveUsers: 0,
                weeklyActiveUsers: 0,
                monthlyActiveUsers: 0,
                lastUpdated: new Date().toISOString(),
            });
        }
        return existing._id;
    },
});

// Get platform stats
export const getPlatformStats = query({
    handler: async (ctx) => {
        let stats = await ctx.db.query("platformStats").first();
        
        // If no stats exist, return default values
        if (!stats) {
            return {
                totalUsers: 0,
                activeUsers: 0,
                totalSessions: 0,
                totalMinutes: 0,
                averageRating: 0,
                totalReviews: 0,
                satisfactionRate: 0,
                dailyActiveUsers: 0,
                weeklyActiveUsers: 0,
                monthlyActiveUsers: 0,
                lastUpdated: new Date().toISOString(),
            };
        }
        
        return stats;
    },
});

// Increment user count
export const incrementUserCount = mutation({
    handler: async (ctx) => {
        const stats = await ctx.db.query("platformStats").first();
        if (stats) {
            await ctx.db.patch(stats._id, {
                totalUsers: stats.totalUsers + 1,
                lastUpdated: new Date().toISOString(),
            });
        }
    },
});

// Increment session count
export const incrementSessionCount = mutation({
    args: {
        duration: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const stats = await ctx.db.query("platformStats").first();
        if (stats) {
            await ctx.db.patch(stats._id, {
                totalSessions: stats.totalSessions + 1,
                totalMinutes: stats.totalMinutes + (args.duration || 0),
                lastUpdated: new Date().toISOString(),
            });
        }
    },
});

// Update active users
export const updateActiveUsers = mutation({
    args: {
        daily: v.optional(v.number()),
        weekly: v.optional(v.number()),
        monthly: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const stats = await ctx.db.query("platformStats").first();
        if (stats) {
            const updates = {
                lastUpdated: new Date().toISOString(),
            };
            
            if (args.daily !== undefined) updates.dailyActiveUsers = args.daily;
            if (args.weekly !== undefined) updates.weeklyActiveUsers = args.weekly;
            if (args.monthly !== undefined) updates.monthlyActiveUsers = args.monthly;
            
            // Update activeUsers to be the daily active users
            if (args.daily !== undefined) updates.activeUsers = args.daily;
            
            await ctx.db.patch(stats._id, updates);
        }
    },
});

// Add review and update rating
export const addReview = mutation({
    args: {
        rating: v.number(),
    },
    handler: async (ctx, args) => {
        const stats = await ctx.db.query("platformStats").first();
        if (stats) {
            const newTotalReviews = stats.totalReviews + 1;
            const newAverageRating = ((stats.averageRating * stats.totalReviews) + args.rating) / newTotalReviews;
            const satisfactionRate = (newAverageRating / 5) * 100;
            
            await ctx.db.patch(stats._id, {
                totalReviews: newTotalReviews,
                averageRating: newAverageRating,
                satisfactionRate: satisfactionRate,
                lastUpdated: new Date().toISOString(),
            });
        }
    },
});

// Get formatted stats for display
export const getFormattedStats = query({
    handler: async (ctx) => {
        const stats = await ctx.db.query("platformStats").first();
        
        if (!stats) {
            return {
                totalUsers: "0",
                activeUsers: "0",
                totalSessions: "0",
                totalMinutes: "0",
                averageRating: "0",
                totalHours: "0",
                satisfactionRate: "0%",
            };
        }
        
        return {
            totalUsers: stats.totalUsers.toLocaleString(),
            activeUsers: stats.activeUsers.toLocaleString(),
            totalSessions: stats.totalSessions.toLocaleString(),
            totalMinutes: stats.totalMinutes.toLocaleString(),
            averageRating: stats.averageRating.toFixed(1),
            totalHours: (stats.totalMinutes / 60).toFixed(1),
            satisfactionRate: stats.satisfactionRate.toFixed(0) + "%",
        };
    },
});