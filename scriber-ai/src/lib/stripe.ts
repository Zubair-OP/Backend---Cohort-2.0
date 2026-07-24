import Stripe from "stripe";

const getStripeSecretKey = () => {
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return secret;
};

export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: "2025-07-30.basil",
});