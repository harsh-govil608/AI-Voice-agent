"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Gift, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function Credits() {
  const credits = 5; // Mock data - replace with actual user credits
  const plan = "Free"; // Mock data

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Credits Balance
          </span>
          <Badge variant="secondary">{plan} Plan</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-primary">{credits}</div>
            <p className="text-sm text-gray-600 mt-1">Sessions Remaining</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <Gift className="w-5 h-5 mx-auto mb-1 text-green-500" />
              <p className="text-xs font-medium">5 Free</p>
              <p className="text-xs text-gray-500">Monthly</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <p className="text-xs font-medium">Bonus</p>
              <p className="text-xs text-gray-500">Earn More</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <Crown className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-xs font-medium">Premium</p>
              <p className="text-xs text-gray-500">Unlimited</p>
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
            Upgrade to Premium
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Get unlimited sessions, priority support, and exclusive features
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default Credits