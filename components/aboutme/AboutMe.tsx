"use client"

import type React from "react"

import { useDeviceDetect } from "@/hooks/useDeviceDetect"
import Window from "./Window"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Code,
  Briefcase,
  GraduationCap,
  Award,
  User,
  Phone,
  Twitter,
  Github,
  Linkedin,
  FolderOpen,
  Mail,
  Send,
  Eye,
  ExternalLink,
  Monitor,
  ShoppingCart,
  Check,
  Target,
  BookOpen,
  Server,
  Gauge,
  Download,
} from "lucide-react"
import { useState } from "react"

interface AboutMeProps {
  onClose: () => void
  onFocus: () => void
}

// Project data structure
interface Project {
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  date: string
  gradient: string
  icon: React.ReactNode
}

export default function AboutMe({ onClose, onFocus }: AboutMeProps) {
  const { deviceType } = useDeviceDetect()
  const [activeSection, setActiveSection] = useState("about")

  // Project data
  const projects: Project[] = [
    {
      title: "Personal Portfolio",
      description:
        "A modern portfolio website built with Next.js and Tailwind CSS featuring a macOS-inspired UI. The site includes interactive elements and smooth animations.",
      image: "/projects/portfolio.jpg",
      technologies: ["Next.js", "Tailwind CSS", "TypeScript"],
      githubUrl: "https://github.com/iamkavy47/portfolio",
      liveUrl: "https://iamkavy47.vercel.app",
      date: "March 2024",
      gradient: "from-blue-400 to-indigo-500",
      icon: <Monitor className="h-16 w-16 text-white/80" />,
    },
    {
      title: "Codestorm Website",
      description:
        "Codestorm is a National level 36 hours Hackathon conducted by Chancellor Brigade in Mandsaur University. I have used Next.js, TypeScript, and Aceternity UI.",
      image: "/projects/codestorm.jpg",
      technologies: ["Next.js", "TypeScript", "Aceternity UI"],
      githubUrl: "#",
      liveUrl: "https://mufests.com",
      date: "February 2024",
      gradient: "",
      icon: "",
    },
  ]

  // Simple sidebar item component
  const SidebarItem = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center w-full px-4 py-2 mb-1 rounded-[8px] transition-all duration-200 ${
        activeSection === id ? "bg-black/20 rounded-[10px] text-black font-medium" : "hover:bg-black/10 text-black"
      }`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span>{label}</span>
    </button>
  )

  // Handle contact button click
  const handleContactClick = () => {
    setActiveSection("contact")
  }

  // Handle view projects button click
  const handleViewProjectsClick = () => {
    setActiveSection("projects")
  }

  // Handle external link click
  const handleExternalLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // Content sections
  const aboutContent = (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
            <Image src="/kavy.jpeg" alt="Kavy Porwal" width={144} height={144} className="object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-2 shadow-md transition-transform duration-300 group-hover:scale-110">
            <Code size={18} />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kavy Porwal
          </h1>
          <h2 className="text-xl text-gray-600 mb-3">Frontend Developer</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">React</span>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">Next.js</span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">TypeScript</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-gray-700 leading-relaxed">
          I'm a passionate frontend developer focused on creating beautiful and functional user interfaces using modern
          web technologies. I love turning complex problems into simple, beautiful, and intuitive designs.
        </p>
        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="rounded-full border-blue-300 hover:bg-blue-50 transition-all"
            onClick={() => setActiveSection("about")}
          >
            <User className="mr-2 h-4 w-4" /> More About Me
          </Button>
          <Button
            className="rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
            onClick={handleViewProjectsClick}
          >
            <FolderOpen className="mr-2 h-4 w-4" /> View Projects
          </Button>
        </div>
      </div>
    </div>
  )

  const skillsContent = (
    <div className="animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Technical Skills
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
          <h4 className="font-medium mb-3 flex items-center text-blue-700">
            <Code className="mr-2 h-5 w-5" /> Frontend
          </h4>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"].map((skill) => (
              <span
                key={skill}
                className="bg-white text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
          <h4 className="font-medium mb-3 flex items-center text-purple-700">
            <Server className="mr-2 h-5 w-5" /> Backend
          </h4>
          <div className="flex flex-wrap gap-2">
            {["Node.js", "Python"].map((skill) => (
              <span
                key={skill}
                className="bg-white text-purple-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="font-medium mb-3 flex items-center text-gray-700">
          <Gauge className="mr-2 h-5 w-5" /> Proficiency
        </h4>
        <div className="space-y-4">
          {[
            { name: "Python", level: 85 },
            { name: "React", level: 75 },
            { name: "TypeScript", level: 75 },
            { name: "Next.js", level: 70 },
            { name: "CSS/Tailwind", level: 85 },
          ].map((skill) => (
            <div key={skill.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{skill.name}</span>
                <span className="text-gray-500">{skill.level}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const experienceContent = (
    <div className="animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Professional Experience
      </h3>

      <div className="relative border-l-2 border-blue-200 pl-6 pb-6 ml-3">
        <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-2 border-white" />
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">Looking for Opportunities</h4>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-[5px] text-xs font-medium">Present</span>
          </div>
          <p className="text-gray-600 mt-1">Open to Work</p>
          <p className="text-gray-700 mt-3">
            Currently seeking opportunities to apply my frontend development skills and grow as a developer. I'm
            passionate about creating intuitive user interfaces and delivering exceptional user experiences.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={handleContactClick}
            >
              <Mail className="mr-2 h-3 w-3" /> Contact Me
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-medium flex items-center text-gray-700">
          <Briefcase className="mr-2 h-5 w-5" /> What I'm Looking For
        </h4>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-[12px] border border-gray-100">
            <span className="text-blue-600 font-medium">Frontend Development</span>
            <p className="text-sm text-gray-600 mt-1">Building responsive and accessible web applications</p>
          </div>
          <div className="bg-white p-3 rounded-[12px] border border-gray-100">
            <span className="text-purple-600 font-medium">Machine Learning </span>
            <p className="text-sm text-gray-600 mt-1">
              Building machine learning projects to solve real world problems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const educationContent = (
    <div className="animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Education
      </h3>

      <div className="relative border-l-2 border-blue-200 pl-6 pb-6 ml-3">
        <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-2 border-white" />
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">B.Tech in Computer Science</h4>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">2024-2028</span>
          </div>
          <p className="text-gray-600 mt-1">Mandsaur University</p>
          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 p-3 rounded-[12px] border border-gray-100">
              <h5 className="text-sm font-medium text-gray-700">Key Courses</h5>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-[5px] text-xs">Machine Learning</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-[5px] text-xs">Web Development</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-[5px] text-xs">Datastructure</span>
              </div>
            </div>
            <p className="text-gray-700">
              Focusing on modern web development technologies and computer science fundamentals. Actively participating
              in coding competitions and hackathons.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm">
        <h4 className="font-medium flex items-center text-blue-700">
          <BookOpen className="mr-2 h-5 w-5" /> Self-Learning Journey
        </h4>
        <div className="mt-3 space-y-3">
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <span className="text-blue-600 font-medium">Learning Computer Vision</span>
            <p className="text-sm text-gray-600 mt-1">Currently iam learning Computer Vision from online resources.</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-100">
            <span className="text-blue-600 font-medium">Frontend Development</span>
            <p className="text-sm text-gray-600 mt-1">Nextjs, TypeScript, Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const achievementsContent = (
    <div className="animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Achievements
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400 rotate-45 translate-x-8 -translate-y-8 opacity-20 group-hover:opacity-30 transition-opacity" />
          <Award className="h-8 w-8 text-yellow-500 mb-3" />
          <h4 className="font-medium text-lg">Currently don't have big Achievments</h4>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm">
        <h4 className="font-medium flex items-center text-purple-700 mb-3">
          <Target className="mr-2 h-5 w-5" /> Goals for 2025
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center mt-0.5">
              <Check className="h-3 w-3 text-purple-500" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Contribute to Open Source</h5>
              <p className="text-sm text-gray-600">Make meaningful contributions to React and Next.js ecosystem</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center mt-0.5">
              <Check className="h-3 w-3 text-purple-500" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Build Portfolio Projects</h5>
              <p className="text-sm text-gray-600">Create 5 high-quality projects showcasing different skills</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center mt-0.5">
              <Check className="h-3 w-3 text-purple-500" />
            </div>
            <div>
              <h5 className="font-medium text-gray-800">Master TypeScript</h5>
              <p className="text-sm text-gray-600">Deepen knowledge of advanced TypeScript patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const projectsContent = (
    <div className="animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Projects
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
          >
            <div className={`h-40 bg-transparent relative overflow-hidden`}>
              {/* Project image */}
              {project.image && (
                <div className="absolute inset-0">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={800}
                    height={300}
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">{project.icon}</div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
                <h4 className="text-white font-medium">{project.title}</h4>
                <div className="flex gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Github className="h-4 w-4 text-white" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-white" />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className={`${
                      tech === "Next.js"
                        ? "bg-blue-100 text-blue-800"
                        : tech === "TypeScript"
                          ? "bg-purple-100 text-purple-800"
                          : tech === "Tailwind CSS"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-yellow-100 text-yellow-800"
                    } px-2 py-0.5 rounded-[5px] text-xs font-medium`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-gray-700">{project.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleExternalLinkClick(project.liveUrl)}
                >
                  <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                </Button>
                <span className="text-xs text-gray-500">{project.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const contactContent = (
    <div id="contact" className="animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Contact Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm text-gray-500 font-medium">Phone</h4>
              <a href="tel:+9191672623" className="text-gray-800 hover:text-blue-600 transition-colors">
                +91-91672623
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm text-gray-500 font-medium">Email</h4>
              <a href="mailto:kavyporwal75@gmail.com" className="text-gray-800 hover:text-blue-600 transition-colors">
                kavyporwal75@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
        <h4 className="font-medium text-blue-700 mb-4">Send Me a Message</h4>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your message"
            ></textarea>
          </div>
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors">
            <Send className="mr-2 h-4 w-4" /> Send Message
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <Button
          className="bg-blue-500 rounded-full text-white px-6"
          variant="default"
          onClick={() => window.open("/resume.pdf", "_blank")}
        >
          <Download className="mr-2 h-4 w-4" /> Download Resume
        </Button>
        <div className="mt-4 flex gap-4">
          <a
            href="https://twitter.com/iamkavy47"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Twitter className="h-5 w-5 text-gray-700" />
          </a>
          <a
            href="https://github.com/iamkavy47"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Github className="h-5 w-5 text-gray-700" />
          </a>
          <a
            href="https://linkedin.com/in/iamkavy47"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Linkedin className="h-5 w-5 text-gray-700" />
          </a>
        </div>
      </div>
    </div>
  )

  // Content renderer
  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return aboutContent
      case "skills":
        return skillsContent
      case "experience":
        return experienceContent
      case "education":
        return educationContent
      case "achievements":
        return achievementsContent
      case "projects":
        return projectsContent
      case "contact":
        return contactContent
      default:
        return aboutContent
    }
  }

  // Mobile layout
  if (deviceType === "mobile") {
    return (
      <div className="ios-app h-full">
        <div className="ios-header">
          <button className="ios-back-button" onClick={onClose}>
            Back
          </button>
          <h1 className="text-xl font-semibold">About Me</h1>
          <div className="w-16"></div>
        </div>
        <div className="flex h-full">
          <div className="w-1/3 h-full overflow-y-auto" style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}>
            <div className="p-2">
              <SidebarItem id="about" label="About" icon={<User size={18} />} />
              <SidebarItem id="skills" label="Skills" icon={<Code size={18} />} />
              <SidebarItem id="experience" label="Experience" icon={<Briefcase size={18} />} />
              <SidebarItem id="education" label="Education" icon={<GraduationCap size={18} />} />
              <SidebarItem id="achievements" label="Achievements" icon={<Award size={18} />} />
              <SidebarItem id="projects" label="Projects" icon={<FolderOpen size={18} />} />
              <SidebarItem id="contact" label="Contact" icon={<Phone size={18} />} />
            </div>
          </div>
          <div className="flex-1 bg-white p-4 overflow-y-auto">{renderContent()}</div>
        </div>
      </div>
    )
  }

  // Desktop layout with Window
  return (
    <Window title="About This Mac" onClose={onClose} onFocus={onFocus} initialSize={{ width: 800, height: 500 }}>
      <style jsx global>{`
        .sidebar {
          background-color: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

      <div className="flex h-full">
        {/* Left sidebar - using inline style for transparency since Tailwind might be overridden */}
        <div className="sidebar w-64 border-r border-white/60 h-full overflow-y-auto p-3">
          <SidebarItem id="about" label="About Developer" icon={<User size={18} />} />
          <SidebarItem id="skills" label="Skills" icon={<Code size={18} />} />
          <SidebarItem id="experience" label="Experience" icon={<Briefcase size={18} />} />
          <SidebarItem id="education" label="Education" icon={<GraduationCap size={18} />} />
          <SidebarItem id="achievements" label="Achievements" icon={<Award size={18} />} />
          <SidebarItem id="projects" label="Projects" icon={<FolderOpen size={18} />} />
          <SidebarItem id="contact" label="Contact Me" icon={<Phone size={18} />} />

          <div className="mt-auto pt-4 border-t border-black/10">
            <h4 className="text-sm px-3 mb-2">Social Links</h4>
            <div className="flex justify-around px-3">
              <a
                href="https://twitter.com/iamkavy47"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-500"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://github.com/iamkavy47"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-500"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/in/iamkavy47"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-500"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Right content area */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">{renderContent()}</div>
      </div>
    </Window>
  )
}

