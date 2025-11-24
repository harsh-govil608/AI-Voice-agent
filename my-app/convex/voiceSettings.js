import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all voice providers
export const getAllVoiceProviders = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("voiceProviders")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();
    },
});

// Get voice provider by name
export const getVoiceProvider = query({
    args: { provider: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("voiceProviders")
            .withIndex("by_provider", (q) => q.eq("provider", args.provider))
            .first();
    },
});

// Create voice provider
export const createVoiceProvider = mutation({
    args: {
        provider: v.string(),
        models: v.array(v.string()),
        voices: v.optional(v.array(v.string())),
        languages: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("voiceProviders", {
            ...args,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Get all voice quality settings
export const getAllVoiceQualitySettings = query({
    handler: async (ctx) => {
        return await ctx.db.query("voiceQualitySettings").collect();
    },
});

// Get default voice quality
export const getDefaultVoiceQuality = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("voiceQualitySettings")
            .filter((q) => q.eq(q.field("isDefault"), true))
            .first();
    },
});

// Create voice quality setting
export const createVoiceQualitySetting = mutation({
    args: {
        level: v.string(),
        sampleRate: v.number(),
        bitrate: v.number(),
        isDefault: v.boolean(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        
        // If this is set as default, unset other defaults
        if (args.isDefault) {
            const existingDefaults = await ctx.db
                .query("voiceQualitySettings")
                .filter((q) => q.eq(q.field("isDefault"), true))
                .collect();
            
            for (const setting of existingDefaults) {
                await ctx.db.patch(setting._id, { isDefault: false });
            }
        }
        
        return await ctx.db.insert("voiceQualitySettings", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Get all analytics metrics
export const getAllAnalyticsMetrics = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("analyticsMetrics")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();
    },
});

// Get analytics metrics by category
export const getAnalyticsMetricsByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("analyticsMetrics")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .filter((q) => q.eq(q.field("isActive"), true))
            .first();
    },
});

// Create analytics metric
export const createAnalyticsMetric = mutation({
    args: {
        category: v.string(),
        metrics: v.array(v.string()),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("analyticsMetrics", {
            ...args,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Seed voice providers
export const seedVoiceProviders = mutation({
    handler: async (ctx) => {
        const existingProviders = await ctx.db.query("voiceProviders").collect();
        
        if (existingProviders.length > 0) {
            return { message: "Voice providers already seeded" };
        }
        
        const now = new Date().toISOString();
        const providers = [
            {
                provider: "openai",
                models: ["whisper-1"],
                voices: ["alloy", "echo", "fable", "onyx", "nova", "shimmer"],
                languages: ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"],
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                provider: "elevenlabs",
                models: ["eleven_multilingual_v2"],
                voices: ["rachel", "domi", "bella", "antoni", "elli", "josh"],
                languages: ["en", "es", "fr", "de", "it", "pt", "pl", "ar", "hi", "tr"],
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                provider: "google",
                models: ["en-US-Neural2-C", "en-US-Neural2-D", "en-US-Neural2-F"],
                languages: ["en-US", "en-GB", "en-AU", "en-IN"],
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
        ];
        
        for (const provider of providers) {
            await ctx.db.insert("voiceProviders", provider);
        }
        
        return { message: "Voice providers seeded successfully", count: providers.length };
    },
});

// Seed voice quality settings
export const seedVoiceQualitySettings = mutation({
    handler: async (ctx) => {
        const existingSettings = await ctx.db.query("voiceQualitySettings").collect();
        
        if (existingSettings.length > 0) {
            return { message: "Voice quality settings already seeded" };
        }
        
        const now = new Date().toISOString();
        const settings = [
            {
                level: "high",
                sampleRate: 48000,
                bitrate: 192,
                isDefault: false,
                createdAt: now,
                updatedAt: now,
            },
            {
                level: "medium",
                sampleRate: 24000,
                bitrate: 128,
                isDefault: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                level: "low",
                sampleRate: 16000,
                bitrate: 64,
                isDefault: false,
                createdAt: now,
                updatedAt: now,
            },
        ];
        
        for (const setting of settings) {
            await ctx.db.insert("voiceQualitySettings", setting);
        }
        
        return { message: "Voice quality settings seeded successfully", count: settings.length };
    },
});

// Seed analytics metrics
export const seedAnalyticsMetrics = mutation({
    handler: async (ctx) => {
        const existingMetrics = await ctx.db.query("analyticsMetrics").collect();
        
        if (existingMetrics.length > 0) {
            return { message: "Analytics metrics already seeded" };
        }
        
        const now = new Date().toISOString();
        const metrics = [
            {
                category: "speechMetrics",
                metrics: ["clarity", "pace", "volume", "pronunciation", "fluency"],
                description: "Metrics for analyzing speech quality and delivery",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                category: "engagementMetrics",
                metrics: ["attention", "interaction_frequency", "response_quality", "topic_relevance"],
                description: "Metrics for measuring user engagement and participation",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                category: "learningMetrics",
                metrics: ["comprehension", "retention", "application", "improvement_rate"],
                description: "Metrics for tracking learning progress and outcomes",
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
        ];
        
        for (const metric of metrics) {
            await ctx.db.insert("analyticsMetrics", metric);
        }
        
        return { message: "Analytics metrics seeded successfully", count: metrics.length };
    },
});