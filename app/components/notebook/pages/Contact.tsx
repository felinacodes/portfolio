import React, { useState } from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";
import { SiFiverr, SiUpwork } from "react-icons/si";

const contactSections = [
  {
    contact: [
      {
        name: "X",
        icon: "devicon-twitter-original",
        hover: "hover:text-blue-500 active:text-blue-500 cursor-pointer",
        href: "https://x.com/Felina_codes",
      },
      {
        name: "Github",
        icon: "devicon-github-original",
        hover: "hover:text-gray-700 active:text-gray-700 cursor-pointer",
        href: "https://github.com/felinacodes",
      },
      {
        name: "LinkedIn",
        icon: "devicon-linkedin-plain",
        hover: "hover:text-blue-700 active:text-blue-700 cursor-pointer",
        href: "https://www.linkedin.com/in/maria-a-0069a13a3/",
      },
      {
        name: "Fiverr",
        icon: "devicon-fiverr-plain",
        hover: "hover:text-green-500 active:text-green-500 cursor-pointer",
        href: "https://www.fiverr.com/felinacodes",
      },
      {
        name: "Upwork",
        icon: "devicon-upwork-plain",
        hover: "hover:text-green-600 active:text-green-600 cursor-pointer",
        href: "https://www.upwork.com/freelancers/~01e5baf4ad0985aea7",
      },
    ],
  },
];
export const ContactBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  return [
    <section
      key="contact"
      className="section-wrapper flex flex-col items-center justify-start h-full w-full p-2 gap-2 "
    >
      <ChapterIntro
        key="chapter-intro"
        name={"Contact"}
        chapterNumber={chapter}
      />

      <div className="flex flex-col gap-4 place-items-stretch justify-center  w-full">
        <div>
          {contactSections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 items-center justify-center  w-full"
            >
              <ul className="flex flex-row gap-4 flex-wrap items-center justify-around  w-full">
                {section.contact.map((contact) => (
                  <li key={contact.name}>
                    <a
                      className={`${contact.hover} transition duration-300`}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {contact.name === "Fiverr" ? (
                        <SiFiverr className="text-3xl" />
                      ) : contact.name === "Upwork" ? (
                        <SiUpwork className="text-3xl" />
                      ) : (
                        <i className={`${contact.icon} text-3xl`} />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full h-full ">
        <form action="" className="flex flex-col  gap-4 h-full">
          <div className="flex flex-row gap-2 flex-wrap justify-center items-center">
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                className="m-2 border rounded-md p-1"
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                className="m-2 border rounded-md p-1"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2  h-full">
            <label htmlFor="message" className="text-start">
              {/* Message: */}
            </label>

            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              className="m-2 border rounded-md p-1 h-auto resize-none flex-1"
            ></textarea>
          </div>

          <button
            className="cursor-pointer font-bold
           text-white bg-black text-center py-2 px-4 rounded-md 
           w-32 self-center mt-4 hover:bg-gray-800 active:bg-gray-700 
           transition duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </section>,
  ];
};
