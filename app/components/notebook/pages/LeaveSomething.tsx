import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";
import { Plus } from "lucide-react";
import { createStickerUrl } from "@/lib/createStickerUrl";
import { StickerName } from "@/lib/stickerMap";
import { ArrowRight } from "lucide-react";

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
    const LeaveSomethingPage = (pageArgs: RenderContext) => {
      const isIntroPage = pageIndex === 0;
      const jumpToLastLeaveSomething = pageArgs.handleJumpToLastLeaveSomething;

      return (
        <section
          className={`flex flex-col gap-6  ${
            isIntroPage ? "section-wrapper" : "mt-4"
          }`}
        >
          {isIntroPage && (
            <ChapterIntro name="Leave Something" chapterNumber={chapter} />
          )}

          {isIntroPage && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => {
                  jumpToLastLeaveSomething?.();
                  console.log("jump to last page");
                }}
                className="
                group
                flex items-center gap-2
                px-4 py-2
                rounded-full
                border border-gray-300
                bg-white/70
                text-sm text-gray-600
                shadow-sm
                transition-all duration-200
                hover:border-gray-400
                hover:bg-gray-100
                hover:text-gray-800
                hover:shadow-md
                active:scale-95
                "
              >
                <span>Jump to last page</span>

                <ArrowRight
                  size={17}
                  strokeWidth={2}
                  className="
                  transition-transform duration-200
                  group-hover:translate-x-1
                   "
                />
              </button>
            </div>
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
