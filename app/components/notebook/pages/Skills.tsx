import React from "react";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

const skillSections = [
  {
    title: "Front-End",
    skills: [
      {
        name: "HTML",
        icon: "devicon-html5-plain",
        hover: "hover:text-orange-600 active:text-orange-600",
      },
      {
        name: "CSS",
        icon: "devicon-css3-plain",
        hover: "hover:text-blue-600 active:text-blue-600",
      },
      {
        name: "JavaScript",
        icon: "devicon-javascript-plain",
        hover: "hover:text-yellow-400 active:text-yellow-400",
      },
      {
        name: "Tailwind",
        icon: "devicon-tailwindcss-plain",
        hover: "hover:text-cyan-400 active:text-cyan-400",
      },
      {
        name: "React",
        icon: "devicon-react-original",
        hover: "hover:text-blue-400 active:text-blue-400",
      },
      {
        name: "TypeScript",
        icon: "devicon-typescript-plain",
        hover: "hover:text-blue-700 active:text-blue-700",
      },
      {
        name: "Next.js",
        icon: "devicon-nextjs-plain",
        hover: "hover:text-gray-300 active:text-gray-300",
      },
    ],
  },
  {
    title: "Back-End",
    skills: [
      {
        name: "Node.js",
        icon: "devicon-nodejs-plain",
        hover: "hover:text-green-600 active:text-green-600",
      },
      {
        name: "Express",
        icon: "devicon-express-original",
        hover: "hover:text-gray-200 active:text-gray-200",
      },
      {
        name: "PostgreSQL",
        icon: "devicon-postgresql-plain",
        hover: "hover:text-blue-700 active:text-blue-700",
      },
      {
        name: "MongoDB",
        icon: "devicon-mongodb-plain",
        hover: "hover:text-green-500 active:text-green-500",
      },
    ],
  },
  {
    title: "Dev Tools",
    skills: [
      {
        name: "Git",
        icon: "devicon-git-plain",
        hover: "hover:text-red-500 active:text-red-500",
      },
      {
        name: "GitHub",
        icon: "devicon-github-plain",
        hover: "hover:text-gray-500 active:text-gray-500",
      },
      {
        name: "npm",
        icon: "devicon-npm-plain",
        hover: "hover:text-red-600 active:text-red-600",
      },
      {
        name: "VS Code",
        icon: "devicon-vscode-plain",
        hover: "hover:text-blue-600 active:text-blue-600",
      },
      {
        name: "Linux",
        icon: "devicon-linux-plain",
        hover: "hover:text-yellow-500 active:text-yellow-500",
      },
      {
        name: "Jest",
        icon: "devicon-jest-plain",
        hover: "hover:text-pink-500 active:text-pink-500",
      },
    ],
  },
  {
    title: "Other / Misc",
    skills: [
      {
        name: "Notion",
        icon: "devicon-notion-plain",
        hover: "hover:text-gray-500 active:text-gray-500",
      },
      {
        name: "Blender",
        icon: "devicon-blender-original",
        hover: "hover:text-orange-500 active:text-orange-500",
      },
    ],
  },
];

export const SkillsBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  return [
    () => (
      <section className="section-wrapper flex flex-col items-center justify-start h-full w-full p-2 gap-6">
        <ChapterIntro name="Skills" chapterNumber={chapter} />

        <div className="w-full text-start text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug space-y-2 lg:space-y-4">
          {skillSections.slice(0, 2).map((section) => (
            <div key={section.title}>
              <h2 className="font-bold text-lg mb-2 border-b-2 border-b-gray-500 w-max">
                {section.title}:
              </h2>

              <ul className="w-full grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                {section.skills.map((skill) => (
                  <li
                    data-no-flip
                    key={skill.name}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border bg-gray-800 text-white transition ${skill.hover}`}
                  >
                    <i className={`${skill.icon} text-3xl`} />
                    <span className="text-sm font-medium">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),

    () => (
      <section className="section-wrapper flex flex-col items-center justify-start w-full p-2 gap-6">
        <div className="mt-4 w-full text-start text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug space-y-2 lg:space-y-4">
          {skillSections.slice(2).map((section) => (
            <div key={section.title}>
              <h2 className="font-bold text-lg mb-2 border-b-2 border-b-gray-500 w-max">
                {section.title}:
              </h2>

              <ul className="w-full grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                {section.skills.map((skill) => (
                  <li
                    data-no-flip
                    key={skill.name}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border bg-gray-800 text-white transition ${skill.hover}`}
                  >
                    <i className={`${skill.icon} text-3xl`} />
                    <span className="text-sm font-medium">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),
  ];
};
