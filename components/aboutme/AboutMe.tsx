import { useDeviceDetect } from "@/hooks/useDeviceDetect"
import Window from "./Window"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Code, Briefcase, GraduationCap, Award, User, Phone, Twitter, Github, Linkedin, FolderOpen } from "lucide-react"
import { useState } from "react"

interface AboutMeProps {
  onClose: () => void
  onFocus: () => void
}

export default function AboutMe({ onClose, onFocus }: AboutMeProps) {
  const { deviceType } = useDeviceDetect()
  const [activeSection, setActiveSection] = useState("about")

  // Simple sidebar item component
  const SidebarItem = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
    <button 
      onClick={() => setActiveSection(id)}
      className={`flex items-center w-full px-4 py-2 mb-1 rounded-[8px] transition-all duration-200 ${
        activeSection === id 
          ? "bg-black/20 rounded-[10px] text-black font-medium" 
          : "hover:bg-black/10 text-black"
      }`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span>{label}</span>
    </button>
  )

  // Content sections
  const aboutContent = (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
          <Image src="/kavy.jpeg" alt="Kavy Porwal" width={128} height={128} className="object-cover" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Kavy Porwal</h1>
        <h2 className="text-xl text-gray-600">Frontend Developer</h2>
      </div>
      <p className="text-gray-700">
        I'm a passionate frontend developer focused on creating beautiful and functional user interfaces using modern web technologies.
      </p>
    </div>
  )

  const skillsContent = (
    <div>
      <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-2">Frontend</h4>
          <div className="flex flex-wrap gap-2">
            {["React", "Next.js", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"].map((skill) => (
              <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-2">Backend</h4>
          <div className="flex flex-wrap gap-2">
            {["Node.js", "Express", "Python", "RESTful APIs"].map((skill) => (
              <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const experienceContent = (
    <div>
      <h3 className="text-xl font-semibold mb-4">Professional Experience</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h4 className="font-medium">Error 404</h4>
        <p className="text-sm text-gray-600">No Experience Found.</p>
        <p className="text-sm text-gray-600 mt-2">
          Currently seeking opportunities to apply my skills and grow as a developer.
        </p>
      </div>
    </div>
  )

  const educationContent = (
    <div>
      <h3 className="text-xl font-semibold mb-4">Education</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="font-medium">B.tech in Computer Science</h4>
        <p className="text-sm text-gray-600">Mandsaur University, 2024-2028</p>
        <p className="text-sm text-gray-700 mt-2">
          Focusing on modern web development technologies and computer science fundamentals.
        </p>
      </div>
    </div>
  )

  const achievementsContent = (
    <div>
      <h3 className="text-xl font-semibold mb-4">Achievements</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-600 italic">Loading...</p>
      </div>
    </div>
  )

  const projectsContent = (
    <div>
      <h3 className="text-xl font-semibold mb-4">Projects</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h4 className="font-medium">Personal Portfolio</h4>
        <p className="text-sm text-gray-700">
          A modern portfolio website built with Next.js and Tailwind CSS featuring a macOS-inspired UI.
        </p>
      </div>
    </div>
  )

  const contactContent = (
    <div>
      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <Phone className="w-4 h-4 mr-2" />
          <span>+91-9991672623</span>
        </div>
        <div className="flex items-center">
          <Code className="w-4 h-4 mr-2" />
          <span>kavyporwal75@gmail.com</span>
        </div>
        <div className="mt-4">
          <Button className="bg-blue-500 rounded-3xl text-white" variant="default">
            Download Resume
          </Button>
        </div>
      </div>
    </div>
  )

  // Content renderer
  const renderContent = () => {
    switch (activeSection) {
      case "about": return aboutContent;
      case "skills": return skillsContent;
      case "experience": return experienceContent;
      case "education": return educationContent;
      case "achievements": return achievementsContent;
      case "projects": return projectsContent;
      case "contact": return contactContent;
      default: return aboutContent;
    }
  }

  // Mobile layout
  if (deviceType === "mobile") {
    return (
      <div className="ios-app h-full">
        <div className="ios-header">
          <button className="ios-back-button" onClick={onClose}>Back</button>
          <h1 className="text-xl font-semibold">About Me</h1>
          <div className="w-16"></div>
        </div>
        <div className="flex h-full">
          <div className="w-1/3 h-full overflow-y-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
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
          <div className="flex-1 bg-white p-4 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout with Window
  return (
    <Window 
      title="About This Mac" 
      onClose={onClose} 
      onFocus={onFocus} 
      initialSize={{ width: 800, height: 500 }}
    >
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
              <a href="x.com/iamkavy47" className=" hover:text-gray-500">
                <Twitter size={18} />
              </a>
              <a href="github.com/iamkavy47" className="hover:text-gray-500">
                <Github size={18} />
              </a>
              <a href="linkedin.in/iamkavy47" className="hover:text-gray-500">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Right content area */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </Window>
  )
}