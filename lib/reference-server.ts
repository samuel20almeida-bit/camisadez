import { readFile } from "fs/promises";
import path from "path";
import { REFERENCE_STICKERS, type ReferenceStickerAsset } from "@/lib/reference-assets";

export async function readReferenceStickerBuffers() {
  const publicDir = path.join(process.cwd(), "public", "social-proof");
  const buffers = await Promise.all(
    REFERENCE_STICKERS.map(async (asset) => {
      try {
        const buffer = await readFile(path.join(publicDir, asset.filename));
        return {
          ...asset,
          buffer,
        };
      } catch {
        return null;
      }
    }),
  );

  return buffers.filter(Boolean) as Array<ReferenceStickerAsset & { buffer: Buffer }>;
}
