"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Mic, Brain, Globe, Shield, Zap, Users, 
  ChevronRight, Star, TrendingUp, Award,
  Headphones, MessageSquare, BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  
  // Fetch real platform statistics
  const platformStats = useQuery(api.platformStats.getPlatformStats);
  const testimonials = useQuery(api.testimonials.getLandingPageTestimonials);
  
  // Initialize platform stats if needed
  const initStats = useMutation(api.platformStats.initializePlatformStats);
  
  useEffect(() => {
    // Initialize platform stats on first load
    initStats();
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Intelligence",
      description: "GPT-4 powered conversations with context awareness and personalized responses"
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Real-time Voice Processing",
      description: "WebRTC-based voice capture with noise suppression and crystal-clear audio"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-language Support",
      description: "Communicate in 6+ languages with real-time translation and transcription"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "End-to-end encryption and secure data handling for complete privacy"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Sub-200ms response time with optimized audio processing pipeline"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Network",
      description: "Access to specialized AI experts across multiple domains"
    }
  ];

  // Use real stats from database or defaults
  const stats = platformStats ? [
    { 
      value: platformStats.totalUsers > 0 ? 
        (platformStats.totalUsers >= 1000 ? 
          `${(platformStats.totalUsers / 1000).toFixed(0)}K+` : 
          platformStats.totalUsers.toString()) : 
        "Join Now", 
      label: "Active Users" 
    },
    { 
      value: platformStats.averageRating > 0 ? 
        platformStats.averageRating.toFixed(1) : 
        "5.0", 
      label: "User Rating" 
    },
    { 
      value: platformStats.totalSessions > 0 ? 
        (platformStats.totalSessions >= 1000 ? 
          `${(platformStats.totalSessions / 1000).toFixed(0)}K+` : 
          platformStats.totalSessions.toString()) : 
        "Start Now", 
      label: "Sessions Completed" 
    },
    { 
      value: platformStats.satisfactionRate > 0 ? 
        `${platformStats.satisfactionRate.toFixed(0)}%` : 
        "100%", 
      label: "Satisfaction Rate" 
    }
  ] : [
    { value: "Join Now", label: "Active Users" },
    { value: "5.0", label: "User Rating" },
    { value: "Start Now", label: "Sessions Completed" },
    { value: "100%", label: "Satisfaction Rate" }
  ];

  // Use real testimonials from database or defaults
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    {
      name: "Be the First",
      role: "Early Adopter",
      content: "Join our AI Voice Agent platform and share your success story!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              Powered by GPT-4 & WebRTC
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your AI Voice Coach
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Experience the future of personalized learning with real-time AI voice conversations, 
              expert coaching, and professional development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Start Free Session
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                <Headphones className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>5 free sessions</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Voice AI Platform
            </h2>
            <p className="text-xl text-gray-600">
              Built for scale, designed for excellence
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Your Skills
            </h2>
            <p className="text-xl text-gray-600">
              Professional coaching for every career stage
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎓", title: "Students", desc: "Ace exams and interviews" },
              { icon: "💼", title: "Professionals", desc: "Advance your career" },
              { icon: "🚀", title: "Entrepreneurs", desc: "Build better businesses" },
              { icon: "🌍", title: "Language Learners", desc: "Master new languages" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our users are saying
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials && displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users improving their skills every day
            </p>
            <Button 
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Get Started for Free
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 5 free sessions • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Voice Agent</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Terms</a>
              <a href="#" className="hover:text-primary">Support</a>
              <a href="#" className="hover:text-primary">API</a>
            </div>
            <div className="text-sm text-gray-600">
              © 2024 AI Voice Agent. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}