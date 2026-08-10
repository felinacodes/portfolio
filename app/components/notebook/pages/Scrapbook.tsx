import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";
import { Plus, ArrowRight } from "lucide-react";
import { createStickerUrl } from "@/lib/createStickerUrl";
import { StickerName } from "@/lib/stickerMap";

export const ScrapbookBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;
  const messages = args?.messages ?? [];
  const setIsModalOpen = args?.setIsModalOpen;

  const MESSAGES_PER_PAGE = 9;
  const FIRST_PAGE_MESSAGES = MESSAGES_PER_PAGE - 3;

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
    const ScrapbookBlocksPage = (pageArgs: RenderContext) => {
      const isIntroPage = pageIndex === 0;
      const jumpToLastScrapbookBlocks = pageArgs.handleJumpToLastScrapbook;

      return (
        <section
          className={`flex flex-col gap-6 ${
            isIntroPage ? "section-wrapper" : "mt-4"
          }`}
        >
          {isIntroPage && (
            <ChapterIntro name="Scrapbook" chapterNumber={chapter} />
          )}

          {isIntroPage && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => {
                  jumpToLastScrapbookBlocks?.();
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

          {isIntroPage && (
            <div className="flex mt-2 order-3 w-full">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300  leading-relaxed  mx-auto">
                * Go to the last scrapbook page, choose a sticker, and add your
                signature or drawing. As long as it&lsquo;s SFW, your
                contribution will become a permanent part of the notebook.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 w-full h-full">
            {pageItems.map((item) => {
              if (item.type === "button") {
                return (
                  <div
                    key="button"
                    className="flex items-center justify-center"
                  >
                    <button
                      onClick={() => {
                        setIsModalOpen?.(true);
                      }}
                      className="
                        flex items-center justify-center
                        w-32 h-32
                        rounded-full
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
                  className="
                    flex
                    flex-col
                    gap-4
                    items-center
                    justify-center
                   
                  "
                >
                  {/* Sticker */}
                  <div
                    className="
                      group
                      relative
                     md:w-32
                     w-24
                      
                      flex
                      items-center
                      justify-center
                      overflow-visible
                    "
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={createStickerUrl(
                        item.message.sticker as StickerName,
                        item.message.color1,
                        item.message.color2,
                      )}
                      alt="sticker"
                      draggable={false}
                      className="
                        relative         
                        object-contain
                        select-none
                        transition-transform
                        duration-300
                        ease-out
                        drop-shadow-[0_10px_8px_rgba(0,0,0,0.40)]
                        drop-shadow-[0_18px_16px_rgba(0,0,0,0.25)]
                        group-hover:scale-[1.01]
                      "
                    />

                    {/* Glossy sticker reflection */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        top-1/2
                        left-1/2
                        w-[45%]
                        h-[45%]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-[40%]
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                      "
                      style={{
                        background: `
                          linear-gradient(
                            135deg,
                            rgba(255,255,255,0.4) 0%,
                            rgba(255,255,255,0.2) 30%,
                            rgba(255,255,255,0) 65%
                          )
                        `,
                        filter: "blur(8px)",
                        mixBlendMode: "screen",
                      }}
                    />
                  </div>

                  {/* Signature */}
                  {item.message.signature && (
                    <div
                      className="relative   md:w-32
                     w-24
                      h-[clamp(32px,40px,50px)]"
                    >
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

    return ScrapbookBlocksPage;
  });
};
