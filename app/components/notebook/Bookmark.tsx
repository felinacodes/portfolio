import React, { useState } from "react";

interface BookmarkProps {
  handleGoTo: (id: string) => void;
  setBookmarkedPage?: (id: string) => void;
  bookmarkedPage: string;
  setDraggingBookmark?: (value: boolean) => void;
  draggingBookmark?: boolean;
}

const Bookmark = ({
  handleGoTo,
  setBookmarkedPage,
  bookmarkedPage,
  setDraggingBookmark,
  draggingBookmark,
}: BookmarkProps) => {
  return (
    <button
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        if (setDraggingBookmark) setDraggingBookmark(true);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        e.currentTarget.releasePointerCapture(e.pointerId);

        if (setDraggingBookmark) setDraggingBookmark(false);
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
          if (setBookmarkedPage) setBookmarkedPage(pageId);
          return;
        }
        if (draggingBookmark && !pageId) {
          if (setBookmarkedPage) setBookmarkedPage("");
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleGoTo(bookmarkedPage);
      }}
      className={` touch-none  cursor-grab active:cursor-grab w-10 h-300 bg-red-500
       opacity-20
       ${bookmarkedPage ? "hover:bg-green-500 active:bg-green-500" : "hover:bg-red-500 active:bg-red-500"} `}
    />
  );
};

export default Bookmark;
