import React, { useEffect, useState, useMemo, useCallback } from 'react'
import type { Sheet } from './notebook/Notebook'
export function useNotebookPagination(
  // allItems: Sheet[],
  items: Sheet[],
  pagesPerView: number,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  isSetTwoPages: boolean,
) {
  const [leftIndex, setLeftIndex] = useState(0)
  const maxLeftIndex = Math.max(0, items.length - pagesPerView)

  useEffect(() => {
    // bug fix for when resizing from 2 pages to 1 page while on last pages that don't exist in 1 page notebook
    // eslint-disable-next-line
    setLeftIndex((prev) => Math.min(prev, maxLeftIndex))
  }, [maxLeftIndex])

  const visibleItems = useMemo(() => {
    return items.slice(leftIndex, leftIndex + pagesPerView)
  }, [items, leftIndex, pagesPerView])

  const prev = () => {
    let newIndex = Math.max(0, leftIndex - pagesPerView)
    const sheet = items[newIndex]

    if (
      sheet.type === 'cover' &&
      sheet.face === 'inside' &&
      sheet.side === 'back'
    ) {
      newIndex -= 1
    }
    setLeftIndex(newIndex)
  }

  const next = () => {
    let newIndex = Math.min(leftIndex + pagesPerView, maxLeftIndex)
    const sheet = items[newIndex]
    if (
      sheet.type === 'cover' &&
      sheet.face === 'inside' &&
      sheet.side === 'back'
    ) {
      newIndex += 1
    }
    setLeftIndex(newIndex)
  }

  const goToIndex = useCallback(
    (id: string) => {
      console.log('called goToindex with id: ', id)
      setIsOpen(true)

      const index = items.findIndex((i) => i.type === 'page' && i.id === id)
      // const index = items.findIndex((i) => i.id === id) // This enables bookmarking blanks as well (page might not exist on 1page view)
      if (index === -1) return

      let newIndex = index

      if (isSetTwoPages === true) {
        // force alignment to even index (left page of spread)
        newIndex = index % 2 === 0 ? index - 1 : index
      }
      setLeftIndex(newIndex)
    },
    [items, setIsOpen, isSetTwoPages],
  )

  return {
    pagesPerView,
    visibleItems,
    prev,
    next,
    goToIndex,
  }
}

export default useNotebookPagination
