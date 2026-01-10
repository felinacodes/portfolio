'use client'

import React, { useEffect, useState } from 'react'
import Page from './Page'
import Cover from './Cover'
import useNotebookPagination from '../useNotebookPagination'

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
  const { visibleItems, prev, next } = useNotebookPagination(sheets)
  return (
    <div>
      <section className="spread">
        {visibleItems.map((sheet, i) => {
          if (sheet.type === 'cover') {
            return <Cover key={i} side={sheet.side} />
          }

          if (sheet.type === 'page') {
            return <Page key={i} title={sheet.title} content={sheet.content} />
          }

          return <div key={i} className="blank-page" />
        })}
      </section>

      <button onClick={prev}>Prev</button>

      <button onClick={next}>Next</button>
    </div>
  )
}

export default Notebook

/*
TODO: Basic styling for notebook and pages. 
TODO: Add pages dynamically. 
*/
