import React, { forwardRef } from 'react'

interface PageProps {
  children?: React.ReactNode
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children }, ref) => {
  return (
    <div className="page h-full w-full flex flex-col p-4 min-h-0">
      {/* CONTENT AREA */}
      <div
        ref={ref}
        className="flex-1 w-full overflow-hidden border-2 border-blue-500"
      >
        {children}
      </div>

      {/* FOOTER */}
      <div className="shrink-0">
        <h1 className="text-lg border-2 border-red-500 m-2 p-2 text-center">
          FOOTER TEST
        </h1>
      </div>
    </div>
  )
})

Page.displayName = 'Page'

export default Page
