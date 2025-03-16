"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserCircle, FolderKanban, Calculator, Code2, ImageIcon, CalendarIcon, Compass } from "lucide-react"

// Using the same dock items from your code
const dockItems = [
  {
    name: "AboutMe",
    icon: <img src="https://i.ibb.co/LDzGD6QZ/generated-image-1741935068996.webp" alt="AboutMe" className="w-[54px] h-[54px] rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "Projects",
    icon: <img src="/Icon/project.png" alt="projects" className="w-[54px] h-[54px] rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "Calculator",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="calculator" className="w-[54px] h-[54px] rounded-[14px]">
        <defs>
          <linearGradient id="a" x1="59.25" x2="60.76" y1="119.1" y2="-.16" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#d4d4d2"></stop>
            <stop offset="1" stop-color="#d4d4d2"></stop>
          </linearGradient>
        </defs>
        <rect width="120" height="120" fill="url(#a)" rx="26"></rect>
        <rect width="62" height="90" x="29" y="15" fill="#1c1c1c" rx="8"></rect>
        <rect width="50" height="21" x="35" y="21" fill="#505050" rx="4"></rect>
        <circle cx="41" cy="55" r="6" fill="#d4d4d2"></circle>
        <circle cx="60" cy="55" r="6" fill="#d4d4d2"></circle>
        <circle cx="79" cy="55" r="6" fill="#fe9500"></circle>
        <circle cx="41" cy="74" r="6" fill="#d4d4d2"></circle>
        <circle cx="60" cy="74" r="6" fill="#d4d4d2"></circle>
        <circle cx="79" cy="74" r="6" fill="#fe9500"></circle>
        <path fill="#d4d4d2" d="M41 99a6 6 0 0 1 0-12h19a6 6 0 0 1 0 12Z"></path>
        <circle cx="79" cy="93" r="6" fill="#fe9500"></circle>
      </svg>
    ),
    background: "bg-transparent",
  },
  {
    name: "VSCode",
    icon: <img src="/Icon/code.png" alt="VS Code" className="w-[68px] h-[68px]" />,
    background: "bg-transparent",
  },
  {
    name: "WallpaperApp",
    icon: <img src="/Icon/gallery.jpg" alt="wallpaper" className="w-[54px] h-[54px] rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "Safari",
    icon: <img src="/Icon/safari.png" alt="safari" className="w-[54px] h-[54px] rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "ContactApp",
    icon: <img src="/Icon/Contacts.png" alt="contact" className="w-[54px] h-[54px] rounded-[14px]" />,
    background: "bg-transparent",
  },
]

interface DockProps {
  openApp: (appName: string) => void
  openApps: string[]
}

export default function Dock({ openApp, openApps }: DockProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [openingApp, setOpeningApp] = useState<string | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)

  const handleOpenApp = (appName: string) => {
    setOpeningApp(appName)
    openApp(appName)
    setTimeout(() => setOpeningApp(null), 500)
  }

  const getIconPosition = (index: number) => {
    if (!dockRef.current) return { x: 0, y: 0 }
    const iconElement = dockRef.current.children[index] as HTMLElement
    const rect = iconElement.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top,
    }
  }

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        ref={dockRef}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/20 backdrop-blur-xl rounded-[28px] px-3 h-20 flex items-center"
      >
        <AnimatePresence>
          {dockItems.map((item, index) => (
            <motion.button
              key={item.name}
              className="relative group flex flex-col items-center mx-0.5 px-0.5"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleOpenApp(item.name)}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div
                className={`${item.background} flex items-center justify-center shadow-md
                  ${openApps.includes(item.name) ? "ring-2 ring-white/50" : ""}`}
                animate={{
                  scale: hoveredItem === index ? 1.2 : openingApp === item.name ? 0.8 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
              >
                {item.icon}
              </motion.div>
              
              {openingApp === item.name && (
                <motion.div
                  className="fixed top-0 left-0 w-full h-full pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    originX: getIconPosition(index).x / window.innerWidth,
                    originY: getIconPosition(index).y / window.innerHeight,
                  }}
                >
                  <div className="w-full h-full bg-white/10 backdrop-blur-lg rounded-lg" />
                </motion.div>
              )}
              
              <motion.div
                className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-white transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: openApps.includes(item.name) ? 1 : 0 }}
              />
              
              <motion.span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white 
                  bg-black/75 rounded-md whitespace-nowrap z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: hoveredItem === index ? 1 : 0,
                  y: hoveredItem === index ? 0 : 10,
                }}
              >
                {item.name}
              </motion.span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
