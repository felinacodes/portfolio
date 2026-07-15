import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const LeaveSomethingBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;
  const messages = args?.messages ?? [];
  const setMessages = args?.setMessages;

  const pages = [
    { type: "intro" as const },
    ...messages.map((message) => ({
      type: "message" as const,
      message,
    })),
  ];

  return pages.map((page) => {
    const LeaveSomethingPage = () => {
      if (page.type === "intro") {
        return (
          <section className="section-wrapper flex flex-col items-center justify-start w-full p-2 gap-2 border-2 border-blue-500">
            <ChapterIntro name="Leave Something" chapterNumber={chapter} />

            <button
              onClick={() =>
                setMessages?.((prev) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),
                    author: "Felina",
                    imageUrl: "https://www.svgrepo.com/show/530366/coffee.svg",
                  },
                ])
              }
            >
              CLICK ME
            </button>

            <p>Total messages: {messages.length}</p>
          </section>
        );
      }

      const message = page.message;

      return (
        <section className="mt-4 flex flex-col items-center justify-start w-full p-2 gap-2 border-2 border-blue-500">
          <div className="text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug">
            <div className="flex flex-wrap w-full gap-4 items-center justify-center">
              <div className="relative w-48 shrink-0 aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={message.imageUrl}
                  alt={message.author}
                  fill
                  className="object-cover grayscale hover:grayscale-0 active:grayscale-0 transition duration-1000 ease-in"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 m-4">
                <h1 className="text-center font-bold text-md xl:text-xl mb-2 border-b-2 border-b-gray-500 dark:border-b-gray-200 w-max">
                  {message.author}
                </h1>

                <div className="flex flex-row gap-4 justify-center items-center">
                  <a
                    href={message.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-500 active:text-gray-500 dark:hover:text-gray-800 active:dark:text-gray-800"
                  >
                    <i
                      className="devicon-github-plain text-3xl
                      hover:text-gray-500 active:text-gray-500
                      dark:hover:text-gray-800 active:dark:text-gray-800"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    };

    return LeaveSomethingPage;
  });
};
