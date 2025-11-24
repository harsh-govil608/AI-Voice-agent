import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";

export default defineSchema({
    users:defineTable({
        name: v.string(),
        email:v.string(),
        credits:v.number(),
        subscriptionId: v.optional(v.string()),
        totalSessions: v.optional(v.number()),
        preferredLanguage: v.optional(v.string()),
        voicePreference: v.optional(v.string()),
        lastActive: v.optional(v.string()),
        theme: v.optional(v.string()),
        backgroundStyle: v.optional(v.string()),
        primaryColor: v.optional(v.string()),
        accentColor: v.optional(v.string())
    }),
    
    discussionRooms:defineTable({
        userId: v.string(),
        coachingOption:v.string(),
        topic:v.string(),
        expertName:v.string(),
        conversation:v.optional(v.array(v.object({
            role: v.string(),
            content: v.string(),
            timestamp: v.string(),
            audioUrl: v.optional(v.string()),
            sentiment: v.optional(v.string()),
            duration: v.optional(v.number())
        }))),
        status: v.string(), // active, completed, paused
        startTime: v.string(),
        endTime: v.optional(v.string()),
        duration: v.optional(v.number()),
        transcript: v.optional(v.string()),
        summary: v.optional(v.string()),
        actionItems: v.optional(v.array(v.string())),
        feedback: v.optional(v.object({
            rating: v.number(),
            comment: v.optional(v.string())
        }))
    }),
    
    voiceSessions:defineTable({
        userId: v.string(),
        roomId: v.string(),
        audioData: v.optional(v.string()),
        transcription: v.optional(v.string()),
        aiResponse: v.optional(v.string()),
        processingTime: v.optional(v.number()),
        errorLog: v.optional(v.string()),
        metadata: v.optional(v.object({
            language: v.string(),
            confidence: v.number(),
            emotion: v.optional(v.string()),
            keywords: v.optional(v.array(v.string()))
        }))
    }),
    
    analytics:defineTable({
        userId: v.string(),
        sessionId: v.string(),
        metrics: v.object({
            speechClarity: v.number(),
            responseTime: v.number(),
            engagementScore: v.number(),
            topicRelevance: v.number(),
            improvementAreas: v.array(v.string())
        }),
        timestamp: v.string()
    }),
    
    expertProfiles:defineTable({
        name: v.string(),
        avatar: v.string(),
        expertise: v.array(v.string()),
        voice: v.string(),
        personality: v.string(),
        responseStyle: v.string(),
        rating: v.number(),
        totalSessions: v.number(),
        languages: v.array(v.string())
    }),
    
    coachingOptions: defineTable({
        name: v.string(),
        icon: v.string(),
        description: v.string(),
        duration: v.string(),
        level: v.string(),
        category: v.optional(v.string()),
        isActive: v.boolean(),
        order: v.number(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_name", ["name"])
      .index("by_active", ["isActive"])
      .index("by_order", ["order"]),
    
    voiceProviders: defineTable({
        provider: v.string(),
        models: v.array(v.string()),
        voices: v.optional(v.array(v.string())),
        languages: v.optional(v.array(v.string())),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_provider", ["provider"]),
    
    voiceQualitySettings: defineTable({
        level: v.string(),
        sampleRate: v.number(),
        bitrate: v.number(),
        isDefault: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_level", ["level"]),
    
    analyticsMetrics: defineTable({
        category: v.string(),
        metrics: v.array(v.string()),
        description: v.optional(v.string()),
        isActive: v.boolean(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_category", ["category"]),
    
    platformStats: defineTable({
        totalUsers: v.number(),
        activeUsers: v.number(),
        totalSessions: v.number(),
        totalMinutes: v.number(),
        averageRating: v.number(),
        totalReviews: v.number(),
        satisfactionRate: v.number(),
        dailyActiveUsers: v.number(),
        weeklyActiveUsers: v.number(),
        monthlyActiveUsers: v.number(),
        lastUpdated: v.string(),
    }),
    
    userStats: defineTable({
        userId: v.string(),
        totalSessions: v.number(),
        totalMinutes: v.number(),
        averageRating: v.number(),
        completedSessions: v.number(),
        streak: v.number(),
        lastSessionDate: v.optional(v.string()),
        favoriteExpert: v.optional(v.string()),
        favoriteCategory: v.optional(v.string()),
        achievements: v.optional(v.array(v.string())),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_user", ["userId"]),
    
    testimonials: defineTable({
        name: v.string(),
        role: v.string(),
        content: v.string(),
        rating: v.number(),
        isApproved: v.boolean(),
        isFeatured: v.boolean(),
        userId: v.optional(v.string()),
        createdAt: v.string(),
    }).index("by_featured", ["isFeatured"])
      .index("by_approved", ["isApproved"])
})