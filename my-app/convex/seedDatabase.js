import { mutation } from "./_generated/server";

// Master seed function to populate all database tables
export const seedAllData = mutation({
    handler: async (ctx) => {
        const results = {
            coachingOptions: { success: false, message: "" },
            experts: { success: false, message: "" },
            voiceProviders: { success: false, message: "" },
            voiceQuality: { success: false, message: "" },
            analyticsMetrics: { success: false, message: "" },
        };
        
        const now = new Date().toISOString();
        
        // Seed Coaching Options
        try {
            const existingOptions = await ctx.db.query("coachingOptions").collect();
            if (existingOptions.length === 0) {
                const options = [
                    {
                        name: "Lecture on Topic",
                        icon: "/lecture.svg",
                        description: "Get comprehensive lectures on any topic with interactive Q&A",
                        duration: "15-30 mins",
                        level: "All levels",
                        category: "Education",
                        order: 1,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        name: "Mock Interview",
                        icon: "/interview.svg",
                        description: "Practice interviews with real-time feedback and performance analysis",
                        duration: "20-45 mins",
                        level: "Professional",
                        category: "Career",
                        order: 2,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        name: "Q&A Preparation",
                        icon: "/qa.svg",
                        description: "Prepare for exams, presentations, or meetings with targeted practice",
                        duration: "10-20 mins",
                        level: "Student/Professional",
                        category: "Education",
                        order: 3,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        name: "Language Skills",
                        icon: "/language.svg",
                        description: "Improve pronunciation, vocabulary, and conversational fluency",
                        duration: "15-30 mins",
                        level: "Beginner to Advanced",
                        category: "Language",
                        order: 4,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        name: "Meditation & Wellness",
                        icon: "/meditation.svg",
                        description: "Guided meditation and mental wellness sessions",
                        duration: "10-25 mins",
                        level: "All levels",
                        category: "Wellness",
                        order: 5,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        name: "Career Coaching",
                        icon: "/career.svg",
                        description: "Career guidance, resume review, and professional development",
                        duration: "20-40 mins",
                        level: "Professional",
                        category: "Career",
                        order: 6,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        name: "Technical Training",
                        icon: "/tech.svg",
                        description: "Learn programming, AI/ML, and technical concepts interactively",
                        duration: "25-45 mins",
                        level: "Beginner to Expert",
                        category: "Technology",
                        order: 7,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                    {
                        name: "Business Strategy",
                        icon: "/business.svg",
                        description: "Business planning, startup advice, and strategic consultation",
                        duration: "30-45 mins",
                        level: "Entrepreneur/Executive",
                        category: "Business",
                        order: 8,
                        isActive: true,
                        createdAt: now,
                        updatedAt: now,
                    },
                ];
                
                for (const option of options) {
                    await ctx.db.insert("coachingOptions", option);
                }
                results.coachingOptions = { success: true, message: `Seeded ${options.length} coaching options` };
            } else {
                results.coachingOptions = { success: true, message: "Coaching options already exist" };
            }
        } catch (error) {
            results.coachingOptions = { success: false, message: error.message };
        }
        
        // Seed Experts
        try {
            const existingExperts = await ctx.db.query("expertProfiles").collect();
            if (existingExperts.length === 0) {
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
                results.experts = { success: true, message: `Seeded ${experts.length} experts` };
            } else {
                results.experts = { success: true, message: "Experts already exist" };
            }
        } catch (error) {
            results.experts = { success: false, message: error.message };
        }
        
        // Seed Voice Providers
        try {
            const existingProviders = await ctx.db.query("voiceProviders").collect();
            if (existingProviders.length === 0) {
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
                results.voiceProviders = { success: true, message: `Seeded ${providers.length} voice providers` };
            } else {
                results.voiceProviders = { success: true, message: "Voice providers already exist" };
            }
        } catch (error) {
            results.voiceProviders = { success: false, message: error.message };
        }
        
        // Seed Voice Quality Settings
        try {
            const existingSettings = await ctx.db.query("voiceQualitySettings").collect();
            if (existingSettings.length === 0) {
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
                results.voiceQuality = { success: true, message: `Seeded ${settings.length} quality settings` };
            } else {
                results.voiceQuality = { success: true, message: "Voice quality settings already exist" };
            }
        } catch (error) {
            results.voiceQuality = { success: false, message: error.message };
        }
        
        // Seed Analytics Metrics
        try {
            const existingMetrics = await ctx.db.query("analyticsMetrics").collect();
            if (existingMetrics.length === 0) {
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
                results.analyticsMetrics = { success: true, message: `Seeded ${metrics.length} analytics metrics` };
            } else {
                results.analyticsMetrics = { success: true, message: "Analytics metrics already exist" };
            }
        } catch (error) {
            results.analyticsMetrics = { success: false, message: error.message };
        }
        
        return {
            success: true,
            message: "Database seeding completed",
            results
        };
    },
});