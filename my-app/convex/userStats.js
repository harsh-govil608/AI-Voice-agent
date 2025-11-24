import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or get user stats
export const getOrCreateUserStats = mutation({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        let userStats = await ctx.db
            .query("userStats")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
        
        if (!userStats) {
            const statsId = await ctx.db.insert("userStats", {
                userId: args.userId,
                totalSessions: 0,
                totalMinutes: 0,
                averageRating: 0,
                completedSessions: 0,
                streak: 0,
                lastSessionDate: null,
                favoriteExpert: null,
                favoriteCategory: null,
                achievements: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            
            userStats = await ctx.db.get(statsId);
        }
        
        return userStats;
    },
});

// Get user stats
export const getUserStats = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const userStats = await ctx.db
            .query("userStats")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
        
        if (!userStats) {
            return {
                totalSessions: 0,
                totalMinutes: 0,
                averageRating: 0,
                completedSessions: 0,
                streak: 0,
                lastSessionDate: null,
                favoriteExpert: null,
                favoriteCategory: null,
                achievements: [],
            };
        }
        
        return userStats;
    },
});

// Update user stats after session
export const updateUserSessionStats = mutation({
    args: {
        userId: v.string(),
        duration: v.number(),
        rating: v.optional(v.number()),
        expertName: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let userStats = await ctx.db
            .query("userStats")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
        
        if (!userStats) {
            // Create new user stats
            await ctx.db.insert("userStats", {
                userId: args.userId,
                totalSessions: 1,
                totalMinutes: args.duration,
                averageRating: args.rating || 0,
                completedSessions: 1,
                streak: 1,
                lastSessionDate: new Date().toISOString(),
                favoriteExpert: args.expertName || null,
                favoriteCategory: args.category || null,
                achievements: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        } else {
            // Update existing stats
            const newTotalSessions = userStats.totalSessions + 1;
            const newTotalMinutes = userStats.totalMinutes + args.duration;
            
            let newAverageRating = userStats.averageRating;
            if (args.rating) {
                newAverageRating = ((userStats.averageRating * userStats.totalSessions) + args.rating) / newTotalSessions;
            }
            
            // Calculate streak
            let newStreak = userStats.streak;
            const lastSession = userStats.lastSessionDate ? new Date(userStats.lastSessionDate) : null;
            const today = new Date();
            
            if (lastSession) {
                const daysDiff = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                    newStreak = userStats.streak + 1;
                } else if (daysDiff > 1) {
                    newStreak = 1;
                }
            } else {
                newStreak = 1;
            }
            
            // Check for achievements
            const achievements = [...(userStats.achievements || [])];
            if (newTotalSessions === 1 && !achievements.includes("first_session")) {
                achievements.push("first_session");
            }
            if (newTotalSessions === 10 && !achievements.includes("10_sessions")) {
                achievements.push("10_sessions");
            }
            if (newTotalSessions === 50 && !achievements.includes("50_sessions")) {
                achievements.push("50_sessions");
            }
            if (newTotalSessions === 100 && !achievements.includes("100_sessions")) {
                achievements.push("100_sessions");
            }
            if (newStreak === 7 && !achievements.includes("week_streak")) {
                achievements.push("week_streak");
            }
            if (newStreak === 30 && !achievements.includes("month_streak")) {
                achievements.push("month_streak");
            }
            
            await ctx.db.patch(userStats._id, {
                totalSessions: newTotalSessions,
                totalMinutes: newTotalMinutes,
                averageRating: newAverageRating,
                completedSessions: userStats.completedSessions + 1,
                streak: newStreak,
                lastSessionDate: new Date().toISOString(),
                favoriteExpert: args.expertName || userStats.favoriteExpert,
                favoriteCategory: args.category || userStats.favoriteCategory,
                achievements: achievements,
                updatedAt: new Date().toISOString(),
            });
        }
        
        // Also update platform stats
        await ctx.db.query("platformStats").first().then(async (platformStats) => {
            if (platformStats) {
                await ctx.db.patch(platformStats._id, {
                    totalSessions: platformStats.totalSessions + 1,
                    totalMinutes: platformStats.totalMinutes + args.duration,
                    lastUpdated: new Date().toISOString(),
                });
            }
        });
    },
});

// Get formatted user stats for display
export const getFormattedUserStats = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const userStats = await ctx.db
            .query("userStats")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();
        
        if (!userStats) {
            return {
                totalSessions: "0",
                totalMinutes: "0",
                totalHours: "0",
                averageRating: "0",
                completedSessions: "0",
                streak: "0",
                achievements: [],
                percentageIncrease: "+0%",
            };
        }
        
        // Calculate percentage increase (mock for now, would need historical data)
        const percentageIncrease = userStats.totalSessions > 0 ? "+12%" : "+0%";
        
        return {
            totalSessions: userStats.totalSessions.toString(),
            totalMinutes: userStats.totalMinutes.toString(),
            totalHours: (userStats.totalMinutes / 60).toFixed(1),
            averageRating: userStats.averageRating.toFixed(1),
            completedSessions: userStats.completedSessions.toString(),
            streak: userStats.streak.toString(),
            achievements: userStats.achievements || [],
            percentageIncrease: percentageIncrease,
        };
    },
});