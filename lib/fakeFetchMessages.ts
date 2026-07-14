export type LeaveMessage = {
  id: string;
  author: string;
  imageUrl: string;
};

export const messages: LeaveMessage[] = [
  {
    id: "1",
    author: "John",
    imageUrl: "https://www.svgrepo.com/show/530365/avocado.svg",
  },
  {
    id: "2",
    author: "Emma",
    imageUrl: "https://www.svgrepo.com/show/530361/cherry.svg",
  },
  {
    id: "3",
    author: "Alex",
    imageUrl: "https://www.svgrepo.com/show/530363/fish.svg",
  },
  {
    id: "4",
    author: "Sophia",
    imageUrl: "https://www.svgrepo.com/show/530364/lemon.svg",
  },
];

export async function fakeFetchMessages(): Promise<LeaveMessage[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(messages);
    }, 1000);
  });
}
