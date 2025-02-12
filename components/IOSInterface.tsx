"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Battery, Wifi, SignalHigh } from "lucide-react"
import IOSFaceTime from "./ios/IOSFaceTime"
import IOSCalendar from "./ios/IOSCalendar"
import IOSPhotos from "./ios/IOSPhotos"
import IOSCamera from "./ios/IOSCamera"
import IOSMail from "./ios/IOSMail"
import IOSClock from "./ios/IOSClock"
import IOSMaps from "./ios/IOSMaps"
import IOSCalculator from "./ios/IOSCalculator"
import IOSSettings from "./ios/IOSSettings"
import IOSAppStore from "./ios/IOSAppStore"
import IOSNotes from "./ios/IOSNotes"
import IOSContacts from "./ios/IOSContacts"
import IOSPhone from "./ios/IOSPhone"
import IOSMessages from "./ios/IOSMessages"
import IOSSafari from "./ios/IOSSafari"
import IOSMusic from "./ios/IOSMusic"
import BootAnimation from "./BootAnimation"

const apps = [
  { name: "FaceTime", icon: "📞", component: IOSFaceTime, background: "bg-[#31C759]" },
  { name: "Calendar", icon: "📅", component: IOSCalendar, background: "bg-white" },
  { name: "Photos", icon: "🖼️", component: IOSPhotos, background: "bg-gradient-to-b from-[#3F99F8] to-[#3C5A99]" },
  { name: "Camera", icon: "📸", component: IOSCamera, background: "bg-[#1C1C1E]" },
  { name: "Mail", icon: "✉️", component: IOSMail, background: "bg-gradient-to-b from-[#3478F6] to-[#5DAFFD]" },
  { name: "Clock", icon: "🕰️", component: IOSClock, background: "bg-[#1C1C1E]" },
  { name: "Maps", icon: "🗺️", component: IOSMaps, background: "bg-[#31AE5F]" },
  { name: "Calculator", icon: "🧮", component: IOSCalculator, background: "bg-[#1C1C1E]" },
  { name: "Settings", icon: "⚙️", component: IOSSettings, background: "bg-[#8E8E93]" },
  { name: "App Store", icon: "🏪", component: IOSAppStore, background: "bg-gradient-to-b from-[#1E92FF] to-[#3867D6]" },
  { name: "Notes", icon: "📝", component: IOSNotes, background: "bg-[#FFFF9E]" },
  { name: "Contacts", icon: "👥", component: IOSContacts, background: "bg-[#1C1C1E]" },
]

const dockApps = [
  { name: "Phone", icon: "📞", background: "bg-[#31C759]", component: IOSPhone },
  { name: "Messages", icon: "💬", background: "bg-[#31C759]", component: IOSMessages },
  { name: "Safari", icon: "🌐", background: "bg-gradient-to-b from-[#1E92FF] to-[#3867D6]", component: IOSSafari },
  { name: "Music", icon: "🎵", background: "bg-gradient-to-b from-[#FC5C7D] to-[#6A82FB]", component: IOSMusic },
]

export default function IOSInterface() {
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isBooting, setIsBooting] = useState(true)

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const openApp = (appName: string) => {
    const app = [...apps, ...dockApps].find((a) => a.name === appName)
    if (app?.component) {
      setActiveApp(appName)
    }
  }

  const closeApp = () => {
    setActiveApp(null)
  }

  const ActiveAppComponent = [...apps, ...dockApps].find((app) => app.name === activeApp)?.component

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollPosition(scrollRef.current.scrollTop)
      }
    }

    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const handleBootComplete = () => {
    setIsBooting(false)
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-[375px] h-[812px] bg-black rounded-[60px] overflow-hidden shadow-xl border-[14px] border-black">
        {/* iPhone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[30px] bg-black rounded-b-3xl z-50"></div>

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 pt-2 pb-1 text-white text-sm font-medium z-40">
          <span>{currentTime}</span>
          <div className="flex items-center gap-2">
            <SignalHigh size={16} />
            <Wifi size={16} />
            <Battery size={16} />
          </div>
        </div>

        {isBooting ? (
          <BootAnimation onComplete={handleBootComplete} />
        ) : (
          <>
            {/* App Content */}
            <div
              ref={scrollRef}
              className="h-full w-full bg-[url('/ios-wallpaper.jpg')] bg-cover bg-center overflow-y-auto"
            >
              {/* App Grid */}
              <div className="pt-16 px-6 grid grid-cols-4 gap-x-4 gap-y-8 pb-24">
                {apps.map((app) => (
                  <motion.button
                    key={app.name}
                    className="flex flex-col items-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openApp(app.name)}
                  >
                    <div
                      className={`w-[62px] h-[62px] rounded-[16px] ${app.background} flex items-center justify-center text-2xl shadow-lg`}
                      style={{
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    >
                      {app.icon}
                    </div>
                    <span className="mt-1.5 text-xs text-white font-medium">{app.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Dock */}
            <div className="absolute bottom-2 left-4 right-4 bg-white/20 backdrop-blur-xl rounded-[32px] p-2">
              <div className="flex justify-around">
                {dockApps.map((app) => (
                  <motion.button
                    key={app.name}
                    className="flex flex-col items-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openApp(app.name)}
                  >
                    <div
                      className={`w-[54px] h-[54px] rounded-[14px] ${app.background} flex items-center justify-center text-2xl`}
                      style={{
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    >
                      {app.icon}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[134px] h-1 bg-white rounded-full"></div>

            {/* App Transitions */}
            <AnimatePresence>
              {activeApp && ActiveAppComponent && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute inset-0 bg-white"
                >
                  <ActiveAppComponent onClose={closeApp} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

