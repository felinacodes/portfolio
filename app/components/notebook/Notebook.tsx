'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Page from './Page'
import Cover from './Cover'
import useNotebookPagination from '../useNotebookPagination'
import { aboutBlocks } from './pages/About'
import { IntroBlocks } from './pages/Intro'
import { EducationBlocks } from './pages/Education'
import { SkillsBlocks } from './pages/Skills'
import { ProjectsBlocks } from './pages/Projects'
import { ContactBlocks } from './pages/Contact'
import { LeaveSomethingBlocks } from './pages/LeaveSomething'
import Bookmarks from './Bookmarks'
import MeasureBlocks from './MeasureBlocks'
// import useMeasure from '../useMeasure'

export type Sheet =
  | { type: 'cover'; side: 'front' | 'back'; face: 'inside' | 'outside' }
  | { type: 'page'; id: string; render: () => React.ReactNode }
  | { type: 'blank' }

type Section = {
  id: string
  render: () => React.ReactNode
}

type SectionConfig = {
  key: string
  blocks: React.ReactNode[]
}

const SECTION_CONFIG: SectionConfig[] = [
  { key: 'intro', blocks: IntroBlocks },
  { key: 'about', blocks: aboutBlocks },
  { key: 'education', blocks: EducationBlocks },
  { key: 'skills', blocks: SkillsBlocks },
  { key: 'projects', blocks: ProjectsBlocks },
  { key: 'contact', blocks: ContactBlocks },
  { key: 'leaveSomething', blocks: LeaveSomethingBlocks },
]

// const sections: Section[] = SECTION_CONFIG.flatMap(({ key, blocks }) =>
//   blocks.map((block, index) => ({
//     id: `${key}-${index}`,
//     render: () => block,
//   })),
// )
const sections: Section[] = SECTION_CONFIG.flatMap(({ key, blocks }) =>
  blocks.map((block, index) => ({
    id: `${key}-${index}`,
    render: () => block,
  })),
)

const sheets: Sheet[] = [
  { type: 'cover', side: 'front', face: 'outside' },
  { type: 'cover', side: 'front', face: 'inside' },
  ...sections.map((s) => ({
    type: 'page' as const,
    id: s.id,
    render: s.render,
  })),
  { type: 'blank' },
  { type: 'blank' },
  // { type: 'blank' },
  { type: 'cover', side: 'back', face: 'inside' },
  { type: 'cover', side: 'back', face: 'outside' },
]

const Notebook = () => {
  const outerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number>(0)
  const [measuredHeights, setMeasuredHeights] = useState<
    Record<string, number[]>
  >({})
  const [isOpen, setIsOpen] = useState(false)
  const [pagesPerView, setPagesPerView] = useState(1)
  const [isTwoPages, setIsTwoPages] = useState(false)
  const ignoreNextHashRef = useRef(false)

  const filteredSheets =
    pagesPerView === 1
      ? sheets.filter(
          (sheet) => !(sheet.type === 'cover' && sheet.face === 'inside'),
        )
      : sheets

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const update = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (!isOpen) {
          setPagesPerView(1)
          return
        }
        setPagesPerView(window.innerWidth >= 768 ? 2 : 1)
        setIsTwoPages(window.innerWidth >= 768 ? true : false)
      }, 100) // 100ms delay
    }

    update()
    window.addEventListener('resize', update)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', update)
    }
  }, [isOpen, isTwoPages])

  const { visibleItems, prev, next, goToIndex } = useNotebookPagination(
    sheets,
    filteredSheets,
    pagesPerView,
    isOpen,
    setIsOpen,
    isTwoPages,
  )

  useEffect(() => {
    const handleHash = () => {
      console.log('handleHash effect')

      // if (ignoreNextHashRef.current) {
      //   ignoreNextHashRef.current = false
      //   return
      // }
      const hashId = window.location.hash.slice(1) // remove the #

      if (!hashId) return

      const pageSheet = sheets.find(
        (sheet): sheet is Extract<Sheet, { type: 'page' }> =>
          sheet.type === 'page' && sheet.id.startsWith(hashId),
      )

      if (pageSheet) {
        goToIndex(pageSheet.id)
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) //URL ONLY

  useEffect(() => {
    const getHeight = () => {
      if (!outerRef.current) return
      const pageHeight = outerRef.current.getBoundingClientRect()
      setHeight(pageHeight.height)
    }

    // Use requestAnimationFrame to ensure DOM has painted
    const rafId = requestAnimationFrame(() => {
      getHeight()
    })

    window.addEventListener('resize', getHeight)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', getHeight)
    }
  }, [visibleItems])

  return (
    <div>
      <h1 className="text-center">{isOpen ? 'Open' : 'Closed'}</h1>
      <div className="w-[80vw] h-[80vh] min-h-[300px] max-h-[800px] flex border-4 border-gray-500">
        {visibleItems.map((sheet, i) => {
          const key =
            sheet.type === 'page'
              ? sheet.id
              : sheet.type === 'cover'
                ? `cover-${sheet.side}-${sheet.face}`
                : `blank-${i}`

          return (
            <div key={key} className="flex-1 p-2 border-5 border-pink-500">
              <div className="w-full h-full">
                {sheet.type === 'cover' && (
                  <Cover
                    side={sheet.side}
                    face={sheet.face}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    pagesPerView={pagesPerView}
                  />
                )}
                {sheet.type === 'page' && (
                  <div
                    id={sheet.id}
                    className="w-full  h-full flex-1  flex border-10 border-yellow-500"
                  >
                    <Page ref={outerRef}>{sheet.render()}</Page>
                  </div>
                )}
                {sheet.type === 'blank' && (
                  <div className="w-full flex border-3 border-yellow-500">
                    <Page />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex gap-4 border-2 border-blue-200">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
      <div>
        <Bookmarks
          sectionIds={sections.map((s) => s.id)}
          goToIndex={goToIndex}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  )
}

export default Notebook
