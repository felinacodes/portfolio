import React, { useEffect, useRef, useLayoutEffect } from 'react'
import Page from './Page'

type Props = {
  blocks: React.ReactNode[]
  width?: number
  onMeasured?: (heights: number[]) => void
}
export default function MeasureBlocks({ blocks, width, onMeasured }: Props) {
  const refs = useRef<HTMLDivElement[]>([])

  useLayoutEffect(() => {
    const heights = refs.current.map(
      (el) => el?.getBoundingClientRect().height || 0,
    )
    onMeasured?.(heights)
  }, [blocks, onMeasured, width])

  return (
    <div className="absolute -left-[9999px] top-0" style={{ width }}>
      <Page>
        {blocks.map((block, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) refs.current[i] = el
            }}
          >
            {block}
          </div>
        ))}
      </Page>
    </div>
  )
}

// export default function MeasureBlocks({ blocks, width, onMeasured }: Props) {
//   const refs = useRef<HTMLDivElement[]>([])
//   useEffect(() => {
//     const heights = refs.current.map(
//       (el) => el?.getBoundingClientRect().height || 0,
//     )
//     onMeasured?.(heights)
//   }, [blocks, onMeasured])

//   return (
//     <div className="absolute -left-[9999px] top-0" style={{ width }}>
//       {blocks.map((block, i) => (
//         <div
//           key={i}
//           ref={(el) => {
//             if (el) refs.current[i] = el
//           }}
//         >
//           {block}
//         </div>
//       ))}
//     </div>
//   )
// }
