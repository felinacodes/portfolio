import React, { useState, useRef, useEffect } from "react";
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

  const ContactPage = () => {
    // const turnstileRef = useRef<HTMLDivElement>(null);
    // const widgetRendered = useRef(false);

    // useEffect(() => {
    //   let interval: number | undefined;

    //   const renderTurnstile = () => {
    //     if (
    //       !window.turnstile ||
    //       !turnstileRef.current ||
    //       widgetRendered.current
    //     ) {
    //       return;
    //     }

    //     window.turnstile.render(turnstileRef.current, {
    //       sitekey: "0x4AAAAAAC-mfSy8WITssxkQ",
    //       callback: (token: string) => {
    //         window.turnstileToken = token;
    //       },
    //     });

    //     widgetRendered.current = true;
    //   };

    //   renderTurnstile();

    //   if (!widgetRendered.current) {
    //     interval = window.setInterval(renderTurnstile, 100);
    //   }

    //   return () => {
    //     if (interval) {
    //       window.clearInterval(interval);
    //     }
    //     if (turnstileRef.current) {
    //       turnstileRef.current.innerHTML = "";
    //     }
    //     widgetRendered.current = false;
    //   };
    // }, []);

    const [errors, setErrors] = useState({
      name: "",
      email: "",
      message: "",
    });

    const handleAutoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const name = formData.get("name")?.toString() || "";
      const email = formData.get("email")?.toString() || "";
      const message = formData.get("message")?.toString() || "";
      const companyNumber = formData.get("CompanyNumber")?.toString() || "";
      // const token =
      //   formData.get("cf-turnstile-response")?.toString() ||
      //   window.turnstileToken ||
      //   "";

      const newErrors = {
        name: "",
        email: "",
        message: "",
      };

      // Name validation
      if (!name || name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters.";
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email && !emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address.";
      }

      // Message validation
      if (!message || message.trim().length < 5) {
        newErrors.message = "Message must be at least 5 characters.";
      }

      setErrors(newErrors);

      if (Object.values(newErrors).some((err) => err !== "")) {
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, companyNumber, token }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Sent!");
        e.currentTarget.reset();
        setErrors({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send.");
      }
    };

    return (
      <section className="section-wrapper flex flex-col items-center justify-start h-full w-full p-2 gap-2">
        <ChapterIntro name={"Contact"} chapterNumber={chapter} />

        {/* SOCIAL LINKS */}
        <div className="flex flex-col gap-4 place-items-stretch justify-center w-full">
          {contactSections.map((section, index) => (
            <div key={index} className="flex justify-center w-full">
              <ul className="flex flex-row gap-4 flex-wrap justify-around w-full">
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

        {/* FORM */}
        <div className="mt-6 w-full h-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
            {/* NAME */}
            <div className="self-center">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                placeholder="Your Name"
                name="name"
                className="m-2 border rounded-md p-1"
              />
              {errors.name && (
                <p className="text-myPinkDark text-sm ml-2">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="self-center">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                className="m-2 border rounded-md p-1"
              />
              {errors.email && (
                <p className="text-myPinkDark text-sm ml-2">{errors.email}</p>
              )}
            </div>

            {/* MESSAGE */}
            <div className="flex flex-col gap-2 h-full ">
              <label htmlFor="message"></label>
              <textarea
                placeholder="Your Message"
                name="message"
                className="m-2 border rounded-md p-1 h-auto resize-none overflow-auto min-h-[70%]"
                onInput={handleAutoResize}
              />
              {errors.message && (
                <p className="text-myPinkDark text-sm ml-2 pb-2 ">
                  {errors.message}
                </p>
              )}
            </div>

            <input
              type="text"
              name="CompanyNumber"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* <div ref={turnstileRef} /> */}

            {/* BUTTON */}
            <button
              type="submit"
              className="cursor-pointer self-center text-white bg-gray-900 hover:bg-gray-700 py-2 px-4 rounded-md"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    );
  };

  return [ContactPage];
};
