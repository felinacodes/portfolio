import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const EducationBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  const EducationPage = () => {
    return (
      <section key="education" className="section-wrapper">
        <ChapterIntro name={"Education"} chapterNumber={chapter} />

        <div className="text-start text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug max-w-[65ch] space-y-2 lg:space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2 border-b-2 border-b-gray-500 w-max">
              Degrees:
            </h3>

            <ol className="list-disc list-inside space-y-1">
              <li>
                <span className="font-semibold">
                  Hellenic Mediterranean University:
                </span>
                <span className="italic ml-1">
                  BSc in Computer and Informatics Engineering
                </span>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 border-b-2 border-b-gray-500 w-max">
              Courses:
            </h3>

            <ol className="list-disc list-inside space-y-1">
              <li>
                <span className="italic">The Odin Project</span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    );
  };

  return [EducationPage];
};
