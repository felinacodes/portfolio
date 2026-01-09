import React from 'react'

interface PageProps {
  title: string
  content: string
}

const Page = ({ title, content }: PageProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  )
}

export default Page
