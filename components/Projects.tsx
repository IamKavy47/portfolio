import Window from "./Window"
import { ExternalLink, Github, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectsProps {
  onClose: () => void
  onFocus: () => void
}

const projects = [
  {
    title: "macOS Portfolio",
    description: "A portfolio website inspired by macOS, built with React and Framer Motion.",
    icon: "🖥️",
    github: "https://github.com/iamkavy47",
    demo: "https://macos-portfolio.vercel.app",
    date: "February 2025",
  },
  {
    title: "MU CodeStorm",
    description: "An 36 hours Hackathon website.",
    icon: "🌐",
    github: "https://github.com/princeyuviii",
    demo: "https://www.mufests.com",
    date: "February 2025",
  },
  {
    title: "Weather App",
    description: "Beautiful weather application with real-time updates and animations.",
    icon: "🌤️",
    github: "https://github.com/kavyporwal/weather-app",
    demo: "https://weather-app-kavyporwal.vercel.app",
    date: "February 2023",
  },
]

export default function Projects({ onClose, onFocus }: ProjectsProps) {
  return (
    <Window title="My Projects" onClose={onClose} onFocus={onFocus} initialSize={{ width: 800, height: 600 }}>
      <div className="h-full bg-gray-100 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded">
          {projects.map((project) => (
            <div key={project.title} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{project.icon}</span>
                <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                {project.date}
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  )
}

