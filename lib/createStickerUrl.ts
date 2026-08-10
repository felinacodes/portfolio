import { stickers, StickerName } from "./stickerMap";
import { svgToDataUrl } from "./svgStickers";

const cache = new Map<string, string>();

const addStickerOutline = (svg: string) => {
  const filter = `
    <filter
      id="sticker-outline"
      x="-20%"
      y="-20%"
      width="140%"
      height="140%"
    >
      <feMorphology
        in="SourceAlpha"
        operator="dilate"
        radius="4"
        result="whiteExpanded"
      />

      <feFlood
        flood-color="white"
        result="whiteColor"
      />

      <feComposite
        in="whiteColor"
        in2="whiteExpanded"
        operator="in"
        result="whiteOutline"
      />

      <feMorphology
        in="SourceAlpha"
        operator="dilate"
        radius="5"
        result="blackExpanded"
      />

      <feFlood
        flood-color="#E3DADA"
        result="blackColor"
      />

      <feComposite
        in="blackColor"
        in2="blackExpanded"
        operator="in"
        result="blackOutline"
      />

      <feMerge>
        <feMergeNode in="blackOutline" />
        <feMergeNode in="whiteOutline" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  `;

  const paddedSvg = svg.replace(/viewBox="([^"]+)"/, (_, viewBox) => {
    const [x, y, width, height] = viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);

    // 3% padding relative to the SVG's own coordinate system
    const padding = Math.max(width, height) * 0.03;

    return `viewBox="${x - padding} ${y - padding} ${
      width + padding * 2
    } ${height + padding * 2}"`;
  });

  return paddedSvg
    .replace("<svg", `<svg filter="url(#sticker-outline)"`)
    .replace(">", `><defs>${filter}</defs>`);
};

export function createStickerUrl(
  sticker: StickerName,
  color1?: string,
  color2?: string,
) {
  const stickerData = stickers[sticker];

  if (!stickerData) {
    console.warn(`Unknown sticker: "${sticker}"`);
    return "";
  }

  const defaults = stickers[sticker].defaults;

  const finalColor1 = color1 || defaults.color1;
  const finalColor2 = color2 || defaults.color2;

  const key = JSON.stringify([sticker, finalColor1, finalColor2]);

  const cached = cache.get(key);
  if (cached) return cached;

  const svg = stickers[sticker].svg(finalColor1, finalColor2);

  // Add the white sticker border HERE
  const stickerSvg = addStickerOutline(svg);

  const url = svgToDataUrl(stickerSvg);

  cache.set(key, url);

  return url;
}
