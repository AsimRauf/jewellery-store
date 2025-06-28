import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/utils/db';
import Order from '@/models/Order';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        console.log('💰 Payment succeeded for:', paymentIntent.id);
        console.log('💰 Amount:', paymentIntent.amount / 100);
        
        // Find the order first to see if it exists
        const existingOrder = await Order.findOne({ 
          'paymentInfo.stripePaymentIntentId': paymentIntent.id 
        });
        
        if (!existingOrder) {
          console.log('❌ No order found with payment intent:', paymentIntent.id);
          
          // Try to find by amount and pending status as fallback
          const orderByAmount = await Order.findOne({
            'pricing.total': paymentIntent.amount / 100,
            paymentStatus: 'pending'
          }).sort({ createdAt: -1 });
          
          if (orderByAmount) {
            console.log('🔄 Found order by amount, updating:', orderByAmount.orderNumber);
            await Order.findByIdAndUpdate(orderByAmount._id, {
              $set: {
                paymentStatus: 'succeeded',
                status: 'confirmed',
                'paymentInfo.stripePaymentIntentId': paymentIntent.id
              }
            });
            console.log('✅ Order updated via amount matching');
          } else {
            console.log('❌ No matching order found by amount either');
          }
          break;
        }
        
        // Update order status with card details
        const updatedOrder = await Order.findOneAndUpdate(
          { 'paymentInfo.stripePaymentIntentId': paymentIntent.id },
          {
            $set: {
              paymentStatus: 'succeeded',
              status: 'confirmed'
            }
          },
          { new: true }
        );
        
        console.log('✅ Order updated successfully:', updatedOrder?.orderNumber);
        break;

      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        
        console.log('💳 Charge succeeded:', charge.id);
        
        // Update order with card details
        if (charge.payment_intent && typeof charge.payment_intent === 'string') {
          const cardDetails = charge.payment_method_details?.card;
          
          const cardUpdatedOrder = await Order.findOneAndUpdate(
            { 'paymentInfo.stripePaymentIntentId': charge.payment_intent },
            {
              $set: {
                'paymentInfo.cardLastFour': cardDetails?.last4 || '',
                'paymentInfo.cardBrand': cardDetails?.brand || '',
                'paymentInfo.cardExpMonth': cardDetails?.exp_month || null,
                'paymentInfo.cardExpYear': cardDetails?.exp_year || null,
              }
            },
            { new: true }
          );
          
          if (cardUpdatedOrder) {
            console.log('✅ Card details updated for order:', cardUpdatedOrder.orderNumber);
          } else {
            console.log('❌ Could not find order to update card details for:', charge.payment_intent);
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        await Order.findOneAndUpdate(
          { 'paymentInfo.stripePaymentIntentId': failedPayment.id },
          {
            paymentStatus: 'failed',
            status: 'cancelled'
          }
        );
        
        console.log('❌ Payment failed:', failedPayment.id);
        break;

      case 'payment_intent.requires_action':
        const actionRequired = event.data.object as Stripe.PaymentIntent;
        
        await Order.findOneAndUpdate(
          { 'paymentInfo.stripePaymentIntentId': actionRequired.id },
          {
            paymentStatus: 'requires_action'
          }
        );
        
        console.log('⚠️ Payment requires action:', actionRequired.id);
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent;
        
        await Order.findOneAndUpdate(
          { 'paymentInfo.stripePaymentIntentId': canceledPayment.id },
          {
            paymentStatus: 'failed',
            status: 'cancelled'
          }
        );
        
        console.log('Payment canceled:', canceledPayment.id);
        break;

      case 'charge.dispute.created':
        const dispute = event.data.object as Stripe.Dispute;
        
        console.log('Dispute created for charge:', dispute.charge);
        
        if (typeof dispute.charge === 'string') {
          try {
            const charge = await stripe.charges.retrieve(dispute.charge);
            if (charge.payment_intent && typeof charge.payment_intent === 'string') {
              await Order.findOneAndUpdate(
                { 'paymentInfo.stripePaymentIntentId': charge.payment_intent },
                {
                  status: 'disputed',
                  notes: `Dispute created: ${dispute.reason}`
                }
              );
            }
          } catch (disputeError) {
            console.error('Error handling dispute:', disputeError);
          }
        }
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
