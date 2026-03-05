'use client'

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from 'react'
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
import { TableOfContentsBlocks } from './pages/TableOfContents'
import Bookmarks from './Bookmarks'
import MeasureBlocks from './MeasureBlocks'
import Bookmark from './Bookmark'

// import useMeasure from '../useMeasure'

type NotebookProps = {
  initialPage?: string
}

export type Sheet =
  | {
      type: 'cover'
      side: 'front' | 'back'
      face: 'inside' | 'outside'
      id: string
    }
  | { type: 'page'; id: string; render: () => React.ReactNode }
  | {
      type: 'context'
      id: string
      render: (
        ctx?: Map<string, number>,
        goToIndex?: (id: string) => void,
      ) => React.ReactNode
    }
  | { type: 'blank'; id: string; render: () => React.ReactNode }

export type Section = {
  id: string
  render: (
    ctx?: Map<string, number>,
    goToIndex?: (id: string) => void,
  ) => React.ReactNode
}
type SectionBlock =
  | React.ReactNode[]
  | ((
      ctx?: Map<string, number>,
      goToIndex?: (id: string) => void,
    ) => React.ReactNode[])

type SectionConfig = {
  key: string
  blocks: SectionBlock
}

const SECTION_CONFIG: SectionConfig[] = [
  { key: 'tableOfContents', blocks: TableOfContentsBlocks },
  { key: 'intro', blocks: IntroBlocks },
  { key: 'about', blocks: aboutBlocks },
  { key: 'education', blocks: EducationBlocks },
  { key: 'skills', blocks: SkillsBlocks },
  { key: 'projects', blocks: ProjectsBlocks },
  { key: 'contact', blocks: ContactBlocks },
  { key: 'leaveSomething', blocks: LeaveSomethingBlocks },
]

const sections: Section[] = SECTION_CONFIG.flatMap(({ key, blocks }) => {
  const resolved = typeof blocks === 'function' ? blocks() : blocks

  return resolved.map((block, index) => ({
    id: `${key}-${index}`,
    render: (ctx?: Map<string, number>, goToIndex?: (id: string) => void) =>
      typeof blocks === 'function' ? blocks(ctx, goToIndex)[index] : block,
  }))
})

const numberOfBlanks = sections.length % 2 === 0 ? 2 : 3

export const transform = (s: string) => {
  if (!s) return
  return s.slice(0, s.indexOf('-'))
}

const sheet: Sheet[] = [
  { type: 'cover', side: 'front', face: 'outside', id: 'cover-front-outside' },
  { type: 'cover', side: 'front', face: 'inside', id: 'cover-front-inside' },

  ...sections.flatMap((s) => {
    if (s.id.startsWith('tableOfContents')) {
      return {
        type: 'context' as const,
        id: s.id,
        render: s.render,
      }
    } else {
      return {
        type: 'page' as const,
        id: s.id,
        render: s.render as () => React.ReactNode,
      }
    }
  }),
  ...Array.from({ length: numberOfBlanks }, (_, i) => ({
    type: 'blank' as const,
    id: `blank-${i}`,
    render: () => null,
  })),
  { type: 'cover', side: 'back', face: 'inside', id: 'cover-back-inside' },
  { type: 'cover', side: 'back', face: 'outside', id: 'cover-back-outside' },
]

