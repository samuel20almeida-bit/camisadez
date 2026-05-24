import { getSupabaseClient } from "@/lib/supabase";
import {
  getSticker,
  markStickerPaid,
  type StickerRecord,
} from "@/lib/sticker-store";
import { PACKS, type PackType } from "@/lib/packs";

export type PackStatus = "generated" | "paid";

export type PackRecord = {
  id: string;
  packType: PackType;
  stickerIds: string[];
  status: PackStatus;
  priceCents: number;
  createdAt: string;
  paidAt?: string;
  stripeSessionId?: string;
};

type PackRow = {
  id: string;
  pack_type: PackType;
  sticker_ids: string[];
  status: PackStatus;
  price_cents: number;
  created_at: string;
  paid_at: string | null;
  stripe_session_id: string | null;
};

function fromRow(row: PackRow): PackRecord {
  return {
    id: row.id,
    packType: row.pack_type,
    stickerIds: row.sticker_ids,
    status: row.status,
    priceCents: row.price_cents,
    createdAt: row.created_at,
    paidAt: row.paid_at ?? undefined,
    stripeSessionId: row.stripe_session_id ?? undefined,
  };
}

function toRow(record: PackRecord): PackRow {
  return {
    id: record.id,
    pack_type: record.packType,
    sticker_ids: record.stickerIds,
    status: record.status,
    price_cents: record.priceCents,
    created_at: record.createdAt,
    paid_at: record.paidAt ?? null,
    stripe_session_id: record.stripeSessionId ?? null,
  };
}

export async function savePack(record: PackRecord) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("packs").upsert(toRow(record));

  if (error) {
    throw new Error(`Falha ao salvar pack: ${error.message}`);
  }
}

export async function getPack(id: string): Promise<PackRecord | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("packs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return fromRow(data as PackRow);
}

export async function createPack(packType: PackType, stickerIds: string[]) {
  const config = PACKS[packType];

  if (stickerIds.length !== config.count) {
    throw new Error(`O ${config.title} precisa de ${config.count} figurinha(s).`);
  }

  for (const stickerId of stickerIds) {
    const sticker = await getSticker(stickerId);

    if (!sticker) {
      throw new Error("Uma das figurinhas não foi encontrada.");
    }
  }

  const record: PackRecord = {
    id: crypto.randomUUID(),
    packType,
    stickerIds,
    status: "generated",
    priceCents: config.priceCents,
    createdAt: new Date().toISOString(),
  };

  await savePack(record);
  return record;
}

export async function getPackStickers(pack: PackRecord) {
  const stickers = await Promise.all(pack.stickerIds.map((id) => getSticker(id)));
  return stickers.filter(Boolean) as StickerRecord[];
}

export async function markPackPaid(id: string, stripeSessionId?: string) {
  const record = await getPack(id);

  if (!record) {
    return null;
  }

  const updated: PackRecord = {
    ...record,
    status: "paid",
    paidAt: record.paidAt ?? new Date().toISOString(),
    stripeSessionId: stripeSessionId ?? record.stripeSessionId,
  };

  await savePack(updated);

  await Promise.all(
    updated.stickerIds.map((stickerId) => markStickerPaid(stickerId, stripeSessionId)),
  );

  return updated;
}
