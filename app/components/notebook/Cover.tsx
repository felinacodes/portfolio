import React, { useState } from "react";
import Bookmarks from "./Bookmarks";
import Bookmark from "./Bookmark";

import { Section, Sheet } from "./Notebook";

// had to pass additional props to make bookmarks work with cover to stay aligned when closed.
interface CoverProps {
  side: string;
  face: string;
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pagesPerView: number;
  animationClass?: string;
  active: string;
  setActive: (id: string) => void;
  handleGoTo: (id: string) => void;
  sections: Section[];
  visibleItems: Sheet[];
  setBookmarkedPage: (id: string) => void;
}

const Cover = ({
  side,
  face,
  isOpen,
  animationClass,
  active,
  setActive,
  handleGoTo,
  sections,
  visibleItems,
  setBookmarkedPage,
}: CoverProps) => {
  return (
    <div
      className={`
    ${animationClass ?? ""}
    text-center h-full w-full relative group z-[20] 

    ${face === "outside" ? "cover-closed md:w-[50%]" : "cover-opened"}

    ${face === "outside" && side === "front" ? "cover-outside-front " : ""}

    ${face === "outside" && side === "back" ? "cover-outside-back" : ""}

    ${animationClass === "coverPrev" || animationClass === "coverNext" ? "no-shadow" : ""}
  `}
    >
      {/*FRONT COVER  */}
      {face === "outside" && side === "front" ? (
        <div
          //   className={`${animationClass ?? ""} cover-front-out text-[clamp(0.9rem,1vw,1rem)] relative flex justify-center items-start h-full ml-8 border-l-2 border-l-black/10
          //    from-white/20 bg-gradient-to-r shadow-[inset_4px_1px_3px_#ffffff60,inset_0_-1px_2px_#00000080]`}
          // >
          className={`z-0 cover-front-out text-[clamp(0.9rem,1vw,1rem)] relative flex justify-center items-start h-full ml-8 border-l-2 border-l-black/10
           from-white/20 bg-gradient-to-r shadow-[inset_4px_1px_3px_#ffffff60,inset_0_-1px_2px_#00000080]
           
           `}
        >
          <div className="cover-light"></div>
          <div className="max-w-[80%] mt-[40%] lg:mt-[25%] w-[clamp(200px,300px,400px)] h-[clamp(10rem,15vw,12rem)] p-2 bg-[#f4f5f0] border-[9px] border-double border-[#438bce] rounded-[40px]">
            <div className="flex flex-col items-start gap-2  justify-center w-full h-full bg-[repeating-linear-gradient(to_bottom,transparent,transparent_30px,#00000030_30px)] p-4">
              <h1 className=" text-start w-full border-b-2 border-dotted border-gray-300 leading-none pt-2">
                <strong className="font-handlee mr-2 font-bold text-[clamp(1rem,1vw,1.2rem)]">
                  Name:
                </strong>
                <span className="font-handlee font-semibold text-blue-800 text-[clamp(1rem,1vw,1.2rem)]">
                  Maria
                </span>
              </h1>
              <h1 className="text-start w-full border-b-2 border-dotted border-gray-300 leading-none pt-2">
                <strong className="font-handlee mr-2 font-bold text-[clamp(1rem,1vw,1.2rem)]">
                  Role:
                </strong>
                <span className="font-handlee font-semibold text-blue-800 text-[clamp(1rem,0.8vw,1.2rem)]">
                  Web Developer
                </span>
              </h1>
            </div>
          </div>
        </div>
      ) : // BACK COVER
      face === "outside" && side === "back" ? (
        <div className="cover-back-out font-handwriting text-[clamp(0.9rem,1vw,1rem)] relative flex justify-center items-end h-full ml-0 mr-8 border-r-2 border-r-black/10  from-white/20 bg-gradient-to-l  shadow-[inset_-4px_1px_3px_#ffffff60,inset_0_-1px_2px_#00000080]">
          <div className="cover-light"></div>
          <div className="drop-shadow-sm max-w-[50%]  w-[clamp(150px,250px,300px)] h-[clamp(10rem,15vh,12rem)] mb-10 bg-white  p-3 rounded-sm">
            <div className=" flex flex-col border-2 w-full h-full justify-between">
              <h1 className="text-2xl p-1">Felina</h1>
              <h2 className="text-center">Made with 💜</h2>
              {/* <div className="w-full h-full"> */}
              <div className="relative barcode w-full h-full border-r-2 "></div>
              <p className="font-mono w-full max-w-full text-center flex items-center justify-between pl-2 pr-2">
                <span>2</span>
                <span>4</span>
                <span>5</span>
                <span>3</span>
                <span>5</span>
                <span>5</span>
                <span>2</span>
                <span>0</span>
                <span>1</span>
                <span>5</span>
              </p>
              {/* </div> */}
            </div>
          </div>
        </div>
      ) : (
        // INSIDE COVER
        <div
          className={`w-full h-full ${side === "front" ? "cover-inside-front" : "cover-inside-back"}`}
        ></div>
      )}
      <div className="z-[-1000000] absolute w-full h-full "></div>
      {!isOpen && !animationClass && (
        <div
          className={
            !isOpen && face === "outside" && side === "front"
              ? "absolute md:top-10 top-[-83px] md:right-[-90px] md:ml-2 flex flex-col md:gap-2 w-full md:w-auto  bookmarks-front md:group-hover:right-[-100px]"
              : "absolute md:top-10 top-[-83px] md:left-[-98px] md:ml-2 flex flex-col md:gap-2  w-full z-[-2] md:z-2 bookmarks-back md:group-hover:left-[-108px]"
          }
        >
          <Bookmarks
            sectionIds={sections.map((s) => s.id)}
            active={active}
            setActive={setActive}
            handleGoTo={handleGoTo}
          />
        </div>
      )}
      {!isOpen && !animationClass && (
        <div
          className={
            !isOpen && face === "outside" && side === "front"
              ? "absolute bookmark-translateZ top-[-40px] left-[30px] "
              : "absolute bookmark-translateZ top-[-40px] right-[30px] "
          }
        >
          <Bookmark
            visibleItems={visibleItems}
            setBookmarkedPage={setBookmarkedPage}
          />
        </div>
      )}
    </div>
  );
};

export default Cover;
