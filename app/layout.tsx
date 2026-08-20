import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Homemade_Apple } from "next/font/google";
import { Indie_Flower } from "next/font/google";
import { Handlee } from "next/font/google";
import { Baskervville } from "next/font/google";
import { Jost } from "next/font/google";
import { Merriweather } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const handwritting = Homemade_Apple({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
});

const indieFlower = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-indie-flower",
});

const handlee = Handlee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handlee",
});

const baskervville = Baskervville({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-baskervville",
});

const jost = Jost({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jost",
});

const merriweather = Merriweather({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "Felina 🎀 ",
  description:
    "Portfolio of Felina, a freelance web developer creating interactive web applications.",
  openGraph: {
    title: "Felina | Web Developer",
    description:
      "Portfolio of Felina, a freelance web developer creating interactive web applications.",
    url: "",
    siteName: "Felina",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Felina | Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Felina | Web Developer",
    description:
      "Portfolio of Felina, a freelance web developer creating interactive web applications.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${handwritting.variable} 
        ${indieFlower.variable} 
        ${handlee.variable}  
        ${baskervville.variable} ${jost.variable} ${merriweather.variable}
        bg-background text-foreground
        antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
