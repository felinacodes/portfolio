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
  // console.log('called useNotebookPagination', items)
  // console.log('pagesPerView', pagesPerView)
  // console.log('isSetTwoPages', isSetTwoPages)
  // console.log('isOpen', isOpen)

  const [leftIndex, setLeftIndex] = useState(0)
  const maxLeftIndex = Math.max(0, items.length - pagesPerView)
  // const [visibleItems, setVisibleItems] = useState<Sheet[]>([items[0]])

  const visibleItems = useMemo(() => {
    // console.log('called useMemo visibleItems')
    // console.log('leftIndex', leftIndex)
    // console.log('pagesPerView', pagesPerView)
    // console.log('maxLeftIndex', maxLeftIndex)
    // console.log(items.slice(leftIndex, leftIndex + pagesPerView))
    const visible = items.slice(leftIndex, leftIndex + pagesPerView)
    // console.log('visible', visible)
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
    console.log('from prev', visibleItems)

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
    if (items[newIndex].type === 'cover' && items[newIndex].face === 'inside') {
      console.log('in if')
      newIndex -= 1
    }
    console.log('leftIndex', leftIndex)
    console.log('newIndex', newIndex)
    console.log('maxLeftIndex', maxLeftIndex)
    console.log('pagesPerView', pagesPerView)
    console.log('end of prev')
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
    if (
      items[newIndex].type === 'cover' &&
      items[newIndex].face === 'inside' &&
      items[newIndex].side === 'back'
    ) {
      console.log('in if')
      newIndex += 1
    }
    console.log('leftIndex', leftIndex)
    console.log('pagesPerView', pagesPerView)
    console.log('maxLeftIndex', maxLeftIndex)
    const nextItem = items[newIndex]
    let item = items.filter((item, i) => i === newIndex)
    console.log('from next: setting neew index to', item)
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

  const goToIndex = useCallback(
    (id: string) => {
      // console.log('called goToindex')
      // console.log(`goToindex with id: ${id}`)
      setIsOpen(true)
      const index = items.findIndex((i) => i.type === 'page' && i.id === id)
      // console.log('items in goToindex', items)
      // console.log('index', index)
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
