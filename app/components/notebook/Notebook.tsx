'use client'

import React, { useEffect, useState } from 'react'
import Page from './Page'
import Cover from './Cover'

type Sheet =
  | { type: 'cover'; side: 'front' | 'back' }
  | { type: 'page'; title: string; content: string }
  | { type: 'blank' }

const pages = [
  { title: 'Page 1', content: 'Content 1' },
  { title: 'Page 2', content: 'Content 2' },
  { title: 'Page 3', content: 'Content 3' },
  { title: 'Page 4', content: 'Content 4' },
  { title: 'Page 5', content: 'Content 5' },
  { title: 'Page 6', content: 'Content 6' },
  { title: 'Page 7', content: 'Content 7' },
  { title: 'Page 8', content: 'Content 8' },
]

const sheets: Sheet[] = [
  { type: 'cover', side: 'front' },
  ...pages.map((p) => ({
    type: 'page' as const,
    title: p.title,
    content: p.content,
  })),
  { type: 'cover', side: 'back' },
]

const Notebook = () => {
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

  const maxLeftIndex = Math.max(0, sheets.length - pagesPerView)
  const safeLeftIndex = Math.min(leftIndex, maxLeftIndex)

  const visibleSheets = sheets.slice(
    safeLeftIndex,
    safeLeftIndex + pagesPerView
  )

  return (
    <div>
      <p>Left index: {safeLeftIndex}</p>
      <p>Pages per view: {pagesPerView}</p>

      <section className="spread">
        {visibleSheets.map((sheet, i) => {
          if (sheet.type === 'cover') {
            return <Cover key={i} side={sheet.side} />
          }

          if (sheet.type === 'page') {
            return <Page key={i} title={sheet.title} content={sheet.content} />
          }

          return <div key={i} className="blank-page" />
        })}
      </section>

      <button
        onClick={() => setLeftIndex((i) => Math.max(0, i - pagesPerView))}
      >
        Prev
      </button>

      <button
        onClick={() =>
          setLeftIndex((i) => Math.min(i + pagesPerView, maxLeftIndex))
        }
      >
        Next
      </button>
    </div>
  )
}

export default Notebook
