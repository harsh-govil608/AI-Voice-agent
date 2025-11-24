"use client"
import React, { useState, useEffect } from 'react'
import FeatureAssistants from './_components/FeatureAssistants'
import History from './_components/History'
import Feedback from './_components/Feedback'
import Credits from './_components/Credits'
import { motion } from 'framer-motion'
import { Mic, MicOff, Activity, TrendingUp, Users, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

function Dashboard() {
  // Mock user ID - replace with actual user authentication
  const userId = "user123";
  
  // Fetch real user stats from database
  const userStats = useQuery(api.userStats.getFormattedUserStats, { userId });
  const platformStats = useQuery(api.platformStats.getFormattedStats);
  
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    averageRating: 0,
    activeUsers: 0
  });

  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Load user statistics
    loadUserStats();
    checkVoiceCapability();
  }, [userStats, platformStats]);

  const loadUserStats = async () => {
    // Load real stats from database
    if (userStats && platformStats) {
      setStats({
        totalSessions: parseInt(userStats.totalSessions) || 0,
        totalMinutes: parseInt(userStats.totalMinutes) || 0,
        averageRating: parseFloat(userStats.averageRating) || 0,
        activeUsers: parseInt(platformStats.activeUsers) || 0
      });
    }
  };

  const checkVoiceCapability = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceStatus('ready');
    } else {
      setVoiceStatus('unsupported');
    }
  };

  const toggleVoiceCommand = () => {
    setIsListening(!isListening);
    // Voice command logic will be handled by VoiceService
  };

  return (
    <div className="min-h-screen">
      {/* Voice Status Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 right-4 z-50"
      >
        <Card className={`border-2 ${isListening ? 'border-green-500 animate-pulse' : 'border-gray-300'}`}>
          <CardContent className="flex items-center gap-3 p-3">
            <button
              onClick={toggleVoiceCommand}
              className={`p-2 rounded-full transition-all ${
                isListening ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Voice Assistant</span>
              <span className="text-xs text-gray-500">
                {isListening ? 'Listening...' : 'Click to activate'}
              </span>
            </div>
            {isListening && (
              <div className="flex gap-1">
                <motion.div
                  animate={{ height: [10, 20, 10] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-1 bg-green-500 rounded"
                />
                <motion.div
                  animate={{ height: [15, 8, 15] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  className="w-1 bg-green-500 rounded"
                />
                <motion.div
                  animate={{ height: [8, 18, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  className="w-1 bg-green-500 rounded"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                {userStats?.percentageIncrease || '+0%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Minutes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMinutes}</div>
              <p className="text-xs text-muted-foreground">
                {userStats?.totalHours || '0'} hours total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-yellow-400 ${i < Math.floor(stats.averageRating) ? '★' : '☆'}`}>
                    {i < Math.floor(stats.averageRating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {platformStats?.totalUsers || '0'} total users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Assistants Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FeatureAssistants />
        </motion.div>

        {/* History and Feedback Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12"
        >
          <History />
          <Feedback />
        </motion.div>

        {/* Credits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Credits />
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard