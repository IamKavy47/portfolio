"use client"

import { useState } from "react"
import { ChevronLeft, Upload, Plus } from "lucide-react"

interface IOSWallpaperAppProps {
  onClose: () => void
  onWallpaperChange: (url: string) => void // Callback to update the wallpaper in the parent component
}

const defaultWallpapers = [
  { name: "Default", url: "/ios1.jpg" },
  { name: "Nature", url: "/nature.jpg" },
  { name: "Abstract", url: "/abstract.jpg" },
  { name: "City", url: "/city.jpg" },
]

export default function IOSWallpaperApp({ onClose, onWallpaperChange }: IOSWallpaperAppProps) {
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
        onWallpaperChange(newWallpaper.url) // Update the wallpaper in the parent component
      }
      reader.readAsDataURL(file)
    }
  }

  const handleWallpaperSelect = (wallpaper: { name: string; url: string }) => {
    setSelectedWallpaper(wallpaper)
    onWallpaperChange(wallpaper.url) // Update the wallpaper in the parent component
  }

  return (
    <div className="ios-app h-full w-full bg-white">
      <header className="ios-header p-4 flex items-center justify-between bg-white shadow-sm">
        <button onClick={onClose} className="ios-back-button p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Wallpaper</h1>
        <div className="w-6"></div>
      </header>
      <div className="ios-content p-4">
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.name}
              className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedWallpaper.url === wallpaper.url
                  ? "border-[var(--ios-blue)] scale-105"
                  : "border-transparent"
              }`}
              onClick={() => handleWallpaperSelect(wallpaper)}
            >
              <img
                src={wallpaper.url}
                alt={wallpaper.name}
                className="w-full h-full object-cover"
              />
              {selectedWallpaper.url === wallpaper.url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-white font-semibold">Selected</span>
                </div>
              )}
            </div>
          ))}
          {/* Upload Button */}
          <label
            htmlFor="wallpaper-upload"
            className="aspect-[9/16] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all"
          >
            <Plus size={24} className="text-gray-500" />
          </label>
        </div>
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