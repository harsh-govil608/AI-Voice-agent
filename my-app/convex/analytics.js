import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save analytics data
export const saveAnalytics = mutation({
    args: {
        userId: v.string(),
        sessionId: v.string(),
        metrics: v.object({
            speechClarity: v.number(),
            responseTime: v.number(),
            engagementScore: v.number(),
            topicRelevance: v.number(),
            improvementAreas: v.array(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const analyticsId = await ctx.db.insert("analytics", {
            ...args,
            timestamp: new Date().toISOString(),
        });
        return analyticsId;
    },
});

// Get user analytics
export const getUserAnalytics = query({
    args: { 
        userId: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 30;
        return await ctx.db
            .query("analytics")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .take(limit);
    },
});

// Get aggregated analytics
export const getAggregatedAnalytics = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const analytics = await ctx.db
            .query("analytics")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
        
        if (analytics.length === 0) {
            return {
                averageClarity: 0,
                averageResponseTime: 0,
                averageEngagement: 0,
                averageRelevance: 0,
                totalSessions: 0,
                improvementAreas: [],
                trend: {},
            };
        }
        
        // Calculate averages
        let totalClarity = 0;
        let totalResponseTime = 0;
        let totalEngagement = 0;
        let totalRelevance = 0;
        const improvementAreasCount = {};
        
        analytics.forEach(record => {
            totalClarity += record.metrics.speechClarity;
            totalResponseTime += record.metrics.responseTime;
            totalEngagement += record.metrics.engagementScore;
            totalRelevance += record.metrics.topicRelevance;
            
            record.metrics.improvementAreas.forEach(area => {
                improvementAreasCount[area] = (improvementAreasCount[area] || 0) + 1;
            });
        });
        
        const count = analytics.length;
        
        // Calculate trend (last 5 sessions)
        const recentSessions = analytics.slice(0, 5);
        const trend = {
            clarity: calculateTrend(recentSessions.map(s => s.metrics.speechClarity)),
            engagement: calculateTrend(recentSessions.map(s => s.metrics.engagementScore)),
            responseTime: calculateTrend(recentSessions.map(s => s.metrics.responseTime)),
            relevance: calculateTrend(recentSessions.map(s => s.metrics.topicRelevance)),
        };
        
        // Get top improvement areas
        const topImprovementAreas = Object.entries(improvementAreasCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([area, count]) => ({ area, count, percentage: (count / analytics.length) * 100 }));
        
        return {
            averageClarity: totalClarity / count,
            averageResponseTime: totalResponseTime / count,
            averageEngagement: totalEngagement / count,
            averageRelevance: totalRelevance / count,
            totalSessions: count,
            improvementAreas: topImprovementAreas,
            trend,
        };
    },
});

// Helper function to calculate trend
function calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const recent = values.slice(0, Math.ceil(values.length / 2));
    const older = values.slice(Math.ceil(values.length / 2));
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    return ((recentAvg - olderAvg) / olderAvg) * 100;
}

// Get session comparison
export const getSessionComparison = query({
    args: {
        userId: v.string(),
        sessionId1: v.string(),
        sessionId2: v.string(),
    },
    handler: async (ctx, args) => {
        const analytics1 = await ctx.db
            .query("analytics")
            .filter((q) => 
                q.and(
                    q.eq(q.field("userId"), args.userId),
                    q.eq(q.field("sessionId"), args.sessionId1)
                )
            )
            .first();
        
        const analytics2 = await ctx.db
            .query("analytics")
            .filter((q) => 
                q.and(
                    q.eq(q.field("userId"), args.userId),
                    q.eq(q.field("sessionId"), args.sessionId2)
                )
            )
            .first();
        
        if (!analytics1 || !analytics2) {
            return null;
        }
        
        return {
            session1: analytics1,
            session2: analytics2,
            comparison: {
                clarityDiff: analytics2.metrics.speechClarity - analytics1.metrics.speechClarity,
                responseTimeDiff: analytics2.metrics.responseTime - analytics1.metrics.responseTime,
                engagementDiff: analytics2.metrics.engagementScore - analytics1.metrics.engagementScore,
                relevanceDiff: analytics2.metrics.topicRelevance - analytics1.metrics.topicRelevance,
            },
        };
    },
});

// Get leaderboard
export const getLeaderboard = query({
    args: { 
        metric: v.string(), // "clarity", "engagement", "responseTime", "relevance"
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;
        const allAnalytics = await ctx.db.query("analytics").collect();
        
        // Group by user and calculate averages
        const userMetrics = {};
        
        allAnalytics.forEach(record => {
            if (!userMetrics[record.userId]) {
                userMetrics[record.userId] = {
                    userId: record.userId,
                    totalSessions: 0,
                    totalClarity: 0,
                    totalEngagement: 0,
                    totalResponseTime: 0,
                    totalRelevance: 0,
                };
            }
            
            userMetrics[record.userId].totalSessions++;
            userMetrics[record.userId].totalClarity += record.metrics.speechClarity;
            userMetrics[record.userId].totalEngagement += record.metrics.engagementScore;
            userMetrics[record.userId].totalResponseTime += record.metrics.responseTime;
            userMetrics[record.userId].totalRelevance += record.metrics.topicRelevance;
        });
        
        // Calculate averages and sort
        const leaderboard = Object.values(userMetrics).map(user => ({
            userId: user.userId,
            sessions: user.totalSessions,
            averageClarity: user.totalClarity / user.totalSessions,
            averageEngagement: user.totalEngagement / user.totalSessions,
            averageResponseTime: user.totalResponseTime / user.totalSessions,
            averageRelevance: user.totalRelevance / user.totalSessions,
        }));
        
        // Sort by specified metric
        const sortKey = {
            clarity: 'averageClarity',
            engagement: 'averageEngagement',
            responseTime: 'averageResponseTime',
            relevance: 'averageRelevance',
        }[args.metric] || 'averageEngagement';
        
        leaderboard.sort((a, b) => {
            // For response time, lower is better
            if (sortKey === 'averageResponseTime') {
                return a[sortKey] - b[sortKey];
            }
            return b[sortKey] - a[sortKey];
        });
        
        return leaderboard.slice(0, limit);
    },
});