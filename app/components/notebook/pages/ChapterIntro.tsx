import React from "react";

interface ChapterIntroProps {
  name?: string;
  icon?: string;
}

const ChapterIntro = ({ name, icon }: ChapterIntroProps) => {
  return (
    <div className="h-full w-full justify-center items-start flex pb-4 ">
      <p className="w-full text-center font-jost font-semibold border-b border-b-gray-400 leading-[1.5] text-2xl  ">
        {name}
      </p>
    </div>
  );
};

export default ChapterIntro;
