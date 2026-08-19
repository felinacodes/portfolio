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
              building websites and web applications.
            </p>

            <p>
              At the moment my focus is on Front-end Development, specifically
              highly interactive and responsive user interfaces using React and
              Next.js. I like creating websites and web apps that are unique and
              don&apos;t look like another template site.
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
        <p className="mt-4">
          Aspects that I find very important while developing include clean code
          that can be easily maintained and scaled, good user experience,
          safety, and SEO.
        </p>

        <p>
          {" "}
          I also have experience with full-stack development, working with
          Node.js and Express to build APIs, as well as Next.js for backend
          logic and Supabase and PostgreSQL for data management. While I enjoy
          frontend development, I find full-stack development even more
          rewarding, as I enjoy working across the entire application and
          understanding how all the different parts come together.{" "}
        </p>

        <p>
          In the future, I would love to get into cybersecurity, since it&apos;s
          an area that I find extremely fascinating, and I believe I can combine
          it with a full-stack career to create some truly robust software.
        </p>
      </section>
    );
  };

  // const AboutClient = () => {
  //   return (
  //     <section className="section-wrapper">
  //       <div className="text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug max-w-[65ch] space-y-2 lg:space-y-4">
  //         <p className="mt-4">
  //           When it comes to working with clients, I find it very important to
  //           customize the experience for each client and project. I like to
  //           understand their needs and create the best possible solution for
  //           them, which doesn&apos;t always mean using React. I aim to be
  //           transparent and communicative throughout the process. Working
  //           alongside an existing team is also something I enjoy, as I get to
  //           meet people with similar interests, exchange ideas, and learn from
  //           different perspectives.
  //         </p>
  //       </div>
  //     </section>
  //   );
  // };

  // return [AboutMain, AboutDeveloping, AboutClient];
  return [AboutMain, AboutDeveloping];
};
