import { stickers, StickerName } from "./stickerMap";
import { svgToDataUrl } from "./svgStickers";

const cache = new Map<string, string>();

export function createStickerUrl(
  sticker: StickerName,
  color1?: string,
  color2?: string,
) {
  const key = `${sticker}|${color1}|${color2}`;

  const cached = cache.get(key);
  if (cached) return cached;

  const svg = stickers[sticker](color1, color2);
  const url = svgToDataUrl(svg);

  cache.set(key, url);

  return url;
}
