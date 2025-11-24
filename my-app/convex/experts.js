import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all experts
export const getAllExperts = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("expertProfiles")
            .collect();
    },
});

// Get expert by name
export const getExpertByName = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("expertProfiles")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first();
    },
});

// Get experts by expertise
export const getExpertsByExpertise = query({
    args: { expertise: v.string() },
    handler: async (ctx, args) => {
        const allExperts = await ctx.db.query("expertProfiles").collect();
        return allExperts.filter(expert => 
            expert.expertise.includes(args.expertise)
        );
    },
});

// Create expert
export const createExpert = mutation({
    args: {
        name: v.string(),
        avatar: v.string(),
        expertise: v.array(v.string()),
        voice: v.string(),
        personality: v.string(),
        responseStyle: v.string(),
        languages: v.array(v.string()),
        rating: v.number(),
        totalSessions: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("expertProfiles", args);
    },
});

// Update expert
export const updateExpert = mutation({
    args: {
        id: v.id("expertProfiles"),
        name: v.optional(v.string()),
        avatar: v.optional(v.string()),
        expertise: v.optional(v.array(v.string())),
        voice: v.optional(v.string()),
        personality: v.optional(v.string()),
        responseStyle: v.optional(v.string()),
        languages: v.optional(v.array(v.string())),
        rating: v.optional(v.number()),
        totalSessions: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return { success: true };
    },
});

// Update expert rating
export const updateExpertRating = mutation({
    args: {
        id: v.id("expertProfiles"),
        newRating: v.number(),
    },
    handler: async (ctx, args) => {
        const expert = await ctx.db.get(args.id);
        if (!expert) throw new Error("Expert not found");
        
        // Calculate new average rating
        const totalRating = expert.rating * expert.totalSessions + args.newRating;
        const newTotalSessions = expert.totalSessions + 1;
        const newAvgRating = totalRating / newTotalSessions;
        
        await ctx.db.patch(args.id, {
            rating: Number(newAvgRating.toFixed(2)),
            totalSessions: newTotalSessions,
        });
        
        return { success: true };
    },
});

// Delete expert
export const deleteExpert = mutation({
    args: { id: v.id("expertProfiles") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// Seed initial experts
export const seedExperts = mutation({
    handler: async (ctx) => {
        const existingExperts = await ctx.db.query("expertProfiles").collect();
        
        if (existingExperts.length > 0) {
            return { message: "Experts already seeded" };
        }
        
        const experts = [
            {
                name: "Dr. Sophia Chen",
                avatar: "/t1.svg",
                expertise: ["Technical Training", "Career Coaching", "Mock Interview"],
                voice: "professional",
                personality: "Analytical and supportive, focuses on practical solutions",
                responseStyle: "Direct and informative with clear examples",
                languages: ["English", "Mandarin", "Spanish"],
                rating: 4.9,
                totalSessions: 1250,
            },
            {
                name: "Prof. James Mitchell",
                avatar: "/t2.svg",
                expertise: ["Lecture on Topic", "Q&A Preparation", "Business Strategy"],
                voice: "warm",
                personality: "Encouraging educator with decades of experience",
                responseStyle: "Patient and thorough with emphasis on understanding",
                languages: ["English", "French", "German"],
                rating: 4.8,
                totalSessions: 2100,
            },
            {
                name: "Maya Patel",
                avatar: "/t3.svg",
                expertise: ["Language Skills", "Meditation & Wellness", "Career Coaching"],
                voice: "calm",
                personality: "Empathetic and patient, creates safe learning environment",
                responseStyle: "Gentle and encouraging with focus on progress",
                languages: ["English", "Hindi", "Bengali", "Tamil"],
                rating: 4.95,
                totalSessions: 1800,
            },
            {
                name: "Alex Rodriguez",
                avatar: "/t4.svg",
                expertise: ["Mock Interview", "Business Strategy", "Technical Training"],
                voice: "energetic",
                personality: "Dynamic and motivating, pushes for excellence",
                responseStyle: "Enthusiastic and challenging with actionable feedback",
                languages: ["English", "Spanish", "Portuguese"],
                rating: 4.85,
                totalSessions: 950,
            },
            {
                name: "Dr. Sarah Williams",
                avatar: "/t5.svg",
                expertise: ["Q&A Preparation", "Language Skills", "Lecture on Topic"],
                voice: "clear",
                personality: "Methodical and thorough, ensures deep understanding",
                responseStyle: "Structured and systematic with clear explanations",
                languages: ["English", "Arabic", "Urdu"],
                rating: 4.92,
                totalSessions: 1650,
            },
        ];
        
        for (const expert of experts) {
            await ctx.db.insert("expertProfiles", expert);
        }
        
        return { message: "Experts seeded successfully", count: experts.length };
    },
});