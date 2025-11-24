import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all coaching options
export const getAllCoachingOptions = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("coachingOptions")
            .filter((q) => q.eq(q.field("isActive"), true))
            .order("asc")
            .collect();
    },
});

// Get coaching option by name
export const getCoachingOptionByName = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("coachingOptions")
            .withIndex("by_name", (q) => q.eq("name", args.name))
            .first();
    },
});

// Create coaching option
export const createCoachingOption = mutation({
    args: {
        name: v.string(),
        icon: v.string(),
        description: v.string(),
        duration: v.string(),
        level: v.string(),
        category: v.optional(v.string()),
        order: v.number(),
    },
    handler: async (ctx, args) => {
        const now = new Date().toISOString();
        return await ctx.db.insert("coachingOptions", {
            ...args,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        });
    },
});

// Update coaching option
export const updateCoachingOption = mutation({
    args: {
        id: v.id("coachingOptions"),
        name: v.optional(v.string()),
        icon: v.optional(v.string()),
        description: v.optional(v.string()),
        duration: v.optional(v.string()),
        level: v.optional(v.string()),
        category: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
        return { success: true };
    },
});

// Delete coaching option
export const deleteCoachingOption = mutation({
    args: { id: v.id("coachingOptions") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// Seed initial coaching options
export const seedCoachingOptions = mutation({
    handler: async (ctx) => {
        const existingOptions = await ctx.db.query("coachingOptions").collect();
        
        if (existingOptions.length > 0) {
            return { message: "Coaching options already seeded" };
        }
        
        const now = new Date().toISOString();
        const options = [
            {
                name: "Lecture on Topic",
                icon: "/lecture.svg",
                description: "Get comprehensive lectures on any topic with interactive Q&A",
                duration: "15-30 mins",
                level: "All levels",
                order: 1,
            },
            {
                name: "Mock Interview",
                icon: "/interview.svg",
                description: "Practice interviews with real-time feedback and performance analysis",
                duration: "20-45 mins",
                level: "Professional",
                order: 2,
            },
            {
                name: "Q&A Preparation",
                icon: "/qa.svg",
                description: "Prepare for exams, presentations, or meetings with targeted practice",
                duration: "10-20 mins",
                level: "Student/Professional",
                order: 3,
            },
            {
                name: "Language Skills",
                icon: "/language.svg",
                description: "Improve pronunciation, vocabulary, and conversational fluency",
                duration: "15-30 mins",
                level: "Beginner to Advanced",
                order: 4,
            },
            {
                name: "Meditation & Wellness",
                icon: "/meditation.svg",
                description: "Guided meditation and mental wellness sessions",
                duration: "10-25 mins",
                level: "All levels",
                order: 5,
            },
            {
                name: "Career Coaching",
                icon: "/career.svg",
                description: "Career guidance, resume review, and professional development",
                duration: "20-40 mins",
                level: "Professional",
                order: 6,
            },
            {
                name: "Technical Training",
                icon: "/tech.svg",
                description: "Learn programming, AI/ML, and technical concepts interactively",
                duration: "25-45 mins",
                level: "Beginner to Expert",
                order: 7,
            },
            {
                name: "Business Strategy",
                icon: "/business.svg",
                description: "Business planning, startup advice, and strategic consultation",
                duration: "30-45 mins",
                level: "Entrepreneur/Executive",
                order: 8,
            },
        ];
        
        for (const option of options) {
            await ctx.db.insert("coachingOptions", {
                ...option,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            });
        }
        
        return { message: "Coaching options seeded successfully", count: options.length };
    },
});