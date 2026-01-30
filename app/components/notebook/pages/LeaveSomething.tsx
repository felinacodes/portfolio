import React from 'react'
import Image from 'next/image'

export const LeaveSomethingBlocks: React.ReactNode[] = [
  <section
    key="header"
    className="flex flex-col items-center justify-center p-4 border-2 border-pink-500 w-full h-full "
  >
    <h1>Leave Me Something: </h1>
  </section>,
]

export default function Intro() {
  return (
    // <div className="w-full h-full text-left text-sm border-2 border-green-700">
    //   {IntroBlocks}
    // </div>
    { LeaveSomethingBlocks }
  )
}
