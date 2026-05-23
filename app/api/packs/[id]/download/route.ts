import { NextResponse } from "next/server";
import JSZip from "jszip";
import { readFile } from "fs/promises";
import { getPack, getPackStickers } from "@/lib/pack-store";
import { getStickerPaths } from "@/lib/sticker-store";
import { toCardName } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(_request: Request, { params }: Params) {
  const pack = await getPack(params.id);

  if (!pack) {
    return NextResponse.json({ error: "Pack não encontrado." }, { status: 404 });
  }

  if (pack.status !== "paid") {
    return NextResponse.json(
      { error: "Pagamento ainda não confirmado." },
      { status: 403 },
    );
  }

  const stickers = await getPackStickers(pack);
  const zip = new JSZip();

  for (const [index, sticker] of stickers.entries()) {
    const image = await readFile(getStickerPaths(sticker.id).clean);
    const name = slugify(toCardName(sticker.firstName, sticker.lastName)) || `figurinha-${index + 1}`;
    zip.file(`${String(index + 1).padStart(2, "0")}-${name}.png`, image);
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="camisa-10-pack-${pack.id}.zip"`,
      "Cache-Control": "private, max-age=60",
    },
  });
}
