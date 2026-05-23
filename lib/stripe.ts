import Stripe from "stripe";
import { getSticker, markStickerPaid, type StickerRecord } from "@/lib/sticker-store";

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey);
}

export async function resolvePaidStickerFromSession(
  sessionId: string | undefined,
): Promise<StickerRecord | null> {
  if (!sessionId) {
    return null;
  }

  if (sessionId.startsWith("dev_")) {
    const stickerId = sessionId.replace(/^dev_/, "");
    const sticker = await getSticker(stickerId);
    return sticker?.status === "paid" ? sticker : null;
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const stickerId = session.metadata?.stickerId;
    const isPaid =
      session.payment_status === "paid" || session.status === "complete";

    if (!stickerId || !isPaid) {
      return null;
    }

    return markStickerPaid(stickerId, session.id);
  } catch {
    return null;
  }
}
