import React from 'react'
import Image from 'next/image'

export const ProjectsBlocks: React.ReactNode[] = [
  <section
    key="project-1"
    className="flex flex-col items-center justify-center p-4 gap-4 h-full w-full"
  >
    <div className="flex">
      <div className="w-48 h-48 rounded-[25px] border">
        <Image
          src="/project1.jpg"
          alt="Portrait"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 m-4">
        <h1>Project 1</h1>
        <a href=" ">Live Demo</a>
        <a href="">Github</a>
      </div>
    </div>

    <p>
      This projects is a simple website that showcases something. It took X
      amount of time to build and I learned Y skills while working on it.
    </p>
    <p>Technologies used: React, HTML, TypeScript</p>
  </section>,

  <section
    key="project-2"
    className="flex flex-col items-center justify-center p-4 gap-4 h-full w-full"
  >
    <div className="flex">
      <div className="w-48 h-48 rounded-[25px] border">
        <Image
          src="/project1.jpg"
          alt="Portrait"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 m-4">
        <h1>Project 1</h1>
        <a href=" ">Live Demo</a>
        <a href="">Github</a>
      </div>
    </div>

    <p>
      This projects is a simple website that showcases something. It took X
      amount of time to build and I learned Y skills while working on it.
    </p>
    <p>Technologies used: React, HTML, TypeScript</p>
  </section>,

  <section
    key="project-3"
    className="flex flex-col items-center justify-center p-4 gap-4 h-full w-full"
  >
    <div className="flex">
      <div className="w-48 h-48 rounded-[25px] border">
        <Image
          src="/project1.jpg"
          alt="Portrait"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 m-4">
        <h1>Project 1</h1>
        <a href=" ">Live Demo</a>
        <a href="">Github</a>
      </div>
    </div>

    <p>
      This projects is a simple website that showcases something. It took X
      amount of time to build and I learned Y skills while working on it.
    </p>
    <p>Technologies used: React, HTML, TypeScript</p>
  </section>,

  <section
    key="project-4"
    className="flex flex-col items-center justify-center p-4 gap-4 h-full w-full"
  >
    <div className="flex">
      <div className="w-48 h-48 rounded-[25px] border">
        <Image
          src="/project1.jpg"
          alt="Portrait"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 m-4">
        <h1>Project 1</h1>
        <a href=" ">Live Demo</a>
        <a href="">Github</a>
      </div>
    </div>

    <p>
      This projects is a simple website that showcases something. It took X
      amount of time to build and I learned Y skills while working on it.
    </p>
    <p>Technologies used: React, HTML, TypeScript</p>
  </section>,

  <section
    key="project-5"
    className="flex flex-col items-center justify-center p-4 gap-4 h-full w-full"
  >
    <div className="flex">
      <div className="w-48 h-48 rounded-[25px] border">
        <Image
          src="/project1.jpg"
          alt="Portrait"
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 m-4">
        <h1>Project 1</h1>
        <a href=" ">Live Demo</a>
        <a href="">Github</a>
      </div>
    </div>

    <p>
      This projects is a simple website that showcases something. It took X
      amount of time to build and I learned Y skills while working on it.
    </p>
    <p>Technologies used: React, HTML, TypeScript</p>
  </section>,
]

export default function Projects() {
  return (
    // <div className="w-full h-full text-left text-sm border-2 border-green-700">
    //   {IntroBlocks}
    // </div>
    { ProjectsBlocks }
  )
}
