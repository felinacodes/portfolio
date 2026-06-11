import React from "react";

import { transform } from "./Notebook";

interface BookmarkProps {
  sectionIds: string[];
  active: string;
  setActive: (id: string) => void;
  handleGoTo: (id: string) => void;
}

const Bookmarks = ({
  sectionIds,
  active,
  setActive,
  handleGoTo,
}: BookmarkProps) => {
  function handleClick(id: string) {
    if (transform(active) === id) return;
    setActive(id);
    handleGoTo(id);
  }

  return (
    <div className="md:pt-2  flex md:flex-col gap:1 md:gap-2  w-full h-full ">
      {sectionIds
        .filter((id) => id.endsWith("-0"))
        .map((id) => (
          <div
            key={id}
            className="
  
 md:w-24
 
 flex-1


  text-[clamp(0.7rem,1vw,1rem)]
  
  break-all
  md:break-normal

  rounded-t-lg
  md:rounded-t-none
  md:rounded-r-lg
  md:px-3 md:py-2
  bg-[#b5b8bbe7]

  shadow-[0_-4px_6px_rgba(0,0,0,0.2)]
  md:shadow-[4px_0_6px_rgba(0,0,0,0.2)]
  
 
  border
  border-black/10
  hover:translate-y-[2px]
  md:hover:translate-x-[2px]
  hover:bg-[#9d9ea0e7]
  active:bg-[#9d9ea0e7]
 
   transition-transform duration-200


  
  w-6
  md:h-auto
  h-20
  p-1
  m-1
  z-[10]
  

    md:in-[.bookmarks-back]:shadow-inner
    md:in-[.bookmarks-back]:rounded-r-none
    md:in-[.bookmarks-back]:rounded-l-lg

    in-[.bookmarks-back]:shadow-inner
    in-[.bookmarks-back]:rounded-r-none
    in-[.bookmarks-back]:rounded-t-lg


  "
          >
            <button
              // onClick={() => handleClick(id)}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(id);
              }}
              className={` flex items-center justify-center w-full h-full 
                font-semibold font-indie-flower md:py-1 md:px-2 
                whitespace-nowrap md:whitespace-normal  hover:cursor-pointer
                ${transform(active) === transform(id) ? "text-myPinkDark" : ""}`}
              aria-label={`Go to ${id.slice(0, id.indexOf("-"))} section`}
            >
              <p className=" text-[clamp(0.6rem,0.8vw,1rem)]  rotate-[-90deg] md:rotate-0">
                {((s) => s[0].toUpperCase() + s.slice(1))(
                  id.slice(0, id.indexOf("-")),
                )}
              </p>
            </button>
          </div>
        ))}
    </div>
  );
};

export default Bookmarks;
