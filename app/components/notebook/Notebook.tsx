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
import { ScrapbookBlocks } from "./pages/Scrapbook";
import { TableOfContentsBlocks } from "./pages/TableOfContents";
import Bookmarks from "./Bookmarks";
import MeasureBlocks from "./MeasureBlocks";
import Bookmark from "./Bookmark";
import Options from "../Options";
import { Settings } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useSound } from "@/contexts/SoundContext";
import { SoundName } from "@/lib/sounds";
// import { fakeFetchMessages, type LeaveMessage } from "@/lib/fakeFetchMessages";
import Modal from "../LeaveModal/Modal";
import { fetchMessages, type LeaveMessage } from "@/lib/fetchMessages";
// import useMeasure from '../useMeasure'
import { useDrawing } from "@/contexts/DrawingContext";

type NotebookProps = {
  initialPage?: string;
};

export type RenderContext = {
  chapter?: number;
  ctx?: Map<string, number>;
  goToIndex?: (id: string) => void;
  messages?: LeaveMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<LeaveMessage[]>>;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleJumpToLastScrapbook?: () => void;
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
      type: "Scrapbook";
      id: string;
      render: (args?: RenderContext) => React.ReactNode;
      chapterName: string;
      messages?: LeaveMessage[];
      setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
  messages?: LeaveMessage[];
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
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
  { key: "Scrapbook", blocks: ScrapbookBlocks },
];

