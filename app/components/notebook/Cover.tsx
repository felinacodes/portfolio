import React from 'react'

interface CoverProps {
  side: string
}

const Cover = ({ side }: CoverProps) => {
  return (
    <div>
      <h1 className="text-red-500">Cover with side {side}</h1>
    </div>
  )
}

export default Cover
