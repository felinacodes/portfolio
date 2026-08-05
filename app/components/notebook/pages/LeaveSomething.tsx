import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";
import { Plus } from "lucide-react";
import { createStickerUrl } from "@/lib/createStickerUrl";
import { StickerName } from "@/lib/stickerMap";

export const LeaveSomethingBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;
  const messages = args?.messages ?? [];
  const setIsModalOpen = args?.setIsModalOpen;

  const MESSAGES_PER_PAGE = 6;
  const FIRST_PAGE_MESSAGES = MESSAGES_PER_PAGE - 2;

  const items = [
    ...messages.map((message) => ({
      type: "message" as const,
      message,
    })),
    {
      type: "button" as const,
    },
  ];

  const firstPageItems = items.slice(0, FIRST_PAGE_MESSAGES);
  const remainingItems = items.slice(FIRST_PAGE_MESSAGES);

  const itemPages = [
    firstPageItems,
    ...Array.from(
      {
        length: Math.ceil(remainingItems.length / MESSAGES_PER_PAGE),
      },
      (_, i) =>
        remainingItems.slice(
          i * MESSAGES_PER_PAGE,
          (i + 1) * MESSAGES_PER_PAGE,
        ),
    ),
  ];

  return itemPages.map((pageItems, pageIndex) => {
    const LeaveSomethingPage = () => {
      const isIntroPage = pageIndex === 0;

      return (
        <section
          className={`flex flex-col gap-6  ${
            isIntroPage ? "section-wrapper" : "mt-4"
          }`}
        >
          {isIntroPage && (
            <ChapterIntro name="Leave Something" chapterNumber={chapter} />
          )}

          <div className="grid grid-cols-2 gap-6 w-full h-full">
            {pageItems.map((item, index) => {
              if (item.type === "button") {
                return (
                  <div
                    key="button"
                    className="flex items-center justify-center "
                  >
                    <button
                      onClick={() => {
                        setIsModalOpen?.(true);
                      }}
                      className="
                    flex items-center justify-center
                    w-32 h-32 rounded-full
                    bg-gray-200   
                    transition-colors duration-200
                    group
                   "
                    >
                      <Plus
                        size={48}
                        strokeWidth={2.5}
                        className="
                      text-gray-500
                      group-hover:text-gray-700        
                      transition-colors duration-200
                      cursor-pointer
        "
                      />
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={item.message.id}
                  className=" flex flex-col gap-4 items-center justify-center"
                >
                  <div className="relative w-32 aspect-square rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={createStickerUrl(
                        item.message.sticker as StickerName,
                        item.message.color1,
                        item.message.color2,
                      )}
                      alt="sticker"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                  {item.message.signature && (
                    <div className="relative w-32 h-12">
                      <Image
                        src={item.message.signature}
                        alt="signature"
                        fill
                        sizes="128px"
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );
    };

    return LeaveSomethingPage;
  });
};
