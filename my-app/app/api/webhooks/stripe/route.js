import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Create or update organization subscription
        await convex.mutation(api.organizations.updateSubscription, {
          organizationId: session.metadata.organizationId,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          plan: session.metadata.plan,
          currentPeriodEnd: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
        });

        // Send welcome email
        await sendWelcomeEmail(session.customer_email, session.metadata.plan);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        await convex.mutation(api.organizations.updateSubscription, {
          organizationId: subscription.metadata.organizationId,
          subscriptionId: subscription.id,
          plan: getPlanFromPriceId(subscription.items.data[0].price.id),
          currentPeriodEnd: subscription.current_period_end * 1000,
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Downgrade to free plan
        await convex.mutation(api.organizations.updateSubscription, {
          organizationId: subscription.metadata.organizationId,
          plan: 'free',
          subscriptionId: null,
          currentPeriodEnd: null,
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        
        // Record payment
        await convex.mutation(api.payments.recordPayment, {
          organizationId: invoice.metadata?.organizationId,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          invoiceId: invoice.id,
          paidAt: Date.now(),
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // Send payment failure notification
        await sendPaymentFailureEmail(invoice.customer_email);
        
        // Create notification in app
        await convex.mutation(api.notifications.create, {
          organizationId: invoice.metadata?.organizationId,
          type: 'payment_failed',
          message: 'Payment failed. Please update your payment method.',
          urgent: true,
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

function getPlanFromPriceId(priceId) {
  const priceIdToPlan = {
    [process.env.STRIPE_STARTER_PRICE_ID]: 'starter',
    [process.env.STRIPE_PROFESSIONAL_PRICE_ID]: 'professional',
    [process.env.STRIPE_ENTERPRISE_PRICE_ID]: 'enterprise',
  };
  return priceIdToPlan[priceId] || 'free';
}

async function sendWelcomeEmail(email, plan) {
  // Integrate with email service (SendGrid, Resend, etc.)
  console.log(`Sending welcome email to ${email} for ${plan} plan`);
}

async function sendPaymentFailureEmail(email) {
  // Integrate with email service
  console.log(`Sending payment failure email to ${email}`);
}