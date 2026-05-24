import { ANTON_FONT_BASE64 } from "@/lib/fonts/anton-base64";

const FONT_FACE = `<style><![CDATA[
  @font-face {
    font-family: 'StickerDisplay';
    src: url(data:font/woff2;base64,${ANTON_FONT_BASE64}) format('woff2');
    font-weight: 400;
    font-style: normal;
  }
]]></style>`;

export function getStickerFontFaceStyle() {
  return FONT_FACE;
}

export const STICKER_DISPLAY_FONT = "StickerDisplay, 'Arial Black', Impact, sans-serif";
