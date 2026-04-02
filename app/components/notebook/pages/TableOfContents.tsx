import React from "react";
import { transform, RenderContext } from "../Notebook";

export const TableOfContentsBlocks = (args?: RenderContext) => {
  const ctx = args?.ctx;
  const goToIndex = args?.goToIndex;

  return [
    <section
      key="header"
      className="flex flex-col items-center justify-center p-4 border-2 border-pink-500 w-full h-full"
    >
      <h1>Table of Contents</h1>
      {ctx &&
        Array.from(ctx.entries()).map(([key, value]) => (
          <div
            key={String(key).toUpperCase()}
            className="cursor-pointer hover:bg-gray-200 p-1 rounded"
            onClick={() => goToIndex?.(key)}
          >
            <h2>{transform(key)?.toUpperCase()}</h2>
            <p>{value}</p>
          </div>
        ))}
    </section>,
  ];
};
