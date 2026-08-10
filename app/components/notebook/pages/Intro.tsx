import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const IntroBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  const IntroPage = () => {
    return (
      <section
        key="header"
        className="flex flex-col items-center justify-start h-full w-full p-2 gap-2"
      >
        <ChapterIntro chapterNumber={chapter} name={"Intro"} />

        <div className="relative w-48 shrink-0 aspect-square rounded-full overflow-hidden border">
          <Image
            src="/images/my_image.png"
            alt="Portrait"
            fill
            sizes="192px"
            className="object-cover grayscale  ease-in"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2 items-center justify-center mt-4 p-2">
          <h1 className="text-2xl font-semibold">Maria A.</h1>

          <p className="whitespace-nowrap text-xl text-gray-500 dark:text-gray-200">
            Freelance Web Developer
          </p>

          <div
            className="p-2 text-lg text-gray-500 dark:text-gray-200 text-center
            [&>span]:relative
            [&>span]:inline-block
            [&>span]:before:content-['•']
            [&>span]:before:mr-2
            [&>span]:after:mr-2"
          >
            <span>React</span>
            <span>Next.JS</span>
            <span>TS</span>
          </div>

          <div className="text-lg text-gray-500 dark:text-gray-200 flex items-center gap-2 flex-col md:flex-row">
            <h3>Availability:</h3>
            <h2>Currently Available</h2>
          </div>
        </div>
      </section>
    );
  };

  return [IntroPage];
};
