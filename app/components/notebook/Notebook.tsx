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
    // console.log('blockHeight', blockHeight)
    // console.log('height is ', pageHeight)
    console.log(`blockheight: ${blockHeight} for block index ${i}`)
    console.log(`pageHeight: ${pageHeight}`)
    console.log(`currentHeight: ${currentHeight}`)
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

  useLayoutEffect(() => {
    const el = pageRef.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)

      const borderTop = parseFloat(style.borderTopWidth) || 0
      const borderBottom = parseFloat(style.borderBottomWidth) || 0

      const usableHeight = rect.height - borderTop - borderBottom

      setHeight(usableHeight)
      setPageWidth(rect.width)
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

  // useLayoutEffect(() => {
  //   // if (!pageRef.current) return
  //   const measure = () => {
  //     const rect = OuterRef.current!.getBoundingClientRect()
  //     setOuterHeight(rect.height)
  //     // setPageWidth(rect.width)
  //   }
  //   measure()
  //   window.addEventListener('resize', measure)
  //   return () => window.removeEventListener('resize', measure)
  // }, [])

  // Paginate after heights + pageHeight are available
  const bioPages =
    measuredHeights.bio && height
      ? paginateByHeight(contentSections.bio, measuredHeights.bio, height) // subtract padding
      : []

  const aboutPages =
    measuredHeights.about && height
      ? paginateByHeight(contentSections.about, measuredHeights.about, height)
      : []

  const sections: Section[] = [
    ...bioPages.map((page, i) => ({
      id: `bio-${i}`,
      render: () => <div className="flex flex-col">{page}</div>,
    })),
    ...aboutPages.map((page, i) => ({
      id: `about-${i}`,
      render: () => <div className="flex flex-col">{page}</div>,
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

  const { visibleItems, prev, next } = useNotebookPagination(sheets)

  return (
    //  Render the sections components outside of view to take measurements, before the pagination.
    <div className="p-4 flex flex-col items-center w-full">
      {Object.entries(contentSections).map(([key, blocks]) => (
        // <MeasureBlocks
        //   key={key}
        //   blocks={blocks.map((block, i) => (
        //     <Page key={i}>{block}</Page>
        //     // <div key={i}>{block} </div>
        //   ))}
        //   width={pageWidth}
        //   onMeasured={(heights) => handleMeasured(key, heights)}
        // />
        <MeasureBlocks
          key={key}
          blocks={blocks}
          width={pageWidth}
          onMeasured={(heights) => handleMeasured(key, heights)}
        />
      ))}

      {/* anchor for pageRef that never unmounts. so it gets the individual styles of the Page. 
      Else it unmounts and have 0 height as a result. If you put it outside the Page Component
      it doesn't take into consideration the Page styles = content overflows. */}
      <div
        className="invisible pointer-events-none top-0 left-0 w-full h-[50vh] min-h-[300px] max-h-[600px] flex"
        style={{ width: '100%', minHeight: '300px', maxHeight: '600px' }}
      >
        <Page ref={pageRef}></Page>
      </div>

      {/* visible pages */}
      <div
        ref={OuterRef}
        className="w-full h-[50vh] min-h-[300px] max-h-[600px] flex border-2 border-yellow-500"
      >
        {visibleItems.map((sheet) => {
          const key =
            sheet.type === 'page'
              ? sheet.id
              : sheet.type === 'cover'
                ? `cover-${sheet.side}`
                : 'blank'

          return (
            <div key={key} className="flex-1 p-2 border">
              <h1>{key}</h1>
              <h1>{height}</h1>

              <div>
                {sheet.type === 'cover' && <Cover side={sheet.side} />}
                {sheet.type === 'page' && (
                  <div className="w-full h-[50vh] min-h-[300px] max-h-[600px] flex border-2 border-yellow-500">
                    <Page>{sheet.render()}</Page>
                  </div>
                )}
                {sheet.type === 'blank' && <Page />}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex gap-4">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
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
