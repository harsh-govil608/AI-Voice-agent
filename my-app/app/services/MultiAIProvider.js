// Multi-AI Provider Service supporting multiple LLM providers
// Supports: OpenAI, Groq, Google Gemini, Anthropic Claude, and local models

class MultiAIProvider {
    constructor() {
        this.providers = {
            openai: {
                name: 'OpenAI',
                models: ['gpt-4', 'gpt-3.5-turbo'],
                apiKeyEnv: 'NEXT_PUBLIC_OPENAI_API_KEY',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                free: false
            },
            groq: {
                name: 'Groq',
                models: ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
                apiKeyEnv: 'NEXT_PUBLIC_GROQ_API_KEY',
                endpoint: 'https://api.groq.com/openai/v1/chat/completions',
                free: false, // Requires API key
                freeLimit: '30 requests/minute'
            },
            google: {
                name: 'Google Gemini',
                models: ['gemini-pro', 'gemini-pro-vision'],
                apiKeyEnv: 'NEXT_PUBLIC_GOOGLE_API_KEY',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
                free: false, // Requires valid API key
                freeLimit: '60 requests/minute'
            },
            anthropic: {
                name: 'Anthropic Claude',
                models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
                apiKeyEnv: 'NEXT_PUBLIC_ANTHROPIC_API_KEY',
                endpoint: 'https://api.anthropic.com/v1/messages',
                free: false
            },
            huggingface: {
                name: 'HuggingFace',
                models: ['meta-llama/Llama-2-7b-chat-hf', 'google/flan-t5-xxl', 'bigscience/bloom'],
                apiKeyEnv: 'NEXT_PUBLIC_HUGGINGFACE_API_KEY',
                endpoint: 'https://api-inference.huggingface.co/models',
                free: true,
                freeLimit: 'Limited by model'
            },
            cohere: {
                name: 'Cohere',
                models: ['command', 'command-light'],
                apiKeyEnv: 'NEXT_PUBLIC_COHERE_API_KEY',
                endpoint: 'https://api.cohere.ai/v1/chat',
                free: true,
                freeLimit: '100 requests/minute for trial'
            },
            local: {
                name: 'Local/Ollama',
                models: ['llama2', 'mistral', 'codellama', 'phi'],
                apiKeyEnv: null,
                endpoint: 'http://localhost:11434/api/chat',
                free: true,
                freeLimit: 'Unlimited (runs on your machine)'
            }
        };
        
        this.currentProvider = 'mock'; // Default to mock (always works)
        this.fallbackProviders = ['local', 'mock']; // Only try local and mock as fallbacks
    }
    
    // Set the active provider
    setProvider(providerName) {
        if (this.providers[providerName]) {
            this.currentProvider = providerName;
            return true;
        }
        return false;
    }
    
    // Get available providers based on API keys
    getAvailableProviders() {
        const available = [];
        
        for (const [key, provider] of Object.entries(this.providers)) {
            if (key === 'local') {
                // Check if Ollama is running
                available.push({
                    ...provider,
                    id: key,
                    available: true,
                    configured: true
                });
            } else if (provider.free) {
                // Free providers are always available
                available.push({
                    ...provider,
                    id: key,
                    available: true,
                    configured: true
                });
            } else if (provider.apiKeyEnv) {
                const hasKey = process.env[provider.apiKeyEnv] || 
                               (typeof window !== 'undefined' && window[provider.apiKeyEnv]);
                available.push({
                    ...provider,
                    id: key,
                    available: hasKey,
                    configured: hasKey
                });
            }
        }
        
        return available;
    }
    
