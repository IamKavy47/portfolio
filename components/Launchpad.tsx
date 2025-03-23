"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface App {
  id: string
  name: string
  icon: string
}

interface Folder {
  id: string
  name: string
  apps: App[]
}

export default function MacLaunchpad() {
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openFolder, setOpenFolder] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Sample app and folder data with more authentic macOS icons
  const apps: App[] = [
    { id: "finder", name: "Finder", icon: "/Icon/finder.png" },
    { id: "safari", name: "Safari", icon: "/Icon/safari.png?height=56&width=56&text=🧭" },
    { id: "mail", name: "Mail", icon: "/Icon/finder.png" },
    { id: "messages", name: "Messages", icon: "/Icon/msg.png" },
    { id: "maps", name: "Maps", icon: "/Icon/map.jpg" },
    { id: "photos", name: "Photos", icon: "/Icon/gallery.jpg" },
    { id: "facetime", name: "FaceTime", icon: "/placeholder.svg?height=56&width=56&text=📹" },
    { id: "calendar", name: "Calendar", icon: "/Icon/Calendar.png" },
    { id: "contacts", name: "Contacts", icon: "/Icon/Contacts.png" },
    { id: "reminders", name: "Reminders", icon: "/placeholder.svg?height=56&width=56&text=✓" },
    { id: "notes", name: "Notes", icon: "/placeholder.svg?height=56&width=56&text=📝" },
    { id: "music", name: "Music", icon: "/Icon/Music.png" },
    { id: "podcasts", name: "Podcasts", icon: "/placeholder.svg?height=56&width=56&text=🎙️" },
    { id: "tv", name: "TV", icon: "/placeholder.svg?height=56&width=56&text=📺" },
    { id: "news", name: "News", icon: "/placeholder.svg?height=56&width=56&text=📰" },
    { id: "appstore", name: "App Store", icon: "/placeholder.svg?height=56&width=56&text=A" },
    { id: "books", name: "Books", icon: "/placeholder.svg?height=56&width=56&text=📚" },
    { id: "weather", name: "Weather", icon: "/Icon/weather.jpg" },
    { id: "stocks", name: "Stocks", icon: "/placeholder.svg?height=56&width=56&text=📈" },
    { id: "home", name: "Home", icon: "/placeholder.svg?height=56&width=56&text=🏠" },
    { id: "voice-memos", name: "Voice Memos", icon: "/placeholder.svg?height=56&width=56&text=🎤" },
    { id: "calculator", name: "Calculator", icon: "/placeholder.svg?height=56&width=56&text=🧮" },
    { id: "dictionary", name: "Dictionary", icon: "/placeholder.svg?height=56&width=56&text=📕" },
  ]
  
  const folders: Folder[] = [
    { 
      id: "productivity", 
      name: "Productivity", 
      apps: [
        { id: "pages", name: "Pages", icon: "/placeholder.svg?height=56&width=56&text=📄" },
        { id: "numbers", name: "Numbers", icon: "/placeholder.svg?height=56&width=56&text=🔢" },
        { id: "keynote", name: "Keynote", icon: "/placeholder.svg?height=56&width=56&text=🎭" },
        { id: "preview", name: "Preview", icon: "/placeholder.svg?height=56&width=56&text=👁️" },
        { id: "siri", name: "Siri", icon: "/placeholder.svg?height=56&width=56&text=🔍" },
        { id: "automator", name: "Automator", icon: "/placeholder.svg?height=56&width=56&text=🤖" },
        { id: "font-book", name: "Font Book", icon: "/placeholder.svg?height=56&width=56&text=🔤" },
        { id: "time-machine", name: "Time Machine", icon: "/placeholder.svg?height=56&width=56&text=⏱️" },
      ] 
    },
    { 
      id: "utilities", 
      name: "Utilities", 
      apps: [
        { id: "terminal", name: "Terminal", icon: "/placeholder.svg?height=56&width=56&text=💻" },
        { id: "activity-monitor", name: "Activity Monitor", icon: "/placeholder.svg?height=56&width=56&text=📊" },
        { id: "disk-utility", name: "Disk Utility", icon: "/placeholder.svg?height=56&width=56&text=💿" },
        { id: "system-preferences", name: "System Settings", icon: "/placeholder.svg?height=56&width=56&text=⚙️" },
        { id: "console", name: "Console", icon: "/placeholder.svg?height=56&width=56&text=🖥️" },
        { id: "keychain", name: "Keychain Access", icon: "/placeholder.svg?height=56&width=56&text=🔑" },
        { id: "migration", name: "Migration Assistant", icon: "/placeholder.svg?height=56&width=56&text=🔄" },
        { id: "screen-sharing", name: "Screen Sharing", icon: "/placeholder.svg?height=56&width=56&text=👥" },
      ] 
    },
    { 
      id: "creative", 
      name: "Creative", 
      apps: [
        { id: "garageband", name: "GarageBand", icon: "/placeholder.svg?height=56&width=56&text=🎸" },
        { id: "imovie", name: "iMovie", icon: "/placeholder.svg?height=56&width=56&text=🎬" },
        { id: "final-cut", name: "Final Cut Pro", icon: "/placeholder.svg?height=56&width=56&text=🎥" },
        { id: "logic-pro", name: "Logic Pro", icon: "/placeholder.svg?height=56&width=56&text=🎹" },
        { id: "motion", name: "Motion", icon: "/placeholder.svg?height=56&width=56&text=🎞️" },
        { id: "compressor", name: "Compressor", icon: "/placeholder.svg?height=56&width=56&text=📦" },
        { id: "mainstage", name: "MainStage", icon: "/placeholder.svg?height=56&width=56&text=🎭" },
        { id: "photobooth", name: "Photo Booth", icon: "/placeholder.svg?height=56&width=56&text=📸" },
      ] 
    }
  ]

  // Focus search input when launchpad opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Filter apps based on search query
  const filteredApps = searchQuery 
    ? apps.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : apps

  const filteredFolders = searchQuery
    ? folders.filter(folder => {
        // Include folder if its name matches or if any app inside matches
        return folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          folder.apps.some(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
      })
    : folders

  // Handle escape key to close launchpad or clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchQuery) {
          setSearchQuery("")
        } else if (openFolder) {
          setOpenFolder(null)
        } else {
          setIsOpen(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchQuery, openFolder])

  // Get the currently open folder
  const currentFolder = openFolder 
    ? folders.find(folder => folder.id === openFolder) 
    : null

  // Handle app click - for Weather app
  const handleAppClick = (appId: string) => {
    if (appId === "weather") {
      window.open("/weather", "_blank")
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {/* Background image (simulating desktop) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          // backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=macOS+Desktop')",
          // filter: isOpen ? "blur(20px)" : "none",
          // transition: "filter 0.3s ease"
        }}
      />

      {/* Dock (more authentic macOS style) */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-xl rounded-2xl p-1.5 flex space-x-1 border border-white/20 shadow-lg">
        {apps.slice(0, 10).map(app => (
          <motion.div
            key={app.id}
            whileHover={{ y: -10, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <img 
              src={app.icon || "/placeholder.svg"} 
              alt={app.name}
              className="w-12 h-12 rounded-xl transition-transform cursor-pointer"
              onClick={() => {
                if (app.id === "weather") {
                  handleAppClick(app.id)
                } else {
                  setIsOpen(true)
                }
              }}
            />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {app.name}
            </div>
          </motion.div>
        ))}
        <div className="w-px h-10 bg-white/20 mx-1"></div>
        <motion.div
          whileHover={{ y: -10, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <div 
            className="w-12 h-12 rounded-xl bg-gray-400/20 backdrop-blur-xl flex items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-0.5">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white/70 rounded-sm"></div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Launchpad
          </div>
        </motion.div>
      </div> */}

      {/* Launchpad */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-transparent backdrop-blur-2xl flex flex-col items-center pt-16"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (openFolder) {
                  setOpenFolder(null)
                } else {
                  setIsOpen(false)
                }
              }
            }}
          >
            {/* Search bar - macOS style */}
            <div className="relative w-64 mb-10">
              <div className="absolute  inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/70" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md text-white rounded-[20px] py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-white/30 border border-white/10"
                placeholder="Search"
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
              )}
            </div>

            {/* App grid or folder view */}
            <AnimatePresence mode="wait">
              {openFolder ? (
                // Folder view - macOS style
                <motion.div
                  key="folder-view"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-5xl px-8"
                >
                  <div className="mb-6 text-center">
                    <h2 className="text-white text-xl font-medium">{currentFolder?.name}</h2>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-x-8 gap-y-10 justify-items-center">
                    {currentFolder?.apps.map(app => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center group"
                        onClick={() => handleAppClick(app.id)}
                      >
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
                            <img 
                              src={app.icon || "/placeholder.svg"} 
                              alt={app.name}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                        </motion.div>
                        <span className="mt-2 text-white text-xs font-medium text-center">{app.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                // Main app grid - macOS style
                <motion.div
                  key="app-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-5xl px-8"
                >
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-x-8 gap-y-10 justify-items-center">
                    {filteredApps.map(app => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center group"
                        onClick={() => handleAppClick(app.id)}
                      >
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
                            <img 
                              src={app.icon || "/placeholder.svg"} 
                              alt={app.name}
                              className="w-full h-full object-contain rounded-[12px]"
                            />
                          </div>
                        </motion.div>
                        <span className="mt-2 text-white text-xs font-medium text-center">{app.name}</span>
                      </motion.div>
                    ))}

                    {filteredFolders.map(folder => (
                      <motion.div
                        key={folder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center group"
                        onClick={() => setOpenFolder(folder.id)}
                      >
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex flex-wrap p-1 overflow-hidden cursor-pointer border border-white/10 shadow-lg">
                            {folder.apps.slice(0, 9).map((app, index) => (
                              <div key={app.id} className="w-1/3 h-1/3 p-0.5 flex items-center justify-center">
                                <img 
                                  src={app.icon || "/placeholder.svg"} 
                                  alt={app.name}
                                  className="w-full h-full object-contain rounded-[4px]"
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                        <span className="mt-2 text-white text-xs font-medium text-center">{folder.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page dots - macOS style */}
            <div className="absolute bottom-24 flex space-x-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
