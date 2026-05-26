// Script para gerar cartão de teste sem OpenAI
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

function formatHeight(cm: number) { return `${(cm / 100).toFixed(2).replace(".", ",")}m`; }
function toCardName(f: string, l: string) { return `${f} ${l}`.trim().toUpperCase(); }
function toTeamName(t: string) { return t.trim().toUpperCase(); }

// Substituto simples do renderText — usa <text> SVG nativo
function renderText(text: string, x: number, y: number, opts: { size: number; fill?: string; opacity?: number; textAnchor?: string; rotate?: { angle: number; cx: number; cy: number } }) {
  const anchor = opts.textAnchor ?? "start";
  const opacity = opts.opacity !== undefined ? ` opacity="${opts.opacity}"` : "";
  const rotate = opts.rotate ? ` transform="rotate(${opts.rotate.angle} ${opts.rotate.cx} ${opts.rotate.cy})"` : "";
  return `<text x="${x}" y="${y}" font-family="Arial Black, Impact, sans-serif" font-size="${opts.size}" font-weight="900" fill="${opts.fill ?? "#000"}" text-anchor="${anchor}"${opacity}${rotate}>${text}</text>`;
}

const WIDTH = 800;
const HEIGHT = 1120;

function fitFontSize(text: string, max = 76, min = 44) {
  if (text.length <= 12) return max;
  return Math.max(min, max - (text.length - 12) * 3);
}

function brazilFlagSvg(size = 132) {
  const cx = size / 2, cy = size / 2;
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

const input = {
  firstName: "Samuel",
  lastName: "Almeida",
  birthDate: "15-03-1995",
  heightCm: 178,
  weightKg: 75,
  team: "Flamengo",
};

const cardName = toCardName(input.firstName, input.lastName);
const team = toTeamName(input.team);
const stats = `${input.birthDate} | ${formatHeight(input.heightCm)} | ${input.weightKg} kg`;
const fontSize = fitFontSize(cardName);

const decorative2 = renderText("2", -28, 438, { size: 440, fill: "#005F00", opacity: 0.82 });
const decorative6 = renderText("6", 272, 808, { size: 520, fill: "#005F00", opacity: 0.82 });
const fifa26 = renderText("26", 644, 140, { size: 98, fill: "#fff" });
const fifaLabel = renderText("FIFA", 687, 256, { size: 32, fill: "#fff" });
const braLabel = renderText("BRA", 706, 854, { size: 104, fill: "#fff", stroke: "#00A8C0", strokeWidth: 8, rotate: { angle: 90, cx: 706, cy: 854 } });
const nameLabel = renderText(cardName, 354, 908, { size: fontSize, fill: "#fff", textAnchor: "middle" });
const statsLabel = renderText(stats, 354, 958, { size: 38, fill: "#fff", textAnchor: "middle" });
const teamLabel = renderText(team, 322, 1042, { size: 36, fill: "#fff", textAnchor: "middle" });
const paniniLabel = renderText("PANINI", 678, 1041, { size: 35, fill: "#C71717", textAnchor: "middle" });

const svg = `
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
    ${decorative2}
    ${decorative6}
    <rect x="356" y="338" width="172" height="172" rx="6" fill="#FFDF00" opacity="0.96"/>
    ${fifa26}
    <path d="M699 83 C723 83 737 103 731 129 C727 148 717 159 708 166 L708 198 L724 226 L674 226 L690 198 L690 166 C680 159 671 146 667 129 C661 103 675 83 699 83Z" fill="#fff"/>
    ${fifaLabel}
    <g transform="translate(602 642)">${brazilFlagSvg(138)}</g>
    ${braLabel}
    <rect x="54" y="146" width="560" height="696" rx="58" fill="#0b8c4d" opacity="0.22" filter="url(#softShadow)"/>
    <!-- placeholder foto -->
    <rect x="74" y="168" width="520" height="650" rx="58" fill="#005f7a" opacity="0.5"/>
    <text x="334" y="520" text-anchor="middle" font-family="Arial" font-size="48" fill="#fff" opacity="0.6">SEM FOTO</text>
    <rect x="42" y="840" width="624" height="128" rx="58" fill="url(#footer)"/>
    ${nameLabel}
    ${statsLabel}
    <rect x="48" y="994" width="548" height="72" rx="25" fill="#002050" opacity="0.88"/>
    ${teamLabel}
    <rect x="594" y="1000" width="166" height="58" rx="6" fill="#FFDF00" stroke="#C71717" stroke-width="5"/>
    ${paniniLabel}
  </svg>
`;

const outPath = path.join(process.cwd(), "test-card.png");
const buf = await sharp(Buffer.from(svg)).png().toBuffer();
fs.writeFileSync(outPath, buf);
console.log(`Cartão gerado: ${outPath} (${buf.length} bytes)`);
