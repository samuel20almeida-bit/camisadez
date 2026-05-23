import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getSticker, markStickerPaid, type StickerRecord } from "@/lib/sticker-store";
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

const PACKS_DIR = path.join(process.cwd(), ".data", "packs");

export function getPackDir(id: string) {
  return path.join(PACKS_DIR, id);
}

export function getPackPaths(id: string) {
  const dir = getPackDir(id);

  return {
    dir,
    metadata: path.join(dir, "metadata.json"),
  };
}

export async function ensurePackDir(id: string) {
  await mkdir(getPackDir(id), { recursive: true });
}

export async function savePack(record: PackRecord) {
  await ensurePackDir(record.id);
  const paths = getPackPaths(record.id);
  await writeFile(paths.metadata, JSON.stringify(record, null, 2), "utf8");
}

export async function getPack(id: string): Promise<PackRecord | null> {
  try {
    const paths = getPackPaths(id);
    const content = await readFile(paths.metadata, "utf8");
    return JSON.parse(content) as PackRecord;
  } catch {
    return null;
  }
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
