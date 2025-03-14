"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ChevronRight, ExternalLink, Github, Star, Code } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface IOSProjectsProps {
  onClose: () => void
}

interface Project {
  id: number
  title: string
  description: string
  image: string
  detailImages: string[]
  technologies: string[]
  features: string[]
  github?: string
  liveUrl?: string
  featured: boolean
}

export default function IOSProjects({ onClose }: IOSProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeCategory, setActiveCategory] = useState<"all" | "web" | "mobile" | "featured">("all")
  const [scrollY, setScrollY] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop)
  }

  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured online shopping platform with product catalog, cart, and checkout functionality.",
      image: "/placeholder.svg?height=400&width=600&text=E-Commerce",
      detailImages: [
        "/placeholder.svg?height=400&width=600&text=E-Commerce+Screenshot+1",
        "/placeholder.svg?height=400&width=600&text=E-Commerce+Screenshot+2",
        "/placeholder.svg?height=400&width=600&text=E-Commerce+Screenshot+3",
      ],
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Stripe", "Prisma", "PostgreSQL"],
      features: [
        "Responsive product catalog with filtering and search",
        "User authentication and account management",
        "Shopping cart with persistent storage",
        "Secure checkout with Stripe integration",
        "Order history and tracking",
        "Admin dashboard for inventory management",
      ],
      github: "https://github.com/username/ecommerce",
      liveUrl: "https://ecommerce-demo.com",
      featured: true,
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A productivity app for managing tasks, projects, and team collaboration with real-time updates.",
      image: "/placeholder.svg?height=400&width=600&text=Task+Management",
      detailImages: [
        "/placeholder.svg?height=400&width=600&text=Task+App+Screenshot+1",
        "/placeholder.svg?height=400&width=600&text=Task+App+Screenshot+2",
      ],
      technologies: ["React Native", "Firebase", "Redux", "Expo", "TypeScript"],
      features: [
        "Task creation and management with due dates",
        "Project organization and categorization",
        "Team collaboration with shared workspaces",
        "Real-time updates and notifications",
        "Progress tracking and reporting",
        "Cross-platform support (iOS and Android)",
      ],
      github: "https://github.com/username/taskapp",
      liveUrl: "https://taskapp-demo.com",
      featured: true,
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A weather forecasting application with interactive maps, charts, and location-based services.",
      image: "/placeholder.svg?height=400&width=600&text=Weather+Dashboard",
      detailImages: [
        "/placeholder.svg?height=400&width=600&text=Weather+Screenshot+1",
        "/placeholder.svg?height=400&width=600&text=Weather+Screenshot+2",
      ],
      technologies: ["React", "D3.js", "OpenWeather API", "Mapbox", "Tailwind CSS"],
      features: [
        "Current weather conditions and forecasts",
        "Interactive maps with weather overlays",
        "Location-based weather services",
        "Historical weather data visualization",
        "Customizable dashboard with widgets",
        "Severe weather alerts and notifications",
      ],
      github: "https://github.com/username/weather",
      liveUrl: "https://weather-demo.com",
      featured: false,
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing projects, skills, and professional experience.",
      image: "/placeholder.svg?height=400&width=600&text=Portfolio",
      detailImages: ["/placeholder.svg?height=400&width=600&text=Portfolio+Screenshot+1"],
      technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
      features: [
        "Responsive design for all devices",
        "Animated transitions and interactions",
        "Project showcase with filtering",
        "Contact form with validation",
        "Dark/light mode toggle",
        "Performance optimized with Next.js",
      ],
      github: "https://github.com/username/portfolio",
      liveUrl: "https://portfolio-demo.com",
      featured: false,
    },
  ]

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "featured") return project.featured
    return true // "all" category shows everything
  })

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
  }

  const handleBackToList = () => {
    setSelectedProject(null)
  }

  return (
    <div className="h-full bg-[#F2F2F7] text-black flex flex-col">
      {/* iOS-style navigation bar */}
      <div 
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-center bg-[#F2F2F7]"
        style={{
          borderBottom: scrollY > 10 ? "0.5px solid rgba(0,0,0,0.2)" : "none",
        }}
      >
        <button onClick={onClose} className="absolute left-2 text-[#007AFF] font-medium flex items-center">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-[17px] font-semibold">My Projects</h1>
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 overflow-auto ios-scroll" onScroll={handleScroll}>
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div
              key="project-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pb-8"
            >
              {/* Project header */}
              <div className="relative w-full h-48 bg-gray-200">
                <img 
                  src={selectedProject.image || "/placeholder.svg"} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={handleBackToList} 
                  className="absolute top-4 left-4 bg-black/30 text-white rounded-full p-2"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>

              {/* Project content */}
              <div className="px-4 py-6">
                <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
                <p className="text-gray-600 mb-6">{selectedProject.description}</p>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold mb-2 text-gray-500">TECHNOLOGIES</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-[#E5E5EA] px-3 py-1 rounded-full text-[13px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold mb-2 text-gray-500">KEY FEATURES</h3>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#007AFF] mr-2">•</span>
                        <span className="text-[15px]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Screenshots */}
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold mb-2 text-gray-500">SCREENSHOTS</h3>
                  <div className="flex overflow-x-auto space-x-3 pb-2 -mx-4 px-4">
                    {selectedProject.detailImages.map((image, index) => (
                      <img 
                        key={index} 
                        src={image || "/placeholder.svg"} 
                        alt={`${selectedProject.title} screenshot ${index + 1}`} 
                        className="h-48 rounded-lg shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center">
                        <Github size={20} className="text-gray-700 mr-3" />
                        <span className="text-[15px]">View Source Code</span>
                      </div>
                      <ExternalLink size={16} className="text-gray-400" />
                    </a>
                  )}
                  
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full bg-[#007AFF] p-4 rounded-lg shadow-sm text-white"
                    >
                      <div className="flex items-center">
                        <ExternalLink size={20} className="mr-3" />
                        <span className="text-[15px]">Visit Live Project</span>
                      </div>
                      <ChevronRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="project-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pb-8"
            >
              {/* Category selector */}
              <div className="px-4 py-4">
                <div className="bg-[#E5E5EA] p-1 rounded-lg flex mb-6">
                  <button
                    className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                      activeCategory === "all" ? "bg-white text-black shadow-sm" : "text-gray-500"
                    }`}
                    onClick={() => setActiveCategory("all")}
                  >
                    All
                  </button>
                  <button
                    className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                      activeCategory === "featured" ? "bg-white text-black shadow-sm" : "text-gray-500"
                    }`}
                    onClick={() => setActiveCategory("featured")}
                  >
                    Featured
                  </button>
                </div>

                {/* Featured project (larger card) */}
                {activeCategory !== "featured" && (
                  <div className="mb-6">
                    <h2 className="text-[15px] font-semibold mb-3 text-gray-500">FEATURED PROJECT</h2>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProjectSelect(projects.find(p => p.featured) || projects[0])}
                      className="bg-white rounded-xl overflow-hidden shadow-sm"
                    >
                      <div className="relative w-full h-48">
                        <img 
                          src={projects.find(p => p.featured)?.image || projects[0].image} 
                          alt="Featured project" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-[#007AFF] text-white text-[12px] font-medium px-2 py-1 rounded-full flex items-center">
                          <Star size={12} className="mr-1" />
                          Featured
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[17px] font-semibold mb-1">
                          {projects.find(p => p.featured)?.title || projects[0].title}
                        </h3>
                        <p className="text-[15px] text-gray-600 mb-3 line-clamp-2">
                          {projects.find(p => p.featured)?.description || projects[0].description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(projects.find(p => p.featured)?.technologies || projects[0].technologies)
                            .slice(0, 3)
                            .map((tech, index) => (
                              <span key={index} className="bg-[#E5E5EA] px-2 py-0.5 rounded-full text-[12px]">
                                {tech}
                              </span>
                            ))}
                          {(projects.find(p => p.featured)?.technologies.length || projects[0].technologies.length) > 3 && (
                            <span className="bg-[#E5E5EA] px-2 py-0.5 rounded-full text-[12px]">
                              +{(projects.find(p => p.featured)?.technologies.length || projects[0].technologies.length) - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Project list */}
                <div>
                  <h2 className="text-[15px] font-semibold mb-3 text-gray-500">
                    {activeCategory === "featured" ? "FEATURED PROJECTS" : "ALL PROJECTS"}
                  </h2>
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleProjectSelect(project)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm flex"
                      >
                        <div className="w-24 h-24">
                          <img 
                            src={project.image || "/placeholder.svg"} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex justify-between items-start">
                            <h3 className="text-[15px] font-semibold mb-1">{project.title}</h3>
                            {project.featured && activeCategory !== "featured" && (
                              <span className="bg-[#007AFF] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center text-[12px] text-gray-500">
                            <Code size={12} className="mr-1" />
                            {project.technologies.slice(0, 3).join(", ")}
                            {project.technologies.length > 3 && ` +${project.technologies.length - 3} more`}
                          </div>
                        </div>
                        <div className="flex items-center pr-3">
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  \
}
\

