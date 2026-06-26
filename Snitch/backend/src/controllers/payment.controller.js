import Cart from '../models/cart.model.js';
import PaymentModel from '../models/payment.model.js';
import {
  cancelPaymentIntent,
  createPaymentIntent,
  constructWebhookEvent,
} from '../services/payment.services.js';

// POST /api/payments/create-intent
export const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      const unitPrice = item.price?.amount ?? item.product?.price?.amount ?? 0;
      return sum + unitPrice * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid cart total' });
    }

    const existingPending = await PaymentModel.findOne({ userId, status: 'pending' });
    if (existingPending) {
      try {
        if (existingPending.stripePaymentIntentId) {
          await cancelPaymentIntent(existingPending.stripePaymentIntentId);
        }
      } catch (cancelError) {
        console.warn('[createPayment] Could not cancel old payment intent:', cancelError.message);
      }

      existingPending.status = 'cancelled';
      await existingPending.save();
    }

    const paymentIntent = await createPaymentIntent({
      // Stripe requires amount in smallest currency unit (cents for USD).
      // PKR is not supported by Stripe, so USD is used for Stripe transactions.
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: { userId: userId.toString() },
    });

    const orderItems = cart.items.map((item) => ({
      productId: item.product._id,
      variantId: item.variant ?? undefined,
      quantity: item.quantity,
      price: item.price,
      description: item.product.description,
      images: item.product.images?.slice(0, 1),
    }));

    const payment = await PaymentModel.create({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      price: { amount: totalAmount, currency: 'PKR' },
      orderItems,
    });

    return res.status(201).json({
      message: 'Payment intent created successfully',
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('[createPayment]', error);
    return res.status(500).json({ message: 'Failed to initiate payment' });
  }
};

// POST /api/payments/webhook  (raw body — registered in app.js before express.json)
export const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ message: 'Missing stripe-signature header' });
  }

  let event;
  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const paymentIntent = event.data.object;

  try {
    if (event.type === 'payment_intent.succeeded') {
      const payment = await PaymentModel.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'successful' },
        { new: true }
      );

      // Cart sirf tab clear hogi jab payment Stripe se confirm ho —
      // orderItems PaymentModel mein already saved hain, data loss nahi hoga
      if (payment) {
        await Cart.findOneAndUpdate(
          { user: payment.userId },
          { $set: { items: [] } }
        );
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      await PaymentModel.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'failed' }
      );
      // Cart intact rehti hai — user dobara try kar sake
    } else if (event.type === 'payment_intent.canceled') {
      await PaymentModel.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { status: 'cancelled' }
      );
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Webhook] DB update error:', err);
    return res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// GET /api/payments/:paymentId
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await PaymentModel.findOne({
      _id: req.params.paymentId,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.status(200).json({ payment });
  } catch (err) {
    console.error('[getPaymentStatus]', err);
    return res.status(500).json({ message: 'Failed to fetch payment' });
  }
};
