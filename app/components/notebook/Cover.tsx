import React from 'react'

interface CoverProps {
  side: string
}

const Cover = ({ side }: CoverProps) => {
  return (
    <div>
      <h1 className="border-2 border-yellow-500 text-center w-full h-full flex flex-col justify-center items-center p-4">
        Cover with side {side}
      </h1>
    </div>
  )
}

export default Cover
