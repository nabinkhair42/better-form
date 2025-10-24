import { BASE_URL } from "@/seo";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Add more routes as your application grows
    // {
    //   url: `${BASE_URL}/docs`,
    //   lastModified: currentDate,
    //   changeFrequency: "weekly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${BASE_URL}/examples`,
    //   lastModified: currentDate,
    //   changeFrequency: "monthly",
    //   priority: 0.7,
    // },
  ];
}
