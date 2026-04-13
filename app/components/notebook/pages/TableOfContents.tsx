import React from "react";
import { transform, RenderContext } from "../Notebook";

export const TableOfContentsBlocks = (args?: RenderContext) => {
  const ctx = args?.ctx;
  const goToIndex = args?.goToIndex;

  return [
    <section
      key="header"
      className="flex flex-col items-center p-4 w-full h-full gap-4 justify-center font-normal"
    >
      <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-baskervville ">
        Contents
      </h1>
      <div className="font-jost  w-full h-full flex flex-col">
        {ctx &&
          Array.from(ctx.entries()).map(([key, value], index) => (
            <div
              className="w-full h-full "
              key={String(key).toUpperCase()}
              onClick={() => goToIndex?.(key)}
            >
              <div className="text-xs mb-1">Chapter: {index + 1}</div>
              <div className="font-normal cursor-pointer hover:bg-gray-200 active:bg-gray-200 border-b-r-2 flex w-full border-b border-dotted border-gray-400 justify-between items-center">
                <h2>{transform(key)}</h2>
                <p className="font-normal">{value}</p>
              </div>
            </div>
          ))}
      </div>
    </section>,
  ];
};
