import { NextResponse } from "next/server";
import { formatHeight, toCardName, toTeamName } from "@/lib/format";
import { getSticker } from "@/lib/sticker-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const sticker = await getSticker(params.id);

  if (!sticker) {
    return NextResponse.json({ error: "Figurinha não encontrada." }, { status: 404 });
  }

  return NextResponse.json({
    id: sticker.id,
    name: toCardName(sticker.firstName, sticker.lastName),
    birthDate: sticker.birthDate,
    stats: `${sticker.birthDate} | ${formatHeight(sticker.heightCm)} | ${sticker.weightKg} kg`,
    team: toTeamName(sticker.team),
    status: sticker.status,
    createdAt: sticker.createdAt,
  });
}
