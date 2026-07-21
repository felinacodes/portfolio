import { StickerName } from "./stickerMap";

export type LeaveMessage = {
  id: string;
  sticker: StickerName;
  color1?: string;
  color2?: string;
  signature?: Blob | null;
};

export const messages: LeaveMessage[] = [
  {
    id: "1",
    sticker: "tea",
    color1: "#e615e6",
    color2: "#e3bb2b",
  },
  {
    id: "2",
    sticker: "tea",
    color1: "#15e6bf",
    color2: "#8817eb",
  },
  {
    id: "3",
    sticker: "tea",
    color1: "",
    color2: "",
  },
  {
    id: "4",
    sticker: "coconutCoctail",
    color1: "",
    color2: "",
  },
  {
    id: "5",
    sticker: "coconutCoctail",
    color1: "#3cde47",
    color2: "#17afeb",
  },
  {
    id: "6",
    sticker: "breakingBad",
    color1: "",
    color2: "",
  },
  {
    id: "7",
    sticker: "breakingBad",
    color1: "#2798cc",
    color2: "",
  },
  {
    id: "8",
    sticker: "breakingBad",
    color1: "#cc27b0",
    color2: "#db562e",
  },
  {
    id: "9",
    sticker: "koala",
    color1: "",
    color2: "",
  },
  {
    id: "10",
    sticker: "koala",
    color1: "#2edbdb",
    color2: "",
  },
  {
    id: "11",
    sticker: "koala",
    color1: "#d02edb",
    color2: "#de4923",
  },
  {
    id: "12",
    sticker: "tea",
    color1: "",
    color2: "",
  },
];

export async function fakeFetchMessages(): Promise<LeaveMessage[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(messages);
    }, 1000);
  });
}
