"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Camera, Clock, Map, Calculator, Users, Layers, User, FolderOpen, Globe, Music, 
  Signal,Battery,Wifi,Youtube
 } from "lucide-react"
import IOSProjects from "./ios/IOSProjects"
import IOSAboutMe from "./ios/IOSAboutMe"
import IOSWallpaperApp from "./ios/IOSWallpaperApp"
import IOSCalendar from "./ios/IOSCalendar"
import IOSCamera from "./ios/IOSCamera"
import IOSClock from "./ios/IOSClock"
import IOSMaps from "./ios/IOSMaps"
import IOSCalculator from "./ios/IOSCalculator"
import IOSContacts from "./ios/IOSContacts"
import IOSSafari from "./ios/IOSSafari"
import IOSMusic from "./ios/IOSMusic"
import BootAnimation from "./BootAnimation"
import IOSYouTube from "./ios/IOSYouTube"

const apps = [
  {
    name: "Calendar",
    icon: <Calendar className="w-7 h-7 text-white" />,
    component: IOSCalendar,
    background: "bg-gradient-to-b from-orange-500 to-red-500",
  },
  {
    name: "Camera",
    icon: <Camera className="w-7 h-7 text-white" />,
    component: IOSCamera,
    background: "bg-[#1C1C1E]",
  },
  {
    name: "Clock",
    icon: <Clock className="w-7 h-7 text-white" />,
    component: IOSClock,
    background: "bg-[#1C1C1E]",
  },
  {
    name: "Maps",
    icon: <Map className="w-7 h-7 text-white" />,
    component: IOSMaps,
    background: "bg-gradient-to-b from-green-400 to-green-600",
  },
  {
    name: "Calculator",
    icon :<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="calculator" className="w-7 h-7">
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
</svg>,
    component: IOSCalculator,
    background: "bg-gradient-to-b from-gray-600 to-gray-800",
  },
  {
    name: "Contacts",
    icon: <Users className="w-7 h-7 text-white" />,
    component: IOSContacts,
    background: "bg-gradient-to-b from-gray-400 to-gray-600",
  },
  {
    name: "Wallpaper",
    icon: <Layers className="w-7 h-7 text-white" />,
    component: IOSWallpaperApp,
    background: "bg-gradient-to-b from-purple-500 to-purple-700",
  },
  {
    name: "Youtube",
    icon: <Youtube className="w-7 h-7 text-white" />,
    component: IOSYouTube,
    background: "bg-gradient-to-b from-purple-500 to-purple-700",
  },
]

