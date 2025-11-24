"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MessageSquare, Star, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function History() {
  // Mock data - replace with actual data from Convex
  const sessions = [
    {
      id: 1,
      topic: "JavaScript Interview Prep",
      expert: "Dr. Sophia Chen",
      date: "2024-03-20",
      duration: 35,
      rating: 5,
      status: "completed"
    },
    {
      id: 2,
      topic: "Public Speaking Skills",
      expert: "Maya Patel",
      date: "2024-03-19",
      duration: 25,
      rating: 4,
      status: "completed"
    },
    {
      id: 3,
      topic: "Business Strategy Discussion",
      expert: "Prof. James Mitchell",
      date: "2024-03-18",
      duration: 45,
      rating: 5,
      status: "completed"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Sessions</span>
          <Badge variant="secondary">{sessions.length} Total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-start justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex-1">
                <h4 className="font-medium">{session.topic}</h4>
                <p className="text-sm text-gray-600 mt-1">with {session.expert}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {session.duration} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {session.date}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < session.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="outline" className="text-xs">
                  {session.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 text-sm text-primary hover:underline">
          View All Sessions →
        </button>
      </CardContent>
    </Card>
  )
}

export default History
