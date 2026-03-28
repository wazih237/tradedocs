import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";

    // Verify webhook signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;

    switch (eventName) {
      case "order_created": {
        const order = payload.data;
        const templateId = order.attributes.first_order_item?.variant_id;
        const customerEmail = order.attributes.user_email;
        const orderId = order.id;
        const total = order.attributes.total_formatted;

        console.log(
          `Order ${orderId}: ${customerEmail} purchased template ${templateId} for ${total}`
        );

        // TODO: Record order in Supabase
        // TODO: Send download link email
        // TODO: Grant access to template file

        break;
      }

      case "order_refunded": {
        const order = payload.data;
        console.log(`Order ${order.id} refunded`);
        // TODO: Revoke access in Supabase
        break;
      }

      case "subscription_created":
      case "subscription_updated":
      case "subscription_cancelled": {
        // Handle subscription events for future subscription tier
        console.log(`Subscription event: ${eventName}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
