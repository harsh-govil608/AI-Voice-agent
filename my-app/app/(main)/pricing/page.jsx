'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, X, Zap, Shield, Building2, Rocket } from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small teams',
      price: isAnnual ? 79 : 99,
      originalPrice: isAnnual ? null : null,
      icon: Zap,
      color: 'from-green-500 to-emerald-600',
      features: [
        { name: 'Up to 5 users', included: true },
        { name: '100 coaching sessions/month', included: true },
        { name: '500 minutes of AI time', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Standard AI agents', included: true },
        { name: 'API access', included: false },
        { name: 'White labeling', included: false },
        { name: 'Custom AI agents', included: false },
        { name: 'Priority support', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For growing teams and businesses',
      price: isAnnual ? 399 : 499,
      originalPrice: isAnnual ? 499 : null,
      icon: Shield,
      color: 'from-blue-500 to-indigo-600',
      features: [
        { name: 'Up to 50 users', included: true },
        { name: '1,000 coaching sessions/month', included: true },
        { name: '5,000 minutes of AI time', included: true },
        { name: 'Advanced analytics & reports', included: true },
        { name: 'Priority support', included: true },
        { name: 'All AI agents + marketplace', included: true },
        { name: 'API access (100K calls)', included: true },
        { name: 'Team collaboration tools', included: true },
        { name: 'White labeling', included: false },
        { name: 'Custom AI agent development', included: false },
      ],
      cta: 'Start Free Trial',
      popular: true,
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise',
      description: 'Tailored solutions for large organizations',
      price: isAnnual ? 1999 : 2499,
      originalPrice: isAnnual ? 2499 : null,
      icon: Building2,
      color: 'from-purple-500 to-pink-600',
      features: [
        { name: 'Unlimited users', included: true },
        { name: 'Unlimited sessions', included: true },
        { name: 'Unlimited AI time', included: true },
        { name: 'Custom analytics dashboards', included: true },
        { name: 'Dedicated support team', included: true },
        { name: 'All agents + custom development', included: true },
        { name: 'Unlimited API calls', included: true },
        { name: 'Advanced team management', included: true },
        { name: 'Full white labeling', included: true },
        { name: 'SLA & compliance (SOC 2)', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
      badge: 'Best Value',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'VP of Learning, TechCorp',
      content: 'The AI Voice Agent has transformed our employee training. ROI within 3 months!',
      rating: 5,
    },
    {
      name: 'Michael Torres',
      role: 'CEO, StartupHub',
      content: 'Interview prep with this platform increased our placement rate by 40%.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Director of HR, Global Finance',
      content: 'The analytics alone are worth the price. Incredible insights into team development.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="outline">
          <Rocket className="h-3 w-3 mr-1" />
          Limited Time: 20% off annual plans
        </Badge>
        <h1 className="text-4xl font-bold mb-4">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Scale your AI coaching platform with transparent, flexible pricing
        </p>
        
        {/* Annual Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className={!isAnnual ? 'font-semibold' : 'text-gray-500'}>Monthly</span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <span className={isAnnual ? 'font-semibold' : 'text-gray-500'}>
            Annual
            <Badge className="ml-2" variant="success">Save 20%</Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  {plan.badge}
                </Badge>
              )}
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.originalPrice && (
                      <span className="ml-2 text-xl line-through text-gray-400">
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className="ml-2 text-gray-600">/month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-green-600 mt-1">
                      Billed annually (${plan.price * 12})
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mb-6" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${!feature.included ? 'text-gray-400' : ''}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ROI Calculator */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Calculate Your ROI</CardTitle>
          <CardDescription>See how much you can save with AI coaching</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">Traditional Coaching Cost</label>
              <div className="text-2xl font-bold text-red-600">$150/session</div>
              <div className="text-sm text-gray-500">Industry average</div>
            </div>
            <div>
              <label className="text-sm font-medium">AI Voice Agent Cost</label>
              <div className="text-2xl font-bold text-green-600">$5/session</div>
              <div className="text-sm text-gray-500">With Professional plan</div>
            </div>
            <div>
              <label className="text-sm font-medium">Your Savings</label>
              <div className="text-2xl font-bold text-primary">$145/session</div>
              <div className="text-sm text-gray-500">97% cost reduction</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-green-800 dark:text-green-200">
              <strong>Annual Savings for 100 sessions/month:</strong> $174,000
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, all plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We'll notify you when you're approaching limits and offer easy upgrade options.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer custom enterprise solutions?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, contact our sales team for custom pricing and features tailored to your needs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}