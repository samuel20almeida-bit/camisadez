import { NextResponse } from "next/server";
import { generateSticker } from "@/lib/sticker-generator";
import { saveSticker, type StickerRecord } from "@/lib/sticker-store";
import { isValidBirthDate, normalizeName } from "@/lib/format";

const MAX_NAME_LENGTH = 40;
const MAX_TEAM_LENGTH = 40;
const HEIGHT_RANGE = { min: 50, max: 230 };
const WEIGHT_RANGE = { min: 10, max: 250 };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// gpt-image-2 com referências pode levar até ~2,5 min; deixamos buffer para Supabase.
export const maxDuration = 180;

const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
]);
const ACCEPTED_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? normalizeName(value) : "";
}

function intValue(formData: FormData, key: string) {
  const raw = formValue(formData, key);
  return /^\d+$/.test(raw) ? Number.parseInt(raw, 10) : Number.NaN;
}

function isAcceptedUpload(photo: File) {
  const type = photo.type.toLowerCase();

  return (
    ACCEPTED_TYPES.has(type) ||
    ((type === "" || type === "application/octet-stream") &&
      ACCEPTED_EXTENSIONS.test(photo.name))
  );
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
    const heightCm = intValue(formData, "heightCm");
    const weightKg = intValue(formData, "weightKg");
    const team = formValue(formData, "team");
    const photo = formData.get("photo");

    if (!firstName || !lastName || !birthDate || !team) {
      return NextResponse.json(
        { error: "Preencha todos os dados do craque." },
        { status: 400 },
      );
    }

    if (
      firstName.length > MAX_NAME_LENGTH ||
      lastName.length > MAX_NAME_LENGTH ||
      team.length > MAX_TEAM_LENGTH
    ) {
      return NextResponse.json(
        { error: "Nome, sobrenome ou time muito longos." },
        { status: 400 },
      );
    }

    if (!isValidBirthDate(birthDate)) {
      return NextResponse.json(
        { error: "Data de nascimento inválida. Use o formato DD-MM-AAAA." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(heightCm) ||
      heightCm < HEIGHT_RANGE.min ||
      heightCm > HEIGHT_RANGE.max
    ) {
      return NextResponse.json(
        {
          error: `Altura deve ser um número inteiro entre ${HEIGHT_RANGE.min} e ${HEIGHT_RANGE.max} cm (use o valor em centímetros, ex: 175).`,
        },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(weightKg) ||
      weightKg < WEIGHT_RANGE.min ||
      weightKg > WEIGHT_RANGE.max
    ) {
      return NextResponse.json(
        {
          error: `Peso deve ser um número inteiro entre ${WEIGHT_RANGE.min} e ${WEIGHT_RANGE.max} kg.`,
        },
        { status: 400 },
      );
    }

    if (!(photo instanceof File)) {
      return NextResponse.json(
        { error: "Envie uma foto em JPG, PNG ou WEBP." },
        { status: 400 },
      );
    }

    if (!isAcceptedUpload(photo)) {
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
    await generateSticker({
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
