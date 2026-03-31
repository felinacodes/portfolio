import React, { forwardRef } from "react";
import { Homemade_Apple } from "next/font/google";

interface PageProps {
  children?: React.ReactNode;
  index?: number;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, index }, ref) => {
    const isOdd = index && index % 2 === 1;

    return (
      <div
        className={`w-full h-full  
          ${isOdd ? "md:pr-2 md:pl-0" : "md:pl-2 md:pr-0"}`}
      >
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
    );
  },
);

Page.displayName = "Page";

export default Page;
