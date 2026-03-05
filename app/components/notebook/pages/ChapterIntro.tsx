import React from 'react'

interface ChapterIntroProps {
  name?: string
  icon?: string
}

const ChapterIntro = ({ name, icon }: ChapterIntroProps) => {
  return (
    <div>
      <p className="text-center">{name}</p>
    </div>
  )
}

export default ChapterIntro
