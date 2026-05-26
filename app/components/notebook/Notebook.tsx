"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import Page from "./Page";
import Cover from "./Cover";
import useNotebookPagination from "../useNotebookPagination";
import { aboutBlocks } from "./pages/About";
import { IntroBlocks } from "./pages/Intro";
import { EducationBlocks } from "./pages/Education";
import { SkillsBlocks } from "./pages/Skills";
import { ProjectsBlocks } from "./pages/Projects";
import { ContactBlocks } from "./pages/Contact";
import { LeaveSomethingBlocks } from "./pages/LeaveSomething";
import { TableOfContentsBlocks } from "./pages/TableOfContents";
import Bookmarks from "./Bookmarks";
import MeasureBlocks from "./MeasureBlocks";
import Bookmark from "./Bookmark";

// import useMeasure from '../useMeasure'

type NotebookProps = {
  initialPage?: string;
};

export type RenderContext = {
  chapter?: number;
  ctx?: Map<string, number>;
  goToIndex?: (id: string) => void;
};

export type Sheet =
  | {
      type: "cover";
      side: "front" | "back";
      face: "inside" | "outside";
      id: string;
    }
  | {
      type: "page";
      id: string;
      render: (args?: RenderContext) => React.ReactNode;
      chapterName: string;
    }
  | {
      type: "context";
      id: string;
      render: (args?: RenderContext) => React.ReactNode;
    }
  | {
      type: "blank";
      id: string;
      render: () => React.ReactNode;
    };

export type Section = {
  id: string;
  chapterName: string;
  render: (args?: RenderContext) => React.ReactNode;
};

type SectionConfig = {
  key: string;
  blocks: (args?: RenderContext) => React.ComponentType<RenderContext>[];
};

const SECTION_CONFIG: SectionConfig[] = [
  { key: "Contents", blocks: TableOfContentsBlocks },
  { key: "Intro", blocks: IntroBlocks },
  { key: "About", blocks: aboutBlocks },
  { key: "Education", blocks: EducationBlocks },
  { key: "Skills", blocks: SkillsBlocks },
  { key: "Projects", blocks: ProjectsBlocks },
  { key: "Contact", blocks: ContactBlocks },
  { key: "Leave Something", blocks: LeaveSomethingBlocks },
];

const sections: Section[] = SECTION_CONFIG.flatMap(
  ({ key, blocks }, chapterIndex) => {
    const resolved = blocks({ chapter: chapterIndex });

    return resolved.map((Component, index) => ({
      id: `${key}-${index}`,
      chapterName: key,

      render: (args?: RenderContext) => {
        const Comp = Component;
        return <Comp {...args} />;
      },
    }));
  },
);

const numberOfBlanks = sections.length % 2 === 0 ? 2 : 3;

// export const transform = (s: string) => {
//   if (!s) return
//   return s.slice(0, s.indexOf('-'))
// }

export const transform = (s: string): string => {
  return s.split("-")[0];
};

const sheet: Sheet[] = [
  { type: "cover", side: "front", face: "outside", id: "cover-front-outside" },
  { type: "cover", side: "front", face: "inside", id: "cover-front-inside" },

  ...sections.map((s) => {
    if (s.id.startsWith("Contents")) {
      return {
        type: "context" as const,
        id: s.id,

        render: s.render,
      };
    } else {
      return {
        type: "page" as const,
        id: s.id,
        chapterName: s.chapterName,
        render: s.render,
      };
    }
  }),
  ...Array.from({ length: numberOfBlanks }, (_, i) => ({
    type: "blank" as const,
    id: `blank-${i}`,
    render: () => null,
  })),
  { type: "cover", side: "back", face: "inside", id: "cover-back-inside" },
  { type: "cover", side: "back", face: "outside", id: "cover-back-outside" },
];

