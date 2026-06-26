import mongoose from "mongoose";
import { priceSchema } from "./product.model.js";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Stripe's PaymentIntent ID — used for webhook lookup and to prevent duplicate orders
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "cancelled"],
      default: "pending",
    },
    price: {
      type: priceSchema,
      required: true,
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product.variants",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: priceSchema,
        },
        description: {
          type: String,
        },
        images: [
          {
            url: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;
