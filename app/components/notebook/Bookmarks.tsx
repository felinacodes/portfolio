import React from 'react'

interface BookmarkProps {
  sectionIds: string[]
  goToIndex: (id: string) => void
  setIsOpen: (isOpen: boolean) => void
}

const Bookmarks = ({ sectionIds, goToIndex, setIsOpen }: BookmarkProps) => {
  function handleClick(id: string) {
    // console.log(`handleClick: ${id}`)
    // ignoreNe
    goToIndex(id)
    // setIsOpen(true)
  }

  const transform = (s: string) => {
    return s.slice(0, s.indexOf('-'))
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {sectionIds
        .filter((id) => id.endsWith('-0'))
        .map((id) => (
          <div key={id} className={''}>
            <a href={`#${transform(id)}`} onClick={() => handleClick(id)}>
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
