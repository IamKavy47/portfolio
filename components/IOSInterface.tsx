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
    icon :<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="calculator" className="w-[54px] h-[54px] rounded-[14px]">
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
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="files" className="w-[54px] h-[54px]">
  <defs>
    <linearGradient id="a" x1="-572.109" x2="-572.109" y1="-746.287" y2="-744.279" gradientTransform="matrix(45.6353 0 0 -27.5386 26168.358 -20456.94)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1d77f2"></stop>
      <stop offset="1" stop-color="#18c1fa"></stop>
    </linearGradient>
  </defs>
  <path fill="#fff" fill-rule="evenodd" d="M0,94.05v-68a25.94821,25.94821,0,0,1,26-26H94a25.94821,25.94821,0,0,1,26,26v68a25.94821,25.94821,0,0,1-26,26H26A26.012,26.012,0,0,1,0,94.05Z"></path>
  <g>
    <path fill="#1aa6f7" fill-rule="evenodd" d="M22,25.25H35.5a7.56976,7.56976,0,0,1,5.3,2.1c3.1,2.8,5.2,4.3,6.5,4.3,1.2,0-5.4,5.6-19.9,16.8a8.19988,8.19988,0,0,1-13.2-6.5v-8.8A7.832,7.832,0,0,1,22,25.25Z"></path>
    <path fill="#1aa6f7" fill-rule="evenodd" d="M39.3,31.55H98a7.81,7.81,0,0,1,7.8,7.8v17.6a7.81,7.81,0,0,1-7.8,7.8H39.3a7.81,7.81,0,0,1-7.8-7.8V39.35A7.87514,7.87514,0,0,1,39.3,31.55Z"></path>
    <path fill="#fff" fill-rule="evenodd" d="M20.9,36.35H99.1a1.89869,1.89869,0,0,1,1.9,1.9v29.3a1.89869,1.89869,0,0,1-1.9,1.9H20.9a1.89869,1.89869,0,0,1-1.9-1.9V38.25A1.78438,1.78438,0,0,1,20.9,36.35Z"></path>
    <path fill="url(#a)" fill-rule="evenodd" d="M18.1,39.45h83.8a3.90479,3.90479,0,0,1,3.9,3.9v43.6a7.81,7.81,0,0,1-7.8,7.8H22a7.81,7.81,0,0,1-7.8-7.8V43.35A3.90474,3.90474,0,0,1,18.1,39.45Z"></path>
  </g>
