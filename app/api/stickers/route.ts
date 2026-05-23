import { NextResponse } from "next/server";
import { generateSticker } from "@/lib/sticker-generator";
import { saveSticker, type StickerRecord } from "@/lib/sticker-store";
import { normalizeName } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? normalizeName(value) : "";
}

function numberValue(formData: FormData, key: string) {
  const value = Number(formValue(formData, key));
  return Number.isFinite(value) ? value : 0;
}

function generationErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("unsupported image format") ||
    normalized.includes("input buffer contains unsupported") ||
    normalized.includes("heif") ||
    normalized.includes("heic")
  ) {
    return "Não conseguimos processar essa foto. Tente exportar como JPG, PNG ou WEBP e enviar novamente.";
  }

  if (normalized.includes("input file is missing") || normalized.includes("empty input")) {
    return "A foto enviada parece estar vazia ou corrompida. Escolha outro arquivo.";
  }

  return "Não foi possível gerar a figurinha agora. Tente outra foto ou recarregue a página.";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formValue(formData, "firstName");
    const lastName = formValue(formData, "lastName");
    const birthDate = formValue(formData, "birthDate");
    const heightCm = numberValue(formData, "heightCm");
    const weightKg = numberValue(formData, "weightKg");
    const team = formValue(formData, "team");
    const photo = formData.get("photo");

    if (!firstName || !lastName || !birthDate || !heightCm || !weightKg || !team) {
      return NextResponse.json(
        { error: "Preencha todos os dados do craque." },
        { status: 400 },
      );
    }

    if (!(photo instanceof File)) {
      return NextResponse.json(
        { error: "Envie uma foto em JPG, PNG ou WEBP." },
        { status: 400 },
      );
    }

    if (!ACCEPTED_TYPES.has(photo.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use JPG, PNG ou WEBP." },
        { status: 400 },
      );
    }

    if (photo.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "A foto deve ter no máximo 10MB." },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const paths = await generateSticker({
      id,
      firstName,
      lastName,
      birthDate,
      heightCm,
      weightKg,
      team,
      photoBuffer,
    });

    const record: StickerRecord = {
      id,
      firstName,
      lastName,
      birthDate,
      heightCm,
      weightKg,
      team,
      status: "generated",
      createdAt: new Date().toISOString(),
      ...paths,
    };

    await saveSticker(record);

    return NextResponse.json({
      id,
      previewUrl: `/api/stickers/${id}/image?variant=preview`,
    });
  } catch (error) {
    console.error("[api/stickers] Falha ao gerar figurinha", error);

    return NextResponse.json(
      { error: generationErrorMessage(error) },
      { status: 500 },
    );
  }
}
