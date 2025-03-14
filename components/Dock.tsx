"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserCircle, FolderKanban, Calculator, Code2, ImageIcon, CalendarIcon, Compass } from "lucide-react"

const dockItems = [
  {
    name: "AboutMe",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <img src="/aboutme.png" className="w-8 h-8" alt="" />
      </div>
    ),
  },
  {
    name: "Projects",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
        <FolderKanban className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    name: "Calculator",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <Calculator className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    name: "VSCode",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <Code2 className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    name: "WallpaperApp",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    name: "Calendar",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <CalendarIcon className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    name: "Safari",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <Compass className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    name: "ContactApp",
    icon: (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <UserCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
    ),
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
    <div className="fixed bottom-2 left-0 right-0 flex justify-center">
      <motion.div
        ref={dockRef}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex items-end gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-2xl shadow-lg"
      >
        <AnimatePresence>
          {dockItems.map((item, index) => (
            <motion.div
              key={item.name}
              className="relative group"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleOpenApp(item.name)}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div
                className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200
                  ${openApps.includes(item.name) ? "ring-2 ring-white/50" : ""}`}
                animate={{
                  scale: hoveredItem === index ? 1.2 : openingApp === item.name ? 0.8 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: openApps.includes(item.name) ? 1 : 0 }}
              />
              <motion.span
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white 
                  bg-black/75 rounded-md whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: hoveredItem === index ? 1 : 0,
                  y: hoveredItem === index ? 0 : 10,
                }}
              >
                {item.name}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

