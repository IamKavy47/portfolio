"use client"

import { useState } from "react"
import { ChevronLeft, Upload } from "lucide-react"

interface IOSWallpaperAppProps {
  onClose: () => void
}

const wallpapers = [
  { name: "Default", url: "/ios1.jpg" },
  { name: "Nature", url: "/placeholder.svg?height=400&width=600" },
  { name: "Abstract", url: "/placeholder.svg?height=400&width=600" },
  { name: "City", url: "/placeholder.svg?height=400&width=600" },
]

export default function IOSWallpaperApp({ onClose }: IOSWallpaperAppProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0])

  return (
    <div className="ios-app">
      <header className="ios-header">
        <button onClick={onClose} className="ios-back-button">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Wallpaper</h1>
        <div className="w-6"></div>
      </header>
      <div className="ios-content">
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.name}
              className={`aspect-[9/16] rounded-xl overflow-hidden border-2 ${
                selectedWallpaper.name === wallpaper.name ? "border-[var(--ios-blue)]" : "border-transparent"
              }`}
              onClick={() => setSelectedWallpaper(wallpaper)}
            >
              <img
                src={wallpaper.url || "/placeholder.svg"}
                alt={wallpaper.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <button className="ios-button mt-6 w-full flex items-center justify-center">
          <Upload size={18} className="mr-2" />
          Upload New Wallpaper
        </button>
      </div>
    </div>
  )
}

