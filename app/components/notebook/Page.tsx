import React, { forwardRef } from "react";
import Bookmark from "./Bookmark";

interface PageProps {
  children?: React.ReactNode;
  index: number;
  chapterName?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, index, chapterName }, ref) => {
    const isOdd = index ? index % 2 === 1 : false;
    return (
      <div
        className={`w-full h-full  ${
          isOdd ? "md:pr-2 md:pl-0" : "md:pl-2 md:pr-0"
        }`}
        // onClick={() => play("flip")}
      >
        <div
          className={`  w-full h-full bg-white dark:bg-background flex flex-col justify-between p-2 relative ${
            isOdd ? "odd-page md:pr-4" : "even-page md:pl-4"
          } `}
        >
          {chapterName && (
            <div
              className={`border-gray-400 font-jost text-xs border-b leading-5
              absolute top-2 left-4 right-4
              ${isOdd ? "text-right pr-5" : "text-left pl-5"}`}
            >
              {chapterName}
            </div>
          )}

          {/* CONTENT */}
          <div
            ref={ref}
            className="flex-1 overflow-auto w-full p-4 pt-10 font-baskervville font-medium
            text-[0.95rem] md:text-[1rem] lg:text-[1.05rem]
            leading-[1.5] md:leading-[1.6]

            text-justify
            [text-justify:inter-word]
            [word-spacing:-0.04em]
            [hyphens:auto]

            [&>p]:m-0
            [&>p:not(:first-of-type)]:indent-[1.5em]

            [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4
            [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3
            [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2

            [&>ol]:pl-5 [&>ol]:my-2
            [&>ul]:pl-5 [&>ul]:my-2
            [&>li]:mb-1"
          >
            {children}
          </div>
          {/* FOOTER */}
          <div className="shrink-0 footer m-1 flex items-center justify-center">
            <p className="text-sm font-merriweather p-1">{index}</p>
          </div>
        </div>
      </div>
    );
  },
);

Page.displayName = "Page";

export default Page;
