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

function aiEditEnabled() {
  return (
    Boolean(process.env.OPENAI_API_KEY) &&
    process.env.OPENAI_IMAGE_EDIT_ENABLED === "true"
  );
}

function referenceSvg(input: AiStickerInput) {
  const name = toCardName(input.firstName, input.lastName);
  const stats = `${input.birthDate} | ${formatHeight(input.heightCm)} | ${input.weightKg} kg`;
  const team = toTeamName(input.team);

  return `
    <svg width="800" height="1120" viewBox="0 0 800 1120" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="1120" fill="#00C4C8"/>
      <text x="-28" y="438" font-family="Arial Black, Impact, sans-serif" font-size="440" font-weight="900" fill="#005F00" opacity="0.82">2</text>
      <text x="272" y="808" font-family="Arial Black, Impact, sans-serif" font-size="520" font-weight="900" fill="#005F00" opacity="0.82">6</text>
      <rect x="356" y="338" width="172" height="172" fill="#FFDF00"/>
      <g transform="translate(626 38)" fill="#fff">
        <text x="18" y="102" font-family="Arial Black, Impact, sans-serif" font-size="98" font-weight="900">26</text>
        <path d="M73 45 C97 45 111 65 105 91 C101 110 91 121 82 128 L82 160 L98 188 L48 188 L64 160 L64 128 C54 121 45 108 41 91 C35 65 49 45 73 45Z"/>
        <text x="61" y="218" font-family="Arial Black, Impact, sans-serif" font-size="32">FIFA</text>
      </g>
      <rect x="74" y="168" width="520" height="650" rx="58" fill="#E8F4FF"/>
      <circle cx="334" cy="356" r="86" fill="#8b5d42"/>
      <path d="M178 752 C210 570 458 570 490 752 Z" fill="#FFDF00"/>
      <path d="M255 628 L334 710 L413 628" fill="none" stroke="#009C3B" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="671" cy="708" r="62" fill="#009C3B" stroke="#fff" stroke-width="8"/>
      <path d="M671 674 L714 708 L671 742 L628 708 Z" fill="#FFDF00"/>
      <circle cx="671" cy="708" r="21" fill="#002776"/>
      <text x="706" y="854" font-family="Arial Black, Impact, sans-serif" font-size="104" fill="#fff" transform="rotate(90 706 854)">BRA</text>
      <rect x="42" y="840" width="624" height="128" rx="58" fill="#002050"/>
      <text x="354" y="908" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="64" font-weight="900" fill="#fff">${name}</text>
      <text x="354" y="958" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" fill="#fff">${stats}</text>
      <rect x="48" y="994" width="548" height="72" rx="25" fill="#002050"/>
      <text x="322" y="1042" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" fill="#fff">${team}</text>
      <rect x="594" y="1000" width="166" height="58" rx="6" fill="#FFDF00" stroke="#C71717" stroke-width="5"/>
      <text x="678" y="1039" text-anchor="middle" font-family="Georgia, serif" font-size="35" font-weight="900" fill="#C71717">PANINI</text>
    </svg>
  `;
}

function buildPrompt(input: AiStickerInput) {
  const name = toCardName(input.firstName, input.lastName);
  const stats = `${input.birthDate} | ${formatHeight(input.heightCm)} | ${input.weightKg} kg`;
  const team = toTeamName(input.team);

  return [
    "Use as imagens de referência fornecidas como base visual principal do layout da figurinha.",
    "Quero que você substitua a pessoa das referências pela pessoa enviada na foto do usuário, mantendo o estilo visual, composição, cores, recorte, fundo, número 26, FIFA 26, bandeira do Brasil, BRA vertical e rodapé das referências.",
    "Garanta que as informações da imagem mudem para os dados abaixo, como nome, sobrenome, peso, altura e time.",
    "É imprescindível que todos os textos estejam legíveis e que apenas a pessoa e os dados mudem; todo o restante deve permanecer no mesmo padrão das referências.",
    `Nome principal: ${name}.`,
    `Linha de stats: ${stats}.`,
    `Time/clube: ${team}.`,
    "Mantenha o estilo de figurinha Copa 2026, fundo ciano, número 26 verde, bandeira do Brasil, BRA vertical e rodapé escuro.",
  ].join(" ");
}

export async function tryGenerateAiSticker(input: AiStickerInput) {
  if (!aiEditEnabled()) {
    return null;
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const referenceAssets = await readReferenceStickerBuffers();
    const referenceBuffer = await sharp(Buffer.from(referenceSvg(input))).png().toBuffer();
    const referenceFiles =
      referenceAssets.length > 0
        ? await Promise.all(
            referenceAssets.map((asset) =>
              toFile(asset.buffer, asset.filename, { type: "image/png" }),
            ),
          )
        : [await toFile(referenceBuffer, "camisa-10-reference.png", { type: "image/png" })];
    const response = await client.images.edit({
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1.5",
      image: [
        ...referenceFiles,
        await toFile(input.photoBuffer, "craque.png", { type: "image/png" }),
      ],
      prompt: buildPrompt(input),
      size: "1024x1536",
      quality: "high",
      output_format: "png",
      input_fidelity: "high",
    });
    const b64 = response.data?.[0]?.b64_json;

    if (!b64) {
      return null;
    }

    return sharp(Buffer.from(b64, "base64"))
      .resize(800, 1120, { fit: "cover", position: "center" })
      .png()
      .toBuffer();
  } catch {
    return null;
  }
}
