import React, { useState } from "react";
import { motion } from "framer-motion";
interface BookmarkProps {
  handleGoTo: (id: string, source?: string) => void;
  setBookmarkedPage?: (id: string) => void;
  bookmarkedPage: string;
  setDraggingBookmark?: (value: boolean) => void;
  draggingBookmark?: boolean;
  hoverDirection?: "next" | "prev" | null;
}

const Bookmark = ({
  handleGoTo,
  setBookmarkedPage,
  bookmarkedPage,
  setDraggingBookmark,
  draggingBookmark,
  hoverDirection,
}: BookmarkProps) => {
  const crystals = Array.from({ length: 6 });

  return (
    <motion.button
      animate={{
        x: hoverDirection === "next" ? -15 : hoverDirection === "prev" ? 15 : 0,

        y: hoverDirection === "next" ? 1 : hoverDirection === "prev" ? -1 : 0,

        rotateY:
          hoverDirection === "next" ? -2 : hoverDirection === "prev" ? 2 : 0,

        rotateZ:
          hoverDirection === "next"
            ? -0.2
            : hoverDirection === "prev"
              ? 0.2
              : 0,

        z: hoverDirection ? 3 : 1,
      }}
      transition={{
        duration: 3,
        ease: [0.22, 1, 0.36, 1],
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        if (setDraggingBookmark) {
          setDraggingBookmark(true);
        }
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
        handleGoTo(bookmarkedPage, "bookmark");
      }}
      className={`bookmark touch-none cursor-grab active:cursor-grab w-[clamp(2.5rem,5vw,3rem)] h-[105%]
        
       ${bookmarkedPage ? "bookmarked-bookmark" : "no-bookmarked-bookmark"} `}
    >
      <div className=" w-full h-full flex ">
        <div className="w-full h-full flex justify-around items-center flex-col ">
          {crystals.map((_, i) => (
            <div key={i} className="crystal" />
          ))}
        </div>
      </div>
    </motion.button>
  );
};

export default Bookmark;
