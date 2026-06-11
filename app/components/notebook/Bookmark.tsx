import React from "react";
import { Sheet } from "./Notebook";

interface BookmarkProps {
  handleGoTo: (id: string) => void;
  setBookmarkedPage: (id: string) => void;
  bookmarkedPage: string;
}

const Bookmark = ({
  handleGoTo,
  setBookmarkedPage,
  bookmarkedPage,
}: BookmarkProps) => {
  function handleClick(sheet: Sheet) {
    // if (sheet.type !== 'page') return
    if (sheet.type === "cover") return;
    const id = sheet.id;
    setBookmarkedPage(id);
  }

  return (
    <div className="">
      <button
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData("bookmark", "true");
          setBookmarkedPage("");
        }}
        // onClick={() => handleClick(visibleItems[0])}
        onClick={() => handleGoTo(bookmarkedPage)}
        className=" cursor-grab active:cursor-grab w-10 h-300 bg-red-500 hover:bg-yellow-500 opacity-20"
      />
    </div>
  );
};

export default Bookmark;
