'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Users, Clock, DollarSign, 
  Mic, Brain, Target, Award, Calendar, Download
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Sample data
  const sessionData = [
    { date: 'Jan 1', sessions: 45, minutes: 675 },
    { date: 'Jan 7', sessions: 52, minutes: 780 },
    { date: 'Jan 14', sessions: 68, minutes: 1020 },
    { date: 'Jan 21', sessions: 85, minutes: 1275 },
    { date: 'Jan 28', sessions: 92, minutes: 1380 },
    { date: 'Feb 4', sessions: 105, minutes: 1575 },
    { date: 'Feb 11', sessions: 118, minutes: 1770 },
  ];

  const userEngagement = [
    { metric: 'Speech Clarity', value: 85, benchmark: 70 },
    { metric: 'Response Time', value: 92, benchmark: 80 },
    { metric: 'Topic Relevance', value: 88, benchmark: 75 },
    { metric: 'Engagement', value: 94, benchmark: 85 },
    { metric: 'Completion Rate', value: 78, benchmark: 60 },
  ];

  const agentUsage = [
    { name: 'Interview Coach', value: 35, color: '#8B5CF6' },
    { name: 'Language Learning', value: 25, color: '#3B82F6' },
    { name: 'Tech Mentor', value: 20, color: '#10B981' },
    { name: 'Sales Training', value: 12, color: '#F59E0B' },
    { name: 'Wellness', value: 8, color: '#EC4899' },
  ];

  const improvementAreas = [
    { area: 'Pronunciation', count: 45, trend: '+12%' },
    { area: 'Technical Terms', count: 38, trend: '+8%' },
    { area: 'Confidence', count: 32, trend: '-5%' },
    { area: 'Structure', count: 28, trend: '+15%' },
    { area: 'Examples', count: 24, trend: '+3%' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your AI coaching performance and user insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last {timeRange}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Sessions
              <Mic className="h-4 w-4 text-purple-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">520</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Active Users
              <Users className="h-4 w-4 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18% growth
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Avg Duration
              <Clock className="h-4 w-4 text-orange-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5m</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.3m increase
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Satisfaction
              <Award className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              Based on 342 reviews
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      name="Sessions"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="minutes" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Minutes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Agent Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={agentUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {agentUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Improvement Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {improvementAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{area.area}</div>
                        <div className="text-sm text-gray-500">
                          Mentioned {area.count} times
                        </div>
                      </div>
                    </div>
                    <Badge variant={area.trend.startsWith('+') ? 'success' : 'secondary'}>
                      {area.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={userEngagement}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Your Users" 
                    dataKey="value" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="Benchmark" 
                    dataKey="benchmark" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3} 
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Daily Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <div className="text-xs text-gray-500 mt-1">70% of total users</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84%</div>
                <div className="text-xs text-gray-500 mt-1">30-day retention</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">NPS Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72</div>
                <div className="text-xs text-green-600 mt-1">Excellent</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Voice Recognition Accuracy</span>
                    <span className="text-sm font-medium">96.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '96.5%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">AI Response Time</span>
                    <span className="text-sm font-medium">145ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">System Uptime</span>
                    <span className="text-sm font-medium">99.98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.98%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">User Satisfaction</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Context Relevance</div>
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Response Quality</div>
                  <div className="text-2xl font-bold text-blue-600">4.7/5</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Learning Progress</div>
                  <div className="text-2xl font-bold text-green-600">+34%</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Error Rate</div>
                  <div className="text-2xl font-bold text-orange-600">0.3%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Return on Investment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Cost Savings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Traditional Coaching Costs</span>
                      <span className="text-sm font-medium text-red-600">$78,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">AI Voice Agent Costs</span>
                      <span className="text-sm font-medium text-green-600">$2,600</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Savings</span>
                        <span className="font-bold text-green-600">$75,400</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Efficiency Gains</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Time Saved</span>
                      <span className="text-sm font-medium">260 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Productivity Increase</span>
                      <span className="text-sm font-medium">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Training Completion Rate</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total ROI</div>
                    <div className="text-3xl font-bold text-green-600">2,900%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Payback Period</div>
                    <div className="text-xl font-bold">1.2 months</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projected Annual Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { category: 'Cost Reduction', value: 75400, color: '#10B981' },
                  { category: 'Productivity Gains', value: 45000, color: '#3B82F6' },
                  { category: 'Quality Improvement', value: 32000, color: '#8B5CF6' },
                  { category: 'Scale Benefits', value: 28000, color: '#F59E0B' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#8B5CF6">
                    {[0, 1, 2, 3].map((index) => (
                      <Cell key={`cell-${index}`} fill={['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}