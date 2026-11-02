import React from "react";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const aboutBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  const AboutMain = () => {
    return (
      <section id="about" className="section-wrapper">
        <ChapterIntro name={"About"} chapterNumber={chapter} />

        <div className="page-text-wrapper text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug max-w-[65ch] space-y-2 lg:space-y-4">
          <div>
            <p>
              Hi! My name is Maria. I currently work as a freelance developer,
              building websites and web applications. I like creating websites
              and web apps that are unique and don&apos;t look like another
              template site.
            </p>
          </div>

          <p>
            I have always been fascinated by the world of computers and
            technology. I want to understand how things work under the hood and
            how they can be improved. This led me to pursue a degree in Computer
            Engineering, alongside specializing in Web Development on my own by
            following various sources and courses and building my own projects.
          </p>
        </div>
      </section>
    );
  };

  const AboutDeveloping = () => {
    return (
      <section className="section-wrapper page-text-wrapper-not-first text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug max-w-[65ch] space-y-2 lg:space-y-4">
        <p>
          {" "}
          I work across the entire development process, from building the user
          interface and creating engaging user experiences to developing the
          underlying logic, handling data, and connecting everything behind the
          scenes. What I find most rewarding about full-stack development is
          being involved in every stage of an application, understanding how
          each part works together, and turning an idea into a complete,
          functional product.{" "}
        </p>

        <p>
          I mainly work within React/Next.JS ecosystem but I am always open to
          learning new technologies when needed.
        </p>
      </section>
    );
  };

  // return [AboutMain, AboutDeveloping, AboutClient];
  return [AboutMain, AboutDeveloping];
};
