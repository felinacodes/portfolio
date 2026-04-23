import React from "react";
import { transform, RenderContext } from "../Notebook";

export const TableOfContentsBlocks = (args?: RenderContext) => {
  // const chapter = args?.chapter;

  return [
    function TableOfContentsPage(props?: RenderContext) {
      const ctx = props?.ctx;
      const goToIndex = props?.goToIndex;

      return (
        <section className="flex flex-col items-center p-4 w-full h-full gap-4 justify-center font-normal">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-baskervville">
            Contents
          </h1>

          <div data-no-flip className="font-jost w-full h-full flex flex-col">
            {ctx &&
              Array.from(ctx.entries()).map(([key, value], index) => (
                <div
                  key={key}
                  className="w-full h-full"
                  onClick={() => goToIndex?.(key)}
                >
                  <div className="text-xs mb-1">Chapter: {index + 1}</div>

                  <div className="cursor-pointer hover:bg-gray-200 active:bg-gray-200 border-b flex justify-between border-dotted border-gray-400">
                    <h2>{transform(key)}</h2>
                    <p>{value}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      );
    },
  ];
};
