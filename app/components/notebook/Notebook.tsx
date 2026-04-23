"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
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
        sheet.type === "context"
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

  // PAGE NAVIGATION LOGIC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      if (e.key === "ArrowRight") {
        next();
      }

      if (e.key === "ArrowLeft") {
        prev();
      }

      if (e.code === "Space") {
        e.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, prev]);

  const handlePageClick = (
    e: React.MouseEvent<HTMLDivElement>,
    sheet: Sheet,
  ) => {
    if (isDraggingRef.current || "ontouchstart" in window) return;

    // if (
    //   sheet.type !== "page" &&
    //   sheet.type !== "context" &&
    //   sheet.type !== "blank"
    // )
    //   return;
    if (sheet.type === "cover") {
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

    const isOdd = (numberedMap.get(sheet.id) ?? 0) % 2 === 1;
    if (isOdd) {
      next();
    } else {
      prev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    touchEnd.current = { x: touch.clientX, y: touch.clientY };

    const dx = touchEnd.current.x - touchStart.current.x;
    const dy = touchEnd.current.y - touchStart.current.y;

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    if (Math.abs(dy) > Math.abs(dx)) return;

    if (dx < 0) {
      next();
    } else {
      prev();
    }
  };

  return (
    <div
      className={`font-baskervville  flex flex-col items-center justify-center w-full h-full `}
    >
      <button onClick={() => goToIndex(bookmarkedPage)}>
        Open On Bookmark
      </button>
      <Bookmark
        visibleItems={visibleItems}
        setBookmarkedPage={setBookmarkedPage}
      />
      <h1 className="text-center">{isOpen ? "Open" : "Closed"}</h1>
      {/* <div className="w-[80vw] h-[80vh] min-h-[300px] max-h-[800px] flex"> */}
      {/* Initial Load fix for flickering and LCP*/}

      {
        <div
          className={` min-h-[350px] h-[90vh] md:h-[85vh]  max-h-[800px] grid grid-cols-1 w-[${pageWidth}vw]
         
          ${
            isOpen
              ? "md:grid-cols-2  p-2 pl-0.5 md:pl-2 shadow-[3px_6px_20px_0_rgba(0,0,0,0.35)] cover "
              : "md:grid-cols-1"
          }`}
        >
          {/* {!mounted && <p>Loading...</p>} */}
          {visibleItems.map((sheet, i) => {
            const key =
              sheet.type === "page"
                ? sheet.id
                : sheet.type === "cover"
                  ? `cover-${sheet.side}-${sheet.face}`
                  : `blank-${i}`;

            return (
              <div
                className="w-full h-full min-h-0 items-center justify-center flex"
                key={key}
              >
                <div
                  onClick={(e) => handlePageClick(e, sheet)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onMouseMove={(e) => {
                    const dx = Math.abs(e.clientX - startPosRef.current.x);
                    const dy = Math.abs(e.clientY - startPosRef.current.y);

                    if (dx > 5 || dy > 5) {
                      isDraggingRef.current = true;
                    }
                  }}
                  onMouseDown={(e) => {
                    isDraggingRef.current = false;
                    startPosRef.current = { x: e.clientX, y: e.clientY };
                  }}
                  className=" w-full h-full relative flex justify-center "
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {sheet.type === "cover" && (
                    <Cover
                      side={sheet.side}
                      face={sheet.face}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      pagesPerView={pagesPerView}
                    />
                  )}
                  {sheet.type === "context" && (
                    <Page ref={outerRef} index={numberedMap.get(sheet.id) ?? 0}>
                      {sheet.render({
                        ctx: contextMap,
                        goToIndex: sheet.id.startsWith("Contents")
                          ? goToIndex
                          : undefined,
                      })}
                    </Page>
                  )}
                  {sheet.type === "page" && (
                    <Page
                      ref={outerRef}
                      index={numberedMap.get(sheet.id) ?? 0}
                      chapterName={sheet.chapterName}
                    >
                      {sheet.render({})}
                    </Page>
                  )}

                  {sheet.type === "blank" && (
                    // <div className="w-full flex border-3 border-yellow-500">
                    <div className="w-full  h-full flex-1  flex ">
                      <Page index={numberedMap.get(sheet.id)} />
                    </div>
                  )}
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
          goToIndex={goToIndex}
          active={active}
          setActive={setActive}
        />
      </div>
    </div>
  );
};

export default Notebook;
