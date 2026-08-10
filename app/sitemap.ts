import type { MetadataRoute } from "next";

const pages = [
  "content-0",
  "about-0",
  "education-0",
  "skills-0",
  "projects-0",
  "contact-0",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return pages.map((pageId) => ({
    url: `${baseUrl}/${pageId}`,
    lastModified: new Date(),
  }));
}
