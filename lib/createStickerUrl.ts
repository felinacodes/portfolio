import { stickers, StickerName } from "./stickerMap";
import { svgToDataUrl } from "./svgStickers";

const cache = new Map<string, string>();

export function createStickerUrl(
  sticker: StickerName,
  color1?: string,
  color2?: string,
) {
  const defaults = stickers[sticker].defaults;

  const finalColor1 = color1 || defaults.color1;
  const finalColor2 = color2 || defaults.color2;
  const key = JSON.stringify([sticker, finalColor1, finalColor2]);

  const cached = cache.get(key);
  if (cached) return cached;

  const svg = stickers[sticker].svg(finalColor1, finalColor2);

  const url = svgToDataUrl(svg);

  cache.set(key, url);

  return url;
}
