'use client'

import React from 'react'
import About from './pages/About'
import Bio from './pages/Bio'
import CV from './pages/CV'
import { useState, useLayoutEffect, useEffect, useRef } from 'react'

const PAGE_HEIGHT = 100
const PAGE_WIDTH = 600

const NotebookTest = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [test, setTest] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  useLayoutEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height
      setTest(height)
      setPageCount(Math.ceil(height / PAGE_HEIGHT))
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div className="border-red-500 border-2 p-4 " ref={ref}>
      <h1>PAGE COUNT: {pageCount}</h1>
      <h1>TEST: {test}</h1>
      <About />
      <Bio />
      <CV />
    </div>
  )
}

export default NotebookTest