const dockApps = [
  {
    name: "About Me",
    icon: <img src="/aboutme.png" className="w-[54px] h-[54px] rounded-[14px]" alt="" />,
    component: IOSAboutMe,
    background: "bg-white",
  },
  {
    name: "Projects",
    icon: <FolderOpen className="w-7 h-7 text-amber-500" />,
    background: "bg-white",
    component: IOSProjects,
  },
  {
    name: "Contact Me",
    icon: <Globe className="w-7 h-7 text-blue-500" />,
    background: "bg-white",
    component: IOSSafari,
  },
  {
    name: "Music",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="apple-music" className="w-[54px] h-[54px] rounded-[14px]">
  <defs>
    <radialGradient id="b" cx="-400.171" cy="-984.067" r="1.587" gradientTransform="matrix(0 31.8923 31.8923 0 31421.78 12852.762)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7470f9"></stop>
      <stop offset="1" stop-color="#7a70fe" stop-opacity="0"></stop>
    </radialGradient>
    <radialGradient id="c" cx="-489.182" cy="-1019.984" r="1.281" gradientTransform="scale(-31.8923 31.8923)rotate(-74.462 426.955 -829.031)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4ca3f8"></stop>
      <stop offset=".362" stop-color="#4ca4f7"></stop>
      <stop offset="1" stop-color="#4aa2f9" stop-opacity="0"></stop>
    </radialGradient>
    <linearGradient id="a" x1="-392" x2="-272" y1="-764" y2="-764" gradientTransform="rotate(-90 276 -548)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fd355a"></stop>
      <stop offset="1" stop-color="#fd5163"></stop>
    </linearGradient>
    <linearGradient id="d" x1="-418.42" x2="-418.034" y1="-1040.402" y2="-1041.278" gradientTransform="matrix(31.8923 0 0 -39.8681 13392.678 -41444.467)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ff6380"></stop>
      <stop offset="1" stop-color="#f65e79" stop-opacity="0"></stop>
    </linearGradient>
  </defs>
  <path fill="url(#a)" fill-rule="evenodd" d="M94,120H26A25.9482,25.9482,0,0,1,0,94V26A25.9482,25.9482,0,0,1,26,0H94a25.9482,25.9482,0,0,1,26,26V94A25.9482,25.9482,0,0,1,94,120Z"></path>
  <g>
    <path fill="#bb58bb" fill-rule="evenodd" d="M88,72.5V76a37.93334,37.93334,0,0,1-.6,6.7,8.5338,8.5338,0,0,1-3.6,5.6h-.1a12.35558,12.35558,0,0,1-6.9,2.5l-1.9.2A9.53981,9.53981,0,0,1,67,87.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V61.6h0V40.1a1.61246,1.61246,0,0,0-.6-1.3,1.73546,1.73546,0,0,0-1.4-.3L48.9,45a2.37562,2.37562,0,0,0-2,2.4V81.6h0v2.5a37.93323,37.93323,0,0,1-.6,6.7,8.53375,8.53375,0,0,1-3.6,5.6h-.1a12.35561,12.35561,0,0,1-6.9,2.5l-1.8.1A9.53981,9.53981,0,0,1,26,95.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V69.6h0V29.9a3.71845,3.71845,0,0,1,3-3.6L85,19a3.14378,3.14378,0,0,1,2.1.5,2.46275,2.46275,0,0,1,.9,1.9V72.5Z"></path>
    <path fill="url(#b)" fill-rule="evenodd" d="M88,72.5V76a37.93334,37.93334,0,0,1-.6,6.7,8.5338,8.5338,0,0,1-3.6,5.6h-.1a12.35558,12.35558,0,0,1-6.9,2.5l-1.9.2A9.53981,9.53981,0,0,1,67,87.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V61.6h0V40.1a1.61246,1.61246,0,0,0-.6-1.3,1.73546,1.73546,0,0,0-1.4-.3L48.9,45a2.37562,2.37562,0,0,0-2,2.4V81.6h0v2.5a37.93323,37.93323,0,0,1-.6,6.7,8.53375,8.53375,0,0,1-3.6,5.6h-.1a12.35561,12.35561,0,0,1-6.9,2.5l-1.8.1A9.53981,9.53981,0,0,1,26,95.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V69.6h0V29.9a3.71845,3.71845,0,0,1,3-3.6L85,19a3.14378,3.14378,0,0,1,2.1.5,2.46275,2.46275,0,0,1,.9,1.9V72.5Z"></path>
    <path fill="url(#c)" fill-rule="evenodd" d="M88,72.5V76a37.93334,37.93334,0,0,1-.6,6.7,8.5338,8.5338,0,0,1-3.6,5.6h-.1a12.35558,12.35558,0,0,1-6.9,2.5l-1.9.2A9.53981,9.53981,0,0,1,67,87.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V61.6h0V40.1a1.61246,1.61246,0,0,0-.6-1.3,1.73546,1.73546,0,0,0-1.4-.3L48.9,45a2.37562,2.37562,0,0,0-2,2.4V81.6h0v2.5a37.93323,37.93323,0,0,1-.6,6.7,8.53375,8.53375,0,0,1-3.6,5.6h-.1a12.35561,12.35561,0,0,1-6.9,2.5l-1.8.1A9.53981,9.53981,0,0,1,26,95.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V69.6h0V29.9a3.71845,3.71845,0,0,1,3-3.6L85,19a3.14378,3.14378,0,0,1,2.1.5,2.46275,2.46275,0,0,1,.9,1.9V72.5Z"></path>
    <path fill="url(#d)" fill-rule="evenodd" d="M88,72.5V76a37.93334,37.93334,0,0,1-.6,6.7,8.5338,8.5338,0,0,1-3.6,5.6h-.1a12.35558,12.35558,0,0,1-6.9,2.5l-1.9.2A9.53981,9.53981,0,0,1,67,87.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V61.6h0V40.1a1.61246,1.61246,0,0,0-.6-1.3,1.73546,1.73546,0,0,0-1.4-.3L48.9,45a2.37562,2.37562,0,0,0-2,2.4V81.6h0v2.5a37.93323,37.93323,0,0,1-.6,6.7,8.53375,8.53375,0,0,1-3.6,5.6h-.1a12.35561,12.35561,0,0,1-6.9,2.5l-1.8.1A9.53981,9.53981,0,0,1,26,95.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V69.6h0V29.9a3.71845,3.71845,0,0,1,3-3.6L85,19a3.14378,3.14378,0,0,1,2.1.5,2.46275,2.46275,0,0,1,.9,1.9V72.5Z"></path>
    <path fill="#fff" fill-rule="evenodd" d="M88,72.5V76a37.93334,37.93334,0,0,1-.6,6.7,8.5338,8.5338,0,0,1-3.6,5.6h-.1a12.35558,12.35558,0,0,1-6.9,2.5l-1.9.2A9.53981,9.53981,0,0,1,67,87.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V61.6h0V40.1a1.61246,1.61246,0,0,0-.6-1.3,1.73546,1.73546,0,0,0-1.4-.3L48.9,45a2.37562,2.37562,0,0,0-2,2.4V81.6h0v2.5a37.93323,37.93323,0,0,1-.6,6.7,8.53375,8.53375,0,0,1-3.6,5.6h-.1a12.35561,12.35561,0,0,1-6.9,2.5l-1.8.1A9.53981,9.53981,0,0,1,26,95.6a8.779,8.779,0,0,1-1.4-8.8v-.1a9.24834,9.24834,0,0,1,6.5-5.8l7.5-2a4.29583,4.29583,0,0,0,3.3-4.2V69.6h0V29.9a3.71845,3.71845,0,0,1,3-3.6L85,19a3.14378,3.14378,0,0,1,2.1.5,2.46275,2.46275,0,0,1,.9,1.9V72.5Z"></path>
  </g>
</svg>,
    background: "bg-white",
    component: IOSMusic,
  },
]

