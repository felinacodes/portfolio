import React, { useState } from "react";
import { useSound } from "@/contexts/SoundContext";

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
  const { play } = useSound();
  const crystals = Array.from({ length: 15 });
  const [canPlay, setCanPlay] = useState(true);
  return (
    <button
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
          setCanPlay(false);
        }
      }}
      onClick={(e) => {
        if (!bookmarkedPage && canPlay) {
          play("error");
        }
        e.stopPropagation();
        handleGoTo(bookmarkedPage, "bookmark");
        setCanPlay(true);
      }}
      className={`bookmark touch-none cursor-grab active:cursor-grab w-10 md:w-15 h-210 
        
       ${bookmarkedPage ? "bookmarked-bookmark" : "no-bookmarked-bookmark"} `}
    >
      <div className=" w-full h-full flex ">
        <div className="w-full h-full flex justify-around items-center flex-col m-[3px]">
          {crystals.map((_, i) => (
            <div key={i} className="crystal" />
          ))}
        </div>

        <div className=" w-full h-full flex justify-around items-center flex-col m-[3px]">
          {crystals.map((_, i) => (
            <div key={i} className="crystal" />
          ))}
        </div>
      </div>
    </button>
  );
};

export default Bookmark;
