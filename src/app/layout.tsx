import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const description =
  "Portfolio of Yashraj Singh — Computer Science student specialising in Artificial Intelligence and Machine Learning, building intelligent systems and practical software products.";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Yashraj Singh | AI Engineer & Developer",
  description,
  applicationName: "Yashraj Singh",
  authors: [{ name: "Yashraj Singh" }],
  creator: "Yashraj Singh",
  keywords: [
    "Yashraj Singh",
    "AI Engineer",
    "Machine Learning",
    "Deep Learning",
    "Portfolio",
    "Computer Science",
    "Kolkata",
    "India",
  ],
  openGraph: {
    title: "Yashraj Singh | AI Engineer & Developer",
    description,
    type: "website",
    locale: "en_US",
    siteName: "Yashraj Singh",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Yashraj Singh — AI Engineer & Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yashraj Singh | AI Engineer & Developer",
    description,
    creator: "@y4sh_codes",
    images: ["/images/og.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090B",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yashraj Singh",
  jobTitle: "AI Engineer",
  description,
  email: "mailto:yashrajsingh231105@gmail.com",
  sameAs: [
    "https://github.com/y4sh-codes",
    "https://www.linkedin.com/in/y4sh-codes",
    "https://x.com/y4sh_codes",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Software Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
