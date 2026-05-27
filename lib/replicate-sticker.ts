import Replicate from "replicate";
import sharp from "sharp";
import { formatHeight, toCardName, toTeamName } from "@/lib/format";

type AiStickerInput = {
  firstName: string;
  lastName: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  team: string;
  photoBuffer: Buffer;
};

// Per-model input parameter shapes
type ModelParams = {
  imageKey: string;
  aspectRatioKey?: string;
  aspectRatioValue?: string;
  extra?: Record<string, unknown>;
};

function modelParams(model: string): ModelParams {
  if (model.startsWith("google/nano-banana")) {
    // Google Imagen-based model: uses "image", "aspect_ratio" "3:4" (portrait)
    // "multi-image fusion" and "character consistency" features
    return {
      imageKey: "image",
      aspectRatioKey: "aspect_ratio",
      aspectRatioValue: "3:4",
      extra: {
        output_format: "png",
        safety_filter_level: "block_few",
        person_generation: "allow_adult",
      },
    };
  }

  if (model.startsWith("black-forest-labs/flux-kontext")) {
    return {
      imageKey: "input_image",
      aspectRatioKey: "aspect_ratio",
      aspectRatioValue: "2:3",
      extra: {
        output_format: "png",
        safety_tolerance: 2,
        prompt_upsampling: false,
      },
    };
  }

  // Generic fallback
  return {
    imageKey: "image",
    aspectRatioKey: "aspect_ratio",
    aspectRatioValue: "2:3",
    extra: { output_format: "png" },
  };
}

async function prepareImage(buffer: Buffer): Promise<string> {
  const processed = await sharp(buffer)
    .rotate()
    .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();
  return `data:image/png;base64,${processed.toString("base64")}`;
}

function buildPrompt(input: AiStickerInput): string {
  const name = toCardName(input.firstName, input.lastName);
  const stats = `${input.birthDate} | ${formatHeight(input.heightCm)} | ${input.weightKg} kg`;
  const team = toTeamName(input.team);

  return `Transform the person in this portrait photo into a Panini FIFA World Cup 2026 collector sticker card.

FACE PRESERVATION — ABSOLUTE PRIORITY:
Reproduce the person's exact face from the input photo. Every feature must be preserved precisely: facial structure, skin tone, eye color and shape, nose shape, lips, beard/stubble or clean shave, hair color, hair texture, hair style, earrings or other visible accessories, birthmarks or scars. Do NOT change, soften, or replace any facial feature. The face in the output must be immediately recognizable as the same person.

CARD LAYOUT (copy exactly):
- Solid bright cyan background (#00C4C8) filling the entire card, 2:3 portrait
- The person stands DIRECTLY on the cyan background — NO photo frame, NO rounded rectangle, NO inset box around the person
- Large decorative "2" in muted dark teal behind the subject at top-left
- Large decorative "6" in muted dark teal behind the subject at bottom-right
- Small yellow square accent in centre-left of card, partially hidden behind person
- Top-right corner: FIFA World Cup 2026 trophy icon (white silhouette) with "26" above and "FIFA" below, inside a semi-transparent panel
- Right side (middle): circular Brazil flag badge (green/yellow/blue) with "BRA" in large bold white letters rotated 90° vertically
- Person wears the official yellow Brazil national team #10 jersey (CBF badge on chest, Nike logo, green collar and trim)
- Bottom section: ONE single large dark-teal rounded rectangle spanning nearly full card width, containing ALL text:
  - Line 1: "${name}" — bold uppercase white, large font
  - Line 2: "${stats}" — regular white, medium font
  - Line 3: "${team}" — semibold white, medium font
- Bottom-right: "PANINI" text in bold red serif font inside a yellow rectangle with red border

STRICT RULES:
- The face MUST match the input photo — this is non-negotiable
- NO photo frame or rounded rectangle inset around the subject
- NO jersey other than the yellow Brazil #10 kit
- ALL text strings must appear exactly as specified above, sharp and readable
- NO extra decorations beyond what is described

OUTPUT: photorealistic, high-resolution, sharp crisp text, consistent lighting, professional quality.`.trim();
}

function extractUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && typeof output[0] === "string") return output[0] as string;
  if (output && typeof (output as { url?: () => string }).url === "function") {
    return (output as { url: () => string }).url();
  }
  return null;
}

export async function tryGenerateReplicateSticker(input: AiStickerInput): Promise<Buffer | null> {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.info("[replicate-sticker] REPLICATE_API_TOKEN ausente; pulando.");
    return null;
  }

  if (process.env.REPLICATE_IMAGE_ENABLED !== "true") {
    console.info("[replicate-sticker] REPLICATE_IMAGE_ENABLED != 'true'; pulando.");
    return null;
  }

  const model =
    (process.env.REPLICATE_MODEL as `${string}/${string}` | undefined) ??
    "google/nano-banana-2";

  const startedAt = Date.now();

  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const inputImage = await prepareImage(input.photoBuffer);
    const params = modelParams(model);

    console.info(`[replicate-sticker] chamando ${model}`);

    const replicateInput: Record<string, unknown> = {
      prompt: buildPrompt(input),
      [params.imageKey]: inputImage,
      ...(params.aspectRatioKey ? { [params.aspectRatioKey]: params.aspectRatioValue } : {}),
      ...params.extra,
    };

    const output = await replicate.run(model, { input: replicateInput });
    const elapsed = Date.now() - startedAt;

    const imageUrl = extractUrl(output);
    if (!imageUrl) {
      console.warn(`[replicate-sticker] resposta sem URL após ${elapsed}ms; usando fallback.`);
      return null;
    }

    console.info(`[replicate-sticker] OK em ${elapsed}ms — baixando imagem`);

    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.warn(`[replicate-sticker] falha ao baixar imagem: ${res.status}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    return sharp(Buffer.from(arrayBuffer))
      .resize(800, 1120, {
        fit: "contain",
        background: { r: 0, g: 196, b: 200, alpha: 1 },
      })
      .png()
      .toBuffer();
  } catch (error) {
    const elapsed = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[replicate-sticker] falha (${elapsed}ms, modelo ${model}): ${message}`);
    return null;
  }
}
