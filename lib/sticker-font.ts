import opentype from "opentype.js";
import { ANTON_WOFF_BASE64 } from "@/lib/fonts/anton-woff-base64";

function decodeFont() {
  const buffer = Buffer.from(ANTON_WOFF_BASE64, "base64");
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
  return opentype.parse(arrayBuffer);
}

let cachedFont: opentype.Font | null = null;

function getFont() {
  if (!cachedFont) {
    cachedFont = decodeFont();
  }
  return cachedFont;
}

type RenderTextOptions = {
  size: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  textAnchor?: "start" | "middle" | "end";
  rotate?: { angle: number; cx: number; cy: number };
};

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export function renderText(
  text: string,
  x: number,
  y: number,
  opts: RenderTextOptions,
): string {
  if (!text) {
    return "";
  }

  const font = getFont();
  const width = font.getAdvanceWidth(text, opts.size);
  let originX = x;

  if (opts.textAnchor === "middle") {
    originX = x - width / 2;
  } else if (opts.textAnchor === "end") {
    originX = x - width;
  }

  const path = font.getPath(text, originX, y, opts.size);
  const d = path.toPathData(2);

  const fill = opts.fill ?? "#000";
  const attrs = [`d="${d}"`, `fill="${escapeAttr(fill)}"`];

  if (opts.opacity !== undefined) {
    attrs.push(`opacity="${opts.opacity}"`);
  }

  if (opts.stroke) {
    attrs.push(`stroke="${escapeAttr(opts.stroke)}"`);
    attrs.push(`stroke-width="${opts.strokeWidth ?? 1}"`);
    attrs.push(`paint-order="stroke"`);
    attrs.push(`stroke-linejoin="round"`);
  }

  const pathEl = `<path ${attrs.join(" ")}/>`;

  if (opts.rotate) {
    const { angle, cx, cy } = opts.rotate;
    return `<g transform="rotate(${angle} ${cx} ${cy})">${pathEl}</g>`;
  }

  return pathEl;
}
