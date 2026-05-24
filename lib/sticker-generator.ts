import sharp from "sharp";
import { formatHeight, toCardName, toTeamName } from "@/lib/format";
import { tryGenerateAiSticker } from "@/lib/openai-sticker";
import { renderText } from "@/lib/sticker-font";
import { downloadStickerImage, uploadStickerImage } from "@/lib/sticker-store";

export type GenerateStickerInput = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  team: string;
  photoBuffer: Buffer;
};

const WIDTH = 800;
const HEIGHT = 1120;

function fitFontSize(text: string, max = 76, min = 44) {
  if (text.length <= 12) {
    return max;
  }

  return Math.max(min, max - (text.length - 12) * 3);
}

function brazilFlagSvg(size = 132) {
  const cx = size / 2;
  const cy = size / 2;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${cx - 6}" fill="#009C3B" stroke="#fff" stroke-width="8"/>
      <path d="M${cx} 22 L${size - 20} ${cy} L${cx} ${size - 22} L20 ${cy} Z" fill="#FFDF00"/>
      <circle cx="${cx}" cy="${cy}" r="25" fill="#002776"/>
      <path d="M42 ${cy - 6} C56 ${cy - 1}, 75 ${cy + 1}, 90 ${cy + 10}" stroke="#fff" stroke-width="4" fill="none"/>
      <circle cx="56" cy="55" r="2" fill="#fff"/>
      <circle cx="70" cy="68" r="2" fill="#fff"/>
      <circle cx="78" cy="57" r="1.8" fill="#fff"/>
    </svg>
  `;
}

function baseSvg(input: GenerateStickerInput) {
  const cardName = toCardName(input.firstName, input.lastName);
  const team = toTeamName(input.team);
  const stats = `${input.birthDate} | ${formatHeight(input.heightCm)} | ${input.weightKg} kg`;
  const fontSize = fitFontSize(cardName);

  const decorative2 = renderText("2", -28, 438, {
    size: 440,
    fill: "#005F00",
    opacity: 0.82,
  });
  const decorative6 = renderText("6", 272, 808, {
    size: 520,
    fill: "#005F00",
    opacity: 0.82,
  });
  const fifa26 = renderText("26", 644, 140, {
    size: 98,
    fill: "#fff",
  });
  const fifaLabel = renderText("FIFA", 687, 256, {
    size: 32,
    fill: "#fff",
  });
  const braLabel = renderText("BRA", 706, 854, {
    size: 104,
    fill: "#fff",
    stroke: "#00A8C0",
    strokeWidth: 8,
    rotate: { angle: 90, cx: 706, cy: 854 },
  });
  const nameLabel = renderText(cardName, 354, 908, {
    size: fontSize,
    fill: "#fff",
    textAnchor: "middle",
  });
  const statsLabel = renderText(stats, 354, 958, {
    size: 38,
    fill: "#fff",
    textAnchor: "middle",
  });
  const teamLabel = renderText(team, 322, 1042, {
    size: 36,
    fill: "#fff",
    textAnchor: "middle",
  });
  const paniniLabel = renderText("PANINI", 678, 1041, {
    size: 35,
    fill: "#C71717",
    textAnchor: "middle",
  });

  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="footer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#00384F"/>
          <stop offset="1" stop-color="#002050"/>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#002776" flood-opacity="0.28"/>
        </filter>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="#00C4C8"/>
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="#fff" opacity="0.05"/>

      ${decorative2}
      ${decorative6}
      <rect x="356" y="338" width="172" height="172" rx="6" fill="#FFDF00" opacity="0.96"/>

      ${fifa26}
      <path d="M699 83 C723 83 737 103 731 129 C727 148 717 159 708 166 L708 198 L724 226 L674 226 L690 198 L690 166 C680 159 671 146 667 129 C661 103 675 83 699 83Z" fill="#fff"/>
      ${fifaLabel}

      <g transform="translate(602 642)">
        ${brazilFlagSvg(138)}
      </g>
      ${braLabel}

      <rect x="54" y="146" width="560" height="696" rx="58" fill="#0b8c4d" opacity="0.22" filter="url(#softShadow)"/>

      <rect x="42" y="840" width="624" height="128" rx="58" fill="url(#footer)"/>
      ${nameLabel}
      ${statsLabel}

      <rect x="48" y="994" width="548" height="72" rx="25" fill="#002050" opacity="0.88"/>
      ${teamLabel}

      <rect x="594" y="1000" width="166" height="58" rx="6" fill="#FFDF00" stroke="#C71717" stroke-width="5"/>
      ${paniniLabel}
    </svg>
  `;
}

function watermarkSvg() {
  const lines = Array.from({ length: 9 }, (_, index) => {
    const y = 96 + index * 120;
    return renderText(
      "MINHA FIGURINHA 2026 • MINHA FIGURINHA 2026 • MINHA FIGURINHA 2026",
      -90,
      y,
      {
        size: 64,
        fill: "#fff",
        stroke: "#002776",
        strokeWidth: 3,
        opacity: 0.55,
      },
    );
  }).join("");

  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-28 ${WIDTH / 2} ${HEIGHT / 2})">
        ${lines}
      </g>
    </svg>
  `;
}

async function preparePhoto(photoBuffer: Buffer) {
  const cropped = await sharp(photoBuffer)
    .rotate()
    .resize(520, 650, {
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .png()
    .toBuffer();

  const mask = Buffer.from(`
    <svg width="520" height="650" viewBox="0 0 520 650" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="520" height="650" rx="58" fill="#fff"/>
    </svg>
  `);

  return sharp(cropped)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

export async function generateSticker(input: GenerateStickerInput) {
  const photo = await preparePhoto(input.photoBuffer);
  const aiClean = await tryGenerateAiSticker(input);

  const clean =
    aiClean ??
    (await sharp(Buffer.from(baseSvg(input)))
      .composite([{ input: photo, left: 74, top: 168 }])
      .png()
      .toBuffer());

  const preview = await sharp(clean)
    .composite([{ input: Buffer.from(watermarkSvg()), left: 0, top: 0 }])
    .png()
    .toBuffer();

  await Promise.all([
    uploadStickerImage(input.id, "clean", clean),
    uploadStickerImage(input.id, "preview", preview),
  ]);
}

export async function readStickerImage(id: string, variant: "clean" | "preview") {
  return downloadStickerImage(id, variant);
}
