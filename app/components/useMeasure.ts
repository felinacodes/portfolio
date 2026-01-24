import { useLayoutEffect, useState } from 'react'

function useMeasure(ref: React.RefObject<HTMLElement>) {
  const [rect, setRect] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return

    const measure = () => {
      const r = ref.current!.getBoundingClientRect()
      setRect({ width: r.width, height: r.height })
    }

    measure() // initial measurement
    window.addEventListener('resize', measure)

    return () => window.removeEventListener('resize', measure)
  }, []) // empty deps, but measurement triggered manually inside

  return rect
}

export default useMeasure
