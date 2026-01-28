'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Page from './Page'
import Cover from './Cover'
import useNotebookPagination from '../useNotebookPagination'
import { bioBlocks } from './pages/Bio'
import { aboutBlocks } from './pages/About'
import MeasureBlocks from './MeasureBlocks'
// import useMeasure from '../useMeasure'

type Sheet =
  | { type: 'cover'; side: 'front' | 'back' }
  | { type: 'page'; id: string; render: () => React.ReactNode }
  | { type: 'blank' }

type Section = {
  id: string
  render: () => React.ReactNode
}

function paginateByHeight(
  blocks: React.ReactNode[],
  heights: number[],
  pageHeight: number,
) {
  const pages: React.ReactNode[][] = []
  let currentPage: React.ReactNode[] = []
  let currentHeight = 0

  blocks.forEach((block, i) => {
    const blockHeight = heights[i]
    console.log(
      `Block ${i}: height=${blockHeight}, current=${currentHeight}, avail=${pageHeight}, would fit=${currentHeight + blockHeight <= pageHeight}`,
    )
    if (currentHeight + blockHeight > pageHeight) {
      pages.push(currentPage)
      currentPage = [block]
      currentHeight = blockHeight
    } else {
      currentPage.push(block)
      currentHeight += blockHeight
    }
  })

  if (currentPage.length) {
    pages.push(currentPage)
  }
  console.log(`Paginated into ${pages.length} pages`)
  return pages
}

const Notebook = () => {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const OuterRef = useRef<HTMLDivElement | null>(null)
  // const { width: pageWidth, height } = useMeasure(pageRef)

  const [height, setHeight] = useState<number>(0)
  const [pageWidth, setPageWidth] = useState<number>(0)
  const [outerHeight, setOuterHeight] = useState<number>(0)

  const [measuredHeights, setMeasuredHeights] = useState<
    Record<string, number[]>
  >({})

  const contentSections = {
    bio: bioBlocks,
    about: aboutBlocks,
  }

  const handleMeasured = (key: string, heights: number[]) => {
    setMeasuredHeights((prev) => {
      const prevHeights = prev[key]
      if (
        prevHeights &&
        prevHeights.length === heights.length &&
        prevHeights.every((h, i) => h === heights[i])
      ) {
        return prev
      }
      return { ...prev, [key]: heights }
    })
  }

  // Paginate after heights + pageHeight are available
  const bioPages =
    measuredHeights.bio && height
      ? paginateByHeight(contentSections.bio, measuredHeights.bio, height - 80) // Subtract footer + margin space
      : []

  const aboutPages =
    measuredHeights.about && height
      ? paginateByHeight(
          contentSections.about,
          measuredHeights.about,
          height - 80,
        ) // Subtract footer + margin space
      : []

  const sections: Section[] = [
    ...bioPages.map((page, i) => ({
      id: `bio-${i}`,
      render: () => (
        <div className="border-5 border-red-500 h-full">{page}</div>
      ),
    })),
    ...aboutPages.map((page, i) => ({
      id: `about-${i}`,
      render: () => (
        <div className="border-5 border-red-500 h-full">{page}</div>
      ),
    })),
  ]

  const sheets: Sheet[] = [
    { type: 'cover', side: 'front' },
    ...sections.map((s) => ({
      type: 'page' as const,
      id: s.id,
      render: s.render,
    })),
    { type: 'blank' },
    { type: 'cover', side: 'back' },
  ]

  const { pagesPerView, visibleItems, prev, next } =
    useNotebookPagination(sheets)

  useLayoutEffect(() => {
    const el = OuterRef.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)

      const borderTop = parseFloat(style.borderTopWidth) || 0
      const borderBottom = parseFloat(style.borderBottomWidth) || 0
      const paddingTop = parseFloat(style.paddingTop) || 0
      const paddingBottom = parseFloat(style.paddingBottom) || 0
      const paddingLeft = parseFloat(style.paddingLeft) || 0
      const paddingRight = parseFloat(style.paddingRight) || 0
      const borderLeft = parseFloat(style.borderLeftWidth) || 0
      const borderRight = parseFloat(style.borderRightWidth) || 0

      // Account for padding in the content area
      const usableHeight =
        rect.height - borderTop - borderBottom - paddingTop - paddingBottom
      const contentWidth =
        rect.width - paddingLeft - paddingRight - borderLeft - borderRight

      console.log(
        `Page measurement: rect.height=${rect.height}, padding=${paddingTop + paddingBottom}, usableHeight=${usableHeight}, contentWidth=${contentWidth}`,
      )
      setHeight(usableHeight)
      setPageWidth(pagesPerView === 1 ? contentWidth : contentWidth / 2)
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)

    window.addEventListener('resize', measure)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    //  Render the sections components outside of view to take measurements, before the pagination.
    <div className="p-4 flex flex-col items-center w-full justify-center border-5">
      {Object.entries(contentSections).map(([key, blocks]) => (
        <MeasureBlocks
          key={key}
          blocks={blocks.map((block, i) => (
            <Page key={i}>{block}</Page>
            // <>{block}</>
          ))}
          width={pageWidth}
          onMeasured={(heights) => handleMeasured(key, heights)}
        />
        // <MeasureBlocks
        //   key={key}
        //   blocks={blocks}
        //   width={pageWidth}
        //   onMeasured={(heights) => handleMeasured(key, heights)}
        // />
      ))}

      {/* anchor for pageRef that never unmounts. so it gets the individual styles of the Page. 
      Else it unmounts and have 0 height as a result. If you put it outside the Page Component
      it doesn't take into consideration the Page styles = content overflows. */}
      {/* <div className="relative w-full h-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] min-h-[300px] max-h-[600px] pointer-events-none opacity-0">
          <Page ref={pageRef}></Page>
        </div>
      </div> */}

      {/* visible pages */}
      <div
        // ref={OuterRef}
        className="w-[90vw] h-full flex-col flex justify-center items-center border-2 border-purple-500"
      >
        <div
          ref={OuterRef}
          className="w-full min-h-[300px] max-h-[800px] flex border-4 border-gray-500"
        >
          {visibleItems.map((sheet) => {
            const key =
              sheet.type === 'page'
                ? sheet.id
                : sheet.type === 'cover'
                  ? `cover-${sheet.side}`
                  : 'blank'

            return (
              <div key={key} className="flex-1 p-2 border-2 border-pink-500">
                <h1>{key}</h1>
                <h1>{height}</h1>
                <h1>{pageWidth}</h1>

                <div>
                  {sheet.type === 'cover' && <Cover side={sheet.side} />}
                  {sheet.type === 'page' && (
                    <div className="w-full h-[50vh] min-h-[300px] max-h-[600px] flex border-3 border-yellow-500">
                      <Page>{sheet.render()}</Page>
                    </div>
                  )}
                  {sheet.type === 'blank' && <Page />}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex gap-4 border-2 border-blue-200">
          <button onClick={prev}>Prev</button>
          <button onClick={next}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default Notebook

/* WEEK 2 TO DO 
1. BUGFIX: Section content is being overflown instead of wrapping the last block to the next page
when it's on 2 pages layout mode. (measure the page?)
2. Create the rest of the sections placeholders.
3. Add bookmarks. 
4. Fix code (remove unecessary things from notebook / move to other files.) 
5. Optimize the code and fix any errors.
*/
