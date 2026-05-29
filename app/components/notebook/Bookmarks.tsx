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
    <div className="pt-2  flex flex-col gap-2 ">
      {sectionIds
        .filter((id) => id.endsWith("-0"))
        .map((id) => (
          <div
            key={id}
            className="
    bookmark
    w-24
    rounded-r-lg
    px-3 py-2
    bg-yellow-200
    shadow-md
    border
    border-black/10
    hover:translate-x-1
    transition

   
    in-[.bookmarks-back]:shadow-inner
    in-[.bookmarks-back]:rounded-r-none
    in-[.bookmarks-back]:rounded-l-lg
  "
          >
            <button
              onClick={() => handleClick(id)}
              className={
                transform(active) === transform(id) ? "text-blue-500" : ""
              }
              aria-label={`Go to ${id.slice(0, id.indexOf("-"))} section`}
            >
              {/* {id.slice(0, id.indexOf('-')).toUpperCase()} */}
              {((s) => s[0].toUpperCase() + s.slice(1))(
                id.slice(0, id.indexOf("-")),
              )}
            </button>
          </div>
        ))}
    </div>
  );
};

export default Bookmarks;
