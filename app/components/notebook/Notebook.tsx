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
import Bookmark from './Bookmark'
// import useMeasure from '../useMeasure'

export type Sheet =
  | {
      type: 'cover'
      side: 'front' | 'back'
      face: 'inside' | 'outside'
      id: string
    }
  | { type: 'page'; id: string; render: () => React.ReactNode; index: number }
  | { type: 'blank'; id: string; render: () => React.ReactNode; index: number }

type Section = {
  id: string
  render: () => React.ReactNode
  // index: number
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

const sections: Section[] = SECTION_CONFIG.flatMap(({ key, blocks }) =>
  blocks.map((block, index) => ({
    id: `${key}-${index}`,
    // index: i,
    render: () => block,
  })),
)

const numberOfBlanks = sections.length % 2 === 0 ? 2 : 3

export const transform = (s: string) => {
  if (!s) return
  return s.slice(0, s.indexOf('-'))
}

const TwoPagesheets: Sheet[] = [
  { type: 'cover', side: 'front', face: 'outside', id: 'cover-front-outside' },
  { type: 'cover', side: 'front', face: 'inside', id: 'cover-front-inside' },
  ...sections.map((s, i) => ({
    type: 'page' as const,
    id: s.id,
    render: s.render,
    index: i + 1,
  })),
  ...Array.from({ length: numberOfBlanks }, (_, i) => ({
    type: 'blank' as const,
    id: `blank-${i}`,
    index: sections.length + i + 1,
    render: () => null, // blank page has nothing to render
  })),
  // { type: 'blank' },
  { type: 'cover', side: 'back', face: 'inside', id: 'cover-back-inside' },
  { type: 'cover', side: 'back', face: 'outside', id: 'cover-back-outside' },
]

const OnePagesheets: Sheet[] = [
  { type: 'cover', side: 'front', face: 'outside', id: 'cover-front-outside' },
  ...sections.map((s, i) => ({
    type: 'page' as const,
    id: s.id,
    render: s.render,
    index: i + 1,
  })),
  ...Array.from({ length: numberOfBlanks - 1 }, (_, i) => ({
    type: 'blank' as const,
    id: `blank-${i}`,
    index: sections.length + i + 1,
    render: () => null, // blank page has nothing to render
  })),
  // { type: 'blank' }
  { type: 'cover', side: 'back', face: 'outside', id: 'cover-back-outside' },
]

console.log(sections.length)

const Notebook = () => {
  const outerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number>(0)
  const [measuredHeights, setMeasuredHeights] = useState<
    Record<string, number[]>
  >({})
  const [isOpen, setIsOpen] = useState(false)
  const [pagesPerView, setPagesPerView] = useState(1)
  const [isTwoPages, setIsTwoPages] = useState(false)
  const [bookmarkedPage, setBookmarkedPage] = useState('')
  const [active, setActive] = React.useState<string>('')

  const correctSheet = isTwoPages ? TwoPagesheets : OnePagesheets

  // HANDLE IF THE NOTEBOOK IS TWO OR ONE PAGE
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const update = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        // setPagesPerView(window.innerWidth >= 768 ? 2 : 1)
        setIsTwoPages(window.innerWidth >= 768 ? true : false)
      }, 100)
    }

    update()
    window.addEventListener('resize', update)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', update)
    }
  }, [isTwoPages]) // removing this makes index go to bookmark page everytime pages view changes

  const { visibleItems, prev, next, goToIndex } = useNotebookPagination(
    // isTwoPages ? TwoPagesheets : OnePagesheets,
    correctSheet,
    pagesPerView,
    isOpen,
    setIsOpen,
    isTwoPages,
  )

  // HANDLE HOW MANY PAGES TO SHOW
  useEffect(() => {
    const pages = isTwoPages && isOpen ? 2 : 1
    setPagesPerView(pages)
  }, [pagesPerView, isTwoPages, isOpen, visibleItems])

  // HANDLE HASH
  useEffect(() => {
    const handleHash = () => {
      const hashId = window.location.hash.slice(1) // remove the #

      if (!hashId) return

      const pageSheet = correctSheet.find(
        // WAS sheets
        (sheet): sheet is Extract<Sheet, { type: 'page' }> =>
          sheet.type === 'page' && sheet.id.startsWith(hashId),
      )

      if (pageSheet) {
        console.log('going to page', pageSheet.id)
        goToIndex(pageSheet.id)
      }
    }
    handleHash()
    return () => window.removeEventListener('hashchange', handleHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTwoPages]) // WAS URL ONLY

  //OPEN - CLOSE LOGIC
  useEffect(() => {
    if (visibleItems.some((i) => i.type === 'cover' && i.face === 'outside')) {
      {
        setIsOpen(false)
        return
      }
    }
    setIsOpen(true)
  }, [visibleItems])

  useEffect(() => {
    const visibleIds = visibleItems.map((item) => transform(item.id))
    const compare = visibleIds.some((id) => id === transform(active))
    if (!compare) {
      if (visibleIds[0] !== 'cover') {
        setActive(visibleItems[0]?.id) // This changes active bookmark to follow nav
      } else {
        setActive(visibleItems[1]?.id) // This changes active bookmark to follow nav
      }
    } // FIXES FOR FIRST AND LAST PAGES NAV IN TWO PAGES MODE.
    else {
      if (active === 'cover-front-inside') {
        console.log('in set active')
        setActive(visibleItems[1]?.id)
      } else if (
        active === 'cover-back-outside' ||
        active.startsWith('blank')
      ) {
        console.log('in else set active')
        setActive(visibleItems[0]?.id)
      }
    }
  }, [visibleItems, setActive, active])

  // Custom Boomark logic
  useEffect(() => {
    const saved = localStorage.getItem('notebook-bookmark')
    if (saved) {
      setBookmarkedPage(saved)
    }
  }, [])

  useEffect(() => {
    if (!bookmarkedPage) return
    localStorage.setItem('notebook-bookmark', bookmarkedPage)
  }, [bookmarkedPage])

  return (
    <div>
      <button onClick={() => goToIndex(bookmarkedPage)}>
        Open On Bookmark
      </button>
      <Bookmark
        visibleItems={visibleItems}
        setBookmarkedPage={setBookmarkedPage}
      />
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
              <h2>{sheet.id}</h2>
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
                    <Page ref={outerRef} index={sheet.index}>
                      {sheet.render()}
                    </Page>
                  </div>
                )}
                {sheet.type === 'blank' && (
                  // <div className="w-full flex border-3 border-yellow-500">
                  <div className="w-full  h-full flex-1  flex border-10 border-yellow-500">
                    <Page index={sheet.index} />
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
          active={active}
          setActive={setActive}
        />
      </div>
    </div>
  )
}

export default Notebook
