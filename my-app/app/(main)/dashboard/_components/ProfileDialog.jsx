"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { User, Mail, Calendar, Award, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function ProfileDialog({children}) {
  // Mock user data - replace with actual user data
  const userData = {
    name: "User",
    email: "user@example.com",
    joinDate: "March 2024",
    totalSessions: 127,
    achievements: ["Fast Learner", "Consistent", "Top Performer"],
    subscription: "Free Plan"
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Manage your account and view your progress
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
              {userData.name[0]}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{userData.name}</h3>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Member Since
              </div>
              <p className="font-medium mt-1">{userData.joinDate}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                Total Sessions
              </div>
              <p className="font-medium mt-1">{userData.totalSessions}</p>
            </div>
          </div>
          
          {/* Achievements */}
          <div>
            <h4 className="text-sm font-medium mb-2">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {userData.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary">
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Subscription */}
          <div className="p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="font-medium">{userData.subscription}</p>
              </div>
              <Button size="sm" variant="outline">
                Upgrade
              </Button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="flex-1">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog