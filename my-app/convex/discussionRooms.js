import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get a discussion room by ID
export const getDiscussionRoom = query({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get all discussion rooms for a user
export const getUserDiscussionRooms = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("discussionRooms")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .take(10);
    },
});

// Create a new discussion room
export const createDiscussionRoom = mutation({
    args: {
        userId: v.string(),
        coachingOption: v.string(),
        topic: v.string(),
        expertName: v.string(),
    },
    handler: async (ctx, args) => {
        const roomId = await ctx.db.insert("discussionRooms", {
            userId: args.userId,
            coachingOption: args.coachingOption,
            topic: args.topic,
            expertName: args.expertName,
            status: "pending",
            startTime: new Date().toISOString(),
            conversation: [],
        });
        return roomId;
    },
});

// Update discussion room
export const updateDiscussionRoom = mutation({
    args: {
        id: v.string(),
        status: v.optional(v.string()),
        startTime: v.optional(v.string()),
        endTime: v.optional(v.string()),
        duration: v.optional(v.number()),
        transcript: v.optional(v.string()),
        summary: v.optional(v.string()),
        conversation: v.optional(v.array(v.object({
            role: v.string(),
            content: v.string(),
            timestamp: v.string(),
        }))),
        actionItems: v.optional(v.array(v.string())),
        feedback: v.optional(v.object({
            rating: v.number(),
            comment: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

// Add message to conversation
export const addMessage = mutation({
    args: {
        roomId: v.string(),
        role: v.string(),
        content: v.string(),
        audioUrl: v.optional(v.string()),
        sentiment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.roomId);
        if (!room) throw new Error("Room not found");
        
        const newMessage = {
            role: args.role,
            content: args.content,
            timestamp: new Date().toISOString(),
            audioUrl: args.audioUrl,
            sentiment: args.sentiment,
        };
        
        const conversation = room.conversation || [];
        conversation.push(newMessage);
        
        await ctx.db.patch(args.roomId, { conversation });
        return { success: true };
    },
});

// Get room statistics
export const getRoomStatistics = query({
    args: { roomId: v.string() },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.roomId);
        if (!room) return null;
        
        const messageCount = room.conversation ? room.conversation.length : 0;
        const duration = room.duration || 0;
        
        return {
            messageCount,
            duration,
            status: room.status,
            rating: room.feedback?.rating,
        };
    },
});

// Delete discussion room
export const deleteDiscussionRoom = mutation({
    args: { id: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});