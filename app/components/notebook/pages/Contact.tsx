import React from "react";
import Image from "next/image";
import ChapterIntro from "./ChapterIntro";
import { RenderContext } from "../Notebook";

export const ContactBlocks = (args?: RenderContext) => {
  const chapter = args?.chapter;

  return [
    <section
      key="contact"
      className="gap-4 flex flex-col items-center justify-center p-4  w-full h-full"
    >
      <ChapterIntro
        key="chapter-intro"
        name={"Contact"}
        icon={"/images/icons/bio.svg"}
      />
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1>Lets Connect 👋</h1>
        <div className="flex flex-row gap-4 flex-wrap items-center justify-center">
          <a href="">Twitter</a>
          <a href="">Github</a>
          <a href="">LinkeIn</a>
          <a href="">Email</a>
          <a href="">Instagram</a>
          <a href="">Fiverr Gigs</a>
          <a href="">Upwork</a>
        </div>
      </div>
      <div className="">
        <form action="" className="flex flex-col gap-4">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Your Name" />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
          />
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </section>,
  ];
};
