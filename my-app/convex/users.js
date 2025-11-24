import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser=mutation({
    args:{
        name:v.string(),
        email:v.string()
    },
    handler:async(ctx,args)=>{
        const userData=await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args.email)).collect();
        if(userData?.length==0){
            const data={
                name: args.name,
                email:args.email,
                credits:10, // Start with 10 free credits instead of 50000
                theme: "dark",
                backgroundStyle: "gradient",
                primaryColor: "#6366F1",
                accentColor: "#10B981",
                totalSessions: 0,
                preferredLanguage: "en",
                voicePreference: "default",
                lastActive: new Date().toISOString()
            }
            const userId = await ctx.db.insert('users',{
                ...data
            });
            
            // Create user stats
            await ctx.db.insert("userStats", {
                userId: userId,
                totalSessions: 0,
                totalMinutes: 0,
                averageRating: 0,
                completedSessions: 0,
                streak: 0,
                lastSessionDate: null,
                favoriteExpert: null,
                favoriteCategory: null,
                achievements: ["welcome"],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            
            // Increment platform user count
            const platformStats = await ctx.db.query("platformStats").first();
            if (platformStats) {
                await ctx.db.patch(platformStats._id, {
                    totalUsers: platformStats.totalUsers + 1,
                    activeUsers: platformStats.activeUsers + 1,
                    dailyActiveUsers: platformStats.dailyActiveUsers + 1,
                    weeklyActiveUsers: platformStats.weeklyActiveUsers + 1,
                    monthlyActiveUsers: platformStats.monthlyActiveUsers + 1,
                    lastUpdated: new Date().toISOString(),
                });
            } else {
                // Initialize platform stats if they don't exist
                await ctx.db.insert("platformStats", {
                    totalUsers: 1,
                    activeUsers: 1,
                    totalSessions: 0,
                    totalMinutes: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    satisfactionRate: 0,
                    dailyActiveUsers: 1,
                    weeklyActiveUsers: 1,
                    monthlyActiveUsers: 1,
                    lastUpdated: new Date().toISOString(),
                });
            }
            
            console.log("New user created:", userId);
            return data;
        }
        return userData[0];
    }
});

// Get user preferences
export const getUserPreferences = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();
        
        if (!user) {
            return {
                theme: "dark",
                backgroundStyle: "gradient",
                primaryColor: "#6366F1",
                accentColor: "#10B981"
            };
        }
        
        return {
            theme: user.theme || "dark",
            backgroundStyle: user.backgroundStyle || "gradient",
            primaryColor: user.primaryColor || "#6366F1",
            accentColor: user.accentColor || "#10B981"
        };
    },
});

// Update user theme
export const updateTheme = mutation({
    args: {
        email: v.string(),
        theme: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();
        
        if (!user) {
            await ctx.db.insert("users", {
                name: "User",
                email: args.email,
                credits: 10, // Start with 10 free credits
                theme: args.theme,
                backgroundStyle: "gradient",
                primaryColor: "#6366F1",
                accentColor: "#10B981",
                totalSessions: 0,
                preferredLanguage: "en",
                voicePreference: "default",
                lastActive: new Date().toISOString()
            });
        } else {
            await ctx.db.patch(user._id, {
                theme: args.theme
            });
        }
        
        return { success: true };
    },
});

// Update background style
export const updateBackgroundStyle = mutation({
    args: {
        email: v.string(),
        backgroundStyle: v.string(),
        primaryColor: v.optional(v.string()),
        accentColor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { email, ...stylePrefs } = args;
        
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();
        
        if (!user) {
            await ctx.db.insert("users", {
                name: "User",
                email: email,
                credits: 10, // Start with 10 free credits
                theme: "dark",
                totalSessions: 0,
                preferredLanguage: "en",
                voicePreference: "default",
                lastActive: new Date().toISOString(),
                ...stylePrefs
            });
        } else {
            await ctx.db.patch(user._id, stylePrefs);
        }
        
        return { success: true };
    },
})