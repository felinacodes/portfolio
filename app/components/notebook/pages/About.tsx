import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const aboutBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  return [
    <section
      id="about"
      key="about-me"
      className="flex flex-col items-center justify-start h-full w-full p-2 gap-2 "
    >
      <ChapterIntro
        key="chapter-intro"
        name={"About Me"}
        chapterNumber={chapter}
      />

      <p key="intro">
        Hello. My name is Maria (a.k.a. Felina) and I am a Web Developer. I am
        currently working as a freelance developer, building websites and web
        applications.
      </p>
      <p>
        Since I was a child I have always been fascinated by the world of
        computers and technology. I have always been interested in how things
        work and how they can be imrpoved. This led me to pursue a degreen in
        Computer Engineering, along side learning about Web Develoment on my own
        following various sources and courses and building my own projects.
        Outside of coding, I enjoy working out, movies, and books (In case it is
        not obvious. 🙃)
      </p>
    </section>,
    <p id="test" key="focus-area">
      I currently focus on Front-end Devolpment and specifically highly
      interactive and responsive user interfaces using React and Next.js. I care
      about clean code, maintainability, and creating user experiences that are
      intuitive and enjoyable.
    </p>,
  ];
};
