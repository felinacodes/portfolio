import React from "react";
import { Sheet } from "./Notebook";

interface BookmarkProps {
  visibleItems: Sheet[];
  setBookmarkedPage: (id: string) => void;
}

const Bookmark = ({ visibleItems, setBookmarkedPage }: BookmarkProps) => {
  function handleClick(sheet: Sheet) {
    // if (sheet.type !== 'page') return
    if (sheet.type === "cover") return;
    const id = sheet.id;
    setBookmarkedPage(id);
  }

  function RemoveBookmark() {
    setBookmarkedPage("");
    localStorage.removeItem("notebook-bookmark");
  }
  return (
    <div>
      {/* <button onClick={() => handleClick(visibleItems[0])}>
        Bookmark this page
      </button>
      <button className="m-2 p-4" onClick={() => RemoveBookmark()}>
        Remove Bookmark
      </button> */}
      {/* <button
        className="absolute top-[10]
        left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-500 "
      /> */}
      <button className="  w-50 h-50 bg-red-500" />
    </div>
  );
};

export default Bookmark;
