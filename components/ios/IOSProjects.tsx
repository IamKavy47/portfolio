import { ChevronLeft, ExternalLink, Github } from "lucide-react"

interface IOSProjectsProps {
  onClose: () => void
}

const projects = [
  {
    title: "macOS Portfolio",
    description: "A portfolio website inspired by macOS, built with React and Framer Motion.",
    icon: "🖥️",
    github: "https://github.com/kavyporwal/macos-portfolio",
    demo: "https://macos-portfolio.vercel.app",
    date: "June 2023",
  },
  {
    title: "E-commerce Platform",
    description: "Full-stack e-commerce platform with real-time inventory management.",
    icon: "🛒",
    github: "https://github.com/kavyporwal/ecommerce-platform",
    demo: "https://ecommerce-platform.vercel.app",
    date: "April 2023",
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

export default function IOSProjects({ onClose }: IOSProjectsProps) {
  return (
    <div className="h-full bg-gray-100 text-black">
      <header className="bg-white p-4 flex items-center shadow-sm">
        <button onClick={onClose} className="text-blue-500">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold ml-4">My Projects</h1>
      </header>
      <div className="p-4 overflow-auto">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-2">{project.icon}</span>
              <h2 className="text-xl font-semibold">{project.title}</h2>
            </div>
            <p className="text-gray-600 mb-3">{project.description}</p>
            <p className="text-sm text-gray-500 mb-3">{project.date}</p>
            <div className="flex space-x-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500"
              >
                <Github size={16} className="mr-1" />
                GitHub
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500"
              >
                <ExternalLink size={16} className="mr-1" />
                Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

