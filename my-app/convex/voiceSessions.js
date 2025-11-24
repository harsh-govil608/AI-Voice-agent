import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save voice session data
export const saveVoiceSession = mutation({
    args: {
        userId: v.string(),
        roomId: v.string(),
        audioData: v.optional(v.string()),
        transcription: v.optional(v.string()),
        aiResponse: v.optional(v.string()),
        processingTime: v.optional(v.number()),
        metadata: v.optional(v.object({
            language: v.string(),
            confidence: v.number(),
            emotion: v.optional(v.string()),
            keywords: v.optional(v.array(v.string())),
        })),
    },
    handler: async (ctx, args) => {
        const sessionId = await ctx.db.insert("voiceSessions", {
            ...args,
            createdAt: new Date().toISOString(),
        });
        return sessionId;
    },
});

// Get voice sessions for a room
export const getRoomVoiceSessions = query({
    args: { roomId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("voiceSessions")
            .filter((q) => q.eq(q.field("roomId"), args.roomId))
            .order("desc")
            .collect();
    },
});

// Get user voice sessions
export const getUserVoiceSessions = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("voiceSessions")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .take(20);
    },
});

// Update voice session with error
export const logVoiceSessionError = mutation({
    args: {
        sessionId: v.string(),
        errorLog: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.sessionId, {
            errorLog: args.errorLog,
            updatedAt: new Date().toISOString(),
        });
        return { success: true };
    },
});

// Get voice session analytics
export const getVoiceAnalytics = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const sessions = await ctx.db
            .query("voiceSessions")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
        
        if (sessions.length === 0) {
            return {
                totalSessions: 0,
                averageConfidence: 0,
                totalProcessingTime: 0,
                topKeywords: [],
                emotionDistribution: {},
            };
        }
        
        // Calculate analytics
        let totalConfidence = 0;
        let totalProcessingTime = 0;
        const keywordCounts = {};
        const emotionCounts = {};
        
        sessions.forEach(session => {
            if (session.metadata) {
                totalConfidence += session.metadata.confidence || 0;
                
                if (session.metadata.keywords) {
                    session.metadata.keywords.forEach(keyword => {
                        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
                    });
                }
                
                if (session.metadata.emotion) {
                    emotionCounts[session.metadata.emotion] = 
                        (emotionCounts[session.metadata.emotion] || 0) + 1;
                }
            }
            
            totalProcessingTime += session.processingTime || 0;
        });
        
        // Get top keywords
        const topKeywords = Object.entries(keywordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([keyword, count]) => ({ keyword, count }));
        
        return {
            totalSessions: sessions.length,
            averageConfidence: totalConfidence / sessions.length,
            totalProcessingTime,
            averageProcessingTime: totalProcessingTime / sessions.length,
            topKeywords,
            emotionDistribution: emotionCounts,
        };
    },
});