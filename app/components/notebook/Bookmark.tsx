import React from 'react'
import { Sheet } from './Notebook'

interface BookmarkProps {
  visibleItems: Sheet[]
  pageIds: string[]
  goToIndex: (id: string) => void
  setIsOpen?: (isOpen: boolean) => void
  setBookmarkedPage: (id: string) => void
}

// const getId = (sheet: Sheet) => {
//   if (sheet.type === 'cover') return
//   return sheet.id
// }

const Bookmark = ({
  visibleItems,
  pageIds,
  goToIndex,
  setIsOpen,
  setBookmarkedPage,
}: BookmarkProps) => {
  //   console.log(visibleItems)

  function handleClick(sheet: Sheet) {
    // if (sheet.type !== 'page') return
    if (sheet.type === 'cover') return
    const id = sheet.id
    setBookmarkedPage(id)
  }

  function RemoveBookmark() {
    setBookmarkedPage('')
  }
  return (
    // <div>{/* <button onClick={handleClick}>Bookmark this page</button> */}</div>
    <div>
      <button onClick={() => handleClick(visibleItems[0])}>
        Bookmark this page
      </button>
      <button className="m-2 p-4" onClick={() => RemoveBookmark()}>
        Remove Bookmark
      </button>
    </div>
  )
}

export default Bookmark
