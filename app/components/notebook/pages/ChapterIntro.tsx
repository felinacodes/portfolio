import React from "react";

interface ChapterIntroProps {
  name?: string;
  icon?: string;
  chapterNumber?: number;
}

const ChapterIntro = ({ name, icon, chapterNumber }: ChapterIntroProps) => {
  return (
    <div className="h-full w-full justify-center items-start flex pb-4 ">
      <div className="w-full text-center font-jost font-semibold border-b border-b-gray-400 leading-[1.5] text-2xl  ">
        {chapterNumber !== undefined && (
          <p className="text-2xl font-semibold font-serif mb-4">
            {chapterNumber}{" "}
          </p>
        )}
        {name}
      </div>
    </div>
  );
};

export default ChapterIntro;
