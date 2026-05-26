import OpenAI, { toFile } from "openai";
import sharp from "sharp";
import { formatHeight, toCardName, toTeamName } from "@/lib/format";
import { readReferenceStickerBuffers } from "@/lib/reference-server";

type AiStickerInput = {
  firstName: string;
  lastName: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  team: string;
  photoBuffer: Buffer;
};

function aiTimeoutMs() {
  const value = Number(process.env.OPENAI_IMAGE_TIMEOUT_MS ?? 150000);
  return Number.isFinite(value) && value > 0 ? value : 150000;
}

const MAX_REFERENCE_IMAGES = Number(process.env.OPENAI_REFERENCE_LIMIT ?? 1);

async function prepareImageForOpenAi(buffer: Buffer) {
  return sharp(buffer)
    .rotate()
    .resize(1024, 1024, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
}

function referenceSvg(input: AiStickerInput) {
  const name = toCardName(input.firstName, input.lastName);
  const stats = `${input.birthDate} | ${formatHeight(input.heightCm)} | ${input.weightKg} kg`;
  const team = toTeamName(input.team);

  // Layout mirrors the real Panini Copa 2026 sticker:
  // - Photo fills the card background (NO inner photo box)
  // - "2" and "6" as large decorative background numbers
  // - FIFA trophy icon top-right
  // - Brazil flag + vertical "BRA" on right side
  // - Single rounded dark-teal bar at bottom with name / stats / team
  // - PANINI seal bottom-right
  return `
    <svg width="800" height="1120" viewBox="0 0 800 1120" xmlns="http://www.w3.org/2000/svg">
      <!-- Cyan background -->
      <rect width="800" height="1120" fill="#00C4C8"/>

      <!-- Large decorative "2" — top-left background -->
      <text x="-55" y="640" font-family="Arial Black, Impact, sans-serif" font-size="700" font-weight="900" fill="#00A0A8" opacity="0.60">2</text>
      <!-- Large decorative "6" — bottom-right background -->
      <text x="190" y="1060" font-family="Arial Black, Impact, sans-serif" font-size="700" font-weight="900" fill="#00A0A8" opacity="0.60">6</text>

      <!-- Yellow square accent (Panini Copa 2026 detail, centre of card) -->
      <rect x="330" y="295" width="148" height="148" fill="#FFDF00"/>

      <!-- ═══ PHOTO AREA (full-bleed, no box) ═══
           The person's photo fills this entire region — no inner frame.
           Place the subject centred from roughly y=0 to y=870, waist-up. -->
      <rect x="0" y="0" width="800" height="870" fill="none"/>

      <!-- FIFA World Cup 2026 icon — top right -->
      <g transform="translate(604 26)">
        <rect width="180" height="230" rx="18" fill="rgba(255,255,255,0.10)"/>
        <!-- Trophy silhouette -->
        <path d="M90 28 C118 28 136 52 128 82 C123 104 111 116 100 124 L100 158 L118 188 L62 188 L80 158 L80 124 C69 116 57 102 52 82 C44 52 62 28 90 28Z" fill="white"/>
        <text x="90" y="218" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="34" font-weight="900" fill="white">FIFA</text>
        <text x="22" y="106" font-family="Arial Black, sans-serif" font-size="90" font-weight="900" fill="white">26</text>
      </g>

      <!-- Brazil flag circle — right middle -->
      <g transform="translate(634 588)">
        <circle cx="68" cy="68" r="68" fill="#009C3B" stroke="white" stroke-width="7"/>
        <polygon points="68,8 122,68 68,128 14,68" fill="#FFDF00"/>
        <circle cx="68" cy="68" r="27" fill="#002776"/>
        <!-- Wavy line on globe (simplified) -->
        <path d="M42 68 Q68 58 94 68" fill="none" stroke="white" stroke-width="3"/>
      </g>

      <!-- "BRA" — vertical text, right side -->
      <text x="755" y="870" text-anchor="middle"
            font-family="Arial Black, Impact, sans-serif" font-size="90" font-weight="900"
            fill="white" transform="rotate(90 755 800)">BRA</text>

      <!-- ═══ BOTTOM INFO BAR (single rounded pill, dark teal) ═══ -->
      <rect x="18" y="862" width="762" height="234" rx="46" fill="#006070" opacity="0.96"/>

      <!-- Player name — bold, uppercase, large -->
      <text x="395" y="948" text-anchor="middle"
            font-family="Arial Black, Impact, sans-serif" font-size="72" font-weight="900"
            fill="white">${name}</text>

      <!-- Stats line (DOB | height | weight) -->
      <text x="395" y="998" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="37" fill="rgba(255,255,255,0.92)">${stats}</text>

      <!-- Team / club -->
      <text x="310" y="1056" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="40" font-weight="700"
            fill="white">${team}</text>

      <!-- PANINI seal — bottom right -->
      <rect x="572" y="1022" width="186" height="62" rx="8" fill="#FFDF00" stroke="#C71717" stroke-width="5"/>
      <text x="665" y="1064" text-anchor="middle"
            font-family="Georgia, serif" font-size="36" font-weight="900"
            fill="#C71717">PANINI</text>
    </svg>
  `;
}

function buildPrompt(input: AiStickerInput) {
  const name = toCardName(input.firstName, input.lastName);
  const stats = `${input.birthDate} | ${formatHeight(input.heightCm)} | ${input.weightKg} kg`;
  const team = toTeamName(input.team);

  return `
Create a Panini FIFA World Cup 2026 collector sticker card. You are given reference sticker images and a portrait photo of a specific person. Your task is to composite them into a finished sticker.

FACE — ABSOLUTE PRIORITY:
The face in the output MUST be an exact photorealistic likeness of the person in the last image (the portrait photo). Every feature must match precisely: facial structure, skin tone, eye color and shape, nose, lips, beard/stubble (if present), hair color, hair texture and style, earrings, birthmarks. Do NOT average, soften, or alter these features. Do NOT substitute a generic or different face.

SUBJECT POSE AND CLOTHING:
- Show the person from the waist up, facing slightly toward the viewer, confident athletic pose.
- They must wear the official Brazil national team yellow jersey (number 10, green collar and trim, CBF shield on chest, Nike logo).
- Composite the subject cleanly against the card background — no halo, no floating edges, natural lighting consistent with the card's bright cyan backdrop.

CARD LAYOUT — copy exactly from the reference sticker images:
1. Background: solid bright cyan (#00C4C8) filling the entire card.
2. Large decorative "2" (top-left area) and "6" (bottom-right area) in muted teal — these sit BEHIND the subject.
3. Small yellow square accent in the centre-left area of the card, partially hidden behind the subject.
4. Top-right corner: FIFA World Cup 2026 trophy icon (white silhouette) with "26" above and "FIFA" below, inside a semi-transparent rounded panel.
5. Right side (middle): circular Brazilian flag badge (green circle, yellow diamond, blue globe with white stripe) with "BRA" in large white bold letters rotated 90° vertically alongside it.
6. CRITICAL — NO inner photo box or rounded rectangle frame around the subject. The subject stands directly on the cyan background; there is NO separate photo frame inset within the card.
7. Bottom section: ONE single large rounded-corner dark-teal rectangle (spanning nearly full card width) containing ALL text:
   - Line 1 (largest, bold white caps): "${name}"
   - Line 2 (medium, white): "${stats}"
   - Line 3 (medium, white): "${team}"
8. Bottom-right corner: "PANINI" text in bold red serif font inside a yellow rectangle with red border.

TEXT — render crisply, no blur, no distortion:
- "${name}" — bold uppercase, ~72px
- "${stats}" — regular, ~37px
- "${team}" — semibold, ~40px
- Keep "26", "FIFA", "BRA", "PANINI" exactly as in the reference images.

STRICT PROHIBITIONS:
- Do NOT add a rounded-rectangle photo frame/inset inside the card (this is the most common error to avoid).
- Do NOT invent or replace the face — use only the provided portrait photo.
- Do NOT put the person in any jersey other than the yellow Brazil #10 kit.
- Do NOT omit, distort, or hallucinate any of the text strings above.
- Do NOT add any extra decorations not present in the reference images.

OUTPUT: photorealistic, high-resolution, sharp text, consistent lighting.
`.trim();
}

export async function tryGenerateAiSticker(input: AiStickerInput) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[openai-sticker] OPENAI_API_KEY ausente; usando gerador local.");
    return null;
  }

  if (process.env.OPENAI_IMAGE_EDIT_ENABLED !== "true") {
    console.info("[openai-sticker] OPENAI_IMAGE_EDIT_ENABLED != 'true'; usando gerador local.");
    return null;
  }

  const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
  const startedAt = Date.now();

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const timeoutMs = aiTimeoutMs();
    const photoBuffer = await prepareImageForOpenAi(input.photoBuffer);
    const referenceAssets = (await readReferenceStickerBuffers()).slice(
      0,
      Math.max(1, MAX_REFERENCE_IMAGES),
    );
    const referenceBuffer = await sharp(Buffer.from(referenceSvg(input))).png().toBuffer();
    const referenceFiles =
      referenceAssets.length > 0
        ? await Promise.all(
            referenceAssets.map((asset) =>
              toFile(asset.buffer, asset.filename, { type: "image/png" }),
            ),
          )
        : [await toFile(referenceBuffer, "camisa-10-reference.png", { type: "image/png" })];

    console.info(
      `[openai-sticker] chamando ${model} (timeout ${timeoutMs}ms, ${referenceFiles.length + 1} imagens)`,
    );

    const supportsInputFidelity = /^gpt-image-1(\b|-)/.test(model);
    const editParams: Parameters<typeof client.images.edit>[0] = {
      model,
      image: [
        ...referenceFiles,
        await toFile(photoBuffer, "craque.png", { type: "image/png" }),
      ],
      prompt: buildPrompt(input),
      size: "1024x1536",
      quality: "high",
      output_format: "png",
    };

    if (supportsInputFidelity) {
      editParams.input_fidelity = "high";
    }

    const response = (await client.images.edit(editParams, {
      maxRetries: 0,
      timeout: timeoutMs,
    })) as { data?: Array<{ b64_json?: string }> };
    const b64 = response.data?.[0]?.b64_json;
    const elapsed = Date.now() - startedAt;

    if (!b64) {
      console.warn(`[openai-sticker] resposta sem b64_json após ${elapsed}ms; usando gerador local.`);
      return null;
    }

    console.info(`[openai-sticker] OK em ${elapsed}ms`);

    return sharp(Buffer.from(b64, "base64"))
      .resize(800, 1120, {
        fit: "contain",
        background: { r: 0, g: 196, b: 200, alpha: 1 },
      })
      .png()
      .toBuffer();
  } catch (error) {
    const elapsed = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : String(error);
    const status = (error as { status?: number })?.status;

    console.warn(
      `[openai-sticker] falha (${elapsed}ms, status ${status ?? "?"}, modelo ${model}): ${message}`,
    );
    return null;
  }
}
