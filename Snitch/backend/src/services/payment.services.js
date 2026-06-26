import Stripe from 'stripe';
import { config } from '../config/config.js';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  return stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card'],
    metadata,
  });
};

export const cancelPaymentIntent = async (paymentIntentId) => {
  return stripe.paymentIntents.cancel(paymentIntentId);
};

// Used in webhook handler to verify the event came from Stripe
export const constructWebhookEvent = (rawBody, signature) => {
  return stripe.webhooks.constructEvent(rawBody, signature, config.STRIPE_WEBHOOK_SECRET);
};

export const retrievePaymentIntent = async (paymentIntentId) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};
