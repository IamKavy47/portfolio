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
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="calendar">
    <path fill="#fff" fill-rule="evenodd" d="M94,120H26A25.9482,25.9482,0,0,1,0,94V26A25.9482,25.9482,0,0,1,26,0H94a25.9482,25.9482,0,0,1,26,26V94A25.9482,25.9482,0,0,1,94,120Z"></path>
    <path fill="#ff3b30" d="M42.36084 25.63436c.15088 1.293 1.42187 2.12207 3.25342 2.12207 1.6914 0 2.8872-.85156 2.8872-2.05762 0-1.02343-.77587-1.61621-2.68261-2.03613l-2.02539-.44141c-2.833-.60351-4.22266-2.05761-4.22266-4.417 0-2.89746 2.35938-4.81543 5.94629-4.81543 3.42578 0 5.84961 1.90723 5.94678 4.65332H48.4043c-.15088-1.27051-1.29248-2.10058-2.86524-2.10058-1.627 0-2.7041.78711-2.7041 2.0039 0 .98047.74316 1.55176 2.564 1.9502l1.87451.39844c3.124.668 4.4707 2.01464 4.4707 4.417 0 3.10254-2.40234 5.01953-6.30225 5.01953-3.70556 0-6.10791-1.82031-6.22656-4.69629zM63.62109 26.1617H58.15918l-1.1958 3.77051H53.69922l5.39746-15.54492H62.9209l5.39746 15.54492H64.79492zm-4.76171-2.43457h4.07226l-1.92871-6.18359h-.19336zM73.06348 29.93221V17.06991H68.39941V14.38729h12.582v2.68262H76.31738v12.8623z"></path>
    <path d="M37.11328 42.36776c9.813 0 16.78418 6.74414 16.78418 15.0791 0 5.91016-2.68994 10.38086-12.42725 20.4209L26.8457 93.13729v.15137H55.29932v4.62207H19.647V94.273L38.96973 73.96541c7.84277-8.18359 9.7749-11.4414 9.7749-16.25292 0-6.02442-4.73584-10.79786-11.63135-10.79786-7.23633 0-12.6543 4.96289-12.73 11.66895H19.38184C19.45752 49.22518 26.99756 42.36776 37.11328 42.36776zM62.00684 70.55624c0-17.16309 7.46386-28.18848 19.81543-28.18848 12.38867 0 19.77734 10.9873 19.77734 28.15039 0 17.27637-7.35059 28.26367-19.77734 28.26367S62.00684 87.8326 62.00684 70.55624zm34.40234 0c0-14.35938-5.418-23.6045-14.58691-23.6045-9.13086 0-14.58692 9.32032-14.58692 23.56641 0 14.51074 5.3418 23.71777 14.58692 23.71777C91.06641 94.23592 96.40918 85.02889 96.40918 70.55624z"></path>
  </svg>,
    component: IOSCalendar,
    background: "bg-transparent",
  },
  {
    name: "Camera",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="camera">
    <defs>
      <linearGradient id="a" x1="60" x2="60" y1="16" y2="-104" gradientTransform="translate(0 104)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#8e8e93"></stop>
        <stop offset="1" stop-color="#e5e5ea"></stop>
      </linearGradient>
    </defs>
    <path fill="url(#a)" d="M26,0H94a25.94821,25.94821,0,0,1,26,26V94a25.94821,25.94821,0,0,1-26,26H26A25.94821,25.94821,0,0,1,0,94V26A25.94819,25.94819,0,0,1,26,0Z"></path>
    <path fill="#2e2e2f" fill-rule="evenodd" d="M35.1,36c5.9,0,7.3-4.8,8-5.9a8.15641,8.15641,0,0,1,7-4.1h20a7.92375,7.92375,0,0,1,7,4.2C77.7,31.3,79,36,85,36H98.1a6.01764,6.01764,0,0,1,6,6V85a6.01763,6.01763,0,0,1-6,6h-76a6.01763,6.01763,0,0,1-6-6V42a6.01764,6.01764,0,0,1,6-6ZM60,81A18.5,18.5,0,1,0,41.5,62.5,18.52215,18.52215,0,0,0,60,81Zm0-3A15.5,15.5,0,1,1,75.5,62.5,15.44959,15.44959,0,0,1,60,78ZM26,30h7a.94477.94477,0,0,1,1,1v3H25V31A.94478.94478,0,0,1,26,30Z"></path>
    <circle cx="82" cy="45" r="2.2" fill="#fc0"></circle>
  </svg>,
    component: IOSCamera,
    background: "bg-[#1C1C1E]",
  },
  {
    name: "Clock",
    icon: <img src="/Icon/clock.png" className="w-full h-full rounded-[10px]" alt="" />,
    component: IOSClock,
    background: "bg-transparent",
  },
  {
    name: "Maps",
    icon: <img src="/Icon/map.jpg" className="w-full h-full rounded-[10px]" alt="" />,
    component: IOSMaps,
    background: "bg-gradient-to-b from-green-400 to-green-600",
  },
  {
    name: "Calculator",
    icon :<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 120 120" id="calculator" className="w-full h-full">
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
    background: "bg-transparent",
  },
  {
    name: "Contacts",
    icon: <img src="/Icon/contact.png" alt="" />,
    component: IOSContacts,
    background: "bg-gradient-to-b from-gray-400 to-gray-600",
  },
  {
    name: "Wallpaper",
    icon: <img src="/Icon/gallery.jpg" className="rounded-[10px]" alt="" />,
    component: IOSWallpaperApp,
    background: "bg-gradient-to-b from-purple-500 to-purple-700",
  },
  {
    name: "Youtube",
    icon: <img src="/Icon/yt.png" className="w-full h-full rounded-[12px]" alt="" />,
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
    icon: <img src="/Icon/project.png" alt="Project" className="h-[54px] w-[54px] "/>,
    background: "bg-white",
    component: IOSProjects,
  },
   {
    name: "Safari",
    icon: <img src="/Icon/safari.png" alt="Music" className="h-[54px] w-[54px]"/>,
    background: "bg-white",
    component: IOSSafari,
  },
  {
    name: "Music",
    icon: <img src="/Icon/Music.png" alt="Music" className="h-[54px] w-[54px] "/>,
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
