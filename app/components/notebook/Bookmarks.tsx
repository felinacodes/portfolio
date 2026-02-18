import React from 'react'

import { transform } from './Notebook'

interface BookmarkProps {
  sectionIds: string[]
  goToIndex: (id: string) => void
  active: string
  setActive: (id: string) => void
}

const Bookmarks = ({
  sectionIds,
  goToIndex,
  active,
  setActive,
}: BookmarkProps) => {
  function handleClick(id: string) {
    if (transform(active) === id) return
    goToIndex(id)
    setActive(id)
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {sectionIds
        .filter((id) => id.endsWith('-0'))
        .map((id) => (
          <div key={id} className={''}>
            <a
              href={`#${transform(id)}`}
              onClick={() => handleClick(id)}
              // className={active === id ? 'text-blue-500' : ''}
              className={
                transform(active) === transform(id) ? 'text-blue-500' : ''
              }
            >
              {/* {id.slice(0, id.indexOf('-')).toUpperCase()} */}
              {((s) => s[0].toUpperCase() + s.slice(1))(
                id.slice(0, id.indexOf('-')),
              )}
            </a>
          </div>
        ))}
    </div>
  )
}

export default Bookmarks
