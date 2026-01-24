import React from 'react'

const CV = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Curriculum Vitae</h2>

      <div>
        <h3 className="font-medium">Skills</h3>
        <ul className="list-disc list-inside">
          <li>HTML / CSS</li>
          <li>JavaScript / TypeScript</li>
          <li>React / Next.js</li>
          <li>Responsive Design</li>
        </ul>
      </div>

      <div>
        <h3 className="font-medium">Experience</h3>
        <p>
          Freelance Web Developer — building, fixing, and untangling front-end
          interfaces for clients who swear nothing was changed.
        </p>
      </div>
    </section>
  )
}

export default CV
