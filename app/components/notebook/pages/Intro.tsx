import React from 'react'
import Image from 'next/image'

export const IntroBlocks: React.ReactNode[] = [
  <section
    key="header"
    className="flex flex-col items-center justify-center p-4 border-2 border-pink-500 w-full h-full "
  >
    <div className="w-48 h-48 rounded-full overflow-hidden border">
      <Image
        src="/me.jpg"
        alt="Portrait"
        width={96}
        height={96}
        className="object-cover"
      />
    </div>

    <div className="flex flex-col gap-2 items-center justify-center mt-4">
      <h1 className="text-2xl font-semibold">FelinaCodes</h1>
      <p className="text-sm text-gray-500">Freelance Web Developer</p>
      <p className="text-sm text-gray-500">React · Next.js · HTML/ CSS/ JS</p>
    </div>
  </section>,
]

export default function Intro() {
  return (
    // <div className="w-full h-full text-left text-sm border-2 border-green-700">
    //   {IntroBlocks}
    // </div>
    { IntroBlocks }
  )
}
