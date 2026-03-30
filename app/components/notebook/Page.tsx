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
          className={`page w-full h-full bg-white flex flex-col 
            justify-center items-center p-2 
            ${index && index % 2 === 1 ? "odd-page pr-4" : "even-page pl-4"}`}
        >
          <div
            ref={ref}
            className=" flex flex-col items-center justify-start w-full h-full overflow-auto p-4 "
          >
            {children}
          </div>

          <div className="footer m-1">
            <p className="text-center">{index}</p>
          </div>
        </div>
      </div>
    );
  },
);

Page.displayName = "Page";

export default Page;
