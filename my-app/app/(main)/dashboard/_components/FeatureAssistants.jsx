"use client"
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// import { useUser } from '@stackframe/stack';
import Image from 'next/image';
import ProfileDialog from './ProfileDialog';
import UserInputDialog from './UserInputDialog';
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star, TrendingUp, User } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

function FeatureAssistants() {
    // const user = useUser();
    const user = { displayName: "User" }; // Temporary mock user
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [hoveredCard, setHoveredCard] = useState(null);
    
    // Fetch coaching options from database
    const coachingOptions = useQuery(api.coachingOptions.getAllCoachingOptions);
    const CoachingOptions = coachingOptions || [];
    
    // Fetch platform stats for display
    const platformStats = useQuery(api.platformStats.getPlatformStats);
    const userStats = useQuery(api.userStats.getUserStats, { userId: "user123" });

    const categories = ['all', 'education', 'professional', 'wellness', 'technical'];

    const filterOptions = (option) => {
        if (selectedCategory === 'all') return true;
        
        const categoryMap = {
            'education': ['Lecture on Topic', 'Q&A Preparation', 'Language Skills'],
            'professional': ['Mock Interview', 'Career Coaching', 'Business Strategy'],
            'wellness': ['Meditation & Wellness'],
            'technical': ['Technical Training']
        };
        
        return categoryMap[selectedCategory]?.includes(option.name);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">My AI Workspace</h2>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Welcome back, {user?.displayName || 'User'}
                    </h1>
                    <p className="text-gray-600 mt-2">Choose an AI expert to start your personalized session</p>
                </div>
                <ProfileDialog>
                    <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                    </Button>
                </ProfileDialog>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Assistant Cards Grid */}
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {CoachingOptions.filter(filterOptions).map((option, index) => (
                    <motion.div
                        key={option.name}
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <UserInputDialog coachingOption={option}>
                            <Card className="cursor-pointer overflow-hidden h-full border-2 hover:border-primary/50 transition-all duration-300">
                                <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className={`p-4 bg-white rounded-full shadow-lg transform transition-transform ${hoveredCard === index ? 'rotate-12 scale-110' : ''}`}>
                                            <Image 
                                                src={option.icon} 
                                                alt={option.name}
                                                width={60} 
                                                height={60}
                                                className="w-12 h-12 object-contain"
                                            />
                                        </div>
                                    </div>
                                    {/* Animated background pattern */}
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" />
                                    </div>
                                </div>
                                
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {option.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="secondary" className="text-xs">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {option.duration}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {option.level}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-medium">
                                                {platformStats?.averageRating > 0 ? platformStats.averageRating.toFixed(1) : "5.0"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({platformStats?.totalReviews > 0 ? platformStats.totalReviews : "New"})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Users className="w-3 h-3" />
                                            <span>
                                                {platformStats?.activeUsers > 0 ? 
                                                    `${platformStats.activeUsers} active` : 
                                                    "Join now"}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </UserInputDialog>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Stats Bar */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl"
            >
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="font-medium">Your Progress:</span>
                        <span className="text-sm text-gray-600">
                            {userStats?.totalSessions > 0 ? 
                                `${userStats.totalSessions} total sessions` : 
                                "Start your journey"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {userStats?.streak > 0 && (
                            <Badge variant="default" className="bg-green-500">
                                <span className="mr-1">🔥</span> {userStats.streak} day streak
                            </Badge>
                        )}
                        <Badge variant="secondary">
                            {userStats?.totalSessions > 0 ? 
                                `Next milestone: ${Math.ceil((userStats.totalSessions + 1) / 5) * 5} sessions` :
                                "Start your first session"}
                        </Badge>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default FeatureAssistants