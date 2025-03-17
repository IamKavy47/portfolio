"use client"

import { useState } from "react"
import Background from "@/components/Background"
import Dock from "@/components/Dock"
import TopBar from "@/components/TopBar"
import AboutMe from "@/components/AboutMe"
import Projects from "@/components/Projects"
import Calculator from "@/components/Calculator"
import VSCode from "@/components/VSCode"
import WallpaperApp from "@/components/WallpaperApp"
import Calendar from "@/components/Calendar"
import Browser from "@/components/Browser"
import Finder from "@/components/Finder"
import ContactApp from "@/components/ContactApp"
import Youtube from "@/components/youtube"

export default function MacOSInterface() {
  const [openApps, setOpenApps] = useState<string[]>([])
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [wallpaper, setWallpaper] = useState(
    "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall5.jpeg",
  )

  const toggleApp = (appName: string) => {
    setOpenApps((prev) => {
      if (prev.includes(appName)) {
        return prev.filter((app) => app !== appName)
      } else {
        setActiveApp(appName)
        return [...prev, appName]
      }
    })
  }
  
  const closeApp = (appName: string) => {
    setOpenApps((prev) => prev.filter((app) => app !== appName))
    setActiveApp(null)
  }

  const focusApp = (appName: string) => {
    setActiveApp(appName)
  }

  const changeWallpaper = (newWallpaper: string) => {
    setWallpaper(newWallpaper)
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Background wallpaper={wallpaper} onOpenApp={toggleApp} />
      <TopBar activeApp={activeApp} onOpenApp={toggleApp} />
      {openApps.includes("AboutMe") && (
        <AboutMe onClose={() => closeApp("AboutMe")} onFocus={() => focusApp("AboutMe")} />
      )}
      {openApps.includes("Projects") && (
        <Projects onClose={() => closeApp("Projects")} onFocus={() => focusApp("Projects")} />
      )}
      {openApps.includes("Calculator") && (
        <Calculator onClose={() => closeApp("Calculator")} onFocus={() => focusApp("Calculator")} />
      )}
      {openApps.includes("VSCode") && <VSCode onClose={() => closeApp("VSCode")} onFocus={() => focusApp("VSCode")} />}
      {openApps.includes("WallpaperApp") && (
        <WallpaperApp
          onClose={() => closeApp("WallpaperApp")}
          onFocus={() => focusApp("WallpaperApp")}
          onChangeWallpaper={changeWallpaper}
        />
      )}
      {openApps.includes("Calendar") && (
        <Calendar onClose={() => closeApp("Calendar")} onFocus={() => focusApp("Calendar")} />
      )}
      {openApps.includes("Safari") && <Browser onClose={() => closeApp("Safari")} onFocus={() => focusApp("Safari")} />}
      {openApps.includes("Finder") && (
        <Finder onClose={() => closeApp("Finder")} onFocus={() => focusApp("Finder")} folderName="Documents" />
      )}
      {openApps.includes("ContactApp") && (
        <ContactApp onClose={() => closeApp("ContactApp")} onFocus={() => focusApp("ContactApp")} />
      )}
      {openApps.includes("Youtube") && (
        <Youtube onClose={() => closeApp("Youtube")} onFocus={()=> focusApp("Youtube")} />
      )}
      <Dock openApp={toggleApp} openApps={openApps} />
    </div>
  )
}
