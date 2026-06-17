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
    <div
      className="pt-2 flex flex-col gap-2 w-full h-full cursor-default overflow-visible"
      onClick={(e) => e.stopPropagation()}
    >
      {sectionIds
        .filter((id) => id.endsWith("-0"))
        .map((id) => (
          <div
            key={id}
            className="
  w-24

  text-[clamp(0.7rem,1vw,1rem)]
  rounded-r-lg
  px-3 py-2

  bg-[#b5b8bbe7]

  shadow-[4px_0_6px_rgba(0,0,0,0.2)]

  border
  border-black/10

  hover:translate-x-[2px]
  hover:bg-[#9d9ea0e7]
  active:bg-[#9d9ea0e7]

  transition-transform duration-200

  m-1
  z-[10]

  in-[.bookmarks-back]:shadow-inner
  in-[.bookmarks-back]:rounded-r-none
  in-[.bookmarks-back]:rounded-l-lg
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
              <p className="text-[clamp(0.6rem,0.8vw,1rem)]">
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
