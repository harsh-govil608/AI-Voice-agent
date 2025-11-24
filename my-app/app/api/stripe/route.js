import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Subscription plans
const PLANS = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    price: 99,
    features: {
      users: 5,
      sessions: 100,
      minutes: 500,
      support: 'email',
      customAgents: false,
      apiAccess: false,
      whiteLabel: false,
    }
  },
  professional: {
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    price: 499,
    features: {
      users: 50,
      sessions: 1000,
      minutes: 5000,
      support: 'priority',
      customAgents: true,
      apiAccess: true,
      whiteLabel: false,
      analytics: true,
    }
  },
  enterprise: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    price: 2499,
    features: {
      users: -1,
      sessions: -1,
      minutes: -1,
      support: 'dedicated',
      customAgents: true,
      apiAccess: true,
      whiteLabel: true,
      analytics: true,
      sla: true,
      customIntegrations: true,
    }
  }
};

export async function POST(request) {
  try {
    const { action, ...params } = await request.json();

    switch (action) {
      case 'create-checkout-session':
        return createCheckoutSession(params);
      case 'create-portal-session':
        return createPortalSession(params);
      case 'update-subscription':
        return updateSubscription(params);
      case 'cancel-subscription':
        return cancelSubscription(params);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Stripe API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function createCheckoutSession({ plan, organizationId, userId, email }) {
  const planDetails = PLANS[plan];
  if (!planDetails) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: planDetails.priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: email,
    metadata: {
      organizationId,
      userId,
      plan,
    },
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        organizationId,
        plan,
      }
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ sessionId: session.id, url: session.url });
}

async function createPortalSession({ customerId }) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}

async function updateSubscription({ subscriptionId, plan }) {
  const planDetails = PLANS[plan];
  if (!planDetails) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: planDetails.priceId,
    }],
    proration_behavior: 'create_prorations',
  });

  return NextResponse.json({ subscription: updatedSubscription });
}

async function cancelSubscription({ subscriptionId }) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return NextResponse.json({ subscription });
}