"use client"
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Brain, Menu, Home, BarChart3, Settings, LogOut, Shield, Store, CreditCard, TrendingUp } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Admin', href: '/admin', icon: Shield },
    { name: 'Marketplace', href: '/marketplace', icon: Store },
    { name: 'Pricing', href: '/pricing', icon: CreditCard },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  ];

  return (
    <div className='fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm'>
      <div className='flex justify-between items-center p-4 md:px-8 lg:px-16'>
        {/* Logo */}
        <div 
          className='flex items-center gap-2 cursor-pointer' 
          onClick={() => router.push('/')}
        >
          <Brain className='w-8 h-8 text-primary' />
          <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
            AI Voice Agent
          </span>
        </div>
        
        {/* Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className='w-4 h-4' />
                <span className='text-sm'>{item.name}</span>
              </button>
            );
          })}
        </nav>
        
        {/* User Menu */}
        <div className='flex items-center gap-3'>
          {/* Theme Toggle */}
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="sm"
            className='hidden md:flex'
            onClick={() => router.push('/dashboard')}
          >
            Get Started
          </Button>
          
          {/* User Avatar */}
          <div className='relative'>
            <button className='flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
              <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-medium'>
                U
              </div>
            </button>
          </div>
          
          {/* Mobile Menu */}
          <button className='md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'>
            <Menu className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppHeader