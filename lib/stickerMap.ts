import { tea, coconutCoctail, breakingBad, koala } from "./svgStickers";

export const stickers = {
  tea,
  coconutCoctail,
  breakingBad,
  koala,
} as const;

export type StickerName = keyof typeof stickers;
