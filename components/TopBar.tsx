"use client"

import { useState, useEffect, useRef } from "react"
import { FaApple, FaSearch } from "react-icons/fa"
import { BsToggles } from "react-icons/bs"
import { motion, AnimatePresence } from "framer-motion"

interface TopBarProps {
  activeApp: string | null
  onOpenApp: (appName: string) => void
}

export default function TopBar({ activeApp, onOpenApp }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const spotlightRef = useRef<HTMLDivElement>(null)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.code === "Space") {
        event.preventDefault()
        setIsSpotlightOpen((prev) => !prev)
        setSearchQuery("")
      }
      if (event.code === "Escape" && isSpotlightOpen) {
        setIsSpotlightOpen(false)
        setSearchQuery("")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [isSpotlightOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (spotlightRef.current && !spotlightRef.current.contains(event.target as Node)) {
        setIsSpotlightOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const menuItems = [
    { name: "About This Mac", action: () => onOpenApp("AboutMe") },
    { name: "System Settings", action: () => onOpenApp("Settings") },
    { name: "App Store", action: () => onOpenApp("AppStore") },
    { name: "Recent Items", action: () => {} },
    { name: "Force Quit", action: () => {} },
    { name: "Sleep", action: () => {} },
    { name: "Restart", action: () => {} },
    { name: "Shut Down", action: () => {} },
  ]

  const [todayInfo, setTodayInfo] = useState("")

  useEffect(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const now = new Date()
    const day = days[now.getDay()]
    const month = months[now.getMonth()]
    const date = now.getDate()

    setTodayInfo(`${day} ${month} ${date}`)
  }, [])

  const apps = [
    { name: "AboutMe", type: "System" },
    { name: "Projects", type: "Development" },
    { name: "Calculator", type: "Utilities" },
    { name: "VSCode", type: "Development" },
    { name: "WallpaperApp", type: "System" },
    { name: "Calendar", type: "Productivity" },
    { name: "Safari", type: "Internet" },
    { name: "ContactApp", type: "Utilities" },
  ]

  const filteredApps = searchQuery
    ? apps.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const shortcutSymbol = isMac ? "⌘" : "⊞"

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[30px] px-2 flex items-center justify-between bg-white/30 backdrop-blur-sm text-black z-50">
        <div className="flex items-center space-x-4 text-sm">
          <div className="relative">
            <FaApple
              className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 py-1 bg-white/40 backdrop-blur-lg border border-white/20 rounded-[12px] shadow-lg">
                {menuItems.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer text-sm"
                    onClick={() => {
                      item.action()
                      setIsMenuOpen(false)
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="font-semibold">{activeApp || "Finder"}</span>
          <span className="cursor-pointer">File</span>
          <span className="cursor-pointer">Edit</span>
          <span className="cursor-pointer">View</span>
          <span className="cursor-pointer">Go</span>
          <span className="cursor-pointer">Window</span>
          <span className="cursor-pointer">Help</span>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center gap-1">
            <FaSearch className="w-4 h-4 cursor-pointer" onClick={() => setIsSpotlightOpen(true)} />
            <span className="text-xs text-gray-500">{shortcutSymbol} Space</span>
          </div>
          <BsToggles className="w-4 h-4" />
          <span className="">{todayInfo}</span>
          <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      <AnimatePresence>
        {isSpotlightOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div
              ref={spotlightRef}
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="fixed left-1/2 top-[33%] -translate-x-1/2 w-[500px] max-w-[90vw] z-50"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center px-4 py-3 border-b border-white/10">
                  <FaSearch className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Spotlight Search"
                    className="flex-1 bg-transparent border-none text-black text-lg placeholder-gray-500 focus:outline-none px-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                {searchQuery && (
                  <div className="max-h-[400px] overflow-auto p-2">
                    {filteredApps.map((app) => (
                      <button
                        key={app.name}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 text-black"
                        onClick={() => {
                          onOpenApp(app.name)
                          setIsSpotlightOpen(false)
                          setSearchQuery("")
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <FaSearch className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-gray-500">{app.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

