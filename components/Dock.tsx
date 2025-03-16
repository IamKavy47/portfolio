"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Using the same dock items from your code
const dockItems = [
  {
    name: "AboutMe",
    icon: <img src="https://i.ibb.co/LDzGD6QZ/generated-image-1741935068996.webp" alt="AboutMe" className="w-full h-full object-cover rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "Projects",
    icon: <img src="/Icon/project.png" alt="projects" className="w-full h-full object-cover rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "Calculator",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="calculator" className="w-full h-full rounded-[14px]">
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
    icon: <img src="/Icon/code.png" alt="VS Code" className="w-full h-full object-cover" />,
    background: "bg-transparent",
  },
  {
    name: "WallpaperApp",
    icon: <img src="/Icon/gallery.jpg" alt="wallpaper" className="w-full h-full object-cover rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "Safari",
    icon: <img src="/Icon/safari.png" alt="safari" className="w-full h-full object-cover rounded-[14px]" />,
    background: "bg-transparent",
  },
  {
    name: "ContactApp",
    icon: <img src="/Icon/Contacts.png" alt="contact" className="w-full h-full object-cover rounded-[14px]" />,
    background: "bg-transparent",
  },
]

interface DockProps {
  openApp: (appName: string) => void
  openApps: string[]
}

export default function Dock({ openApp, openApps }: DockProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [openingApp, setOpeningApp] = useState<string | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])

  // Track mouse position for the magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleOpenApp = (appName: string) => {
    setOpeningApp(appName)
    openApp(appName)
    setTimeout(() => setOpeningApp(null), 500)
  }

  const getIconPosition = (index: number) => {
    if (!iconRefs.current[index]) return { x: 0, y: 0 }
    const rect = iconRefs.current[index]!.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top,
    }
  }

  // Calculate scale for each icon based on mouse proximity (macOS magnetic effect)
  const getIconScale = (index: number) => {
    if (!iconRefs.current[index]) return 1
    
    const iconRect = iconRefs.current[index]!.getBoundingClientRect()
    const iconCenter = {
      x: iconRect.left + iconRect.width / 2,
      y: iconRect.top + iconRect.height / 2,
    }
    
    // Distance between mouse and icon center
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - iconCenter.x, 2) + 
      Math.pow(mousePosition.y - iconCenter.y, 2)
    )
    
    // Max distance for effect (adjust as needed)
    const maxDistance = 150
    
    // Base scale and max scale
    const baseScale = 1
    const maxAdditionalScale = 0.6
    
    if (distance > maxDistance) return baseScale
    
    // Calculate scale based on distance (closer = bigger)
    const additionalScale = maxAdditionalScale * (1 - distance / maxDistance)
    return baseScale + additionalScale
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        ref={dockRef}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-black/20 backdrop-blur-2xl rounded-3xl px-3 py-2 flex items-end gap-1 border border-white/10 shadow-2xl"
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        <AnimatePresence>
          {dockItems.map((item, index) => (
            <motion.div
              key={item.name}
              className="relative flex flex-col items-center justify-end"
              ref={el => (iconRefs.current[index] = el)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                delay: index * 0.05 
              }}
            >
              <motion.button
                className="relative group flex flex-col items-center mx-1"
                onClick={() => handleOpenApp(item.name)}
                animate={{ 
                  y: getIconScale(index) > 1.2 ? -10 : 0,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <motion.div
                  className={`${item.background} flex items-center justify-center overflow-hidden
                    ${openApps.includes(item.name) ? "ring-2 ring-white/30" : ""}`}
                  animate={{ 
                    scale: openingApp === item.name ? 0.8 : getIconScale(index),
                  }}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    transformOrigin: "bottom"
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                    y: { type: "spring", stiffness: 500, damping: 30 }
                  }}
                >
                  {item.icon}
                </motion.div>
                
                {/* App opening animation overlay */}
                {openingApp === item.name && (
                  <motion.div
                    className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
                    initial={{ scale: 0, opacity: 0, borderRadius: "12px" }}
                    animate={{ scale: 1, opacity: 1, borderRadius: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.19, 1.0, 0.22, 1.0] }}
                    style={{
                      originX: getIconPosition(index).x / window.innerWidth,
                      originY: getIconPosition(index).y / window.innerHeight,
                    }}
                  >
                    <div className="w-full h-full bg-white/5 backdrop-blur-lg" />
                  </motion.div>
                )}
                
                {/* Running indicator dot */}
                <motion.div
                  className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: openApps.includes(item.name) ? 1 : 0,
                    scale: openApps.includes(item.name) ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              
              {/* App name tooltip */}
              <motion.span
                className="absolute -top-8 px-3 py-1 text-xs font-medium text-white 
                  bg-black/80 rounded-lg whitespace-nowrap z-20 pointer-events-none"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{
                  opacity: getIconScale(index) > 1.2 ? 1 : 0,
                  y: getIconScale(index) > 1.2 ? 0 : 10,
                  scale: getIconScale(index) > 1.2 ? 1 : 0.8,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {item.name}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Dock reflection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mx-auto mt-1 w-3/4 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-sm"
      />
    </div>
  )
}
