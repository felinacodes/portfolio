import React from 'react'
import Image from 'next/image'

export const aboutBlocks: React.ReactNode[] = [
  <section
    key="about-me"
    className="gap-4 flex flex-col p-4 m-2 border-2 border-green-200 items-center justify-center"
  >
    <p key="intro">
      Hello. My name is Maria (a.k.a. Felina) and I am a Web Developer. I am
      currently working as a freelance developer, building websites and web
      applications.
    </p>

    <p>
      Since I was a child I have always been fascinated by the world of
      computers and technology. I have always been interested in how things work
      and how they can be imrpoved. This led me to pursue a degreen in Computer
      Engineering, along side learning about Web Develoment on my own following
      various sources and courses and building my own projects. Outside of
      coding, I enjoy working out, movies, and books (In case it is not obvious.
      🙃)
    </p>
  </section>,
  <p key="focus-area">
    I currently focus on Front-end Devolpment and specifically highly
    interactive and responsive user interfaces using React and Next.js. I care
    about clean code, maintainability, and creating user experiences that are
    intuitive and enjoyable.
  </p>,
]

export default function About() {
  // return <div className="w-full h-full text-left text-sm">{aboutBlocks}</div>
  return { aboutBlocks }
}
