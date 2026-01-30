import React from 'react'
import Image from 'next/image'

export const SkillsBlocks: React.ReactNode[] = [
  <section
    key="header"
    className="flex flex-col items-center justify-center p-4 border-2 border-pink-500 w-full h-full "
  >
    <h1>Skills:</h1>
    <ul>
      <h1>Front-End:</h1>
      <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
        <li>Tailwind</li>
        <li>React</li>
        <li>TypeScript</li>
        <li>Next.js</li>
      </ul>
      <h1>Back-End:</h1>
      <ul>
        <li>Node.js</li>
        <li>Express</li>
        <li>PostreSQL</li>
        <li>MongoDB</li>
      </ul>
      <h1>Misc:</h1>
      <ul>
        <li>Git</li>
        <li>Jest</li>
        <li>VS Code</li>
      </ul>
    </ul>
  </section>,
]

export default function Skills() {
  return (
    // <div className="w-full h-full text-left text-sm border-2 border-green-700">
    //   {IntroBlocks}
    // </div>
    { SkillsBlocks }
  )
}
