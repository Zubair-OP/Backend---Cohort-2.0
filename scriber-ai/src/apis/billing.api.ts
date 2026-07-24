import axios from "axios";

export interface StripeCheckoutPayload {
  plan?: "pro";
}

export const getBillingStatusApi = async () => {
  const response = await axios.get("/api/billing/me");

  return response.data;
};

export const createStripeCheckoutSessionApi = async (
  payload: StripeCheckoutPayload = { plan: "pro" }
) => {
  const response = await axios.post("/api/billing/stripe/checkout-session", payload);

  return response.data;
};