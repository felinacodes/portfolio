import React from "react";

interface ChapterIntroProps {
  name: string;
  chapterNumber?: number;
}

const ChapterIntro = ({ name, chapterNumber }: ChapterIntroProps) => {
  return (
    <div className="  h-[20%] w-full mb-2 mt-10">
      <div className=" w-full text-center font-jost font-semibold border-b border-b-gray-400 leading-[1.7] text-2xl  ">
        {chapterNumber !== undefined && (
          <p className="text-2xl font-semibold font-serif mb-2">
            {chapterNumber}{" "}
          </p>
        )}
        {name}
      </div>
    </div>
  );
};

export default ChapterIntro;
