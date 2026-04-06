import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const EducationBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  return [
    <section
      key="education"
      className="flex flex-col items-center justify-start h-full w-full p-2 gap-2 "
    >
      <ChapterIntro
        key="chapter-intro"
        name={"Education"}
        chapterNumber={chapter}
      />
      <div>{chapter}</div>
      <div className="w-full max-w-md text-left">
        <h3 className="font-semibold mb-2">Degrees</h3>
        <ol className="list-decimal list-inside">
          <li>
            <b>Hellenic Mediterranean University:</b> BSc in Computer and
            Informatics Engineering
          </li>
        </ol>

        <h3 className="font-semibold mt-6 mb-2">Courses</h3>
        <ol className="list-decimal list-inside ml-4">
          <li>The Odin Project</li>
        </ol>
      </div>
    </section>,
  ];
};

// export default function Education({ chapter }: { chapter?: number }) {
//   return <>{EducationBlocks({ chapter })}</>;
// }
