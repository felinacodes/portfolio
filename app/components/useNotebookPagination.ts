import React, { useEffect, useState, useMemo, useCallback } from 'react'
import type { Sheet } from './notebook/Notebook'

export function useNotebookPagination(
  allItems: Sheet[],
  items: Sheet[],
  pagesPerView: number,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  isSetTwoPages: boolean,
) {
  const [leftIndex, setLeftIndex] = useState(0)
  const maxLeftIndex = Math.max(0, items.length - pagesPerView)
  const safeLeftIndex = Math.min(leftIndex, maxLeftIndex)

  const visibleItems = useMemo(() => {
    const slice = items.slice(safeLeftIndex, safeLeftIndex + pagesPerView)
    // console.log(`slice: ${slice}`)
    // console.table(slice)
    console.log(
      `from slice: safeLeftIndex: ${safeLeftIndex} pagesPerView: ${pagesPerView}`,
    )

    return slice
  }, [items, safeLeftIndex, pagesPerView])

  // useEffect(() => {
  //   // console.log('STATE COMMITTED', { leftIndex, maxLeftIndex, isOpen })
  //   console.log(`isSetTwoPages: ${isSetTwoPages}`)
  //   console.log(`PagesPerView: ${pagesPerView}`)
  // }, [leftIndex, maxLeftIndex, isOpen])

  // const visibleItems = useMemo(() => {
  //   const slice = items.slice(safeLeftIndex, safeLeftIndex + pagesPerView)

  //   if (pagesPerView === 1) {
  //     return slice.filter(
  //       (item) => !(item.type === 'cover' && item.face === 'inside'),
  //     )
  //   }
  //   console.log(slice)
  //   return slice
  // }, [items, safeLeftIndex, pagesPerView])

  // console.log({ items })  //ASK HERE

  const prev = () => {
    console.log(items)

    const newIndex = Math.max(0, leftIndex - pagesPerView)
    setLeftIndex(newIndex)
    if (newIndex === 0) setIsOpen(false)
    else setIsOpen(true)

    console.log(
      `from: prev : leftindex: ${leftIndex} maxLeftIndex: ${maxLeftIndex} isOpen: ${isOpen} newIndex: ${newIndex}`,
    )
  }

  const next = () => {
    if (isSetTwoPages && leftIndex - 1 === maxLeftIndex) return //BUG FIX - where pressing 2 times next and then prev returns to two plank pages
    console.log(items)

    const newIndex = Math.min(leftIndex + pagesPerView, maxLeftIndex)
    setLeftIndex(newIndex)
    if (newIndex === maxLeftIndex) setIsOpen(false)
    else setIsOpen(true)
    // console.log(isOpen)

    console.log(
      `from: next : leftindex: ${leftIndex} maxLeftIndex: ${maxLeftIndex} isOpen: ${isOpen} newIndex: ${newIndex}`,
    )
  }

  // const goToIndex = (id: string) => {
  //   const index = items.findIndex((i) => i.type === 'page' && i.id === id)
  //   if (index !== -1) setLeftIndex(index)
  // }

  const goToIndex = useCallback(
    (id: string) => {
      setIsOpen(true)
      console.log('useCallback')
      const index = items.findIndex((i) => i.type === 'page' && i.id === id)

      if (index !== -1) setLeftIndex(index)
    },
    [items, setIsOpen],
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
