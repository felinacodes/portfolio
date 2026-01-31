import React, { useEffect, useState, useMemo } from 'react'
import type { Sheet } from './notebook/Notebook'

export function useNotebookPagination(items: Sheet[]) {
  const [leftIndex, setLeftIndex] = useState(0)
  const [pagesPerView, setPagesPerView] = useState(1)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const update = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setPagesPerView(window.innerWidth >= 768 ? 2 : 1)
      }, 100) // 100ms delay
    }

    update()
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', update)
    }
  }, [])

  const maxLeftIndex = Math.max(0, items.length - pagesPerView)
  const safeLeftIndex = Math.min(leftIndex, maxLeftIndex)

  const visibleItems = useMemo(
    () => items.slice(safeLeftIndex, safeLeftIndex + pagesPerView),
    [items, safeLeftIndex, pagesPerView],
  )

  const prev = () => setLeftIndex((i) => Math.max(0, i - pagesPerView))
  const next = () =>
    setLeftIndex((i) => Math.min(i + pagesPerView, maxLeftIndex))

  const goToIndex = (id: string) => {
    const index = items.findIndex((i) => i.type === 'page' && i.id === id)
    if (index !== -1) setLeftIndex(index)
  }

  return {
    pagesPerView,
    visibleItems,
    prev,
    next,
    goToIndex,
  }
}

export default useNotebookPagination