const Notebook: React.FC<NotebookProps> = ({ initialPage }) => {
  const outerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number>(0)
  const [measuredHeights, setMeasuredHeights] = useState<
    Record<string, number[]>
  >({})
  const [isOpen, setIsOpen] = useState(false)
  const [pagesPerView, setPagesPerView] = useState(1)

  const getIsTwoPages = () =>
    typeof window !== 'undefined' && window.innerWidth >= 768

  const [isTwoPages, setIsTwoPages] = useState(false)
  // Fixes initial flickering on 2 pages view but cause hydration error
  // const [isTwoPages, setIsTwoPages] = useState(() =>
  //   window.innerWidth >= 768 ? true : false,
  // )
  const [bookmarkedPage, setBookmarkedPage] = useState('')
  const [active, setActive] = React.useState<string>('')
  const [mounted, setIsmounted] = useState(false)

  // const correctSheet = isTwoPages ? TwoPagesheets : OnePagesheets
  const correctSheet = isTwoPages
    ? sheet
    : sheet.filter((s) => !(s.type === 'cover' && s.face === 'inside'))

  useEffect(() => {
    setIsmounted(true)
  }, [])

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
    initialPage,
    mounted,
  )

  // HANDLE HOW MANY PAGES TO SHOW
  useEffect(() => {
    const pages = isTwoPages && isOpen ? 2 : 1
    setPagesPerView(pages)
    // }, [pagesPerView, isTwoPages, isOpen, visibleItems])
  }, [pagesPerView, isTwoPages, isOpen, visibleItems])

  // OPEN - CLOSE LOGIC
  useEffect(() => {
    if (visibleItems.some((i) => i.type === 'cover' && i.face === 'outside')) {
      {
        setIsOpen(false)
        return
      }
    }
    setIsOpen(true)
  }, [visibleItems])

  // Handle URL's
  useEffect(() => {
    let newUrl
    if (!visibleItems.length) return

    const firstPage = visibleItems.find(
      (item) => item.type === 'page' || item.type === 'context',
    )

    if (!firstPage) {
      newUrl = `/`
    } else {
      newUrl = `/notebook/${firstPage.id}`
    }

    if (window.location.pathname !== newUrl) {
      window.history.replaceState(null, '', newUrl)
    }
  }, [visibleItems])

  // Active bookmark logic
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
      } else if (
        active === 'cover-back-outside' ||
        active.startsWith('blank')
      ) {
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

  // HANDLE NUMBERING OF PAGES
  const numberedMap = useMemo(() => {
    let count = 0
    const map = new Map<string, number>()

    correctSheet.forEach((sheet) => {
      if (
        sheet.type === 'page' ||
        sheet.type === 'blank' ||
        sheet.type === 'context'
      ) {
        count++
        map.set(sheet.id, count)
      }
    })

    return map
  }, [correctSheet])

  const contextMap = useMemo(() => {
    const zeroIndexMap = new Map<string, number>()

    numberedMap.forEach((value, key) => {
      if (key.endsWith('-0') && !key.startsWith('blank')) {
        // const transformedKey = transform(key)
        zeroIndexMap.set(key, value)
      }
    })
    return zeroIndexMap
  }, [numberedMap])

  // const pageMultiplier = isTwoPages && !isOpen ? 0.5 : 1
  // const pageWidth = isTwoPages && !isOpen ? 40 : 80
  const pageWidth = 80

  //Fixes Flickering bad bad SEO
  // if (!mounted) {
  //   return <div>...Loading...</div>
  // }

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full `}>
      <button onClick={() => goToIndex(bookmarkedPage)}>
        Open On Bookmark
      </button>
      <Bookmark
        visibleItems={visibleItems}
        setBookmarkedPage={setBookmarkedPage}
      />
      <h1 className="text-center">{isOpen ? 'Open' : 'Closed'}</h1>
      {/* <div className="w-[80vw] h-[80vh] min-h-[300px] max-h-[800px] flex"> */}
      {/* Initial Load fix for flickering and LCP*/}

      {
        <div
          className={`h-[80vh] min-h-[300px] max-h-[800px] grid md:grid-cols-2 grid-cols-1 border-2 border-blue-500
    ${isOpen ? `md:w-[${pageWidth}vw] w-[${pageWidth}vw]` : `md:w-[${pageWidth / 2}vw] w-[${pageWidth}vw]`}`}
        >
          {/* {!mounted && <p>Loading...</p>} */}
          {visibleItems.map((sheet, i) => {
            const key =
              sheet.type === 'page'
                ? sheet.id
                : sheet.type === 'cover'
                  ? `cover-${sheet.side}-${sheet.face}`
                  : `blank-${i}`

            return (
              <div
                // style={{ width: `${pageWidth}vw` }}
                key={key}
                // className="flex-1 p-2 border-5 border-yellow-500"
                // className={` ${mounted ? 'opacity-100' : 'opacity-0'}`}
              >
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
                  {sheet.type === 'context' && (
                    <Page ref={outerRef} index={numberedMap.get(sheet.id) ?? 0}>
                      {/* {sheet.render(contextMap)} */}
                      {sheet.render(
                        contextMap,
                        sheet.id.startsWith('tableOfContents')
                          ? goToIndex
                          : undefined,
                      )}
                    </Page>
                  )}
                  {sheet.type === 'page' && (
                    <Page ref={outerRef} index={numberedMap.get(sheet.id) ?? 0}>
                      {sheet.render()}
                    </Page>
                  )}

                  {sheet.type === 'blank' && (
                    // <div className="w-full flex border-3 border-yellow-500">
                    <div className="w-full  h-full flex-1  flex border-10 border-yellow-500">
                      <Page index={numberedMap.get(sheet.id)} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      }

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
