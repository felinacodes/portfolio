import React, { useEffect, useState } from 'react'

export function useNotebookPagination<T>(items: T[]) {
  const [leftIndex, setLeftIndex] = useState(0)
  const [pagesPerView, setPagesPerView] = useState(1)

  useEffect(() => {
    const update = () => {
      setPagesPerView(window.innerWidth >= 768 ? 2 : 1)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxLeftIndex = Math.max(0, items.length - pagesPerView)
  const safeLeftIndex = Math.min(leftIndex, maxLeftIndex)

  const visibleItems = items.slice(safeLeftIndex, safeLeftIndex + pagesPerView)

  const prev = () => setLeftIndex((i) => Math.max(0, i - pagesPerView))
  const next = () =>
    setLeftIndex((i) => Math.min(i + pagesPerView, maxLeftIndex))

  return {
    pagesPerView,
    visibleItems,
    prev,
    next,
  }
}

export default useNotebookPagination
