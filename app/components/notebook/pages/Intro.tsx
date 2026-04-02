import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const IntroBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;
  return [
    <section
      key="header"
      className="flex flex-col items-center justify-center p-4 w-full h-full "
    >
      <ChapterIntro
        key="chapter-intro"
        chapterNumber={chapter}
        name={"Intro"}
        icon={"/images/icons/bio.svg"}
      />

      <div className="w-48 h-48 rounded-full overflow-hidden border">
        <Image
          src="/me.jpg"
          alt="Portrait"
          width={96}
          height={96}
          className="object-cover"
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
