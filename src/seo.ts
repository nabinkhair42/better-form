import { Metadata } from "next";

// Base URL for the application
export const BASE_URL = "https://better-form.nabinkhair.com.np";

// Site configuration
export const siteConfig = {
  name: "Better Form",
  title: "Better Form - DX-First Dynamic Form Builder for React & Next.js",
  description:
    "A next-generation developer-first dynamic form builder for React and Next.js. Build powerful forms with drag & drop, live preview, TypeScript, Zod validation, and Shadcn/UI components.",
  url: BASE_URL,
  ogImage: `${BASE_URL}/og-image.png`,
  keywords: [
    "form builder",
    "react form builder",
    "nextjs form builder",
    "dynamic form builder",
    "shadcn ui forms",
    "react hook form",
    "zod validation",
    "typescript forms",
    "drag and drop form builder",
    "form generator",
    "developer tools",
    "dx first",
    "form library",
    "react forms",
    "next.js forms",
    "tailwindcss forms",
    "form creator",
    "online form builder",
    "custom form builder",
    "open source form builder",
  ],
  authors: [
    {
      name: "Nabin Khair",
      url: "https://github.com/nabinkhair42",
    },
  ],
  creator: "Nabin Khair",
  publisher: "Nabin Khair",
  category: "Developer Tools",
  classification: "Web Development Tool",
};

// Default metadata for the application
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@nabinkhair42",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "", // TODO: will configure later
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: siteConfig.category,
  classification: siteConfig.classification,
};

// JSON-LD structured data for better SEO
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: siteConfig.description,
  url: BASE_URL,
  author: {
    "@type": "Person",
    name: siteConfig.creator,
    url: "https://github.com/nabinkhair42",
  },
  publisher: {
    "@type": "Person",
    name: siteConfig.publisher,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "1",
  },
  featureList: [
    "Drag & Drop Form Builder",
    "Live Preview",
    "TypeScript Support",
    "Zod Validation",
    "Shadcn/UI Components",
    "React Hook Form Integration",
    "Code Export",
    "Responsive Design",
  ],
};

// Organization structured data
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: BASE_URL,
  logo: `${BASE_URL}/icon.svg`,
  description: siteConfig.description,
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: siteConfig.creator,
  },
  sameAs: ["https://github.com/nabinkhair42/better-form"],
};

// WebSite structured data for search box
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: BASE_URL,
  description: siteConfig.description,
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// BreadcrumbList for better navigation understanding
export const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
  ],
};

// Helper function to generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  path = "",
  keywords,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const pageDescription = description || siteConfig.description;
  const pageKeywords = keywords || siteConfig.keywords;

  return {
    title,
    description: pageDescription,
    keywords: pageKeywords,
    openGraph: {
      title,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
