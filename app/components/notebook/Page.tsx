import React, { forwardRef } from "react";
import { Homemade_Apple } from "next/font/google";

interface PageProps {
  children?: React.ReactNode;
  index?: number;
  chapterName?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, index, chapterName }, ref) => {
    const isOdd = index && index % 2 === 1;

    return (
      <>
        <div
          className={` w-full h-full  
          ${isOdd ? "md:pr-2 md:pl-0" : "md:pl-2 md:pr-0"}`}
        >
          {chapterName && (
            <div
              className={`border-gray-400 font-jost text-xs z-10 border-b leading-5 
              absolute top-2 left-4 right-4 
              ${isOdd ? "text-right pr-5  z-50 left-6 right-6" : "text-left pl-5 right-6 left-6"}`}
            >
              {chapterName}
            </div>
          )}
          <div
            className={` w-full h-full bg-white flex flex-col 
            justify-between p-2 
            ${index && index % 2 === 1 ? "odd-page md:pr-4" : "even-page md:pl-4"}`}
          >
            <div ref={ref} className="flex-1 overflow-auto h-full w-full p-4 ">
              {children}
            </div>

            <div className="shrink-0 footer m-1 flex items-center justify-center">
              <p className="text-sm font-merriweather  p-1">{index}</p>
            </div>
          </div>
        </div>
      </>
    );
  },
);

Page.displayName = "Page";

export default Page;
