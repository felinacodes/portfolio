import React from 'react'
import { transform } from '../Notebook'
import ChapterIntro from './ChapterIntro'

export const TableOfContentsBlocks = (
  context?: Map<string, number>,
  goToIndex?: (id: string) => void,
) => {
  return [
    // <ChapterIntro
    //   key="chapter-intro"
    //   name={'Table Of Contents'}
    //   icon={'/images/icons/bio.svg'}
    // />,
    <section
      key="header"
      className="flex flex-col items-center justify-center p-4 border-2 border-pink-500 w-full h-full"
    >
      <h1>Table of Contents</h1>
      {context &&
        Array.from(context.entries()).map(([key, value]) => (
          <div
            key={String(key).toUpperCase()}
            className="cursor-pointer hover:bg-gray-200 p-1 rounded"
            onClick={() => goToIndex?.(key)} // call goToIndex on click
          >
            <h2>{transform(key)?.toUpperCase()}</h2>
            <p>{value}</p>
          </div>
        ))}
    </section>,
  ]
}

export default function TableOfContents({
  goToIndex,
}: {
  goToIndex?: (id: string) => void
}) {
  return <>{TableOfContentsBlocks(undefined, goToIndex)}</>
}
