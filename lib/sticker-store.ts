import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

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
  cleanPath: string;
  previewPath: string;
};

const DATA_DIR = path.join(process.cwd(), ".data", "stickers");

export function getStickerDir(id: string) {
  return path.join(DATA_DIR, id);
}

export function getStickerPaths(id: string) {
  const dir = getStickerDir(id);

  return {
    dir,
    metadata: path.join(dir, "metadata.json"),
    clean: path.join(dir, "clean.png"),
    preview: path.join(dir, "preview.png"),
  };
}

export async function ensureStickerDir(id: string) {
  await mkdir(getStickerDir(id), { recursive: true });
}

export async function saveSticker(record: StickerRecord) {
  await ensureStickerDir(record.id);
  const paths = getStickerPaths(record.id);
  await writeFile(paths.metadata, JSON.stringify(record, null, 2), "utf8");
}

export async function getSticker(id: string): Promise<StickerRecord | null> {
  try {
    const paths = getStickerPaths(id);
    const content = await readFile(paths.metadata, "utf8");
    return JSON.parse(content) as StickerRecord;
  } catch {
    return null;
  }
}

export async function markStickerPaid(id: string, stripeSessionId?: string) {
  const record = await getSticker(id);

  if (!record) {
    return null;
  }

  const updated: StickerRecord = {
    ...record,
    status: "paid",
    paidAt: record.paidAt ?? new Date().toISOString(),
    stripeSessionId: stripeSessionId ?? record.stripeSessionId,
  };

  await saveSticker(updated);
  return updated;
}
