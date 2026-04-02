import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const SkillsBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  return [
    <section
      key="header"
      className="flex flex-col items-center justify-center p-4  w-full h-full "
    >
      <ChapterIntro
        key="chapter-intro"
        name={"Skills"}
        icon={"/images/icons/bio.svg"}
      />

      <h1>Skills:</h1>
      <ul>
        <h1>Front-End:</h1>
        <ul>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>Tailwind</li>
          <li>React</li>
          <li>TypeScript</li>
          <li>Next.js</li>
        </ul>
        <h1>Back-End:</h1>
        <ul>
          <li>Node.js</li>
          <li>Express</li>
          <li>PostreSQL</li>
          <li>MongoDB</li>
        </ul>
        <h1>Misc:</h1>
        <ul>
          <li>Git</li>
          <li>Jest</li>
          <li>VS Code</li>
        </ul>
      </ul>
    </section>,
  ];
};
