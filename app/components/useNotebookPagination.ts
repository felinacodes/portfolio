import React, { useEffect, useState, useMemo, useCallback } from 'react'
import type { Sheet } from './notebook/Notebook'
import { isSet } from 'util/types'

export function useNotebookPagination(
  // allItems: Sheet[],
  items: Sheet[],
  pagesPerView: number,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  isSetTwoPages: boolean,
) {
  // console.log('called useNotebookPagination', items)
  // console.log('pagesPerView', pagesPerView)
  // console.log('isSetTwoPages', isSetTwoPages)
  // console.log('isOpen', isOpen)

  const [leftIndex, setLeftIndex] = useState(0)
  const maxLeftIndex = Math.max(0, items.length - pagesPerView)
  // const [visibleItems, setVisibleItems] = useState<Sheet[]>([items[0]])

  // useEffect(() => {
  //   setLeftIndex(0)
  // }, [isSetTwoPages])

  useEffect(() => {
    // bug fix for when resizing from 2 pages to 1 page while on last pages that don't exist in 1 page notebook
    // eslint-disable-next-line
    setLeftIndex((prev) => Math.min(prev, maxLeftIndex))
    // console.log('max left index useeffect:', maxLeftIndex)
  }, [maxLeftIndex])

  // const correctIndexBetweenViews = useCallback(() => {
  //   console.log('from correctIndexBetweenViews: leftIndex', leftIndex)
  //   setLeftIndex((prev) => prev + 1)
  // }, [isSetTwoPages, leftIndex])

  const visibleItems = useMemo(() => {
    // console.log('called useMemo visibleItems')
    // console.log('leftIndex', leftIndex)
    // console.log('pagesPerView', pagesPerView)
    // console.log('maxLeftIndex', maxLeftIndex)
    // console.log(items.slice(leftIndex, leftIndex + pagesPerView))

    const visible = items.slice(leftIndex, leftIndex + pagesPerView)
    // console.log('visible items in visible', visible)

    //BUG FIX : resizing from 2 pages to 1 while on last pages that don't
    //exist in 1 page notebook
    // if (leftIndex > maxLeftIndex) {
    //   visible = items.slice(leftIndex - 1, leftIndex + pagesPerView)
    // }

    return visible
    // return items.slice(leftIndex, leftIndex + pagesPerView)
  }, [items, leftIndex, pagesPerView])

  // const visibleItems = items.slice(leftIndex, leftIndex + pagesPerView)

  // useEffect(() => {
  //   console.log('called useEffect visibleItems')
  //   console.log('leftIndex', leftIndex)
  //   console.log('pagesPerView', pagesPerView)
  //   const temp = items.slice(leftIndex, leftIndex + pagesPerView)
  //   setVisibleItems(temp)
  // }, [leftIndex])

  // useEffect(() => {
  //   const current = items[leftIndex]

  //   if (!current) return

  //   if (current.type === 'cover') {
  //     setIsOpen(false)
  //   } else {
  //     setIsOpen(true)
  //   }
  // }, [leftIndex, items])

  const prev = () => {
    // console.log('from prev', visibleItems)

    // if (
    //   visibleItems[0].type === 'cover' &&
    //   visibleItems[0].side === 'back' &&
    //   visibleItems[0].face === 'outside'
    // ) {
    //   console.log('from prev setIsOpen to false')
    //   setIsOpen(true)
    //   // return
    // } else {
    //   setIsOpen(false)
    // }
    let newIndex = Math.max(0, leftIndex - pagesPerView)
    const sheet = items[newIndex]

    if (
      sheet.type === 'cover' &&
      sheet.face === 'inside' &&
      sheet.side === 'back'
    ) {
      newIndex -= 1
    }
    // console.log('leftIndex', leftIndex)
    // console.log('newIndex', newIndex)
    // console.log('maxLeftIndex', maxLeftIndex)
    // console.log('pagesPerView', pagesPerView)
    // console.log('end of prev')
    setLeftIndex(newIndex)
    // if (newIndex === 0) {
    //   setIsOpen(false)
    // } else {
    //   setIsOpen(true)
    // }
    // setLeftIndex((prevIndex) => Math.max(0, prevIndex - pagesPerView))
  }

  const next = () => {
    // if (leftIndex === items.length) return
    let newIndex = Math.min(leftIndex + pagesPerView, maxLeftIndex)
    const sheet = items[newIndex]
    if (
      sheet.type === 'cover' &&
      sheet.face === 'inside' &&
      sheet.side === 'back'
    ) {
      // console.log('in if')
      newIndex += 1
    }
    // console.log('leftIndex', leftIndex)
    // console.log('pagesPerView', pagesPerView)
    // console.log('maxLeftIndex', maxLeftIndex)
    // const nextItem = items[newIndex]
    // let item = items.filter((item, i) => i === newIndex)
    // console.log('from next: setting neew index to', item)
    // If we are about to land on back inside cover,
    // close the book and move directly to back outside

    // if (
    //   nextItem?.type === 'cover' &&
    //   nextItem.side === 'back' &&
    //   nextItem.face === 'inside'
    // ) {
    //   console.log('from next setIsOpen to false')
    //   setIsOpen(false)

    //   const outsideIndex = items.findIndex(
    //     (i) => i.type === 'cover' && i.side === 'back' && i.face === 'outside',
    //   )

    //   console.log('form next outsideIndex', outsideIndex)
    //   if (outsideIndex !== -1) {
    //     console.log('from next setting leftIndex to outsideIndex')
    //     setLeftIndex(outsideIndex)
    //     return
    //   }
    // } else {
    //   setIsOpen(true)
    // }

    setLeftIndex(newIndex)
  }

  // const fixLeftIndex = useCallback(() => {
  //   if (!isSetTwoPages) return
  //   setLeftIndex((prev) => prev + 1)
  // }, [isSetTwoPages])

  // const goToIndex = useCallback(
  //   (id: string) => {
  //     console.log('called goToindex')
  //     // console.log('called goToindex')
  //     // console.log(`goToindex with id: ${id}`)
  //     setIsOpen(true)
  //     const index = items.findIndex((i) => i.type === 'page' && i.id === id)
  //     // console.log('items in goToindex', items)
  //     // console.log('index', index)
  //     console.log('newIndex', index)
  //     if (index !== -1) setLeftIndex(index)
  //   },

  //   [items, setIsOpen],
  // )

  const goToIndex = useCallback(
    (id: string) => {
      setIsOpen(true)

      const index = items.findIndex((i) => i.type === 'page' && i.id === id)

      if (index === -1) return

      let newIndex = index

      if (isSetTwoPages === true) {
        // force alignment to even index (left page of spread)
        newIndex = index % 2 === 0 ? index - 1 : index
      }

      // console.log('newIndex', newIndex)
      // console.log('pagesPerView', pagesPerView)
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
