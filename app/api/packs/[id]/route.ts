import { NextResponse } from "next/server";
import { getPack, getPackStickers } from "@/lib/pack-store";
import { PACKS } from "@/lib/packs";
import { formatHeight, toCardName, toTeamName } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const pack = await getPack(params.id);

  if (!pack) {
    return NextResponse.json({ error: "Pack não encontrado." }, { status: 404 });
  }

  const stickers = await getPackStickers(pack);
  const config = PACKS[pack.packType];

  return NextResponse.json({
    id: pack.id,
    packType: pack.packType,
    title: config.title,
    count: config.count,
    priceLabel: config.priceLabel,
    status: pack.status,
    stickers: stickers.map((sticker) => ({
      id: sticker.id,
      name: toCardName(sticker.firstName, sticker.lastName),
      stats: `${sticker.birthDate} | ${formatHeight(sticker.heightCm)} | ${sticker.weightKg} kg`,
      team: toTeamName(sticker.team),
      imageUrl: `/api/stickers/${sticker.id}/image?variant=${
        pack.status === "paid" ? "clean" : "preview"
      }`,
    })),
  });
}
