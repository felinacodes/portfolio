import React from "react";
import Image from "next/image";
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
              Hi! My name is Maria (a.k.a. Felina). I currently work as a
              freelance developer, building websites and web applications.
            </p>

            <p>
              I currently focus on Front-end Development, specifically highly
              interactive and responsive user interfaces using React and
              Next.js. I like creating websites and web apps that are unique and
              don&apos;t look like another template site.
            </p>
          </div>

          <p>
            As long as I can remember, I have always been fascinated by the
            world of computers and technology. I want to understand how things
            work under the hood and how they can be improved. This led me to
            pursue a degree in Computer Engineering, alongside specializing in
            Web Development on my own by following various sources and courses
            and building my own projects.
          </p>
        </div>
      </section>
    );
  };

  const AboutDeveloping = () => {
    return (
      <section className="section-wrapper page-text-wrapper-not-first text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug max-w-[65ch] space-y-2 lg:space-y-4">
        <p className="mt-4">
          Aspects that I find very important while developing include clean code
          that can be easily maintained and scaled, good user experience,
          accessibility, and SEO.
        </p>

        <p>
          Full-stack development is also something I enjoy. I have experience
          with Node.js and Express for building APIs, and I am also learning
          about databases and server management. Having shipped a few full-stack
          projects, I can definitely say that I enjoy the process of building an
          app from scratch and the extra responsibility that comes with it.
        </p>

        <p>
          In the future, I would love to get into cybersecurity, since it&apos;s
          an area that I find extremely fascinating, and I believe I can combine
          it with a full-stack career to create truly robust software.
        </p>
      </section>
    );
  };

  const AboutClient = () => {
    return (
      <section className="section-wrapper">
        <div className="text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug max-w-[65ch] space-y-2 lg:space-y-4">
          <p className="mt-4">
            When it comes to working with clients, I find it very important to
            customize the experience for each client and project. I like to
            understand their needs and create the best possible solution for
            them (it&apos;s not always React). I aim to be transparent and
            communicative throughout the process. Working alongside an existing
            team is also something I enjoy, since I get to meet people with
            similar interests and exchange ideas.
          </p>
        </div>
      </section>
    );
  };

  return [AboutMain, AboutDeveloping, AboutClient];
};
