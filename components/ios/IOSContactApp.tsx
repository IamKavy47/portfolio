import { useState } from "react"
import { ChevronLeft, Phone, Mail, Globe } from "lucide-react"

interface IOSContactAppProps {
  onClose: () => void
}

const contactInfo = {
  name: "Kavy Porwal",
  role: "Full Stack Developer",
  email: "kavy@example.com",
  phone: "+1 (123) 456-7890",
  website: "https://kavyporwal.com",
}

export default function IOSContactApp({ onClose }: IOSContactAppProps) {
  const [activeSection, setActiveSection] = useState<"info" | "message">("info")

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <header className="ios-header">
        <button onClick={onClose} className="ios-back-button">
          <ChevronLeft size={24} />
          <span className="ml-1">Back</span>
        </button>
        <h1 className="text-xl font-semibold">Contact</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-3"></div>
          <h2 className="text-2xl font-bold">{contactInfo.name}</h2>
          <p className="text-[var(--ios-gray)]">{contactInfo.role}</p>
        </div>

        <div className="space-y-4">
          <a href={`tel:${contactInfo.phone}`} className="ios-list-item flex items-center">
            <Phone size={20} className="text-[var(--ios-blue)] mr-3" />
            <span>{contactInfo.phone}</span>
          </a>
          <a href={`mailto:${contactInfo.email}`} className="ios-list-item flex items-center">
            <Mail size={20} className="text-[var(--ios-blue)] mr-3" />
            <span>{contactInfo.email}</span>
          </a>
          <a
            href={contactInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ios-list-item flex items-center"
          >
            <Globe size={20} className="text-[var(--ios-blue)] mr-3" />
            <span>{contactInfo.website}</span>
          </a>
        </div>

        <button className="ios-button w-full mt-6">Send Message</button>
      </div>
    </div>
  )
}

