import React from 'react'
import Image from 'next/image'

export const bioBlocks: React.ReactNode[] = [
  // HEADER
  <section
    key="header"
    className="flex items-center gap-4 mb-6 border-2 border-green-700"
  >
    <div className="w-24 h-24 rounded-full overflow-hidden border">
      <Image
        src="/me.jpg" // put this in /public
        alt="Portrait"
        width={96}
        height={96}
        className="object-cover"
      />
    </div>

    <div>
      <h1 className="text-2xl font-semibold">Felina</h1>
      <p className="text-sm text-gray-500">Frontend Developer</p>
      <p className="text-sm text-gray-500">React · Next.js · UI Engineering</p>
    </div>
  </section>,

  // PARAGRAPH 1
  <p key="p1" className="mb-4 leading-relaxed border-2 border-green-700">
    I’m a frontend developer focused on building clean, interactive user
    interfaces that don’t feel like a punishment to use. My work sits at the
    intersection of design and engineering, where layout, motion, and structure
    actually matter.
  </p>,

  // PARAGRAPH 2
  <p key="p2" className="mb-4 leading-relaxed border-2 border-green-700">
    I work primarily with React and Next.js, building component-driven systems
    that scale without turning into unreadable spaghetti. I care about
    maintainability, predictable state, and UI logic that doesn’t surprise the
    next developer who opens the file.
  </p>,

  // QUOTE / HIGHLIGHT
  <blockquote
    key="quote"
    className="mb-6 border-l-4 pl-4 italic text-gray-600 border-2 border-green-700"
  >
    “If it looks simple, that’s because I removed everything unnecessary.”
  </blockquote>,

  // PARAGRAPH 3
  <p key="p3" className="mb-4 leading-relaxed border-2 border-green-700">
    Outside of code, I care about clarity. Clear layouts, clear typography,
    clear intent. I like interfaces that guide users quietly instead of shouting
    at them. Animations should explain, not entertain themselves.
  </p>,

  // SKILLS LIST
  <section key="skills" className="mb-6 border-2 border-green-700">
    <h2 className="text-lg font-semibold mb-2">Core Skills</h2>
    <ul className="list-disc list-inside space-y-1 text-sm">
      <li>React, Next.js (App Router)</li>
      <li>TypeScript</li>
      <li>Tailwind CSS</li>
      <li>Component architecture</li>
      <li>Responsive layout systems</li>
    </ul>
  </section>,

  // FINAL PARAGRAPH
  <p key="p4" className="leading-relaxed border-2 border-green-700">
    This notebook format reflects how I think about projects: structured,
    layered, and intentional. Each section has a purpose, and nothing is here by
    accident.
  </p>,
]

export default function Bio() {
  return (
    <div className="w-full h-full text-left text-sm border-2 border-green-700">
      {bioBlocks}
    </div>
  )
}
