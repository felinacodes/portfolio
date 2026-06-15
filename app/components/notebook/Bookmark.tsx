import React, { useState } from "react";
import { Sheet } from "./Notebook";

interface BookmarkProps {
  handleGoTo: (id: string) => void;
  setBookmarkedPage: (id: string) => void;
  bookmarkedPage: string;
  setDraggingBookmark: (value: boolean) => void;
  draggingBookmark: boolean;
}

const Bookmark = ({
  handleGoTo,
  setBookmarkedPage,
  bookmarkedPage,
  setDraggingBookmark,
  draggingBookmark,
}: BookmarkProps) => {
  function handleClick(sheet: Sheet) {
    if (sheet.type === "cover") return;

    setBookmarkedPage(sheet.id);
  }

  return (
    <button
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDraggingBookmark(true);
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);

        setDraggingBookmark(false);
      }}
      onPointerMove={(e) => {
        const el = document.elementFromPoint(e.clientX, e.clientY);

        if (e.currentTarget.contains(el)) {
          return;
        }

        const pageId = el
          ?.closest("[data-page-id]")
          ?.getAttribute("data-page-id");

        if (pageId) {
          setBookmarkedPage(pageId);
          return;
        }
        if (draggingBookmark && !pageId) {
          setBookmarkedPage("");
        }
      }}
      onClick={() => handleGoTo(bookmarkedPage)}
      className="touch-none cursor-grab active:cursor-grab w-10 h-300 bg-red-500 hover:bg-yellow-500 opacity-20"
    />
  );
};

export default Bookmark;
