"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
// import { useUser } from '@stackframe/stack'
import { toast } from 'sonner'
import { Loader2, Mic, Video, Globe, Clock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

function UserInputDialog({ children, coachingOption }) {
    const router = useRouter();
    // const user = useUser();
    const user = { id: "user123", displayName: "User" }; // Temporary mock user
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        expertName: '',
        language: 'English',
        sessionType: 'voice',
        duration: '30'
    });

    const createRoom = useMutation(api.discussionRooms.createDiscussionRoom);
    
    // Fetch experts from database
    const allExperts = useQuery(api.experts.getAllExperts);
    const CoachingExperts = allExperts || [];

    // Filter experts based on coaching option
    const availableExperts = CoachingExperts.filter(expert => 
        expert.expertise.includes(coachingOption.name)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.topic || !formData.expertName) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        
        try {
            const roomId = await createRoom({
                userId: user?.id || 'anonymous',
                coachingOption: coachingOption.name,
                topic: formData.topic,
                expertName: formData.expertName,
            });

            toast.success('Session created successfully!');
            setOpen(false);
            
            // Navigate to discussion room
            router.push(`/discussion-room/${roomId}`);
        } catch (error) {
            console.error('Error creating room:', error);
            toast.error('Failed to create session. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Start {coachingOption.name} Session
                    </DialogTitle>
                    <DialogDescription>
                        Configure your personalized AI coaching session
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Topic Input */}
                    <div className="space-y-2">
                        <Label htmlFor="topic" className="text-sm font-medium">
                            Session Topic <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="topic"
                            placeholder="e.g., JavaScript fundamentals, Interview preparation..."
                            value={formData.topic}
                            onChange={(e) => handleChange('topic', e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description (Optional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Provide more details about what you want to learn or discuss..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Expert Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="expert" className="text-sm font-medium">
                            Choose Your AI Expert <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.expertName}
                            onValueChange={(value) => handleChange('expertName', value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an expert..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableExperts.map((expert) => (
                                    <SelectItem key={expert.name} value={expert.name}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{expert.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {expert.personality.split(',')[0]}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 ml-4">
                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs">{expert.rating}</span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {formData.expertName && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-secondary rounded-lg mt-2"
                            >
                                <p className="text-xs text-gray-600">
                                    {availableExperts.find(e => e.name === formData.expertName)?.personality}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                        {availableExperts.find(e => e.name === formData.expertName)?.sessions}+ sessions
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {availableExperts.find(e => e.name === formData.expertName)?.languages.length} languages
                                    </Badge>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Session Configuration */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Language */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                Language
                            </Label>
                            <Select
                                value={formData.language}
                                onValueChange={(value) => handleChange('language', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Spanish">Spanish</SelectItem>
                                    <SelectItem value="French">French</SelectItem>
                                    <SelectItem value="German">German</SelectItem>
                                    <SelectItem value="Mandarin">Mandarin</SelectItem>
                                    <SelectItem value="Hindi">Hindi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Session Type */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Session Type
                            </Label>
                            <Select
                                value={formData.sessionType}
                                onValueChange={(value) => handleChange('sessionType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="voice">
                                        <div className="flex items-center gap-2">
                                            <Mic className="w-3 h-3" />
                                            Voice Only
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="video">
                                        <div className="flex items-center gap-2">
                                            <Video className="w-3 h-3" />
                                            Video Call
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Duration
                            </Label>
                            <Select
                                value={formData.duration}
                                onValueChange={(value) => handleChange('duration', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 mins</SelectItem>
                                    <SelectItem value="30">30 mins</SelectItem>
                                    <SelectItem value="45">45 mins</SelectItem>
                                    <SelectItem value="60">60 mins</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            💡 <strong>Tip:</strong> {coachingOption.description}
                        </p>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !formData.topic || !formData.expertName}
                            className="bg-gradient-to-r from-primary to-primary/80"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Session...
                                </>
                            ) : (
                                <>
                                    Start Session
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UserInputDialog
