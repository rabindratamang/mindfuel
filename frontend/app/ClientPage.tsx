"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoveRight, Brain, Moon, Sparkles, Menu, X } from "lucide-react"
import { HeroAnimation } from "@/components/hero-animation"
import React from "react"

export default function ClientPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MindFuel",
    description: "AI-powered mental health companion for mood analysis, meditation, and sleep improvement",
    url: process.env.NEXT_PUBLIC_API_URL || "https://mindfuel.app",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: [
      {
        "@type": "Person",
        name: "Shashwot Pradhan",
        url: "https://github.com/Shashwot90",
      },
      {
        "@type": "Person",
        name: "Rabindra Tamang",
        url: "https://github.com/rabindratamang",
      },
    ],
    featureList: [
      "AI-powered mood analysis",
      "Personalized meditation exercises",
      "Sleep improvement suggestions",
      "Mental health tracking",
      "Stress relief techniques",
    ],
    screenshot: "/app-screenshot.png",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
        <header className="container mx-auto py-4 px-4 sm:py-6 flex justify-between items-center relative z-50">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-teal-500" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
              MindFuel
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 dark:text-slate-200">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-teal-500 to-sky-500 text-white">Sign Up</Button>
            </Link>
          </div>
          <div className="sm:hidden relative z-50">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-manipulation"
              style={{ minWidth: "48px", minHeight: "48px" }}
              aria-label="Toggle mobile menu"
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              )}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={toggleMobileMenu}>
              <div
                className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-slate-900 shadow-lg transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pt-20">
                  <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={toggleMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-slate-700 dark:text-slate-200">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={toggleMobileMenu}>
                      <Button className="w-full bg-gradient-to-r from-teal-500 to-sky-500 text-white">Sign Up</Button>
                    </Link>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>
                    <Link href="/about" onClick={toggleMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-slate-700 dark:text-slate-200">
                        About
                      </Button>
                    </Link>
                    <Link href="/contact" onClick={toggleMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-slate-700 dark:text-slate-200">
                        Contact
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        <main>
          <section className="container mx-auto px-4 py-12 sm:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Animation first on mobile, last on desktop */}
              <div className="flex-1 relative h-[300px] sm:h-[400px] w-full lg:order-last mb-8 lg:mb-0">
                <HeroAnimation />
              </div>

              {/* Text content */}
              <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left relative">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white leading-tight">
                  Your AI-Powered{" "}
                  <span className="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
                    Mental Health
                  </span>{" "}
                  Companion
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
                  MindFuel uses advanced AI to analyze your mood, recommend personalized meditation exercises, and
                  provide sleep suggestions tailored to your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-sky-500 text-white">
                      Get Started <MoveRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-teal-500 text-teal-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-12 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 text-slate-800 dark:text-white">
              How MindFuel Helps You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard
                icon={<Brain className="h-8 w-8 sm:h-10 sm:w-10 text-teal-500" />}
                title="Mood Analysis"
                description="Our AI analyzes your mood through text and voice inputs to provide personalized coping strategies."
              />
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-sky-500" />}
                title="Guided Meditation"
                description="Access AI-generated guided meditations and mindfulness exercises tailored to your specific needs."
              />
              <FeatureCard
                icon={<Moon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-400" />}
                title="Sleep Improvement"
                description="Get personalized sleep recommendations and wind-down routines based on your habits and preferences."
              />
            </div>
          </section>
        </main>

        <footer className="bg-slate-100 dark:bg-slate-900 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-teal-500" />
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
                  MindFuel
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-slate-600 dark:text-slate-300">
                <Link href="/about" className="hover:text-teal-500 transition-colors">
                  About
                </Link>
                <Link href="/privacy" className="hover:text-teal-500 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-teal-500 transition-colors">
                  Terms
                </Link>
                <Link href="/contact" className="hover:text-teal-500 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} MindFuel. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 group hover:border-teal-100 dark:hover:border-teal-900">
      <div className="mb-4 transform group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-slate-800 dark:text-white">{title}</h3>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  )
}
