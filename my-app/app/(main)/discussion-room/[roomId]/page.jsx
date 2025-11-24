"use client"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, 
    Send, Loader2, User, Bot, Clock, Activity,
    Settings, Download, Share2, MessageSquare, Zap,
    FileText, FileJson, Link, Mail, MessageCircle,
    Twitter, Linkedin
} from 'lucide-react';
import VoiceService from '@/app/services/VoiceService';
import AIConversationEngine from '@/app/services/AIConversationEngine';
// import { useUser } from '@stackframe/stack';
import { toast } from 'sonner';

function DiscussionRoom() {
    const { roomId } = useParams();
    const router = useRouter();
    // const user = useUser();
    const user = { id: "user123", displayName: "User" }; // Temporary mock user
    
    // State Management
    const [expert, setExpert] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [voiceLevel, setVoiceLevel] = useState(0);
    const [sessionStats, setSessionStats] = useState({
        duration: 0,
        exchanges: 0,
        clarity: 95,
        engagement: 88
    });
    
    // Refs
    const voiceServiceRef = useRef(null);
    const aiEngineRef = useRef(null);
    const messagesEndRef = useRef(null);
    const sessionTimerRef = useRef(null);
    
    // Convex queries and mutations
    const discussionRoomData = useQuery(api.discussionRooms.getDiscussionRoom, { id: roomId });
    const updateRoom = useMutation(api.discussionRooms.updateDiscussionRoom);
    const saveTranscript = useMutation(api.voiceSessions.saveVoiceSession);
    
    // Fetch experts from database
    const allExperts = useQuery(api.experts.getAllExperts);
    
    // Initialize expert and services
    useEffect(() => {
        if (discussionRoomData && allExperts) {
            const foundExpert = allExperts.find(item => item.name === discussionRoomData.expertName);
            setExpert(foundExpert);
            
            // Initialize AI Engine (will work with or without API key)
            const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
            aiEngineRef.current = new AIConversationEngine(apiKey);
            
            // Initialize Voice Service
            voiceServiceRef.current = new VoiceService();
            setupVoiceCallbacks();
            
            // Load existing messages if any
            if (discussionRoomData.conversation) {
                setMessages(discussionRoomData.conversation);
            }
        }
        
        return () => {
            cleanup();
        };
    }, [discussionRoomData]);
    
    // Setup voice service callbacks
    const setupVoiceCallbacks = () => {
        if (!voiceServiceRef.current) return;
        
        voiceServiceRef.current.onTranscription = (text, confidence, isFinal) => {
            if (isFinal) {
                handleUserSpeech(text);
            } else {
                setTranscript(text);
            }
        };
        
        voiceServiceRef.current.onVoiceActivity = (level) => {
            setVoiceLevel(level);
        };
        
        voiceServiceRef.current.onError = (error) => {
            toast.error(`Voice error: ${error}`);
            console.error('Voice service error:', error);
        };
    };
    
    // Handle connection
    const handleConnect = async () => {
        try {
            setIsProcessing(true);
            
            // Ensure services are initialized
            if (!voiceServiceRef.current) {
                voiceServiceRef.current = new VoiceService();
                setupVoiceCallbacks();
            }
            
            if (!aiEngineRef.current) {
                const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
                aiEngineRef.current = new AIConversationEngine(apiKey);
            }
            
            // Initialize voice service
            await voiceServiceRef.current.initializeAudio();
            
            // Initialize AI conversation
            const welcomeMessage = await aiEngineRef.current.initializeConversation(
                expert || { name: discussionRoomData?.expertName, personality: "friendly and helpful" },
                discussionRoomData?.coachingOption || "General Discussion",
                { name: user?.displayName || "User", id: user?.id || "user123" }
            );
            
            // Add welcome message
            addMessage('assistant', welcomeMessage);
            
            // Speak welcome message
            if (isSpeakerOn) {
                await voiceServiceRef.current.speak(welcomeMessage, {
                    voice: expert.voice,
                    rate: 0.95
                });
            }
            
            setIsConnected(true);
            startSessionTimer();
            
            // Update room status
            await updateRoom({
                id: roomId,
                status: 'active',
                startTime: new Date().toISOString()
            });
            
            toast.success('Connected successfully! You can start speaking.');
        } catch (error) {
            console.error('Connection error:', error);
            toast.error('Failed to connect. Please check your microphone permissions.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Handle disconnection
    const handleDisconnect = async () => {
        try {
            setIsProcessing(true);
            
            // Stop recording
            if (voiceServiceRef.current && voiceServiceRef.current.isRecording) {
                voiceServiceRef.current.stopRecording();
            }
            
            // Generate session summary
            const feedback = await aiEngineRef.current.generateFeedback();
            
            // Save session data
            await updateRoom({
                id: roomId,
                status: 'completed',
                endTime: new Date().toISOString(),
                duration: sessionStats.duration,
                transcript: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
                summary: feedback.summary,
                conversation: messages
            });
            
            // Save voice session analytics
            await saveTranscript({
                userId: user?.id,
                roomId: roomId,
                transcription: transcript,
                metadata: {
                    language: 'en',
                    confidence: 0.95,
                    keywords: Object.keys(aiEngineRef.current.learningProfile)
                }
            });
            
            setIsConnected(false);
            stopSessionTimer();
            
            toast.success('Session ended. Summary has been saved.');
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Disconnect error:', error);
            toast.error('Error ending session');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Toggle microphone
    const toggleMicrophone = async () => {
        if (!voiceServiceRef.current) return;
        
        if (isMuted) {
            await voiceServiceRef.current.startRecording();
            setIsMuted(false);
            toast.success('Microphone unmuted');
        } else {
            voiceServiceRef.current.stopRecording();
            setIsMuted(true);
            toast.info('Microphone muted');
        }
    };
    
    // Toggle speaker
    const toggleSpeaker = () => {
        setIsSpeakerOn(!isSpeakerOn);
        toast.info(isSpeakerOn ? 'Speaker muted' : 'Speaker unmuted');
    };
    
    // Handle user speech
    const handleUserSpeech = async (text) => {
        if (!text.trim()) return;
        
        setIsProcessing(true);
        setTranscript('');
        
        // Add user message
        addMessage('user', text);
        
        try {
            // Process with AI
            const response = await aiEngineRef.current.processUserInput(text, {
                pitch: 1.0,
                rate: 1.0,
                volume: 1.0
            });
            
            // Add AI response
            addMessage('assistant', response.text);
            
            // Speak response
            if (isSpeakerOn && voiceServiceRef.current) {
                await voiceServiceRef.current.speak(response.text, {
                    voice: expert.voice,
                    emotion: response.emotion
                });
            }
            
            // Update stats
            setSessionStats(prev => ({
                ...prev,
                exchanges: prev.exchanges + 1
            }));
            
            // Show suggestions if available
            if (response.suggestions && response.suggestions.length > 0) {
                // Handle suggestions display
            }
        } catch (error) {
            console.error('Processing error:', error);
            toast.error('Error processing your message');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Handle text input send
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !isConnected) return;
        
        const message = inputMessage;
        setInputMessage('');
        await handleUserSpeech(message);
    };
    
    // Add message to chat
    const addMessage = (role, content) => {
        const newMessage = {
            role,
            content,
            timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Auto scroll to bottom
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };
    
    // Session timer
    const startSessionTimer = () => {
        sessionTimerRef.current = setInterval(() => {
            setSessionStats(prev => ({
                ...prev,
                duration: prev.duration + 1
            }));
        }, 1000);
    };
    
    const stopSessionTimer = () => {
        if (sessionTimerRef.current) {
            clearInterval(sessionTimerRef.current);
        }
    };
    
    // Format duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Cleanup
    const cleanup = () => {
        if (voiceServiceRef.current) {
            voiceServiceRef.current.destroy();
        }
        stopSessionTimer();
    };
    
    // Download transcript as different formats
    const downloadTranscript = (format = 'txt') => {
        if (messages.length === 0) {
            toast.error('No conversation to download');
            return;
        }
        
        let content = '';
        let mimeType = 'text/plain';
        let fileName = `transcript_${discussionRoomData?.topic || 'session'}_${new Date().toISOString().split('T')[0]}`;
        
        switch (format) {
            case 'txt':
                // Plain text format
                content = `AI Voice Agent - Session Transcript\n`;
                content += `=====================================\n\n`;
                content += `Topic: ${discussionRoomData?.topic || 'General Discussion'}\n`;
                content += `Expert: ${expert?.name || discussionRoomData?.expertName}\n`;
                content += `Date: ${new Date().toLocaleDateString()}\n`;
                content += `Duration: ${formatDuration(sessionStats.duration)}\n\n`;
                content += `Conversation:\n`;
                content += `-------------\n\n`;
                
                messages.forEach((msg, index) => {
                    const speaker = msg.role === 'user' ? 'You' : expert?.name || 'AI Expert';
                    const time = new Date(msg.timestamp).toLocaleTimeString();
                    content += `[${time}] ${speaker}:\n${msg.content}\n\n`;
                });
                
                fileName += '.txt';
                break;
                
            case 'json':
                // JSON format for data analysis
                const jsonData = {
                    session: {
                        topic: discussionRoomData?.topic,
                        expert: expert?.name || discussionRoomData?.expertName,
                        date: new Date().toISOString(),
                        duration: sessionStats.duration,
                        exchanges: messages.length
                    },
                    messages: messages,
                    statistics: sessionStats
                };
                content = JSON.stringify(jsonData, null, 2);
                mimeType = 'application/json';
                fileName += '.json';
                break;
                
            case 'md':
                // Markdown format
                content = `# AI Voice Agent - Session Transcript\n\n`;
                content += `## Session Information\n`;
                content += `- **Topic:** ${discussionRoomData?.topic || 'General Discussion'}\n`;
                content += `- **Expert:** ${expert?.name || discussionRoomData?.expertName}\n`;
                content += `- **Date:** ${new Date().toLocaleDateString()}\n`;
                content += `- **Duration:** ${formatDuration(sessionStats.duration)}\n\n`;
                content += `## Conversation\n\n`;
                
                messages.forEach((msg, index) => {
                    const speaker = msg.role === 'user' ? '**You**' : `**${expert?.name || 'AI Expert'}**`;
                    const time = new Date(msg.timestamp).toLocaleTimeString();
                    content += `### ${speaker} - _${time}_\n\n`;
                    content += `${msg.content}\n\n---\n\n`;
                });
                
                mimeType = 'text/markdown';
                fileName += '.md';
                break;
        }
        
        // Create and download the file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success(`Transcript downloaded as ${format.toUpperCase()}`);
    };
    
    // Share session via different methods
    const shareSession = async (method = 'link') => {
        const sessionUrl = window.location.href;
        const sessionTitle = `AI Voice Session: ${discussionRoomData?.topic || 'Discussion'}`;
        const sessionDescription = `Join me for an AI-powered ${discussionRoomData?.coachingOption} session with ${expert?.name || 'AI Expert'}`;
        
        switch (method) {
            case 'link':
                // Copy link to clipboard
                try {
                    await navigator.clipboard.writeText(sessionUrl);
                    toast.success('Session link copied to clipboard!');
                } catch (err) {
                    toast.error('Failed to copy link');
                }
                break;
                
            case 'email':
                // Share via email
                const emailSubject = encodeURIComponent(sessionTitle);
                const emailBody = encodeURIComponent(
                    `${sessionDescription}\n\nJoin the session: ${sessionUrl}\n\n` +
                    `Session Details:\n- Topic: ${discussionRoomData?.topic}\n- Expert: ${expert?.name}\n- Duration: ${formatDuration(sessionStats.duration)}`
                );
                window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
                break;
                
            case 'whatsapp':
                // Share via WhatsApp
                const whatsappText = encodeURIComponent(`${sessionTitle}\n\n${sessionDescription}\n\nJoin here: ${sessionUrl}`);
                window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
                break;
                
            case 'twitter':
                // Share via Twitter
                const tweetText = encodeURIComponent(`Just had an amazing AI voice session on ${discussionRoomData?.topic}! 🎯\n\n${sessionUrl}\n\n#AIVoiceAgent #Learning`);
                window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
                break;
                
            case 'linkedin':
                // Share via LinkedIn
                const linkedinUrl = encodeURIComponent(sessionUrl);
                const linkedinTitle = encodeURIComponent(sessionTitle);
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${linkedinUrl}&title=${linkedinTitle}`, '_blank');
                break;
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">{discussionRoomData?.coachingOption}</h1>
                    <p className="text-gray-600">Topic: {discussionRoomData?.topic}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Video/Audio Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Expert Display */}
                        <Card className="overflow-hidden">
                            <div className="relative h-[400px] bg-gradient-to-br from-primary/5 to-primary/10">
                                {/* Voice Visualization */}
                                {isConnected && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            animate={{
                                                scale: isMuted ? 1 : [1, 1.2, 1],
                                                opacity: isMuted ? 0.5 : [0.5, 0.8, 0.5]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity
                                            }}
                                            className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl"
                                        />
                                    </div>
                                )}
                                
                                {/* Expert Avatar */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.div
                                        animate={{
                                            scale: isProcessing ? [1, 1.05, 1] : 1
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat: isProcessing ? Infinity : 0
                                        }}
                                    >
                                        <Image
                                            src={expert?.avatar || '/default-avatar.png'}
                                            alt={expert?.name || 'Expert'}
                                            width={150}
                                            height={150}
                                            className="rounded-full border-4 border-white shadow-xl"
                                        />
                                    </motion.div>
                                    <h2 className="mt-4 text-xl font-semibold">{expert?.name}</h2>
                                    <Badge variant="secondary" className="mt-2">
                                        {isConnected ? 'Connected' : 'Not Connected'}
                                    </Badge>
                                </div>
                                
                                {/* Voice Level Indicator */}
                                {isConnected && !isMuted && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-white/90 backdrop-blur rounded-lg p-2">
                                            <div className="flex items-center gap-2">
                                                <Mic className="w-4 h-4 text-green-500" />
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-green-500"
                                                        animate={{ width: `${Math.min(voiceLevel * 2, 100)}%` }}
                                                        transition={{ duration: 0.1 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Control Buttons */}
                            <CardContent className="p-4">
                                <div className="flex items-center justify-center gap-4">
                                    {!isConnected ? (
                                        <Button
                                            size="lg"
                                            onClick={handleConnect}
                                            disabled={isProcessing}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            ) : (
                                                <Phone className="w-5 h-5 mr-2" />
                                            )}
                                            Connect
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant={isMuted ? "secondary" : "default"}
                                                size="icon"
                                                onClick={toggleMicrophone}
                                            >
                                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                            </Button>
                                            
                                            <Button
                                                variant={isSpeakerOn ? "default" : "secondary"}
                                                size="icon"
                                                onClick={toggleSpeaker}
                                            >
                                                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                            </Button>
                                            
                                            <Button
                                                variant="destructive"
                                                onClick={handleDisconnect}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                ) : (
                                                    <PhoneOff className="w-5 h-5 mr-2" />
                                                )}
                                                End Call
                                            </Button>
                                        </>
                                    )}
                                </div>
                                
                                {/* Session Stats */}
                                {isConnected && (
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        <div className="text-center">
                                            <Clock className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                                            <p className="text-sm font-medium">{formatDuration(sessionStats.duration)}</p>
                                            <p className="text-xs text-gray-500">Duration</p>
                                        </div>
                                        <div className="text-center">
                                            <MessageSquare className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                                            <p className="text-sm font-medium">{sessionStats.exchanges}</p>
                                            <p className="text-xs text-gray-500">Exchanges</p>
                                        </div>
                                        <div className="text-center">
                                            <Activity className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                                            <p className="text-sm font-medium">{sessionStats.clarity}%</p>
                                            <p className="text-xs text-gray-500">Clarity</p>
                                        </div>
                                        <div className="text-center">
                                            <Zap className="w-4 h-4 mx-auto mb-1 text-gray-500" />
                                            <p className="text-sm font-medium">{sessionStats.engagement}%</p>
                                            <p className="text-xs text-gray-500">Engagement</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        {/* Live Transcript */}
                        {transcript && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Live Transcript</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 italic">{transcript}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    
                    {/* Chat Panel */}
                    <div className="space-y-6">
                        <Card className="h-[600px] flex flex-col">
                            <CardHeader>
                                <CardTitle>Conversation</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col p-0">
                                <ScrollArea className="flex-1 px-4">
                                    <div className="space-y-4 pb-4">
                                        <AnimatePresence>
                                            {messages.map((message, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className={`flex gap-3 ${
                                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                                    }`}
                                                >
                                                    {message.role === 'assistant' && (
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <Bot className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`max-w-[70%] rounded-lg p-3 break-words ${
                                                            message.role === 'user'
                                                                ? 'bg-primary text-white'
                                                                : 'bg-secondary'
                                                        }`}
                                                    >
                                                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                                        <p className="text-xs opacity-70 mt-1">
                                                            {new Date(message.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                    {message.role === 'user' && (
                                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                                
                                {/* Input Area */}
                                <div className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            placeholder="Type a message or speak..."
                                            className="resize-none"
                                            rows={2}
                                            disabled={!isConnected}
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!isConnected || !inputMessage.trim()}
                                            size="icon"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Transcript
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => downloadTranscript('txt')}>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Text File (.txt)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => downloadTranscript('json')}>
                                            <FileJson className="w-4 h-4 mr-2" />
                                            JSON File (.json)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => downloadTranscript('md')}>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Markdown (.md)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start" size="sm">
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share Session
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => shareSession('link')}>
                                            <Link className="w-4 h-4 mr-2" />
                                            Copy Link
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => shareSession('email')}>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Email
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => shareSession('whatsapp')}>
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            WhatsApp
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => shareSession('twitter')}>
                                            <Twitter className="w-4 h-4 mr-2" />
                                            Twitter
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => shareSession('linkedin')}>
                                            <Linkedin className="w-4 h-4 mr-2" />
                                            LinkedIn
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="outline" className="w-full justify-start" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                
                {/* Session Notes */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Session Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            AI-generated notes and action items will appear here after your session ends.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DiscussionRoom