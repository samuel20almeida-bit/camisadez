import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { getSticker, markStickerPaid } from "@/lib/sticker-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { stickerId } = (await request.json().catch(() => ({}))) as {
    stickerId?: string;
  };

  if (!stickerId) {
    return NextResponse.json({ error: "ID da figurinha ausente." }, { status: 400 });
  }

  const sticker = await getSticker(stickerId);

  if (!sticker) {
    return NextResponse.json({ error: "Figurinha não encontrada." }, { status: 404 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const stripe = getStripeClient();

  if (!stripe) {
    await markStickerPaid(stickerId, `dev_${stickerId}`);

    return NextResponse.json({
      url: `${origin}/sucesso?session_id=dev_${stickerId}`,
      mode: "development",
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: 990,
          product_data: {
            name: "Figurinha Personalizada Copa 2026 — sem marca d'água",
          },
        },
      },
    ],
    success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/preview?id=${stickerId}`,
    metadata: {
      stickerId,
    },
  });

  return NextResponse.json({ url: session.url });
}
