"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Lightbulb, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function Feedback() {
  // Mock feedback data
  const feedbackItems = [
    {
      id: 1,
      category: "Improvement",
      icon: TrendingUp,
      title: "Speaking Pace",
      description: "Your speaking pace has improved by 15% in the last 5 sessions",
      color: "text-green-500"
    },
    {
      id: 2,
      category: "Goal",
      icon: Target,
      title: "Next Milestone",
      description: "Complete 2 more technical interviews to unlock advanced features",
      color: "text-blue-500"
    },
    {
      id: 3,
      category: "Tip",
      icon: Lightbulb,
      title: "Pro Tip",
      description: "Try using more specific examples in your responses for better clarity",
      color: "text-yellow-500"
    },
    {
      id: 4,
      category: "Achievement",
      icon: Award,
      title: "Milestone Reached",
      description: "You've completed 10 sessions! Keep up the great work",
      color: "text-purple-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Insights & Feedback</span>
          <Badge variant="secondary">AI Analysis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbackItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className={`mt-1 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-4 text-sm text-primary hover:underline">
          View Detailed Analytics →
        </button>
      </CardContent>
    </Card>
  )
}

export default Feedback