import { NextResponse } from "next/server";
import { readStickerImage } from "@/lib/sticker-generator";
import { getSticker } from "@/lib/sticker-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  const url = new URL(request.url);
  const variant = url.searchParams.get("variant") === "clean" ? "clean" : "preview";
  const shouldDownload = url.searchParams.get("download") === "1";
  const sticker = await getSticker(params.id);

  if (!sticker) {
    return NextResponse.json({ error: "Figurinha não encontrada." }, { status: 404 });
  }

  if (variant === "clean" && sticker.status !== "paid") {
    return NextResponse.json(
      { error: "Pagamento ainda não confirmado." },
      { status: 403 },
    );
  }

  try {
    const image = await readStickerImage(params.id, variant);
    const headers = new Headers({
      "Content-Type": "image/png",
      "Cache-Control": "private, max-age=60",
    });

    if (shouldDownload) {
      headers.set(
        "Content-Disposition",
        `attachment; filename="camisa-10-${params.id}.png"`,
      );
    }

    return new NextResponse(image, { headers });
  } catch {
    return NextResponse.json(
      { error: "Imagem indisponível." },
      { status: 404 },
    );
  }
}
