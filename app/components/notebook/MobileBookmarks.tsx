"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { transform } from "./Notebook";

interface MobileBookmarksProps {
  sectionIds: string[];
  active: string;
  setActive: (id: string) => void;
  handleGoTo: (id: string) => void;
}

const MobileBookmarks = ({
  sectionIds,
  active,
  setActive,
  handleGoTo,
}: MobileBookmarksProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const bookmarks = sectionIds.filter((id) => id.endsWith("-0"));

  function handleClick(id: string) {
    if (transform(active) === transform(id)) {
      setIsOpen(false);
      return;
    }

    setActive(id);
    setIsOpen(false);
    handleGoTo(id);
  }

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          md:hidden
          fixed
          top-2
          left-2
          z-[200]
          p-2
          rounded-lg
          text-myDark
          bg-myPink
          hover:bg-myPinkDark
          hover:cursor-pointer
          shadow-lg
          backdrop-blur-sm         
          
        "
        aria-label="Open navigation"
      >
        <Menu size={12} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="
            md:hidden
            fixed
            inset-0
            z-[190]
            bg-black/30
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side menu */}
      <aside
        className={`
          md:hidden
          fixed
          top-0
          left-0
          z-[200]
          h-full
          w-64
          bg-myPinkLight
          shadow-[4px_0_15px_rgba(0,0,0,0.2)]
          transition-transform
          duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col items-center justify-center p-5 gap-4">
          {/* <h2 className="font-indie-flower text-xl">Contents</h2> */}

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
            className="text-myDark p-1 self-end cursor-pointer hover:bg-myPinkDark rounded-md transition-colors"
          >
            <X size={22} />
          </button>

          <nav className="">
            <div className="flex flex-col gap-2">
              {bookmarks.map((id) => {
                const name = id.slice(0, id.indexOf("-"));

                const isActive = transform(active) === transform(id);

                return (
                  <button
                    key={id}
                    onClick={() => handleClick(id)}
                    className={`
                    text-myDark
                    text-center
                    text-lg
                    px-3
                    py-3
                    rounded-md
                    font-indie-flower
                    transition-colors
                    hover:bg-myPink
                    active:bg-myPink
                    cursor-pointer
                    ${isActive ? "text-myPinkDark bg-black/8 font-semibold" : "text-myDark"}
                  `}
                  >
                    {name[0].toUpperCase() + name.slice(1)}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default MobileBookmarks;