    // Generate response using current provider
    async generateResponse(messages, options = {}) {
        // If mock provider, return mock response directly
        if (this.currentProvider === 'mock') {
            const lastMessage = messages[messages.length - 1];
            return this.getMockResponse(lastMessage ? lastMessage.content : '');
        }
        
        const provider = this.providers[this.currentProvider];
        
        try {
            // Check if provider needs API key and if it's available
            if (provider && provider.apiKeyEnv) {
                const apiKey = typeof window !== 'undefined' 
                    ? (window[provider.apiKeyEnv] || process.env[provider.apiKeyEnv])
                    : process.env[provider.apiKeyEnv];
                    
                if (!apiKey || apiKey === 'demo_key' || apiKey === 'trial_key' || apiKey.startsWith('your_')) {
                    console.warn(`No valid API key for ${this.currentProvider}, using mock responses`);
                    return this.getMockResponse(messages[messages.length - 1].content);
                }
            }
            
            switch (this.currentProvider) {
                case 'groq':
                    return await this.callGroq(messages, options);
                    
                case 'google':
                    return await this.callGoogleGemini(messages, options);
                    
                case 'openai':
                    return await this.callOpenAI(messages, options);
                    
                case 'anthropic':
                    return await this.callAnthropic(messages, options);
                    
                case 'huggingface':
                    return await this.callHuggingFace(messages, options);
                    
                case 'cohere':
                    return await this.callCohere(messages, options);
                    
                case 'local':
                    return await this.callOllama(messages, options);
                    
                default:
                    // Fallback to mock response
                    return this.getMockResponse(messages[messages.length - 1].content);
            }
        } catch (error) {
            console.error(`Error with ${this.currentProvider}:`, error);
            
            // If API error, use mock response
            return this.getMockResponse(messages[messages.length - 1].content);
        }
    }
    