export default function IOSInterface() {
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isBooting, setIsBooting] = useState(true)
  const [wallpaper, setWallpaper] = useState(
    "https://9to5mac.com/wp-content/uploads/sites/6/2022/06/7411.WWDC_2022_Light-1024w-1366h@2xipad.jpeg?resize=2048,2048",
  ) // Default wallpaper

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

  const handleWallpaperChange = (url: string) => {
    setWallpaper(url) // Update the wallpaper in the interface
    // Don't close the app automatically to allow multiple wallpaper selections
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

  useEffect(() => {
    // Set isBooting to false after 4 seconds (your video duration)
    const timer = setTimeout(() => {
      setIsBooting(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
      <div className="relative w-[355px] h-[769px] rounded-[55px] overflow-hidden shadow-xl border-[12px] border-black">
        {isBooting ? (
          <BootAnimation onComplete={() => setIsBooting(false)} />
        ) : (
          <>
            <div
              ref={scrollRef}
              className="h-full w-full bg-cover bg-center overflow-y-auto"
              style={{ backgroundImage: `url(${wallpaper})` }} // Dynamic wallpaper
            >
              {/* Status Bar */}
              {/* <div className="h-7 w-full flex justify-between items-center px-5 text-white text-xs">
                <div>{currentTime}</div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-2.5 bg-white rounded-sm"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div> */}

              {/* Dynamic Island - Only visible on home screen */}
              {!activeApp && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-black w-[27vw] h-8 rounded-full mt-2 flex items-center justify-center">
                    <div className="bg-[#1C1C1E] w-3 h-3 rounded-full absolute right-3"></div>
                  </div>
                </div>
              )}

              {/* App Grid */}
              <div className="mt-[25px] pt-10 px-6 grid grid-cols-4 gap-x-4 gap-y-8 pb-24">
                {apps.map((app) => (
                  <motion.button
                    key={app.name}
                    className="flex flex-col items-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openApp(app.name)}
                  >
                    <div
                      className={`w-[62px] h-[62px] rounded-[16px] ${app.background} flex items-center justify-center shadow-lg`}
                      style={{
                        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    >
                      {app.icon}
                    </div>
                    <span className="mt-1.5 text-xs text-white font-medium drop-shadow-md">{app.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Dock */}
            <div className="absolute bottom-2 left-4 right-4 bg-white/20 backdrop-blur-xl rounded-[28px] p-2 h-20">
              <div className="flex justify-around">
                {dockApps.map((app) => (
                  <motion.button
                    key={app.name}
                    className="flex flex-col items-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openApp(app.name)}
                  >
                    <div
                      className={`w-[54px] h-[54px] rounded-[14px] mt-1 ${app.background} flex items-center justify-center shadow-md`}
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

            <AnimatePresence>
              {activeApp && ActiveAppComponent && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute inset-0 bg-white"
                >
                  {activeApp === "Wallpaper" ? (
                    <ActiveAppComponent onClose={closeApp} onWallpaperChange={handleWallpaperChange} />
                  ) : (
                    <ActiveAppComponent onClose={closeApp} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