</svg>,
    background: "bg-white",
    component: IOSProjects,
  },
  {
    name: "Safari",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" id="safari" className="w-[54px] h-[54px]">
  <defs>
    <linearGradient id="a" x1="-868.775" x2="-868.775" y1="-881.357" y2="-879.35" gradientTransform="matrix(51.9299 0 0 -51.9299 45175.498 -45656.667)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1e6ff1"></stop>
      <stop offset="1" stop-color="#28cefb"></stop>
    </linearGradient>
  </defs>
  <path fill="#fff" fill-rule="evenodd" d="M0,94V26A25.94821,25.94821,0,0,1,26,0H94a25.94821,25.94821,0,0,1,26,26V94a25.94821,25.94821,0,0,1-26,26H26A25.94821,25.94821,0,0,1,0,94Z"></path>
  <g>
    <circle cx="60.1" cy="60" r="52.1" fill="url(#a)"></circle>
    <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M60.1024,107.4798v-8"></path>
    <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M60.1024,20.4798v-8"></path>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M51.83207 106.78616l1.38918-7.87846M66.93946 21.1079l1.38918-7.87846"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M43.85227 104.62661l2.73616-7.51754M73.608 22.87335l2.73616-7.51754"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M36.312 101.16559l4-6.92821M79.812 25.82138l4-6.9282"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M29.61161 96.39464l5.1423-6.12835M85.53413 29.74878l5.1423-6.12836"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M23.66233 90.51885l6.12835-5.1423M90.30818 34.59634l6.12836-5.1423"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M18.94561 83.72128l6.92819-4M94.2898 40.22129l6.9282-4"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M15.386 76.2519l7.51754-2.73616M97.13924 46.49615L104.65678 43.76"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M13.29134 68.29889L21.1698 66.9097M98.96961 53.1915l7.87847-1.38919"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M12.61824 60.00238h8M99.61822 60.00238h8"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M13.31368 51.78449l7.87846 1.38919M98.992 66.89189l7.87846 1.38918"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M15.47 43.7719l7.51754 2.73616M97.22325 73.52765l7.51754 2.73616"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M18.92822 36.30686l6.9282 4M94.27242 79.80686l6.92821 4"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M23.67793 29.43833l6.12835 5.1423M90.32379 85.36085l6.12836 5.14231"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M29.50992 23.626l5.1423 6.12836M85.43245 90.27185l5.1423 6.12836"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M36.32019 18.86009l4 6.9282M79.82019 94.2043l4 6.9282"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M43.85359 15.359l2.73616 7.51754M73.60934 97.11222l2.73616 7.51754"></path>
    </g>
    <g>
      <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M51.802 13.29176l1.38919 7.87846M66.90935 98.97l1.38919 7.87846"></path>
    </g>
    <g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M55.93679 107.30772l.34863-3.98478M63.868 16.654l.34863-3.98477"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M47.8203 105.92861l1.03528-3.8637M71.37283 18.02937l1.03528-3.86371"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M39.99838 103.01769l1.69048-3.62523M78.45664 20.54368l1.69048-3.62523"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M32.84 98.92712l2.29431-3.27661M85.03542 24.38428l2.29431-3.27661"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M26.54054 93.59134L29.369 90.76292M90.88724 29.24464l2.82843-2.82843"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M21.19133 87.29431L24.46794 85M95.73417 35.09885l3.27661-2.29431"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M17.06127 80.08907L20.6865 78.3986M99.53528 41.63081l3.62523-1.69047"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M14.20386 72.32676l3.8637-1.03528M102.10311 48.77422l3.8637-1.03527"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M12.73681 64.15229l3.98478-.34863M103.39053 56.22111l3.98478-.34862"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M12.77127 55.87244l3.98478.34863M103.425 63.80362l3.98478.34862"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M14.14562 47.75326l3.8637 1.03528M102.04485 71.30579l3.8637 1.03528"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M17.028 39.92087l3.62523 1.69047M99.502 78.37913l3.62523 1.69047"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M21.17515 32.80011l3.27661 2.29431M95.718 84.99557l3.27661 2.2943"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M26.53579 26.44337l2.82843 2.82843M90.88251 90.79009l2.82842 2.82843"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M32.7894 21.08372l2.29431 3.27661M84.98486 95.62656l2.29431 3.27661"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M40.02276 16.989l1.69047 3.62523M78.481 99.463l1.69047 3.62523"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M47.77372 14.17253l1.03528 3.8637M71.32625 102.07178l1.03528 3.86371"></path>
      </g>
      <g>
        <path fill="none" stroke="#fff" stroke-linecap="square" stroke-width="1.003" d="M55.895 12.71089l.34862 3.98478M63.82621 103.36462l.34862 3.98477"></path>
      </g>
    </g>
    <g>
      <polygon fill="#fff" fill-rule="evenodd" points="97.07 29.06 55.97 55.36 23.07 91.06 64.37 65.36 97.07 29.06"></polygon>
      <polygon fill="#ff3b30" fill-rule="evenodd" points="97.07 29.06 55.97 55.36 64.37 65.36 97.07 29.06"></polygon>
    </g>
  </g>
</svg>,
    background: "bg-white",
    component: IOSSafari,
  },
  {
    name: "Music",
    icon: <img src="/Music.png" alt="Music" className="h-[54px] w-[54px] rounded-full"/>,
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
