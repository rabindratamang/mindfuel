import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "MindFuel - AI-Powered Mental Health Companion | Mood Analysis & Meditation",
  description:
    "Transform your mental wellness with MindFuel's AI-powered mood analysis, personalized meditation exercises, and sleep improvement suggestions. Start your journey to better mental health today.",
  keywords: [
    "mental health",
    "AI therapy",
    "mood analysis",
    "meditation app",
    "sleep improvement",
    "mental wellness",
    "AI companion",
    "stress relief",
    "mindfulness",
    "emotional wellbeing",
    "mental health app",
    "AI counseling",
  ],
  authors: [
    { name: "Shashwot Pradhan", url: "https://github.com/Shashwot90" },
    { name: "Rabindra Prasad", url: "https://github.com/rabindratamang" },
  ],
  creator: "MindFuel Team",
  publisher: "MindFuel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MindFuel - AI-Powered Mental Health Companion",
    description:
      "Transform your mental wellness with AI-powered mood analysis, personalized meditation, and sleep improvement. Your journey to better mental health starts here.",
    siteName: "MindFuel",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindFuel - AI-Powered Mental Health Companion",
        type: "image/png",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "MindFuel App Icon",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindFuel - AI-Powered Mental Health Companion",
    description:
      "Transform your mental wellness with AI-powered mood analysis, personalized meditation, and sleep improvement.",
    images: ["/twitter-image.png"],
    creator: "@mindfuelapp",
    site: "@mindfuelapp",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "Health & Wellness",
  classification: "Mental Health Application",
  referrer: "origin-when-cross-origin",
}

export default function Home() {
  return <ClientPage />
}
