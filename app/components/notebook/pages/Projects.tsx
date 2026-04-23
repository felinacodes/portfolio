import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";
import { ExternalLink, Star } from "lucide-react";

const projects = [
  {
    title: "Nile Lab - Gamehub",
    image: "/images/nile_crop.webp",
    alt: "gamehub",
    live: "https://gamehub.nile.hmu.gr/",
    github: null,
    description:
      "As part of my Thesis, I redesigned and developed the front-end of an existing web application. I focused on improving the UX and visual design of the app while maintaining the existing functionality and integrating with the existing back-end API.",
    features: [
      "Mobile-first responsive layout",
      "Interactive elements and animations",
      "Aligned UI with brand guidelines",
    ],
    tech: [
      "devicon-react-original hover:text-blue-400 active:text-blue-400",
      "devicon-materialui-plain hover:text-blue-500 active:text-blue-500",
      "devicon-typescript-plain hover:text-blue-700 active:text-blue-700",
      "devicon-vite-original transition hover:scale-110 active:scale-110 hover:bg-gradient-to-r active:bg-gradient-to-r hover:from-purple-500 active:from-purple-500 hover:via-pink-500 active:via-pink-500 hover:to-yellow-400 active:to-yellow-400 hover:text-transparent active:text-transparent hover:bg-clip-text",
    ],
  },
  {
    title: "Pilates Studio Landing Page",
    image: "/images/pilates-studio.webp",
    alt: "pilates-studio",
    live: "https://mypilateslandingpage.netlify.app/",
    github: "https://github.com/felinacodes/pilates-studio",
    description:
      "Designed and developed a modern landing page for a pilates studio, focusing on performance, clean visual hierarchy, and conversion-friendly layout. Optimized for fast load times and smooth responsiveness across devices.",
    features: [
      "Mobile-first responsive layout",
      "Optimized performance",
      "Clean UI structure",
    ],
    tech: [
      "devicon-react-original hover:text-blue-400 active:text-blue-400",
      "devicon-tailwindcss-plain hover:text-cyan-400 active:text-cyan-400",
      "devicon-typescript-plain hover:text-blue-700 active:text-blue-700",
      "devicon-vite-original transition hover:scale-110 active:scale-110 hover:bg-gradient-to-r active:bg-gradient-to-r hover:from-purple-500 active:from-purple-500 hover:via-pink-500 active:via-pink-500 hover:to-yellow-400 active:to-yellow-400 hover:text-transparent active:text-transparent hover:bg-clip-text",
    ],
  },
  {
    title: "Movie Inventory App",
    image: "/images/movie-inventory.webp",
    alt: "movie-inventory",
    live: "https://inventoryapplication-ejfd.onrender.com/",
    github: "https://github.com/felinacodes/inventoryApplication",
    description:
      "Developed a movie web application using Express and EJS, featuring dynamic content rendering and structured routing. Implemented server-side logic to manage movie data and user interactions.",
    features: [
      "Database design and hosting",
      "Image upload and hosting using Cloudinary",
      "All CRUD operations",
      "Searching functionality",
    ],
    tech: [
      "devicon-express-original hover:text-gray-400 active:text-gray-400",
      "devicon-tailwindcss-plain hover:text-cyan-400 active:text-cyan-400",
      "devicon-typescript-plain hover:text-blue-700 active:text-blue-700",
      "devicon-postgresql-plain hover:text-blue-700 active:text-blue-700",
    ],
  },
  {
    title: "Battleship Game",
    image: "/images/battleship.webp",
    alt: "battleship",
    live: "https://felinacodes.github.io/battleship/",
    github: "https://github.com/felinacodes/battleship",
    description:
      "The classic game of Battleship, where players try to sink the opponent's ships by shooting them with their own ships. The game features a unique board design, where each square on the board represents a ship. The game was developed using the TDD approach.",
    features: ["TDD approach", "Scorring system", "Game reset and restart"],
    tech: [
      "devicon-javascript-plain hover:text-yellow-400 active:text-yellow-400",
      "devicon-css3-plain hover:text-blue-600 active:text-blue-600",
      "devicon-jest-plain hover:text-pink-500 active:text-pink-500",
      "devicon-webpack-plain hover:text-blue-700 active:text-blue-700",
    ],
  },
];

export const ProjectsBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  return projects.map((project, index) => {
    const ProjectPage = () => (
      <section
        className={`${
          index === 0 ? "section-wrapper" : "mt-4"
        } flex flex-col items-center justify-start w-full p-2 gap-2`}
      >
        {index === 0 && (
          <ChapterIntro name={"Projects"} chapterNumber={chapter} />
        )}

        <div className="text-[0.9rem] sm:text-[1rem] xl:text-[1.2rem] leading-snug">
          <div className="flex flex-wrap w-full gap-4 items-center justify-center">
            <div className="relative w-48 shrink-0 aspect-square rounded-lg overflow-hidden border">
              <Image
                src={project.image}
                alt={project.alt}
                fill
                className="object-cover grayscale hover:grayscale-0 active:grayscale-0 transition duration-1000 ease-in"
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-4 m-4">
              <h1 className="text-center font-bold text-md xl:text-xl mb-2 border-b-2 border-b-gray-500 w-max">
                {project.title}
              </h1>

              <div className="flex flex-row gap-4 justify-center items-center">
                <a
                  className="hover:text-gray-500 active:text-gray-500"
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={32} />
                </a>

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="devicon-github-plain text-3xl hover:text-gray-500 active:text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="text-start max-w-[65ch] xl:mt-5 mt-2 space-y-2 lg:space-y-4 p-2">
            <p>{project.description}</p>

            <ul className="space-y-1">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Star
                    size={14}
                    className="text-gray-500 hover:text-yellow-500 active:text-yellow-500"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex-wrap gap-2 md:gap-4 items-center justify-start mt-4 flex">
              <span className="font-bold"> Tech Stack: </span>

              {project.tech.map((tech, i) => (
                <span key={i}>
                  <i
                    data-no-flip
                    className={`${tech} text-gray-500 text-xl lg:text-3xl`}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    );

    return ProjectPage;
  });
};
