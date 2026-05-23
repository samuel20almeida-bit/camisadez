import { NextResponse } from "next/server";
import { markPackPaid } from "@/lib/pack-store";
import { getStripeClient } from "@/lib/stripe";
import { markStickerPaid } from "@/lib/sticker-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret || !signature) {
    return NextResponse.json(
      { error: "Webhook Stripe não configurado." },
      { status: 500 },
    );
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const packId = session.metadata?.packId;
      const stickerId = session.metadata?.stickerId;

      if (packId) {
        await markPackPaid(packId, session.id);
      } else if (stickerId) {
        await markStickerPaid(stickerId, session.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Assinatura do webhook inválida." },
      { status: 400 },
    );
  }
}