const Notebook: React.FC<NotebookProps> = ({ initialPage }) => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);
  const [measuredHeights, setMeasuredHeights] = useState<
    Record<string, number[]>
  >({});
  const [isOpen, setIsOpen] = useState(false);
  const [pagesPerView, setPagesPerView] = useState(1);

  const [isTwoPages, setIsTwoPages] = useState(false);
  // Fixes initial flickering on 2 pages view but cause hydration error
  // const [isTwoPages, setIsTwoPages] = useState(() =>
  //   window.innerWidth >= 768 ? true : false,
  // )
  const [bookmarkedPage, setBookmarkedPage] = useState("");
  const [active, setActive] = React.useState<string>("");
  const [mounted, setIsmounted] = useState(false);
  const [flipping, setFlipping] = useState<null | {
    direction: "next" | "prev";
    id: string;
  }>(null);
  const [bookmarkNav, setBookmarkNav] = useState(false);

  const flippingRef = useRef<null | { direction: "next" | "prev"; id: string }>(
    null,
  );
  const pendingNavRef = useRef<string | null>(null);
  const lastPressRef = useRef(0);

  const [toggleAnimation, setToggleAnimation] = useState(true);
  const [correctAnimation, setCorrectAnimation] = useState("");

  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const SWIPE_THRESHOLD = 50;

  // const correctSheet = isTwoPages ? TwoPagesheets : OnePagesheets
  const correctSheet = isTwoPages
    ? sheet
    : sheet.filter((s) => !(s.type === "cover" && s.face === "inside"));

  const getNextActive = (visibleItems: Sheet[], currentActive: string) => {
    const sectionVisible = visibleItems.filter(
      (item) =>
        (item.type === "page" || item.type === "context") &&
        !item.id.startsWith("blank") &&
        !item.id.includes("cover"),
    );

    // if current active is visible among sections, keep it
    if (
      sectionVisible.some(
        (item) => transform(item.id) === transform(currentActive),
      )
    ) {
      return currentActive;
    }

    // prefer left-most section page, or first one that ends with -0
    const preferred =
      sectionVisible.find((item) => item.id.endsWith("-0")) ||
      sectionVisible[0];

    return preferred?.id ?? currentActive;
  };

  useEffect(() => {
    setIsmounted(true);
  }, []);

  // HANDLE IF THE NOTEBOOK IS TWO OR ONE PAGE
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const update = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // setPagesPerView(window.innerWidth >= 768 ? 2 : 1)
        setIsTwoPages(window.innerWidth >= 768 ? true : false);
      }, 100);
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", update);
    };
  }, []); // removing this makes index go to bookmark page everytime pages view changes

  const { visibleItems, prev, next, goToIndex } = useNotebookPagination(
    // isTwoPages ? TwoPagesheets : OnePagesheets,
    correctSheet,
    pagesPerView,
    isOpen,
    setIsOpen,
    isTwoPages,
    initialPage,
  );

  // HANDLE HOW MANY PAGES TO SHOW
  useEffect(() => {
    const pages = isTwoPages && isOpen ? 2 : 1;
    setPagesPerView(pages);
    // }, [pagesPerView, isTwoPages, isOpen, visibleItems])
  }, [pagesPerView, isTwoPages, isOpen, visibleItems]);

  // OPEN - CLOSE LOGIC
  useEffect(() => {
    if (visibleItems.some((i) => i.type === "cover" && i.face === "outside")) {
      {
        setIsOpen(false);
        return;
      }
    }
    setIsOpen(true);
  }, [visibleItems]);

  // Handle URL's
  useEffect(() => {
    let newUrl;
    if (!visibleItems.length) return;

    const firstPage = visibleItems.find(
      (item) => item.type === "page" || item.type === "context",
    );

    if (!firstPage) {
      newUrl = `/`;
    } else {
      newUrl = `/notebook/${firstPage.id}`;
    }

    if (window.location.pathname !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [visibleItems]);

  // Active bookmark logic
  useEffect(() => {
    // ignore pages that don't have a bookmark
    const sectionPages = visibleItems.filter(
      (item) => item.type === "page" || item.type === "context",
    );

    if (!sectionPages.length) {
      setActive("");
      return;
    }

    // Prefer chapter start page (-0)
    const chapterStart = sectionPages.find((item) => item.id.endsWith("-0"));

    if (chapterStart) {
      setActive(transform(chapterStart.id));
      return;
    }

    // Otherwise use left page
    const leftPage = sectionPages[0];
    setActive(transform(leftPage.id));
  }, [visibleItems]);

  // Custom Boomark logic
  useEffect(() => {
    const saved = localStorage.getItem("notebook-bookmark");
    if (saved) {
      setBookmarkedPage(saved);
    }
  }, []);

  useEffect(() => {
    if (!bookmarkedPage) return;
    localStorage.setItem("notebook-bookmark", bookmarkedPage);
  }, [bookmarkedPage]);

  // HANDLE NUMBERING OF PAGES
  const numberedMap = useMemo(() => {
    let count = 0;
    const map = new Map<string, number>();

    correctSheet.forEach((sheet) => {
      if (
        sheet.type === "page" ||
        sheet.type === "blank" ||
        sheet.type === "context" ||
        sheet.type === "cover"
      ) {
        count++;
        map.set(sheet.id, count);
      }
    });
    return map;
  }, [correctSheet]);

  const contextMap = useMemo(() => {
    const zeroIndexMap = new Map<string, number>();

    numberedMap.forEach((value, key) => {
      if (key.endsWith("-0") && !key.startsWith("blank")) {
        // const transformedKey = transform(key)
        zeroIndexMap.set(key, value);
      }
    });
    return zeroIndexMap;
  }, [numberedMap]);

  // const pageMultiplier = isTwoPages && !isOpen ? 0.5 : 1
  // const pageWidth = isTwoPages && !isOpen ? 40 : 80
  const pageWidth = 80;

  //Fixes Flickering bad bad SEO
  // if (!mounted) {
  //   return <div>...Loading...</div>
  // }

  const finishFlip = useCallback(() => {
    if (!flippingRef.current && !pendingNavRef.current) return;

    // if we have a pending navigation
    if (pendingNavRef.current) {
      const target = pendingNavRef.current;
      setBookmarkNav(false);
      pendingNavRef.current = null;

      setFlipping(null);
      flippingRef.current = null;

      goToIndex(target);
      return;
    }

    // fallback: normal next/prev
    const direction = flippingRef.current?.direction;

    flippingRef.current = null;
    setFlipping(null);

    if (direction === "next") {
      next();
    } else {
      prev();
    }
  }, [next, prev, goToIndex]);

  const handleNext = useCallback(
    (id: string) => {
      if (!toggleAnimation) {
        next();
      }

      if (flippingRef.current) {
        flippingRef.current = null;
      }
      setFlipping({ direction: "next", id });
      flippingRef.current = { direction: "next", id };
    },
    [toggleAnimation, next],
  );

  const handlePrev = useCallback(
    (id: string) => {
      if (!toggleAnimation) {
        prev();
      }

      if (flippingRef.current) {
        flippingRef.current = null;
      }
      setFlipping({ direction: "prev", id });
      flippingRef.current = { direction: "prev", id };
    },
    [toggleAnimation, prev],
  );

  const handleCoverNavigation = (sheet: Extract<Sheet, { type: "cover" }>) => {
    // no animation for covers
    setFlipping(null);
    flippingRef.current = null;

    if (sheet.face === "outside" && sheet.side === "front") {
      next();
      return;
    }

    if (sheet.face === "outside" && sheet.side === "back") {
      prev();
      return;
    }

    if (sheet.face === "inside" && sheet.side === "front") {
      prev();
      return;
    }

    if (sheet.face === "inside" && sheet.side === "back") {
      next();
      return;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();

      if (now - lastPressRef.current < 200) return;
      lastPressRef.current = now;

      if (e.key === "ArrowRight" || e.code === "Space") {
        e.preventDefault();

        const rightPage = visibleItems[visibleItems.length - 1];
        if (rightPage) {
          if (rightPage.type === "cover") {
            if (rightPage.face === "outside" && rightPage.side === "back")
              return;
            handleCoverNavigation(rightPage);
            return;
          }
          handleNext(rightPage.id);
        }
      }

      if (e.key === "ArrowLeft") {
        const leftPage = visibleItems[0];

        if (leftPage) {
          if (leftPage.type === "cover") {
            if (leftPage.face === "outside" && leftPage.side === "front")
              return;
            handleCoverNavigation(leftPage);
            return;
          }

          setFlipping({ direction: "prev", id: leftPage.id });
          flippingRef.current = { direction: "prev", id: leftPage.id };

          handlePrev(leftPage.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibleItems, next, prev, handleNext, handlePrev]);

  const handlePageClick = (
    e: React.MouseEvent<HTMLDivElement>,
    sheet: Sheet,
  ) => {
    if (isDraggingRef.current || "ontouchstart" in window) return;

    if (sheet.type === "cover") {
      handleCoverNavigation(sheet);
      return;
    }

    const target = e.target as HTMLElement;

    if (
      target.closest(
        "button, a, input, textarea, select, label, img, [role='button'], [data-no-flip]",
      )
    ) {
      return;
    }

    // ignore if text is selected
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }

    // one page mode within a no-phone device
    if (!isTwoPages) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      if (clickX > rect.width / 2) {
        handleNext(sheet.id);
      } else {
        handlePrev(sheet.id);
      }
      return;
    }

    // only for 2 pages view mode
    const isOdd = (numberedMap.get(sheet.id) ?? 0) % 2 === 1;
    if (isOdd) {
      handleNext(sheet.id);
    } else {
      handlePrev(sheet.id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd =
    (sheet: Sheet) => (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.changedTouches[0];
      touchEnd.current = { x: touch.clientX, y: touch.clientY };

      const dx = touchEnd.current.x - touchStart.current.x;
      const dy = touchEnd.current.y - touchStart.current.y;

      if (Math.abs(dx) < SWIPE_THRESHOLD) return;

      if (Math.abs(dy) > Math.abs(dx)) return;

      if (dx < 0) {
        if (
          sheet.type === "cover" &&
          sheet.face === "outside" &&
          sheet.side === "back"
        )
          return;
        if (sheet.type === "cover") {
          handleCoverNavigation(sheet);
          return;
        }

        handleNext(sheet.id);
      } else {
        if (
          sheet.type === "cover" &&
          sheet.face === "outside" &&
          sheet.side === "front"
        )
          return;
        handlePrev(sheet.id);
      }
    };

  useEffect(() => {
    if (!flipping || !toggleAnimation) {
      setCorrectAnimation("");
    } else {
      setCorrectAnimation(
        !isOpen
          ? flipping.direction === "next"
            ? "coverPrev"
            : "coverNext"
          : flipping.direction === "next"
            ? "flipNext"
            : "flipPrev",
      );
    }
  }, [flipping, toggleAnimation, isOpen]);

  const handleGoTo = (id: string) => {
    if (!toggleAnimation) {
      goToIndex(id);
      return;
    }

    if (!visibleItems.length) {
      goToIndex(id);
      return;
    }

    const leftPage = visibleItems[0];
    const rightPage = visibleItems[visibleItems.length - 1];

    if (leftPage.id === id || rightPage.id === id) {
      return;
    }

    const currentIndex = numberedMap.get(leftPage.id) ?? 0;
    const targetIndex = numberedMap.get(id) ?? 0;

    const isNext = targetIndex > currentIndex;

    let animatingId = leftPage.id;
    let direction: "next" | "prev" = "prev";

    if (isTwoPages) {
      if (isNext) {
        animatingId = rightPage.id;
        direction = "next";
      } else {
        animatingId = leftPage.id;
        direction = "prev";
      }
    } else {
      animatingId = leftPage.id;
      direction = isNext ? "next" : "prev";
    }

    // store where we actually want to go

    pendingNavRef.current = id;
    setBookmarkNav(true);

    setFlipping({ direction, id: animatingId });
    // setCorrectAnimation(direction === "next" ? "flipNext" : "flipPrev");
    setCorrectAnimation(
      !isOpen
        ? direction === "next"
          ? "coverPrev"
          : "coverNext"
        : direction === "next"
          ? "flipNext"
          : "flipPrev",
    );
  };

  const getSpreadTarget = useCallback(
    (id: string) => {
      const targetIndex = correctSheet.findIndex((s) => s.id === id);

      if (targetIndex === -1) return null;

      const targetSheet = correctSheet[targetIndex];
      const pageNumber = numberedMap.get(targetSheet.id) ?? 0;

      const isEven = pageNumber % 2 === 0;

      return {
        targetIndex,
        targetSheet,
        pageNumber,
        isEven,
        leftPageIndex: isEven ? targetIndex : targetIndex - 1,
        rightPageIndex: isEven ? targetIndex + 1 : targetIndex,
      };
    },
    [correctSheet, numberedMap],
  );

  const prevSheet = useMemo(() => {
    if (!visibleItems.length) return null;

    // override ONLY during bookmark navigation
    if (bookmarkNav && pendingNavRef.current) {
      const spread = getSpreadTarget(pendingNavRef.current);

      if (!spread) return null;

      // fix for 1 page view
      if (!isTwoPages) return correctSheet[spread.targetIndex] ?? null;

      return correctSheet[spread.leftPageIndex] ?? null;
    }

    const firstId = visibleItems[0].id;
    const index = correctSheet.findIndex((s) => s.id === firstId);

    return index > 0 ? correctSheet[index - pagesPerView] : null;
  }, [
    visibleItems,
    correctSheet,
    pagesPerView,
    bookmarkNav,
    getSpreadTarget,
    isTwoPages,
  ]);

  const nextSheet = useMemo(() => {
    if (!visibleItems.length) return null;

    // override ONLY during bookmark navigation
    if (bookmarkNav && pendingNavRef.current) {
      const spread = getSpreadTarget(pendingNavRef.current);

      if (!spread) return null;

      // fix for 1 page view
      if (!isTwoPages) return correctSheet[spread.targetIndex] ?? null;

      return correctSheet[spread.rightPageIndex] ?? null;
    }

    const lastId = visibleItems[visibleItems.length - 1].id;
    const index = correctSheet.findIndex((s) => s.id === lastId);

    return index < correctSheet.length - pagesPerView
      ? correctSheet[index + pagesPerView]
      : null;
  }, [visibleItems, correctSheet, pagesPerView, bookmarkNav, getSpreadTarget]);

  const renderSheet = (sheet: Sheet) => {
    if (sheet.type === "cover") {
      return (
        <div className="cover-out h-full w-full  flex justify-center items-center">
          <Cover
            side={sheet.side}
            face={sheet.face}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            pagesPerView={pagesPerView}
            animationClass={sheet.id === flipping?.id ? correctAnimation : ""}
          />
        </div>
      );
    }

    if (sheet.type === "context") {
      return (
        <Page ref={outerRef} index={numberedMap.get(sheet.id) ?? 0}>
          {sheet.render({
            ctx: contextMap,
            goToIndex: sheet.id.startsWith("Contents") ? handleGoTo : undefined,
          })}
        </Page>
      );
    }

    if (sheet.type === "page") {
      return (
        <Page
          ref={outerRef}
          index={numberedMap.get(sheet.id) ?? 0}
          chapterName={sheet.chapterName}
        >
          {sheet.render({})}
        </Page>
      );
    }

    if (sheet.type === "blank") {
      return <Page index={numberedMap.get(sheet.id)} />;
    }

    return null;
  };

  return (
    <div
      className={`font-baskervville  flex flex-col items-center justify-center w-full h-full `}
    >
      {/* <button onClick={() => goToIndex(bookmarkedPage)}> */}
      <button onClick={() => handleGoTo(bookmarkedPage)}>
        Open On Bookmark
      </button>
      <button onClick={() => setToggleAnimation(!toggleAnimation)}>
        {toggleAnimation ? "Disable Animation" : "Enable Animation"}
      </button>
      <Bookmark
        visibleItems={visibleItems}
        setBookmarkedPage={setBookmarkedPage}
      />
      <div className="testwrapper">
        <h1 className="text-center testanime">{isOpen ? "Open" : "Closed"}</h1>
        <h1 className="text-center testanime">{flipping?.direction}</h1>
        <h1 className="text-center testanime">Prev: {prevSheet?.id}</h1>
        <h1 className="text-center testanime">Next: {nextSheet?.id}</h1>
      </div>

      {/* <div className="w-[80vw] h-[80vh] min-h-[300px] max-h-[800px] flex"> */}
      {/* Initial Load fix for flickering and LCP*/}

      {
        <div
          className={`book-scene min-h-[350px] h-[90vh] md:h-[85vh]  max-h-[800px] grid grid-cols-1 w-[${pageWidth}vw] 
          
         
          ${
            isOpen
              ? "md:grid-cols-2  p-2 pl-0 md:pl-2 shadow-[3px_6px_20px_0_rgba(0,0,0,0.35)] cover-opened "
              : `md:grid-cols-1`
          }`}
        >
          {visibleItems.map((sheet, i) => {
            const isLeftPage = i === 0;
            const isRightPage = i === visibleItems.length - 1;

            const key =
              sheet.type === "page"
                ? sheet.id
                : sheet.type === "cover"
                  ? `cover-${sheet.side}-${sheet.face}`
                  : `blank-${i}`;

            return (
              <div
                className="relative w-full h-full min-h-0 items-center justify-center flex"
                key={key}
              >
                {/* Leave the isLeftPage and isRightPage logic for 2 pages
                so the hover animation works as intented.*/}
                {isOpen && isLeftPage && prevSheet && isTwoPages && (
                  <div className="absolute inset-0 -z-10">
                    {renderSheet(prevSheet)}
                  </div>
                )}

                {isOpen && isRightPage && nextSheet && isTwoPages && (
                  <div className="absolute inset-0 -z-10">
                    {renderSheet(nextSheet)}
                  </div>
                )}

                {/* Fix for 1 pages view.*/}
                {isOpen &&
                  flipping?.direction === "prev" &&
                  prevSheet &&
                  !isTwoPages && (
                    <div className="absolute inset-0 -z-10">
                      {renderSheet(prevSheet)}
                    </div>
                  )}

                {/* flippingRef.current.direction === next  seem to be the problem.*/}
                {isOpen &&
                  flipping?.direction === "next" &&
                  nextSheet &&
                  !isTwoPages && (
                    <div className="absolute inset-0 -z-10">
                      {renderSheet(nextSheet)}
                    </div>
                  )}

                {/* Show first inside page while opening cover 
                1 and 2 pages view
                */}
                {!isOpen && flipping?.direction === "next" && nextSheet && (
                  <div className="absolute inset-0 z-0 flex justify-center">
                    <div className="w-full md:w-1/2 h-full">
                      {renderSheet(nextSheet)}
                    </div>
                  </div>
                )}

                <div
                  onClick={(e) => handlePageClick(e, sheet)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd(sheet)}
                  onMouseMove={(e) => {
                    const dx = Math.abs(e.clientX - startPosRef.current.x);
                    const dy = Math.abs(e.clientY - startPosRef.current.y);
                    if (dx > 5 || dy > 5) isDraggingRef.current = true;
                  }}
                  onMouseDown={(e) => {
                    isDraggingRef.current = false;
                    startPosRef.current = { x: e.clientX, y: e.clientY };
                  }}
                  onAnimationEnd={finishFlip}
                  className={`page-flip w-full h-full relative flex justify-center ${
                    sheet.id === flipping?.id ? correctAnimation : ""
                  }`}
                >
                  {renderSheet(sheet)}
                </div>
              </div>
            );
          })}
        </div>
      }

      {/* <div className="mt-4 flex gap-4 border-2 border-blue-200">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div> */}
      <div>
        <Bookmarks
          sectionIds={sections.map((s) => s.id)}
          active={active}
          setActive={setActive}
          handleGoTo={handleGoTo}
        />
      </div>
    </div>
  );
};

export default Notebook;