export const transform = (s: string): string => {
  return s.split("-")[0];
};

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

  const [correctAnimation, setCorrectAnimation] = useState("");

  const [draggingBookmark, setDraggingBookmark] = useState(false);
  const [hoverDirection, setHoverDirection] = useState<"next" | "prev" | null>(
    null,
  );

  const [optionsOpen, setOptionsOpen] = useState(false);

  const [toggleAnimation, setToggleAnimation] = useState(true);

  const [messages, setMessages] = useState<LeaveMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const { theme, setTheme } = useTheme();
  const { drawingEnabled } = useDrawing();

  const SWIPE_THRESHOLD = 50;

  const flipProgress = useMotionValue(0);

  const rotateY = useTransform(flipProgress, [0, 0.5, 1], [0, -90, -180]);

  const translateZ = useTransform(flipProgress, [0, 0.5, 1], [0, 150, 0]);
  // const correctSheet = isTwoPages ? TwoPagesheets : OnePagesheets

  const sections = useMemo(() => {
    return SECTION_CONFIG.flatMap(({ key, blocks }, chapterIndex) => {
      const context =
        key === "Scrapbook"
          ? {
              chapter: chapterIndex,
              messages,
              setMessages,
              setIsModalOpen,
            }
          : {
              chapter: chapterIndex,
            };

      const resolved = blocks(context);

      return resolved.map((Component, index) => ({
        id: `${key}-${index}`,
        chapterName: key,
        render: (args?: RenderContext) => {
          const Comp = Component;
          return <Comp {...args} />;
        },
      }));
    });
  }, [messages]);

  const numberOfBlanks = sections.length % 2 === 0 ? 2 : 1;
  // const numberOfBlanks = 1;

  const sheet: Sheet[] = useMemo(
    () => [
      {
        type: "cover",
        side: "front",
        face: "outside",
        id: "cover-front-outside",
      },

      {
        type: "cover",
        side: "front",
        face: "inside",
        id: "cover-front-inside",
      },

      ...sections.map((s) => {
        if (s.id.startsWith("Contents")) {
          return {
            type: "context" as const,
            id: s.id,
            render: s.render,
          };
        }

        if (s.id.startsWith("Scrapbook")) {
          return {
            type: "Scrapbook" as const,
            id: s.id,
            chapterName: s.chapterName,
            render: s.render,
          };
        }

        return {
          type: "page" as const,
          id: s.id,
          chapterName: s.chapterName,
          render: s.render,
        };
      }),

      ...Array.from({ length: numberOfBlanks }, (_, i) => ({
        type: "blank" as const,
        id: `blank-${i}`,
        render: () => null,
      })),

      {
        type: "cover",
        side: "back",
        face: "inside",
        id: "cover-back-inside",
      },
      {
        type: "cover",
        side: "back",
        face: "outside",
        id: "cover-back-outside",
      },
    ],
    [sections, numberOfBlanks],
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 850px)");

    const update = () => setIsDesktop(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  const correctSheet = useMemo(() => {
    return isTwoPages
      ? sheet
      : sheet.filter((s) => !(s.type === "cover" && s.face === "inside"));
  }, [sheet, isTwoPages]);

  const firstPageId = useMemo(() => {
    const first = [...correctSheet].find((s) => s.type !== "cover");

    return first?.id;
  }, [correctSheet]);

  const lastPageId = useMemo(() => {
    const last = [...correctSheet].reverse().find((s) => s.type !== "cover");

    return last?.id;
  }, [correctSheet]);

  useEffect(() => {
    setIsmounted(true);
  }, []);

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await fetchMessages();
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      } finally {
        setMessagesLoaded(true);
      }
    }

    loadMessages();
  }, []);

  // HANDLE IF THE NOTEBOOK IS TWO OR ONE PAGE
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const update = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // setPagesPerView(window.innerWidth >= 768 ? 2 : 1)
        setIsTwoPages(window.innerWidth >= 850 ? true : false);
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

  const { soundEnabled, toggleSound, play } = useSound();

  // HANDLE HOW MANY PAGES TO SHOW
  useEffect(() => {
    setPagesPerView(isTwoPages && isOpen ? 2 : 1);
  }, [isTwoPages, isOpen]);

  // OPEN - CLOSE LOGIC
  // useEffect(() => {
  //   console.log("OPEN - CLOSE LOGIC useEffect called");
  //   setCalled("called");
  //   // if (pagesPerView === 1) setIsOpen(false);

  //   if (visibleItems.some((i) => i.type === "cover" && i.face === "outside")) {
  //     {
  //       setIsOpen(false);
  //       return;
  //     }
  //   }
  //   setIsOpen(true);
  //   setCalled("finished");
  //   console.log("OPEN - CLOSE LOGIC useEffect finished");
  // }, [visibleItems]);

  // useEffect(() => {
  //   console.log("OPEN - CLOSE LOGIC useEffect called");
  //   const shouldBeOpen = !visibleItems.some(
  //     (i) => i.type === "cover" && i.face === "outside",
  //   );

  //   setIsOpen((prev) => (prev === shouldBeOpen ? prev : shouldBeOpen));
  // }, [visibleItems]);

  useLayoutEffect(() => {
    const shouldBeOpen = !visibleItems.some(
      (i) => i.type === "cover" && i.face === "outside",
    );

    setIsOpen((prev) => (prev === shouldBeOpen ? prev : shouldBeOpen));
  }, [visibleItems]);
  // Handle URL's
  useEffect(() => {
    let newUrl;
    if (!visibleItems.length) return;

    const firstPage = visibleItems.find(
      (item) =>
        item.type === "page" ||
        item.type === "context" ||
        item.type === "Scrapbook",
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
      (item) =>
        item.type === "page" ||
        item.type === "context" ||
        item.type === "Scrapbook",
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
    if (!bookmarkedPage) {
      localStorage.removeItem("notebook-bookmark");
      return;
    }
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
        sheet.type === "Scrapbook" ||
        sheet.type === "cover"
      ) {
        count++;
        map.set(sheet.id, count);
      }
    });
    return map;
  }, [correctSheet]);

  // Do not include covers -> Removing it from the numberedMap breaks functionality
  // Having Page handle it, flickers wrong.
  const pageIndexMap = useMemo(() => {
    let count = 0;
    const map = new Map<string, number>();

    correctSheet.forEach((sheet) => {
      if (
        sheet.type === "page" ||
        sheet.type === "blank" ||
        sheet.type === "context" ||
        sheet.type === "Scrapbook"
      ) {
        count++;
        map.set(sheet.id, count);
      }
    });
    return map;
  }, [correctSheet]);

  const contextMap = useMemo(() => {
    const zeroIndexMap = new Map<string, number>();

    pageIndexMap.forEach((value, key) => {
      if (key.endsWith("-0") && !key.startsWith("blank")) {
        // const transformedKey = transform(key)
        zeroIndexMap.set(key, value);
      }
    });
    return zeroIndexMap;
  }, [pageIndexMap]);

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

  const handleSound = useCallback(
    (sound: SoundName) => {
      play(sound);
    },
    [play],
  );

  const handleNext = useCallback(
    (id: string) => {
      const skipAnimation = !isTwoPages && id === lastPageId;

      if (!id.startsWith("cover") && !skipAnimation) {
        handleSound("flip");
      }

      if (skipAnimation) {
        handleSound("close");
      }

      if (!toggleAnimation || skipAnimation) {
        next();
        return;
      }

      if (flippingRef.current) {
        flippingRef.current = null;
      }
      setFlipping({ direction: "next", id });
      flippingRef.current = { direction: "next", id };
    },
    [toggleAnimation, next, handleSound, isTwoPages, lastPageId],
  );

  const handlePrev = useCallback(
    (id: string) => {
      const skipAnimation = !isTwoPages && id === firstPageId;

      if (!id.startsWith("cover") && !skipAnimation) {
        handleSound("flip");
      }

      if (skipAnimation) {
        handleSound("close");
      }

      if (!toggleAnimation || skipAnimation) {
        prev();
        return;
      }

      if (flippingRef.current) {
        flippingRef.current = null;
      }

      setFlipping({ direction: "prev", id });
      flippingRef.current = { direction: "prev", id };
    },
    [toggleAnimation, prev, handleSound, isTwoPages, firstPageId],
  );

  const handleCoverNavigation = useCallback(
    (sheet: Extract<Sheet, { type: "cover" }>) => {
      // no animation for covers
      // setFlipping(null);
      // flippingRef.current = null;

      if (sheet.face === "outside" && sheet.side === "front") {
        handleNext(sheet.id);
        return;
      }

      if (sheet.face === "outside" && sheet.side === "back") {
        handlePrev(sheet.id);
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
    },
    [handleNext, handlePrev, prev, next],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).matches(
          "input, textarea, [contenteditable='true']",
        )
      ) {
        return;
      }

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
  }, [visibleItems, next, prev, handleNext, handlePrev, handleCoverNavigation]);

  const handlePageClick = (
    e: React.MouseEvent<HTMLDivElement>,
    sheet: Sheet,
  ) => {
    const target = e.target as HTMLElement;
    const isValidClick =
      target.closest("[data-page-id]") || target.closest("[data-cover-id]");

    if (isDraggingRef.current || "ontouchstart" in window || !isValidClick)
      return;

    if (sheet.type === "cover") {
      // if (!toggleAnimation && active) return;
      handleCoverNavigation(sheet);
      return;
    }

    if (
      target.closest(
        "button, a, input, textarea, select, label, [role='button'], [data-no-flip]",
      )
    ) {
      return;
    }

    // ignore if text is selected
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // fix getting stuck in drawing mode if text was already selected.
      if (!drawingEnabled) return;
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

      if (drawingEnabled) return;

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
  }, [flipping, toggleAnimation, isOpen, pagesPerView, isTwoPages]);

  const handleGoTo = useCallback(
    (id: string, source?: string) => {
      if (!id) return;

      const leftPage = visibleItems[0];
      const rightPage = visibleItems[visibleItems.length - 1];

      if (leftPage.id === id || rightPage.id === id) {
        return;
      }

      handleSound("flip");

      if (!toggleAnimation) {
        goToIndex(id);
        return;
      }

      if (!visibleItems.length) {
        goToIndex(id);
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

      pendingNavRef.current = id;
      setBookmarkNav(true);

      setFlipping({ direction, id: animatingId });

      setCorrectAnimation(
        !isOpen
          ? direction === "next"
            ? "coverPrev"
            : "coverNext"
          : direction === "next"
            ? "flipNext"
            : "flipPrev",
      );
    },
    [
      visibleItems,
      handleSound,
      toggleAnimation,
      goToIndex,
      numberedMap,
      isTwoPages,
      isOpen,
    ],
  );

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

    return index > 0
      ? isTwoPages && !isOpen // fix for 2 pages view and opening cover without bookmarks
        ? correctSheet[index - 2]
        : correctSheet[index - pagesPerView]
      : null;
  }, [
    visibleItems,
    correctSheet,
    pagesPerView,
    bookmarkNav,
    getSpreadTarget,
    isTwoPages,
    isOpen,
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
      ? isTwoPages && !isOpen // fix for 2 pages view and opening cover without bookmarks
        ? correctSheet[index + 2]
        : correctSheet[index + pagesPerView]
      : null;
  }, [
    visibleItems,
    correctSheet,
    pagesPerView,
    bookmarkNav,
    getSpreadTarget,
    isTwoPages,
    isOpen,
  ]);

  const isBookmarkVisible = visibleItems.some(
    (item) => item.id === bookmarkedPage,
  );

  const bookmarkPosition = useMemo(() => {
    if (!bookmarkedPage || !visibleItems.length || isBookmarkVisible) {
      return;
    }

    const leftPage = visibleItems[0];

    const currentIndex = numberedMap.get(leftPage.id) ?? 0;
    const bookmarkIndex = numberedMap.get(bookmarkedPage) ?? 0;

    // bookmark is behind
    if (bookmarkIndex < currentIndex) {
      return "previous";
    }

    // bookmark is ahead
    return "next";
  }, [bookmarkedPage, visibleItems, numberedMap, isBookmarkVisible]);

  const currentSheet = visibleItems[0];

  const isBackCover =
    currentSheet?.type === "cover" &&
    currentSheet.side === "back" &&
    currentSheet.face === "outside";

  const lastLScrapbookPageId = useMemo(() => {
    const ScrapbookPages = sections.filter(
      (section) => section.chapterName === "Scrapbook",
    );
    return ScrapbookPages.at(-1)?.id;
  }, [sections]);

  const handleJumpToLastScrapbook = useCallback(() => {
    if (!lastLScrapbookPageId) return;

    handleGoTo(lastLScrapbookPageId);
  }, [lastLScrapbookPageId, handleGoTo]);
  const renderSheet = (sheet: Sheet) => {
    if (sheet.type === "cover") {
      return (
        <div className=" cover-out h-full w-full  flex justify-center items-center ">
          <Cover
            side={sheet.side}
            face={sheet.face}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            pagesPerView={pagesPerView}
            animationClass={sheet.id === flipping?.id ? correctAnimation : ""}
            active={active}
            setActive={setActive}
            handleGoTo={handleGoTo}
            sections={sections}
            setBookmarkedPage={setBookmarkedPage}
            bookmarkedPage={bookmarkedPage}
          />
        </div>
      );
    }

    if (sheet.type === "context") {
      return (
        <Page
          ref={outerRef}
          index={pageIndexMap.get(sheet.id) ?? 0}
          pageId={sheet.id}
        >
          {sheet.render({
            ctx: contextMap,
            goToIndex: sheet.id.startsWith("Contents") ? handleGoTo : undefined,
          })}
        </Page>
      );
    }

    if (sheet.type === "Scrapbook") {
      return (
        <Page
          ref={outerRef}
          index={pageIndexMap.get(sheet.id) ?? 0}
          chapterName={sheet.chapterName}
          pageId={sheet.id}
        >
          {sheet.render({
            messages,
            setMessages,
            handleJumpToLastScrapbook,
          })}
        </Page>
      );
    }

    if (sheet.type === "page") {
      return (
        <Page
          ref={outerRef}
          index={pageIndexMap.get(sheet.id) ?? 0}
          chapterName={sheet.chapterName}
          pageId={sheet.id}
        >
          {sheet.render({})}
        </Page>
      );
    }

    if (sheet.type === "blank") {
      return <Page index={pageIndexMap.get(sheet.id) ?? 0} pageId={sheet.id} />;
    }

    return null;
  };

  return (
    <div className="flex w-full h-full m-2 flex-col md:flex-row">
      <div className="z-100 flex justify-center items-center gap-5"></div>
      <div
        className={` order-2 md:order-1 relative font-baskervville  flex flex-col md:items-center md:justify-center w-full h-full ${!toggleAnimation ? "no-anim" : ""}`}
      >
        {/* <div className="w-[80vw] h-[80vh] min-h-[300px] max-h-[800px] flex"> */}
        {/* Initial Load fix for flickering and LCP*/}

        {
          <div
            className={`relative  book-scene min-h-[350px] h-[90vh] md:h-[85vh]  
            max-h-[800px] grid grid-cols-1 md:self-center w-[80vw] max-w-[2000px]
                 
          ${
            isOpen
              ? "md:grid-cols-2  p-2 pl-0 md:pl-2 shadow-[3px_6px_20px_0_rgba(0,0,0,0.35)] cover-opened  "
              : `md:grid-cols-1  `
          }
          ${isBackCover ? "self-end mr-1 ml-0 md:mr-0 md:ml-0" : "self-start ml-1 mr-0 md:mr-0 md:ml-0"}
          `}
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
                  className=" relative w-full h-full min-h-0 items-center justify-center flex"
                  key={key}
                >
                  {/* Leave the isLeftPage and isRightPage logic for 2 pages
                so the hover animation works as intented.*/}
                  {isOpen && isLeftPage && prevSheet && isTwoPages && (
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                      {renderSheet(prevSheet)}
                    </div>
                  )}

                  {isOpen && isRightPage && nextSheet && isTwoPages && (
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                      {renderSheet(nextSheet)}
                    </div>
                  )}

                  {/* Fix for 1 pages view.*/}
                  {isOpen &&
                    flipping?.direction === "prev" &&
                    prevSheet &&
                    !isTwoPages && (
                      <div className="absolute inset-0 -z-10 pointer-events-none ">
                        {renderSheet(prevSheet)}
                      </div>
                    )}

                  {/* flippingRef.current.direction === next  seem to be the problem.*/}
                  {isOpen &&
                    flipping?.direction === "next" &&
                    nextSheet &&
                    !isTwoPages && (
                      <div className="absolute inset-0 -z-10 pointer-events-none">
                        {renderSheet(nextSheet)}
                      </div>
                    )}

                  {/* Show first inside page while opening cover 
                1 and 2 pages view
                */}
                  {!isOpen && flipping?.direction === "next" && nextSheet && (
                    <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
                      <div className="w-full md:w-1/2 h-full">
                        {renderSheet(nextSheet)}
                      </div>
                    </div>
                  )}

                  {/* Show last inside page while closing back cover */}
                  {!isOpen && flipping?.direction === "prev" && prevSheet && (
                    <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
                      <div className="w-full md:w-1/2 h-full">
                        {renderSheet(prevSheet)}
                      </div>
                    </div>
                  )}

                  <div
                    data-page-id={
                      isOpen && sheet.type != "cover" ? sheet.id : undefined
                    }
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
                    onMouseEnter={() => {
                      if (
                        !isTwoPages ||
                        sheet.type === "cover" ||
                        !isBookmarkVisible
                      ) {
                        return;
                      }

                      const pageNumber = numberedMap.get(sheet.id);

                      if (!pageNumber) return;

                      setHoverDirection(pageNumber % 2 === 1 ? "next" : "prev");
                    }}
                    onMouseLeave={() => {
                      setHoverDirection(null);
                    }}
                    className={` page-flip w-full h-full relative flex justify-center ${
                      sheet.id === flipping?.id ? correctAnimation : ""
                    }
                 
                  `}
                  >
                    {renderSheet(sheet)}
                  </div>
                </div>
              );
            })}

            {isOpen && (
              <div
                className="
                absolute
                top-10
                left-full
                ml-[-20px]

                flex
                flex-col
                gap-2

                z-10
              "
              >
                <Bookmarks
                  sectionIds={sections.map((s) => s.id)}
                  active={active}
                  setActive={setActive}
                  handleGoTo={handleGoTo}
                />
              </div>
            )}
            {isOpen && (
              <div
                className={`
                absolute
                top-[-20px]
                h-full
                left-0
                translate-x-0
                md:left-1/2
                md:-translate-x-1/2
                md:m-0
                z-[-100]
              ${
                bookmarkPosition === "previous"
                  ? "md:left-[47%]"
                  : bookmarkPosition === "next"
                    ? "md:left-[53%]"
                    : ""
              }
              ${
                !bookmarkedPage
                  ? "bookmark-translateZ"
                  : isBookmarkVisible
                    ? "bookmark-visible left-0 m-1 translate-x-0 md:left-0 md:translate-x-0 md:m-0"
                    : ""
              }
          `}
              >
                <Bookmark
                  handleGoTo={handleGoTo}
                  setBookmarkedPage={setBookmarkedPage}
                  bookmarkedPage={bookmarkedPage}
                  setDraggingBookmark={setDraggingBookmark}
                  draggingBookmark={draggingBookmark}
                  hoverDirection={hoverDirection}
                />
              </div>
            )}
          </div>
        }
      </div>
      <div className="z-100 text-myPinkDark absolute top-2 right-2  hover:text-myPinkLight ">
        <button
          onClick={() => setOptionsOpen(!optionsOpen)}
          className="text-center cursor-pointer  "
        >
          <Settings size={20} />
        </button>
      </div>

      <AnimatePresence>
        {optionsOpen && (
          <motion.div
            className="order-1 "
            initial={{
              opacity: 0,
              scaleY: 0.8,
              x: isDesktop ? 20 : 0,
              y: isDesktop ? 0 : -8,
            }}
            animate={{
              opacity: 1,
              scaleY: 1,
              x: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scaleY: 0.8,
              x: isDesktop ? 20 : 0,
              y: isDesktop ? 0 : -8,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Options
              darkMode={theme}
              animationsEnabled={toggleAnimation}
              toggleDarkMode={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              toggleAnimations={() => setToggleAnimation(!toggleAnimation)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div className="order-1 origin-center">
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            setMessages={setMessages}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Notebook;
