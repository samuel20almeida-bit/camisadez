import { NextResponse } from "next/server";
import { createPack, markPackPaid } from "@/lib/pack-store";
import { PACKS, normalizePackType } from "@/lib/packs";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutPayload = {
  packType?: string;
  stickerIds?: string[];
  stickerId?: string;
};

function getLineItem(packType: keyof typeof PACKS) {
  const config = PACKS[packType];
  const configuredPrice = process.env[config.stripePriceEnv];

  if (configuredPrice) {
    return {
      quantity: 1,
      price: configuredPrice,
    };
  }

  return {
    quantity: 1,
    price_data: {
      currency: "brl",
      unit_amount: config.priceCents,
      product_data: {
        name: config.productName,
      },
    },
  };
}

function resolveOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV !== "production") {
    return request.headers.get("origin") ?? "http://localhost:3000";
  }

  return null;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as CheckoutPayload;
  const packType = normalizePackType(payload.packType);
  const stickerIds = payload.stickerIds?.filter(Boolean) ?? (payload.stickerId ? [payload.stickerId] : []);

  const origin = resolveOrigin(request);

  if (!origin) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_SITE_URL não configurado." },
      { status: 500 },
    );
  }

  const stripe = getStripeClient();

  let pack;

  try {
    pack = await createPack(packType, stickerIds);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pack inválido." },
      { status: 400 },
    );
  }

  const config = PACKS[pack.packType];

  if (!stripe) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Pagamento indisponível no momento." },
        { status: 503 },
      );
    }

    await markPackPaid(pack.id, `dev_pack_${pack.id}`);

    return NextResponse.json({
      url: `${origin}/sucesso?session_id=dev_pack_${pack.id}`,
      mode: "development",
      packId: pack.id,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [getLineItem(pack.packType)],
    success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/criar?pack=${pack.packType}`,
    metadata: {
      packId: pack.id,
      packType: pack.packType,
      stickerIds: pack.stickerIds.join(","),
    },
  });

  return NextResponse.json({
    url: session.url,
    packId: pack.id,
    priceLabel: config.priceLabel,
  });
}