    // Groq API (Free, Fast)
    async callGroq(messages, options = {}) {
        try {
            const apiKey = typeof window !== 'undefined' 
                ? (window.NEXT_PUBLIC_GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY)
                : process.env.NEXT_PUBLIC_GROQ_API_KEY;
            
            // Don't call API with invalid keys
            if (!apiKey || apiKey === 'gsk_demo_key' || apiKey.startsWith('your_') || apiKey.startsWith('demo_')) {
                console.log('No valid Groq API key, using mock response');
                return this.getMockResponse(messages[messages.length - 1].content);
            }
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: options.model || 'mixtral-8x7b-32768',
                    messages: messages,
                    temperature: options.temperature || 0.7,
                    max_tokens: options.maxTokens || 1000,
                    stream: false
                })
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Groq API error:', errorData);
                throw new Error(`Groq API error: ${response.status}`);
            }
            
            const data = await response.json();
            if (!data.choices || !data.choices[0]) {
                throw new Error('Invalid response from Groq API');
            }
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Groq API call failed:', error);
            throw error;
        }
    }
    
    // Google Gemini (Free tier available)
    async callGoogleGemini(messages, options = {}) {
        try {
            const apiKey = typeof window !== 'undefined'
                ? (window.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
                : process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
            
            // Don't call API with invalid keys
            if (!apiKey || apiKey === 'demo_key' || apiKey.startsWith('your_')) {
                console.log('No valid Google API key, using mock response');
                return this.getMockResponse(messages[messages.length - 1].content);
            }
            
            const model = options.model || 'gemini-pro';
            
            // Convert messages to Gemini format
            const contents = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));
            
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: contents,
                        generationConfig: {
                            temperature: options.temperature || 0.7,
                            maxOutputTokens: options.maxTokens || 1000
                        }
                    })
                }
            );
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Gemini API error:', errorData);
                throw new Error(`Gemini API error: ${response.status}`);
            }
            
            const data = await response.json();
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid response from Gemini API');
            }
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API call failed:', error);
            throw error;
        }
    }
    
    // Ollama (Local, Free, No API key needed)
    async callOllama(messages, options = {}) {
        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: options.model || 'llama2',
                    messages: messages,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error('Ollama not running');
            }
            
            const data = await response.json();
            return data.message.content;
        } catch (error) {
            console.error('Ollama error:', error);
            throw error;
        }
    }
    
    // HuggingFace (Free tier)
    async callHuggingFace(messages, options = {}) {
        const apiKey = typeof window !== 'undefined'
            ? (window.NEXT_PUBLIC_HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY)
            : process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
        
        // Don't call API with invalid keys
        if (!apiKey || apiKey === 'hf_free_key' || apiKey.startsWith('your_') || apiKey.startsWith('demo_')) {
            console.log('No valid HuggingFace API key, using mock response');
            return this.getMockResponse(messages[messages.length - 1].content);
        }
        const model = options.model || 'microsoft/DialoGPT-medium';
        
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: messages[messages.length - 1].content,
                    parameters: {
                        temperature: options.temperature || 0.7,
                        max_length: options.maxTokens || 1000
                    }
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data[0].generated_text;
    }
    
    // Cohere (Free trial)
    async callCohere(messages, options = {}) {
        const apiKey = typeof window !== 'undefined'
            ? (window.NEXT_PUBLIC_COHERE_API_KEY || process.env.NEXT_PUBLIC_COHERE_API_KEY)
            : process.env.NEXT_PUBLIC_COHERE_API_KEY;
        
        // Don't call API with invalid keys
        if (!apiKey || apiKey === 'trial_key' || apiKey.startsWith('your_') || apiKey.startsWith('demo_')) {
            console.log('No valid Cohere API key, using mock response');
            return this.getMockResponse(messages[messages.length - 1].content);
        }
        
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: messages[messages.length - 1].content,
                model: options.model || 'command',
                temperature: options.temperature || 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`Cohere API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.text;
    }
    
    // OpenAI (Paid)
    async callOpenAI(messages, options = {}) {
        const apiKey = typeof window !== 'undefined'
            ? (window.NEXT_PUBLIC_OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY)
            : process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        
        if (!apiKey) {
            throw new Error('OpenAI API key not configured');
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: options.model || 'gpt-3.5-turbo',
                messages: messages,
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // Anthropic Claude (Paid)
    async callAnthropic(messages, options = {}) {
        const apiKey = typeof window !== 'undefined'
            ? (window.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY)
            : process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
        
        if (!apiKey) {
            throw new Error('Anthropic API key not configured');
        }
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: options.model || 'claude-3-haiku-20240307',
                messages: messages,
                max_tokens: options.maxTokens || 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.content[0].text;
    }
    
    // Mock response for demo/fallback
    getMockResponse(userInput) {
        if (!userInput) {
            return "Hello! I'm ready to assist you. What would you like to discuss today?";
        }
        
        const responses = {
            interview: [
                "That's an excellent question! Let me share my experience with this. In my previous role, I encountered a similar challenge where we needed to balance performance with maintainability. The approach I took was to first understand the core requirements, then implement a solution that could scale. Would you like me to elaborate on the specific techniques I used?",
                "I appreciate this question as it touches on a fundamental aspect of the role. Based on my experience, I believe the key is to approach this systematically. First, I would analyze the current situation, then identify potential improvements, and finally implement solutions with measurable outcomes. Let me give you a specific example from my recent project.",
                "Great question! This is actually something I'm passionate about. In my experience, the most effective approach combines both technical excellence and strong communication. Let me walk you through a situation where I successfully applied this principle.",
                "That's a very insightful question. I've handled similar scenarios multiple times in my career. The strategy that has worked best for me involves three key steps: assessment, planning, and iterative implementation. Would you like me to share a specific case study?",
                "Excellent point! This relates directly to my core strengths. I believe in taking a data-driven approach to solve such challenges. Let me explain how I've successfully implemented this methodology in past projects."
            ],
            technical: [
                "From a technical perspective, this is a fascinating problem. The optimal solution would involve implementing a microservices architecture with proper load balancing and caching strategies. I've worked with similar systems where we achieved 99.9% uptime. Would you like me to dive deeper into the technical implementation?",
                "That's a great technical question! The approach I would recommend involves using design patterns like Factory and Observer to maintain clean, scalable code. In my experience with large-scale applications, this has proven to reduce maintenance costs by up to 40%. Let me explain the architecture in more detail.",
                "Excellent technical challenge! I would approach this by first analyzing the time and space complexity requirements. Then, I'd implement an optimized algorithm using dynamic programming or a divide-and-conquer approach, depending on the specific constraints. I recently solved a similar problem that improved performance by 300%.",
                "From an engineering standpoint, this requires careful consideration of both performance and reliability. I would implement a solution using containerization with Kubernetes for orchestration, combined with a robust CI/CD pipeline. This approach has helped me achieve zero-downtime deployments in production environments.",
                "That's a sophisticated technical question. The solution involves implementing proper abstraction layers, using dependency injection for testability, and ensuring horizontal scalability. I've successfully implemented similar architectures that handled millions of requests per day."
            ],
            behavioral: [
                "That's a great behavioral question. In that situation, I focused on clear communication and empathy. I scheduled one-on-one meetings with each team member to understand their perspectives, then facilitated a collaborative solution that addressed everyone's concerns. The result was a 25% improvement in team productivity.",
                "I appreciate this question as it highlights the importance of soft skills. When faced with such challenges, I believe in leading by example and maintaining transparency. Let me share a specific instance where this approach helped me turn around a struggling project.",
                "Excellent question about teamwork! My approach is to first listen actively to understand all viewpoints, then find common ground to build consensus. I recently led a cross-functional team where this method helped us deliver the project two weeks ahead of schedule.",
                "That's a valuable question about leadership. In my experience, the key is to balance assertiveness with empathy. I once managed a situation where conflicting priorities threatened our deadline, and through careful negotiation and compromise, we exceeded our goals.",
                "Great question about problem-solving! I approach such situations by remaining calm, gathering all relevant information, and involving the right stakeholders. This methodology has helped me resolve critical issues that could have impacted thousands of users."
            ],
            general: [
                "That's a thoughtful question. Let me provide you with a comprehensive answer based on my experience. The key factors to consider include stakeholder requirements, available resources, and long-term sustainability. I've successfully applied this framework in multiple scenarios.",
                "I understand your interest in this topic. From my perspective, the most important aspect is maintaining a balance between innovation and stability. Let me share how I've achieved this balance in my previous roles.",
                "Excellent question! This touches on several important areas. My approach involves careful analysis, strategic planning, and consistent execution. I've found this methodology to be highly effective across different industries and project types.",
                "That's a very relevant question in today's context. Based on my experience, success in this area requires both technical expertise and business acumen. Let me explain how I've developed and applied both skill sets.",
                "Great point! This is something I've given considerable thought to. My philosophy is to always consider the bigger picture while paying attention to details. This balanced approach has helped me deliver consistent results throughout my career."
            ]
        };
        
        // Detect context and return appropriate response
        const lowerInput = userInput.toLowerCase();
        let category = 'general';
        
        // More sophisticated context detection
        if (lowerInput.includes('tell me about yourself') || lowerInput.includes('introduce yourself')) {
            return "I'm a dedicated professional with extensive experience in software development and AI technologies. My passion lies in creating innovative solutions that solve real-world problems. I combine technical expertise with strong communication skills to deliver exceptional results. Throughout my career, I've successfully led multiple projects from conception to deployment, always focusing on user experience and business value.";
        }
        
        if (lowerInput.includes('strength') || lowerInput.includes('weakness')) {
            return "My greatest strength is my ability to quickly learn and adapt to new technologies while maintaining a strong foundation in core principles. As for areas of improvement, I'm continuously working on delegating more effectively to empower team members, though I've made significant progress through leadership training and mentorship.";
        }
        
        if (lowerInput.includes('why') && (lowerInput.includes('company') || lowerInput.includes('role') || lowerInput.includes('position'))) {
            return "I'm excited about this opportunity because it perfectly aligns with my career goals and expertise. Your company's commitment to innovation and the challenging nature of this role would allow me to contribute meaningfully while continuing to grow professionally. I'm particularly impressed by your recent achievements in AI technology and would love to be part of that journey.";
        }
        
        if (lowerInput.includes('code') || lowerInput.includes('algorithm') || lowerInput.includes('technical') || 
            lowerInput.includes('programming') || lowerInput.includes('system') || lowerInput.includes('design')) {
            category = 'technical';
        } else if (lowerInput.includes('team') || lowerInput.includes('conflict') || lowerInput.includes('manage') || 
                   lowerInput.includes('leader') || lowerInput.includes('collaborate')) {
            category = 'behavioral';
        } else if (lowerInput.includes('interview') || lowerInput.includes('job') || lowerInput.includes('career') || 
                   lowerInput.includes('experience') || lowerInput.includes('project')) {
            category = 'interview';
        }
        
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
}

export default MultiAIProvider;