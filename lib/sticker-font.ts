import { readFile } from "fs/promises";
import path from "path";

let cachedBase64: Promise<string> | null = null;

function loadFontBase64() {
  const filePath = path.join(process.cwd(), "lib", "fonts", "anton.woff2");
  return readFile(filePath).then((buffer) => buffer.toString("base64"));
}

export function getStickerFontBase64() {
  if (!cachedBase64) {
    cachedBase64 = loadFontBase64();
  }

  return cachedBase64;
}

export async function getStickerFontFaceStyle() {
  const base64 = await getStickerFontBase64();

  return `<style><![CDATA[
    @font-face {
      font-family: 'StickerDisplay';
      src: url(data:font/woff2;base64,${base64}) format('woff2');
      font-weight: 400;
      font-style: normal;
    }
  ]]></style>`;
}

export const STICKER_DISPLAY_FONT = "StickerDisplay, 'Arial Black', Impact, sans-serif";
