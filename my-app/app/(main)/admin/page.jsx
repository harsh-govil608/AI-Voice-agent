'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Users, DollarSign, TrendingUp, Activity, 
  Settings, Shield, Award, Globe, Mic, Brain,
  Download, Upload, AlertCircle, CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    revenue: { total: 125000, mrr: 45000, growth: 23 },
    users: { total: 2547, active: 1823, enterprise: 47 },
    usage: { sessions: 15420, minutes: 285000, satisfaction: 4.7 },
    performance: { uptime: 99.98, latency: 145, errorRate: 0.02 }
  });

  const [revenueData] = useState([
    { month: 'Jan', revenue: 32000, users: 450 },
    { month: 'Feb', revenue: 35000, users: 520 },
    { month: 'Mar', revenue: 38000, users: 610 },
    { month: 'Apr', revenue: 41000, users: 720 },
    { month: 'May', revenue: 43000, users: 890 },
    { month: 'Jun', revenue: 45000, users: 1050 },
  ]);

  const [planDistribution] = useState([
    { name: 'Enterprise', value: 47, revenue: 117000, color: '#8B5CF6' },
    { name: 'Professional', value: 234, revenue: 116000, color: '#3B82F6' },
    { name: 'Starter', value: 892, revenue: 89000, color: '#10B981' },
    { name: 'Free', value: 1374, revenue: 0, color: '#6B7280' },
  ]);

  const [topAgents] = useState([
    { name: 'Interview Coach Pro', installs: 3420, rating: 4.8, revenue: 34200 },
    { name: 'Language Master AI', installs: 2890, rating: 4.9, revenue: 28900 },
    { name: 'Tech Mentor Bot', installs: 2340, rating: 4.7, revenue: 23400 },
    { name: 'Sales Trainer Elite', installs: 1980, rating: 4.6, revenue: 19800 },
    { name: 'Executive Coach AI', installs: 1560, rating: 4.8, revenue: 31200 },
  ]);

  const [systemHealth] = useState({
    api: { status: 'operational', latency: 120 },
    database: { status: 'operational', latency: 45 },
    ai: { status: 'operational', latency: 230 },
    storage: { status: 'operational', usage: 67 },
    cdn: { status: 'operational', bandwidth: 89 },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Enterprise Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your platform performance and manage operations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.revenue.mrr.toLocaleString()}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{metrics.revenue.growth}%</span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.users.active.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-2">
                {metrics.users.enterprise} Enterprise
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Mic className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.usage.sessions.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-2">
                {Math.round(metrics.usage.minutes / 60).toLocaleString()} hours
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Award className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.usage.satisfaction}/5.0</div>
              <div className="text-sm text-gray-600 mt-2">
                {metrics.performance.uptime}% Uptime
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        name="Revenue ($)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${(value * 1000).toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {planDistribution.map((entry, index) => (
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
                <CardTitle>Payment Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Successful Payments</div>
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-xs text-gray-500 mt-1">1,247 transactions</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Transaction</div>
                    <div className="text-2xl font-bold text-blue-600">$189</div>
                    <div className="text-xs text-gray-500 mt-1">+12% from last month</div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</div>
                    <div className="text-2xl font-bold text-purple-600">2.3%</div>
                    <div className="text-xs text-gray-500 mt-1">Industry avg: 5.6%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#3B82F6" name="New Users" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {planDistribution.map((plan) => (
                      <div key={plan.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: plan.color }}
                          />
                          <span className="font-medium">{plan.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{plan.value} users</span>
                          <Badge variant="outline">
                            {((plan.value / metrics.users.total) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Active Users</span>
                      <span className="font-bold">823</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Weekly Active Users</span>
                      <span className="font-bold">1,456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Active Users</span>
                      <span className="font-bold">1,823</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Session Duration</span>
                      <span className="font-bold">18.5 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sessions per User</span>
                      <span className="font-bold">6.2/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing AI Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAgents.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{agent.name}</div>
                          <div className="text-sm text-gray-600">
                            {agent.installs.toLocaleString()} installs
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Rating</div>
                          <div className="font-semibold">{agent.rating}/5.0</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Revenue</div>
                          <div className="font-semibold text-green-600">
                            ${agent.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">147</div>
                  <div className="text-xs text-gray-500">32 pending review</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">API Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4M</div>
                  <div className="text-xs text-gray-500">This month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Developer Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$67K</div>
                  <div className="text-xs text-gray-500">Shared this month</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(systemHealth).map(([service, status]) => (
                    <div key={service} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{service}</span>
                        <Badge 
                          variant={status.status === 'operational' ? 'success' : 'destructive'}
                        >
                          {status.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {status.latency && `Latency: ${status.latency}ms`}
                        {status.usage && `Usage: ${status.usage}%`}
                        {status.bandwidth && `Bandwidth: ${status.bandwidth}%`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">API Response Time</span>
                        <span className="text-sm font-medium">145ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Database Load</span>
                        <span className="text-sm font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CDN Cache Hit Rate</span>
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
                  <CardTitle>Recent Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">All Systems Operational</div>
                        <div className="text-xs text-gray-500">Last incident: 14 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Scheduled Maintenance</div>
                        <div className="text-xs text-gray-500">June 30, 2024 - 2:00 AM UTC</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'TechCorp Solutions', users: 450, mrr: 12500, logo: '🏢' },
                      { name: 'Global Finance Inc', users: 320, mrr: 9800, logo: '🏦' },
                      { name: 'EduLearn Systems', users: 280, mrr: 8400, logo: '🎓' },
                      { name: 'HealthTech Pro', users: 210, mrr: 7350, logo: '🏥' },
                      { name: 'Marketing Dynamics', users: 180, mrr: 6300, logo: '📊' },
                      { name: 'LegalTech Partners', users: 150, mrr: 5250, logo: '⚖️' },
                    ].map((client) => (
                      <div key={client.name} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">{client.logo}</div>
                          <div>
                            <div className="font-semibold">{client.name}</div>
                            <Badge variant="outline" className="mt-1">Enterprise</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Users:</span>
                            <span className="ml-2 font-medium">{client.users}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">MRR:</span>
                            <span className="ml-2 font-medium text-green-600">
                              ${client.mrr.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>White Label Deployments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Custom Domains Active</span>
                      <Badge>23</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Custom Branding</span>
                      <Badge>18</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Integrations</span>
                      <Badge>47</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SSO Configurations</span>
                      <Badge>31</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="font-bold text-green-600">8 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open Tickets</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolution Rate</span>
                      <span className="font-bold text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SLA Compliance</span>
                      <span className="font-bold text-green-600">99.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}