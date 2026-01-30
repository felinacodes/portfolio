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

const contentSections = {
  intro: IntroBlocks,
  about: aboutBlocks,
  educationBlocks: EducationBlocks,
  skills: SkillsBlocks,
  projects: ProjectsBlocks,
  contact: ContactBlocks,
  leaveSomething: LeaveSomethingBlocks,
}

const introPages = contentSections.intro
const aboutPages = contentSections.about
const educationPages = contentSections.educationBlocks
const skillsPages = contentSections.skills
const projectPages = contentSections.projects
const contactPages = contentSections.contact
const leaveSomethingPages = contentSections.leaveSomething

const sections: Section[] = [
  ...introPages.map((p, i) => ({
    id: `intro-${i}`,
    // render: () => <div className="">{p}</div>,
    render: () => p,
  })),
  ...aboutPages.map((p, i) => ({
    id: `about-${i}`,
    // render: () => <div className="">{p}</div>,
    render: () => p,
  })),
  ...educationPages.map((p, i) => ({
    id: `education-${i}`,
    // render: () => <div className="">{p}</div>,
    render: () => p,
  })),
  ...skillsPages.map((p, i) => ({
    id: `skills-${i}`,
    // render: () => <div className="">{p}</div>,
    render: () => p,
  })),
  ...projectPages.map((p, i) => ({
    id: `projects-${i}`,
    // render: () => <div className="">{p}</div>,
    render: () => p,
  })),
  ...contactPages.map((p, i) => ({
    id: `contact-${i}`,
    // render: () => <div className="">{p}</div>,
    render: () => p,
  })),
  ...leaveSomethingPages.map((p, i) => ({
    id: `leaveSomething-${i}`,
    // render: () => <div className="">{p}</div>,
    render: () => p,
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

const Notebook = () => {
  // Paginate after heights + pageHeight are available
  const outerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number>(0)
  const [measuredHeights, setMeasuredHeights] = useState<
    Record<string, number[]>
  >({})

  const { pagesPerView, visibleItems, prev, next } =
    useNotebookPagination(sheets)

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
      <div className="w-[80vw] h-[80vh] min-h-[300px] max-h-[800px] flex border-4 border-gray-500">
        {visibleItems.map((sheet) => {
          const key =
            sheet.type === 'page'
              ? sheet.id
              : sheet.type === 'cover'
                ? `cover-${sheet.side}`
                : 'blank'

          return (
            <div key={key} className="flex-1 p-2 border-5 border-pink-500">
              <div className="w-full h-full">
                {sheet.type === 'cover' && <Cover side={sheet.side} />}
                {sheet.type === 'page' && (
                  <div className="w-full  h-full flex-1  flex border-10 border-yellow-500">
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
    </div>
  )
}

export default Notebook

/* WEEK 2 TO DO 
1. Create the rest of the sections placeholders.
2. Add bookmarks. 
3. Fix basic notebook layout.
*/
