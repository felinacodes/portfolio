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
    <div className="p-4 flex flex-col items-center w-full m-4">
      {/* NOTEBOOK BODY */}
      <div className="border-2 border-blue-500 w-full flex justify-center h-[50vh] min-h-[300px] max-h-[600px]">
        <section className="text-center flex justify-center items-center w-full h-full">
          {visibleItems.map((sheet, i) => (
            <div
              key={i}
              className="flex-1 flex justify-center items-stretch p-2 border-2 "
            >
              {sheet.type === 'cover' && <Cover side={sheet.side} />}
              {sheet.type === 'page' && (
                <Page title={sheet.title} content={sheet.content} />
              )}
              {sheet.type === 'blank' && <div className="blank-page flex-1" />}
            </div>
          ))}
        </section>
      </div>

      <div className="mt-4 flex gap-4">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  )
}

export default Notebook

/*
TODO: Basic styling for notebook and pages. 
TODO: Add pages dynamically. 
*/
