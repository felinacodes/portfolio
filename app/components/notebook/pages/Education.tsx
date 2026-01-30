import React from 'react'
import Image from 'next/image'

export const EducationBlocks: React.ReactNode[] = [
  <section
    key="education"
    className="flex flex-col items-center justify-center p-4 border-2 border-pink-500 w-full h-full"
  >
    <div className="w-full max-w-md text-left">
      <h3 className="font-semibold mb-2">Degrees</h3>
      <ol className="list-decimal list-inside">
        <li>
          <b>Hellenic Mediterranean University:</b> BSc in Computer and
          Informatics Engineering
        </li>
      </ol>

      <h3 className="font-semibold mt-6 mb-2">Courses</h3>
      <ol className="list-decimal list-inside ml-4">
        <li>The Odin Project</li>
      </ol>
    </div>
  </section>,
]

export default function Education() {
  return (
    // <div className="w-full h-full text-left text-sm border-2 border-green-700">
    //   {IntroBlocks}
    // </div>
    { EducationBlocks }
  )
}
