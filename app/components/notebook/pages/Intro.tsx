import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const IntroBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;
  return [
    <section
      key="header"
      className="flex flex-col items-center justify-start h-full w-full p-2 gap-2 "
    >
      <ChapterIntro
        key="chapter-intro"
        chapterNumber={chapter}
        name={"Intro"}
      />

      <div className="relative w-48 h-48 rounded-full overflow-hidden border ">
        <Image
          src="/images/my_image.png"
          alt="Portrait"
          fill
          className="object-cover grayscale"
        />
      </div>

      <div className="flex flex-col gap-2 items-center justify-center mt-4">
        <h1 className="text-2xl font-semibold">FelinaCodes</h1>
        <p className="text-sm text-gray-500">Freelance Web Developer</p>
        <p className="text-sm text-gray-500">React · Next.js · HTML/ CSS/ JS</p>
      </div>
    </section>,
  ];
};
