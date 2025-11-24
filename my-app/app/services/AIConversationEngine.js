// Advanced AI Conversation Engine with Context Management
import OpenAI from 'openai';
import MultiAIProvider from './MultiAIProvider';

class AIConversationEngine {
    constructor(apiKey) {
        // Initialize Multi-AI Provider
        this.multiAI = new MultiAIProvider();
        
        // Check if API key is provided
        this.hasApiKey = apiKey && apiKey !== '' && apiKey !== 'your_openai_api_key_here';
        
        if (this.hasApiKey) {
            this.openai = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true // Note: In production, use server-side API calls
            });
            this.multiAI.setProvider('openai');
        } else {
            console.log('No API key configured. Using intelligent mock responses for conversation.');
            this.openai = null;
            // Default to mock provider (always works without API key)
            this.multiAI.setProvider('mock');
        }
        
        this.conversationHistory = [];
        this.contextWindow = 10; // Keep last 10 exchanges for context
        this.currentExpert = null;
        this.sessionMetadata = {};
        this.emotionState = 'neutral';
        this.learningProfile = {};
    }

    // Initialize conversation with expert profile
    async initializeConversation(expert, topic, userProfile) {
        this.currentExpert = expert;
        this.sessionMetadata = {
            expert: expert.name,
            topic: topic,
            startTime: new Date().toISOString(),
            userProfile: userProfile
        };
        
        // Create system prompt based on expert personality
        const systemPrompt = this.createExpertPersona(expert, topic);
        
        this.conversationHistory = [{
            role: 'system',
            content: systemPrompt
        }];
        
        // Generate welcome message
        const welcomeMessage = await this.generateResponse(
            `Introduce yourself and welcome the user to discuss ${topic}. Be ${expert.personality}.`
        );
        
        return welcomeMessage;
    }

    // Create expert persona prompt
    createExpertPersona(expert, topic) {
        return `You are ${expert.name}, an expert in ${expert.expertise.join(', ')}.
        
Personality: ${expert.personality}
Voice Style: ${expert.voice}
Languages: ${expert.languages.join(', ')}

You are conducting a ${topic} session. Guidelines:
1. Maintain your unique personality and expertise throughout
2. Provide detailed, accurate, and helpful responses
3. Use appropriate technical depth based on user's level
4. Be encouraging and supportive
5. Ask clarifying questions when needed
6. Provide actionable insights and practical examples
7. Adapt your communication style to the user's needs
8. Track user progress and provide personalized feedback
9. Use analogies and real-world examples
10. Ensure cultural sensitivity and inclusivity

Remember to:
- Stay in character as ${expert.name}
- Speak naturally as in a real conversation
- Be concise but comprehensive
- Show empathy and understanding
- Celebrate user achievements`;
    }

    // Process user input with context awareness
    async processUserInput(transcript, audioMetrics = {}) {
        // Analyze emotion from audio metrics
        const emotion = this.analyzeEmotion(audioMetrics);
        
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: transcript,
            metadata: {
                emotion: emotion,
                timestamp: new Date().toISOString(),
                confidence: audioMetrics.confidence || 1.0
            }
        });
        
        // Generate contextual response
        const response = await this.generateResponse(transcript, emotion);
        
        // Update learning profile
        this.updateLearningProfile(transcript, response);
        
        // Manage context window
        this.manageContextWindow();
        
        return {
            text: response,
            emotion: this.emotionState,
            suggestions: await this.generateSuggestions(transcript),
            metadata: {
                responseTime: new Date().toISOString(),
                contextLength: this.conversationHistory.length
            }
        };
    }

    // Generate AI response
    async generateResponse(userInput, emotion = 'neutral') {
        try {
            // Adjust response based on emotion
            let emotionContext = '';
            if (emotion === 'frustrated') {
                emotionContext = 'The user seems frustrated. Be extra patient and supportive. ';
            } else if (emotion === 'confused') {
                emotionContext = 'The user seems confused. Provide clearer explanations with examples. ';
            } else if (emotion === 'excited') {
                emotionContext = 'The user is engaged and excited. Match their energy. ';
            }
            
            // Add emotion context if needed
            if (emotionContext) {
                this.conversationHistory.push({
                    role: 'system',
                    content: emotionContext
                });
            }
            
            // Try OpenAI first if API key is available
            if (this.hasApiKey && this.openai) {
                try {
                    const completion = await this.openai.chat.completions.create({
                        model: 'gpt-4-turbo-preview',
                        messages: this.conversationHistory,
                        temperature: 0.7,
                        max_tokens: 500,
                        presence_penalty: 0.3,
                        frequency_penalty: 0.3,
                        stream: false
                    });
                    
                    const response = completion.choices[0].message.content;
                    
                    // Add assistant response to history
                    this.conversationHistory.push({
                        role: 'assistant',
                        content: response,
                        metadata: {
                            timestamp: new Date().toISOString(),
                            model: 'gpt-4-turbo-preview'
                        }
                    });
                    
                    return response;
                } catch (openAIError) {
                    console.warn('OpenAI failed, falling back to alternative provider:', openAIError);
                }
            }
            
            // Use Multi-AI Provider with mock responses (no API needed)
            // Force mock provider to avoid API errors
            this.multiAI.setProvider('mock');
            const response = await this.multiAI.generateResponse(
                this.conversationHistory,
                {
                    temperature: 0.7,
                    maxTokens: 500
                }
            );
            
            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                metadata: {
                    timestamp: new Date().toISOString(),
                    model: this.multiAI.currentProvider
                }
            });
            
            return response;
        } catch (error) {
            console.error('Error generating response:', error);
            return this.getMockResponse(userInput, emotion);
        }
    }

    // Analyze emotion from audio metrics
    analyzeEmotion(audioMetrics) {
        const { pitch, rate, volume, pauseRatio } = audioMetrics;
        
        if (!pitch || !rate) return 'neutral';
        
        // Simple emotion detection logic
        if (pitch > 1.3 && rate > 1.2) return 'excited';
        if (pitch < 0.8 && rate < 0.8) return 'sad';
        if (volume > 1.3 && rate > 1.1) return 'angry';
        if (pauseRatio > 0.4) return 'confused';
        if (pitch > 1.1 && pitch < 1.3) return 'happy';
        
        return 'neutral';
    }

    // Generate contextual suggestions
    async generateSuggestions(userInput) {
        try {
            const prompt = `Based on the conversation about "${userInput}", suggest 3 follow-up questions or topics the user might want to explore. Format as a JSON array of strings.`;
            
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that suggests relevant follow-up questions.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 150
            });
            
            const suggestions = JSON.parse(completion.choices[0].message.content);
            return suggestions;
        } catch (error) {
            return [
                "Can you explain that in more detail?",
                "What are the practical applications?",
                "How does this relate to real-world scenarios?"
            ];
        }
    }

    // Update user's learning profile
    updateLearningProfile(input, response) {
        // Extract keywords and topics
        const keywords = this.extractKeywords(input + ' ' + response);
        
        // Update topic frequency
        keywords.forEach(keyword => {
            if (!this.learningProfile[keyword]) {
                this.learningProfile[keyword] = 0;
            }
            this.learningProfile[keyword]++;
        });
    }

    // Extract keywords from text
    extractKeywords(text) {
        // Simple keyword extraction (in production, use NLP library)
        const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but']);
        const words = text.toLowerCase().split(/\s+/);
        
        return words
            .filter(word => word.length > 3 && !stopWords.has(word))
            .slice(0, 10);
    }

    // Manage conversation context window
    manageContextWindow() {
        // Keep system prompt and last N exchanges
        if (this.conversationHistory.length > this.contextWindow * 2 + 1) {
            const systemPrompt = this.conversationHistory[0];
            const recentHistory = this.conversationHistory.slice(-this.contextWindow * 2);
            this.conversationHistory = [systemPrompt, ...recentHistory];
        }
    }

    // Generate session summary
    async generateSessionSummary() {
        try {
            const prompt = `Summarize this conversation in a structured format:
            1. Main topics discussed
            2. Key learning points
            3. Action items or recommendations
            4. Areas for improvement
            5. Next steps`;
            
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    ...this.conversationHistory,
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 500
            });
            
            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Error generating summary:', error);
            return 'Session completed. Thank you for participating!';
        }
    }

    // Generate feedback and analytics
    async generateFeedback() {
        const summary = await this.generateSessionSummary();
        
        return {
            summary: summary,
            duration: this.calculateSessionDuration(),
            topicsCount: Object.keys(this.learningProfile).length,
            exchangesCount: Math.floor(this.conversationHistory.length / 2),
            learningProfile: this.learningProfile,
            recommendations: await this.generateRecommendations()
        };
    }

    // Generate personalized recommendations
    async generateRecommendations() {
        const topTopics = Object.entries(this.learningProfile)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic]) => topic);
        
        return {
            topics: topTopics,
            nextSession: `Based on your interests, consider exploring advanced concepts in ${topTopics[0]}`,
            resources: [
                'Practice exercises on covered topics',
                'Review session transcript for key points',
                'Schedule follow-up session for deeper dive'
            ]
        };
    }

    // Calculate session duration
    calculateSessionDuration() {
        if (!this.sessionMetadata.startTime) return 0;
        
        const start = new Date(this.sessionMetadata.startTime);
        const end = new Date();
        const durationMs = end - start;
        
        return Math.floor(durationMs / 1000); // Return in seconds
    }

    // Get fallback response
    getFallbackResponse() {
        const fallbacks = [
            "I understand. Could you tell me more about that?",
            "That's interesting. Let me think about that for a moment.",
            "I see what you're saying. Can you elaborate a bit more?",
            "Let's explore that further. What specific aspect interests you most?"
        ];
        
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    // Get mock response when no API key
    getMockResponse(userInput, emotion = 'neutral') {
        const mockResponses = {
            greeting: [
                "Hello! I'm your AI coach. While I'm currently running in demo mode without OpenAI API, I can still help you practice conversations. What would you like to discuss today?",
                "Welcome! I'm here to assist you with your learning journey. What topic interests you?",
                "Great to meet you! I'm ready to help you practice and improve. What's on your mind?"
            ],
            question: [
                "That's an excellent question! In a real session with an API key, I would provide detailed insights based on advanced AI. For now, let me share that this topic is quite interesting and has many aspects to explore.",
                "Great point! While I'm in demo mode, I can tell you that this area has significant importance in professional development. What specific aspect would you like to focus on?",
                "Interesting perspective! This is definitely worth exploring further. Can you share more about your experience with this?"
            ],
            general: [
                "I appreciate your input. In a full session, I would analyze this deeply and provide personalized guidance. For now, let's continue exploring your thoughts on this.",
                "That's a valuable observation. This kind of thinking shows great potential for growth and learning.",
                "You're on the right track! This demonstrates good understanding of the core concepts."
            ]
        };
        
        // Simple intent detection
        const input = userInput.toLowerCase();
        let responseType = 'general';
        
        if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
            responseType = 'greeting';
        } else if (input.includes('?') || input.includes('how') || input.includes('what') || input.includes('why')) {
            responseType = 'question';
        }
        
        const responses = mockResponses[responseType];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Add a note about API key
        const apiKeyNote = "\n\n💡 Note: To unlock full AI capabilities with GPT-4, please add your OpenAI API key in the .env.local file.";
        
        return response + (Math.random() > 0.7 ? apiKeyNote : "");
    }

    // Handle special commands
    handleCommand(command) {
        const commands = {
            '/help': 'Available commands: /help, /summary, /feedback, /restart, /expert',
            '/summary': () => this.generateSessionSummary(),
            '/feedback': () => this.generateFeedback(),
            '/restart': () => this.resetConversation(),
            '/expert': () => `Current expert: ${this.currentExpert?.name}`
        };
        
        return commands[command] || null;
    }

    // Reset conversation
    resetConversation() {
        this.conversationHistory = [];
        this.learningProfile = {};
        this.emotionState = 'neutral';
        return 'Conversation reset. How can I help you today?';
    }

    // Export conversation
    exportConversation() {
        return {
            metadata: this.sessionMetadata,
            history: this.conversationHistory,
            learningProfile: this.learningProfile,
            summary: this.generateSessionSummary()
        };
    }
}

export default AIConversationEngine;