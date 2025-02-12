"use client"

import { useState } from "react"
import Window from "./Window"
import { Github, Linkedin, Mail, Phone, MapPin, Globe } from "lucide-react"

interface ContactAppProps {
  onClose: () => void
  onFocus: () => void
}

export default function ContactApp({ onClose, onFocus }: ContactAppProps) {
  const [activeSection, setActiveSection] = useState<string>("contact")

  const contactInfo = {
    name: "Kavy Porwal",
    role: "Front-end  Developer",
    email: "kavyporwal75@gmail.com",
    phone: "+91 9691672623",
    location: "Mandsaur, India",
    github: "https://github.com/iamkavy47",
    linkedin: "https://linkedin.com/in/iamkavy47",
    website: "soon",
  }

  return (
    <Window title="Contact Me" onClose={onClose} onFocus={onFocus} initialSize={{ width: 400, height: 500 }}>
      <div className="flex flex-col h-full bg-gray-100">
        <div className="flex-1 p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{contactInfo.name}</h2>
            <p className="text-md text-gray-600">{contactInfo.role}</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-full ${
                activeSection === "contact" ? "bg-blue-500 text-white" : "bg-white text-gray-800"
              }`}
              onClick={() => setActiveSection("contact")}
            >
              Contact
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                activeSection === "social" ? "bg-blue-500 text-white" : "bg-white text-gray-800"
              }`}
              onClick={() => setActiveSection("social")}
            >
              Social
            </button>
          </div>

          {activeSection === "contact" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <a href={`mailto:${contactInfo.email}`} className="text-blue-500 hover:underline">
                  {contactInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <a href={`tel:${contactInfo.phone}`} className="text-blue-500 hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{contactInfo.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {contactInfo.website}
                </a>
              </div>
            </div>
          )}

          {activeSection === "social" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Github className="w-5 h-5 text-gray-500" />
                <a
                  href={contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GitHub Profile
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Linkedin className="w-5 h-5 text-gray-500" />
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  )
}

