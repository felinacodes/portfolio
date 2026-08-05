import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";

import type { Sheet } from "./notebook/Notebook";

export function useNotebookPagination(
  // allItems: Sheet[],
  items: Sheet[],
  pagesPerView: number,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  isSetTwoPages: boolean,
  initialPage?: string,
) {
  const decodedInitialPage = initialPage
    ? decodeURIComponent(initialPage)
    : undefined;
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  const [leftIndex, setLeftIndex] = useState(() => {
    if (!initialPage) return 0;

    const index = items.findIndex((i) => i.id === decodedInitialPage);
    if (index === -1) return 0;

    return index;
  });
  const maxLeftIndex = Math.max(0, items.length - pagesPerView);

  //BUG FIX : when switching from 1 page view to 2 goes back to initialPage instead of following current index.
  const initialRef = useRef(initialPage);

  /* Fix syncing between 2 pages view and 1 page view */
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      initialRef.current = undefined;
    }
    prevPathname.current = pathname;
  }, [pathname]);

  useLayoutEffect(() => {
    if (!initialRef.current) return;
    const index = items.findIndex((i) => i.id === decodedInitialPage);

    if (index === -1) return;
    let newIndex = index;
    if (isSetTwoPages) {
      newIndex = index % 2 === 0 ? index - 1 : index;
      // initialRef.current = undefined;
    }
    // eslint-disable-next-line
    setLeftIndex(Math.max(0, newIndex));
  }, [items, isSetTwoPages, decodedInitialPage]);

  useEffect(() => {
    // eslint-disable-next-line
    setLeftIndex((prev) => Math.min(prev, maxLeftIndex));
  }, [maxLeftIndex]);

  const prevTwoPages = useRef(isSetTwoPages);

  // BUG FIX : when switching from 1 page view to 2 page view, and lands  on last blank page.
  useEffect(() => {
    const switchedToTwoPages = !prevTwoPages.current && isSetTwoPages;
    prevTwoPages.current = isSetTwoPages;

    if (!switchedToTwoPages) return;
    // eslint-disable-next-line
    setLeftIndex((prev) => {
      const aligned = prev % 2 === 0 ? prev - 1 : prev;
      return Math.max(0, aligned);
    });
  }, [isSetTwoPages]);

  const visibleItems = useMemo(() => {
    // if (!mounted) return []
    return items.slice(leftIndex, leftIndex + pagesPerView);
  }, [items, leftIndex, pagesPerView]);

  const prev = () => {
    let newIndex = Math.max(0, leftIndex - pagesPerView);
    const sheet = items[newIndex];

    if (
      sheet.type === "cover" &&
      sheet.face === "inside" &&
      sheet.side === "back"
    ) {
      newIndex -= 1;
    }
    setLeftIndex(newIndex);
  };

  const next = () => {
    let newIndex = Math.min(leftIndex + pagesPerView, maxLeftIndex);

    const sheet = items[newIndex];
    if (
      sheet.type === "cover" &&
      sheet.face === "inside" &&
      sheet.side === "back"
    ) {
      newIndex += 1;
    }
    setLeftIndex(newIndex);
  };

  const goToIndex = useCallback(
    (id: string) => {
      console.log("goToIndex called with id: ", id);
      // const index = items.findIndex((i) => i.type !== 'blank' && i.id === id)
      const index = items.findIndex((i) => i.id === id);

      // const index = items.findIndex((i) => i.type === 'page' && i.id === id)
      // const index = items.findIndex((i) => i.id === id) // This enables bookmarking blanks as well (page might not exist on 1page view)
      if (index === -1) return;

      setIsOpen(true);

      let newIndex = index;

      if (isSetTwoPages) {
        // force alignment to even index (left page of spread)
        newIndex = index % 2 === 0 ? index - 1 : index;
      }
      setLeftIndex(newIndex);
    },
    [items, setIsOpen, isSetTwoPages],
  );

  return {
    pagesPerView,
    visibleItems,
    prev,
    next,
    goToIndex,
  };
}

export default useNotebookPagination;
