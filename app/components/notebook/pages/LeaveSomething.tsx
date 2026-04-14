import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const LeaveSomethingBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  const LeaveSomethingPage = () => {
    return (
      <section className="flex flex-col items-center justify-start h-full w-full p-2 gap-2">
        <ChapterIntro
          name={"Leave Something"}
          // icon={"/images/icons/bio.svg"}
          chapterNumber={chapter}
        />

        <h1>Leave Me Something:</h1>
      </section>
    );
  };

  return [LeaveSomethingPage];
};
