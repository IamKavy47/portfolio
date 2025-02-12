"use client"

import { useState } from "react"
import { ChevronLeft, Upload } from "lucide-react"

interface IOSWallpaperAppProps {
  onClose: () => void
}

const defaultWallpapers = [
  { name: "Default", url: "/ios1.jpg" },
  { name: "Nature", url: "/placeholder.svg?height=400&width=600" },
  { name: "Abstract", url: "/placeholder.svg?height=400&width=600" },
  { name: "City", url: "/placeholder.svg?height=400&width=600" },
]

export default function IOSWallpaperApp({ onClose }: IOSWallpaperAppProps) {
  const [wallpapers, setWallpapers] = useState(defaultWallpapers)
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0])

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const newWallpaper = { name: "Custom", url: reader.result as string }
        setWallpapers([...wallpapers, newWallpaper])
        setSelectedWallpaper(newWallpaper)
      }
      reader.readAsDataURL(file)
    }
  }

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
              className={`aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedWallpaper.name === wallpaper.name ? "border-[var(--ios-blue)] scale-105" : "border-transparent"
              }`}
              onClick={() => setSelectedWallpaper(wallpaper)}
            >
              <img
                src={wallpaper.url}
                alt={wallpaper.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <label
          htmlFor="wallpaper-upload"
          className="ios-button mt-6 w-full flex items-center justify-center rounded-lg p-3 bg-white shadow-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <Upload size={18} className="mr-2" />
          Upload New Wallpaper
        </label>
        <input
          id="wallpaper-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
