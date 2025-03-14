"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface IOSAboutMeProps {
  onClose: () => void
}

export default function IOSAboutMe({ onClose }: IOSAboutMeProps) {
  const [activeSection, setActiveSection] = useState<string>("profile")
  const [scrollY, setScrollY] = useState(0)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop)
  }

  const sections = [
    { id: "profile", label: "Profile" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "achievements", label: "Achievements" },
  ]

  const skills = [
    { name: "React", level: 90 },
    { name: "Next.js", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "Python", level: 70 },
    { name: "AWS", level: 65 },
    { name: "Docker", level: 60 },
  ]

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
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-[17px] font-semibold">About Me</h1>
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 overflow-auto ios-scroll" onScroll={handleScroll}>
        {/* Profile header */}
        <div className="px-4 py-6 flex flex-col items-center">
          <motion.div
            className="w-[100px] h-[100px] rounded-full overflow-hidden border-[0.5px] border-gray-300 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Image src="/kavy.jpeg" alt="Kavy Porwal" width={100} height={100} className="object-cover" />
          </motion.div>
          <motion.h2
            className="text-xl font-semibold mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Kavy Porwal
          </motion.h2>
          <motion.h3
            className="text-[15px] text-gray-500 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Frontend Developer
          </motion.h3>

          {/* Contact buttons */}
          <motion.div
            className="flex space-x-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button className="bg-[#007AFF] text-white px-4 py-2 rounded-full text-[14px] font-medium">Message</button>
            <button className="bg-[#007AFF] text-white px-4 py-2 rounded-full text-[14px] font-medium">Call</button>
          </motion.div>
        </div>

        {/* iOS-style segmented control */}
        <div className="px-4 mb-4">
          <div className="bg-[#E5E5EA] p-1 rounded-lg flex">
            {sections.slice(0, 3).map((section) => (
              <button
                key={section.id}
                className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                  activeSection === section.id ? "bg-white text-black shadow-sm" : "text-gray-500"
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content sections */}
        <div className="px-4 pb-8">
          <AnimatePresence mode="wait">
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* About section */}
                <div className="bg-white rounded-xl mb-4 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">About</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-[15px] text-gray-600 leading-relaxed">
                      Passionate front-end developer with expertise in modern web technologies. I love building
                      scalable applications and solving complex problems with elegant solutions. When I'm not coding,
                      you can find me hiking, reading tech blogs, or experimenting with new frameworks.
                    </p>
                  </div>
                </div>

                {/* Contact info */}
                <div className="bg-white rounded-xl mb-4 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">Contact Info</h3>
                  </div>
                  <div>
                    <div className="flex items-center px-4 py-3 border-b border-[#E5E5EA]">
                      <Mail size={18} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-[15px] text-gray-600">Email</p>
                        <p className="text-[15px] text-[#007AFF]">kavyporwal75@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 py-3 border-b border-[#E5E5EA]">
                      <Phone size={18} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-[15px] text-gray-600">Phone</p>
                        <p className="text-[15px] text-[#007AFF]">+91 9691672623</p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 py-3">
                      <MapPin size={18} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-[15px] text-gray-600">Location</p>
                        <p className="text-[15px]">Mandsaur,MP</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">Social</h3>
                  </div>
                  <div>
                    <a href="https://github.com/iamkavy47" className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5EA]">
                      <div className="flex items-center">
                        <Github size={18} className="text-gray-400 mr-3" />
                        <p className="text-[15px]">GitHub</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </a>
                    <a href="https://linkedin.com/in/iamkavy47" className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5EA]">
                      <div className="flex items-center">
                        <Linkedin size={18} className="text-gray-400 mr-3" />
                        <p className="text-[15px]">LinkedIn</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </a>
                    <a href="https://x.com/iamkavy47" className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center">
                        <Twitter size={18} className="text-gray-400 mr-3" />
                        <p className="text-[15px]">Twitter</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">Technical Skills</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {skills.map((skill, index) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[15px]">{skill.name}</span>
                          <span className="text-[13px] text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-[#E5E5EA] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-[#007AFF]"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ delay: 0.1 * index, duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden mt-4">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">Other Skills</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {["UI/UX Design", "Agile", "Git", "CI/CD", "Testing", "REST APIs", "GraphQL"].map((skill) => (
                        <span key={skill} className="bg-[#E5E5EA] px-3 py-1 rounded-full text-[13px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "experience" && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">Work Experience</h3>
                  </div>
                  <div>
                    <div className="px-4 py-4 border-b border-[#E5E5EA]">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-[15px] font-semibold">Senior Developer</h4>
                        <span className="text-[13px] text-gray-500">2020 - Present</span>
                      </div>
                      <p className="text-[15px] text-gray-500 mb-2">Tech Co</p>
                      <p className="text-[14px] text-gray-600">
                        Led development of multiple web applications using React and Node.js. Implemented CI/CD
                        pipelines and mentored junior developers.
                      </p>
                    </div>
                    <div className="px-4 py-4">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-[15px] font-semibold">Full Stack Developer</h4>
                        <span className="text-[13px] text-gray-500">2018 - 2020</span>
                      </div>
                      <p className="text-[15px] text-gray-500 mb-2">Startup Inc</p>
                      <p className="text-[14px] text-gray-600">
                        Built and maintained RESTful APIs, developed front-end interfaces, and collaborated with design
                        team to create responsive web applications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden mt-4">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">Education</h3>
                  </div>
                  <div className="px-4 py-4">
                    <div className="flex justify-between mb-1">
                      <h4 className="text-[15px] font-semibold">B.S. in Computer Science</h4>
                      <span className="text-[13px] text-gray-500">2018</span>
                    </div>
                    <p className="text-[15px] text-gray-500 mb-2">University of Technology</p>
                    <p className="text-[14px] text-gray-600">
                      Graduated with honors. Specialized in software engineering and data structures.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden mt-4">
                  <div className="px-4 py-3 border-b border-[#E5E5EA]">
                    <h3 className="text-[17px] font-semibold">Achievements</h3>
                  </div>
                  <div>
                    <div className="px-4 py-3 border-b border-[#E5E5EA]">
                      <p className="text-[15px]">Winner of Hackathon 2022</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-[15px]">Open Source Contributor of the Year 2021</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Missing imports
import { ChevronRight } from "lucide-react"

