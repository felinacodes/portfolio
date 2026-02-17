import React, { useEffect } from 'react'
import type { Sheet } from './Notebook'
import { transform } from './Notebook'

interface BookmarkProps {
  sectionIds: string[]
  goToIndex: (id: string) => void
  setIsOpen: (isOpen: boolean) => void
  active: string
  setActive: (id: string) => void
  visibleItems: Sheet[]
}

const Bookmarks = ({
  sectionIds,
  goToIndex,
  setIsOpen,
  active,
  setActive,
  visibleItems,
}: BookmarkProps) => {
  // const [active, setActive] = React.useState<string>('')
  // console.log('sectionIds', sectionIds)

  // const transform = (s: string) => {
  //   // console.log('transforming id: ', s)
  //   return s.slice(0, s.indexOf('-'))
  // }

  // useEffect(() => {
  //   console.log('bookmark visibleItem', visibleItems)
  //   // const visibleId = visibleItem?.id
  //   const visibleIds = visibleItems.map((item) => transform(item.id))
  //   const compare = visibleIds.some((id) => id === transform(active))
  //   if (!compare) {
  //     setActive('')
  //   }
  //   console.log('visible ids are: ', visibleIds)
  //   // if (transform(visibleId || '') !== transform(active)) {
  //   //   // console.log
  //   //   setActive('')
  //   // }
  //   // setActive(visibleId || '')
  // }, [visibleItems, setActive, active])

  function handleClick(id: string) {
    //   // console.log(`handleClick: ${id}`)
    //   // ignoreNe
    //   // setIsOpen(true)
    // if (active === id) setActive('')

    //   // window.location.hash = ''
    //   return
    // }
    // console.log('handleClick: ', id)
    // console.log('active before click: ', active)
    if (transform(active) === id) return
    console.log('go to index from bookmark:', id)
    goToIndex(id)
    setActive(id)
    // console.log('active', active)
    // setIsOpen(true)
  }

  // function handleClick(id: string) {
  //   if (active === id) {
  //     setActive('')

  //     // Remove the hash without affecting scroll position
  //     history.replaceState(
  //       null,
  //       '',
  //       window.location.pathname + window.location.search,
  //     )
  //     return
  //   }

  //   goToIndex(id)
  //   setActive(id)
  // }

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
