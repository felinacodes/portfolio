import { StickerName } from "./stickerMap";

export type LeaveMessage = {
  id: string;
  author: string;
  sticker: StickerName;
  color1?: string;
  color2?: string;
};

export const messages: LeaveMessage[] = [
  {
    id: "1",
    author: "Thomas",
    sticker: "tea",
    color1: "#e615e6",
    color2: "#e3bb2b",
  },
  {
    id: "2",
    author: "Emma",
    sticker: "tea",
    color1: "#15e6bf",
    color2: "#8817eb",
  },
  {
    id: "3",
    author: "John",
    sticker: "tea",
    color1: "",
    color2: "",
  },
  {
    id: "4",
    author: "John",
    sticker: "coconutCoctail",
    color1: "",
    color2: "",
  },

  {
    id: "5",
    author: "Alex",
    sticker: "coconutCoctail",
    color1: "#3cde47",
    color2: "#17afeb",
  },
  {
    id: "6",
    author: "Pamela",
    sticker: "breakingBad",
    color1: "",
    color2: "",
  },
  {
    id: "7",
    author: "Ben",
    sticker: "breakingBad",
    color1: "#2798cc",
    color2: "",
  },
  {
    id: "8",
    author: "Matt",
    sticker: "breakingBad",
    color1: "#cc27b0",
    color2: "#db562e",
  },
  {
    id: "9",
    author: "Jason",
    sticker: "koala",
    color1: "",
    color2: "",
  },
  {
    id: "10",
    author: "Martin",
    sticker: "koala",
    color1: "#2edbdb",
    color2: "",
  },
  {
    id: "11",
    author: "Jackson",
    sticker: "koala",
    color1: "#d02edb",
    color2: "#de4923",
  },

  {
    id: "12",
    author: "Liam",
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
