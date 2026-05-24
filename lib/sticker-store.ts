import {
  STICKER_BUCKET,
  getSupabaseClient,
  stickerStoragePath,
} from "@/lib/supabase";

export type StickerStatus = "generated" | "paid";

export type StickerRecord = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  team: string;
  status: StickerStatus;
  createdAt: string;
  paidAt?: string;
  stripeSessionId?: string;
};

type StickerRow = {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
  team: string;
  status: StickerStatus;
  created_at: string;
  paid_at: string | null;
  stripe_session_id: string | null;
};

function fromRow(row: StickerRow): StickerRecord {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    birthDate: row.birth_date,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    team: row.team,
    status: row.status,
    createdAt: row.created_at,
    paidAt: row.paid_at ?? undefined,
    stripeSessionId: row.stripe_session_id ?? undefined,
  };
}

function toRow(record: StickerRecord): StickerRow {
  return {
    id: record.id,
    first_name: record.firstName,
    last_name: record.lastName,
    birth_date: record.birthDate,
    height_cm: record.heightCm,
    weight_kg: record.weightKg,
    team: record.team,
    status: record.status,
    created_at: record.createdAt,
    paid_at: record.paidAt ?? null,
    stripe_session_id: record.stripeSessionId ?? null,
  };
}

export async function saveSticker(record: StickerRecord) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("stickers").upsert(toRow(record));

  if (error) {
    throw new Error(`Falha ao salvar figurinha: ${error.message}`);
  }
}

export async function getSticker(id: string): Promise<StickerRecord | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("stickers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return fromRow(data as StickerRow);
}

export async function markStickerPaid(id: string, stripeSessionId?: string) {
  const existing = await getSticker(id);

  if (!existing) {
    return null;
  }

  const updated: StickerRecord = {
    ...existing,
    status: "paid",
    paidAt: existing.paidAt ?? new Date().toISOString(),
    stripeSessionId: stripeSessionId ?? existing.stripeSessionId,
  };

  await saveSticker(updated);
  return updated;
}

export async function uploadStickerImage(
  id: string,
  variant: "clean" | "preview",
  data: Buffer | Uint8Array,
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage
    .from(STICKER_BUCKET)
    .upload(stickerStoragePath(id, variant), data, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    throw new Error(`Falha ao subir imagem (${variant}): ${error.message}`);
  }
}

export async function downloadStickerImage(
  id: string,
  variant: "clean" | "preview",
): Promise<Buffer> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(STICKER_BUCKET)
    .download(stickerStoragePath(id, variant));

  if (error || !data) {
    throw new Error(`Imagem ${variant} indisponível para ${id}.`);
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
