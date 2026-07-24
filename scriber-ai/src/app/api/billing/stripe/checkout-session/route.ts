import connectToDB from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import UserModel from "@/models/user.model";
import { StripeCheckoutBody } from "@/types/user.types";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const userId = await getCurrentUser();
    const body: StripeCheckoutBody = await req.json().catch(() => ({}));
    const plan = body.plan ?? "pro";

    if (plan !== "pro") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unsupported plan",
        },
        { status: 400 }
      );
    }

    const priceId = process.env.STRIPE_PRICE_ID_PRO;

    if (!priceId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Stripe price is not configured",
        },
        { status: 500 }
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/pricing?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      client_reference_id: userId,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Checkout session created successfully",
        data: {
          url: session.url,
          id: session.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in checkout session api", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}