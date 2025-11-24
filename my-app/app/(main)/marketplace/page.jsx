'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Star, Download, TrendingUp, Search, Filter,
  Mic, BookOpen, Briefcase, Heart, Code, Globe
} from 'lucide-react';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Agents', icon: Brain },
    { id: 'education', name: 'Education', icon: BookOpen },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'wellness', name: 'Wellness', icon: Heart },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'language', name: 'Language', icon: Globe },
  ];

  const featuredAgents = [
    {
      id: 1,
      name: 'Interview Coach Pro',
      creator: 'TechPrep Inc',
      description: 'Master technical and behavioral interviews with personalized AI coaching',
      category: 'business',
      rating: 4.8,
      reviews: 342,
      downloads: 3420,
      price: 49,
      features: ['Mock interviews', 'Real-time feedback', 'Industry-specific prep'],
      badge: 'Featured',
    },
    {
      id: 2,
      name: 'Language Master AI',
      creator: 'LinguaLearn',
      description: 'Conversational language learning with native-level pronunciation training',
      category: 'language',
      rating: 4.9,
      reviews: 289,
      downloads: 2890,
      price: 39,
      features: ['30+ languages', 'Accent training', 'Cultural context'],
      badge: 'Popular',
    },
    {
      id: 3,
      name: 'Executive Coach Elite',
      creator: 'Leadership Labs',
      description: 'C-suite leadership development and strategic decision-making coaching',
      category: 'business',
      rating: 4.7,
      reviews: 156,
      downloads: 1560,
      price: 199,
      features: ['Leadership scenarios', 'Board presentation prep', 'Crisis management'],
      badge: 'Premium',
    },
    {
      id: 4,
      name: 'Mindfulness Mentor',
      creator: 'ZenAI Studios',
      description: 'Personalized meditation and stress management with voice guidance',
      category: 'wellness',
      rating: 4.9,
      reviews: 523,
      downloads: 5230,
      price: 0,
      features: ['Guided meditation', 'Stress tracking', 'Sleep stories'],
      badge: 'Free',
    },
    {
      id: 5,
      name: 'Sales Trainer Pro',
      creator: 'CloseDeal AI',
      description: 'Advanced sales techniques and objection handling practice',
      category: 'business',
      rating: 4.6,
      reviews: 198,
      downloads: 1980,
      price: 79,
      features: ['Role-play scenarios', 'Objection library', 'Industry scripts'],
    },
    {
      id: 6,
      name: 'Code Review Buddy',
      creator: 'DevTools AI',
      description: 'Real-time code review and best practices coaching for developers',
      category: 'technical',
      rating: 4.8,
      reviews: 412,
      downloads: 4120,
      price: 59,
      features: ['10+ languages', 'Security analysis', 'Performance tips'],
    },
  ];

  const filteredAgents = featuredAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4 rounded-2xl mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">AI Agent Marketplace</h1>
          <p className="text-xl mb-8 opacity-90">
            Discover and deploy specialized AI agents for every coaching need
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Browse Agents
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              Become a Creator
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">147+</div>
            <div className="text-sm text-gray-600">AI Agents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-gray-600">Downloads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">4.7</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">$67K</div>
            <div className="text-sm text-gray-600">Creator Earnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex-shrink-0"
            >
              <Icon className="h-4 w-4 mr-2" />
              {cat.name}
            </Button>
          );
        })}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                {agent.badge && (
                  <Badge variant={agent.price === 0 ? "success" : "default"}>
                    {agent.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-sm">by {agent.creator}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
              
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{agent.rating}</span>
                  <span className="text-gray-500">({agent.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Download className="h-4 w-4" />
                  <span>{agent.downloads.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {agent.features.slice(0, 2).map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {agent.features.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{agent.features.length - 2} more
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {agent.price === 0 ? 'Free' : `$${agent.price}`}
                  {agent.price > 0 && <span className="text-sm text-gray-500 font-normal">/mo</span>}
                </div>
                <Button size="sm">
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Creator CTA */}
      <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Build Your Own AI Agent</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join our creator program and earn revenue by building specialized AI agents. 
            Get access to our SDK, documentation, and support.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Start Building
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}