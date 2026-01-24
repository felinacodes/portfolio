import { useLayoutEffect, useRef, useState } from 'react'

function usePageHeight() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (!ref.current) return

    const measure = () => {
      setHeight(ref.current!.getBoundingClientRect().height)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return { ref, height }
}

export default usePageHeight
