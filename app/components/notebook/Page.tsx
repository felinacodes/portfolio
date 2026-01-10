import React from 'react'

interface PageProps {
  title: string
  content: string
}

const Page = ({ title, content }: PageProps) => {
  return (
    <div className="border-2 border-red-500 text-center w-full h-full flex flex-col justify-center items-center p-4">
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  )
}

export default Page
