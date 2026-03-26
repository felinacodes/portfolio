import React, { useState } from "react";
interface CoverProps {
  side: string;
  face: string;
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pagesPerView: number;
}

const Cover = ({ side, face, isOpen, setIsOpen, pagesPerView }: CoverProps) => {
  return (
    <div
      className={`text-center h-full w-full ${
        face === "outside" ? "cover md:w-[50%]" : ""
      }`}
    >
      {/*FRONT COVER  */}
      {face === "outside" && side === "front" ? (
        <div className="text-[clamp(0.9rem,1vw,1rem)] relative flex justify-center items-start h-full ml-8 border-l-2 border-l-black/10  from-white/20  bg-gradient-to-r  shadow-[inset_4px_1px_3px_#ffffff60,inset_0_-1px_2px_#00000080] ">
          <div className="max-w-[80%] mt-[40%] lg:mt-[25%] w-[clamp(200px,300px,400px)] h-[clamp(10rem,15vw,12rem)] p-2 bg-[#f4f5f0] border-[9px] border-double border-[#438bce] rounded-[40px]">
            <div className="flex flex-col items-start gap-2  justify-center w-full h-full bg-[repeating-linear-gradient(to_bottom,transparent,transparent_30px,#00000030_30px)] p-4">
              <h1 className=" text-start w-full border-b-2 border-dotted border-gray-300 leading-none pt-2">
                <strong>Name:</strong> Maria
              </h1>
              <h1 className="text-start w-full border-b-2 border-dotted border-gray-300 leading-none pt-2">
                <strong>Profession:</strong> Web Developer
              </h1>
            </div>
          </div>
        </div>
      ) : // BACK COVER
      face === "outside" && side === "back" ? (
        <div className="text-[clamp(0.9rem,1vw,1rem)] relative flex justify-center items-end h-full ml-0 mr-8 border-r-2 border-r-black/10  from-white/20 bg-gradient-to-l  shadow-[inset_-4px_1px_3px_#ffffff60,inset_0_-1px_2px_#00000080]">
          <div className="drop-shadow-sm max-w-[50%]  w-[clamp(150px,250px,300px)] h-[clamp(10rem,15vh,12rem)] mb-10 bg-white  p-3 rounded-sm">
            <div className=" flex flex-col border-2 w-full h-full justify-between">
              <h1 className="text-2xl">Felina</h1>
              <h2 className="">Made with 💜</h2>
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
    </div>
  );
};

export default Cover;
