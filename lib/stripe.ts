import Stripe from "stripe";
import {
  getPack,
  getPackStickers,
  markPackPaid,
  type PackRecord,
} from "@/lib/pack-store";
import { markStickerPaid, type StickerRecord } from "@/lib/sticker-store";

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey);
}

export type PaidCheckout = {
  pack: PackRecord;
  stickers: StickerRecord[];
};

async function resolveLegacySticker(stickerId: string, sessionId?: string): Promise<PaidCheckout | null> {
  const sticker = await markStickerPaid(stickerId, sessionId);

  if (!sticker) {
    return null;
  }

  return {
    pack: {
      id: sticker.id,
      packType: "individual",
      stickerIds: [sticker.id],
      status: "paid",
      priceCents: 990,
      createdAt: sticker.createdAt,
      paidAt: sticker.paidAt,
      stripeSessionId: sessionId,
    },
    stickers: [sticker],
  };
}

export async function resolvePaidCheckoutFromSession(
  sessionId: string | undefined,
): Promise<PaidCheckout | null> {
  if (!sessionId) {
    return null;
  }

  if (sessionId.startsWith("dev_pack_")) {
    const packId = sessionId.replace(/^dev_pack_/, "");
    const pack = await getPack(packId);

    if (!pack || pack.status !== "paid") {
      return null;
    }

    return {
      pack,
      stickers: await getPackStickers(pack),
    };
  }

  if (sessionId.startsWith("dev_")) {
    return resolveLegacySticker(sessionId.replace(/^dev_/, ""), sessionId);
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaid =
      session.payment_status === "paid" || session.status === "complete";
    const packId = session.metadata?.packId;
    const stickerId = session.metadata?.stickerId;

    if (!isPaid) {
      return null;
    }

    if (packId) {
      const pack = await markPackPaid(packId, session.id);

      if (!pack) {
        return null;
      }

      return {
        pack,
        stickers: await getPackStickers(pack),
      };
    }

    if (stickerId) {
      return resolveLegacySticker(stickerId, session.id);
    }

    return null;
  } catch {
    return null;
  }
}

export async function resolvePaidStickerFromSession(
  sessionId: string | undefined,
): Promise<StickerRecord | null> {
  const checkout = await resolvePaidCheckoutFromSession(sessionId);
  return checkout?.stickers[0] ?? null;
}
