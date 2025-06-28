"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, GraduationCap, Code, Brain, Users } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const developers = [
    {
      name: "Shashwot Pradhan",
      username: "Shashwot90",
      role: "AI Fellow & Full-Stack Developer",
      company: "Techkraft",
      bio: "Recent Computer Science graduate and AI Fellow at Fusemachines with expertise in AI, ML, and software development. Passionate about creating intelligent solutions that make a difference.",
      github: "https://github.com/Shashwot90",
      avatar: "https://avatars.githubusercontent.com/u/100454943?v=4",
      stats: {
        stars: 86,
        commits: 716,
        prs: 14,
        repos: 101,
      },
      skills: [
        "Python",
        "ReactJS",
        "JavaScript",
        "Vercel",
        "React",
        "MongoDB",
        "MySQL",
        "TailwindCSS",
        "Next.js",
        "Machine Learning",
        "AI",
        "PyTorch",
        "Pandas",
        "NumPy",
        "OpenCV",
      ],
    },
    {
      name: "Rabindra Tamang",
      username: "rabindratamang",
      role: "Software Engineer",
      company: "G-mana",
      bio: "Experienced Software Engineer specializing in backend development and Javascript technologies. Focused on building robust, scalable systems and clean architecture.",
      github: "https://github.com/rabindratamang",
      avatar: "https://avatars.githubusercontent.com/u/25865816?v=4",
      stats: {
        repos: 79,
        experience: "4+ years",
        specialization: "Backend",
      },
      skills: [
        "Javascript",
        "Typescript",
        "Backend Development",
        "System Architecture",
        "Database Design",
        "API Development",
        "Microservices",
        "DevOps",
      ],
    },
  ]

  const projectHighlights = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced mood analysis using natural language processing and machine learning algorithms",
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description: "Intuitive interface designed for seamless mental health tracking and personalized recommendations",
    },
    {
      icon: Code,
      title: "Modern Tech Stack",
      description: "Built with Next.js, React, TypeScript, and integrated with AI APIs for intelligent insights",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            Gen AI Class Project - Leapfrog Connect
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Meet the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Creators</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            MindFuel was born from our passion for combining artificial intelligence with mental wellness. Created as
            part of our Generative AI course at Leapfrog Connect, this project represents our commitment to leveraging
            technology for positive mental health outcomes.
          </p>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">The Development Team</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {developers.map((dev, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <img
                        src={dev.avatar || "/placeholder.svg"}
                        alt={dev.name}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-teal-100"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-1.5 rounded-full">
                        <Code className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{dev.name}</h3>
                      <p className="text-teal-600 font-medium mb-1">@{dev.username}</p>
                      <p className="text-slate-600 text-sm mb-2">{dev.role}</p>
                      <p className="text-slate-500 text-xs mb-4">{dev.company}</p>

                      <p className="text-slate-700 text-sm leading-relaxed mb-4">{dev.bio}</p>

                      {/* GitHub Stats */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {dev.stats.stars && (
                          <div className="text-xs bg-slate-100 px-2 py-1 rounded">⭐ {dev.stats.stars} stars</div>
                        )}
                        {dev.stats.commits && (
                          <div className="text-xs bg-slate-100 px-2 py-1 rounded">📝 {dev.stats.commits} commits</div>
                        )}
                        {dev.stats.repos && (
                          <div className="text-xs bg-slate-100 px-2 py-1 rounded">📁 {dev.stats.repos} repos</div>
                        )}
                        {dev.stats.experience && (
                          <div className="text-xs bg-slate-100 px-2 py-1 rounded">💼 {dev.stats.experience}</div>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {dev.skills.slice(0, 8).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {dev.skills.length > 8 && (
                          <Badge variant="outline" className="text-xs">
                            +{dev.skills.length - 8} more
                          </Badge>
                        )}
                      </div>

                      <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800">
                        <Link href={dev.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          View GitHub
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Project Highlights</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {projectHighlights.map((highlight, index) => (
              <Card
                key={index}
                className="text-center border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 text-white rounded-2xl mb-6">
                    <highlight.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{highlight.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Context */}
      {/* <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 bg-gradient-to-r from-teal-500 to-blue-500 text-white">
            <CardContent className="p-12">
              <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-6">Educational Journey</h2>
              <p className="text-lg leading-relaxed mb-8 text-teal-50">
                This project was developed as part of our Generative AI course at <strong>Leapfrog Connect</strong>.
                Through this intensive program, we explored cutting-edge AI technologies and their practical
                applications in solving real-world problems. MindFuel represents our commitment to using AI responsibly
                and effectively in the mental health space.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">Generative AI</Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">Machine Learning</Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">Natural Language Processing</Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">Full-Stack Development</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Start Your Mental Wellness Journey?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Experience the power of AI-driven mental health insights with MindFuel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
            >
              <Link href="/register">
                Get Started Free
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
