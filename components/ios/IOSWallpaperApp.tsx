"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Plus } from "lucide-react"

interface IOSWallpaperAppProps {
  onClose: () => void
  onWallpaperChange: (url: string) => void
}

const defaultWallpapers = [
  { name: "Default", url: "/ios1.jpg" },
  { name: "Nature", url: "/nature.jpg" },
  { name: "Abstract", url: "/abstract.jpg" },
  { name: "City", url: "/city.jpg" },
]

export default function IOSWallpaperApp({ onClose, onWallpaperChange }: IOSWallpaperAppProps) {
  // Initialize state with wallpapers from localStorage if available
  const [wallpapers, setWallpapers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customWallpapers')
      return saved ? [...defaultWallpapers, ...JSON.parse(saved)] : defaultWallpapers
    }
    return defaultWallpapers
  })

  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0])

  // Save custom wallpapers to localStorage whenever they change
  useEffect(() => {
    if (wallpapers.length > defaultWallpapers.length) {
      const customWallpapers = wallpapers.slice(defaultWallpapers.length)
      localStorage.setItem('customWallpapers', JSON.stringify(customWallpapers))
    }
  }, [wallpapers])

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const newWallpaper = { 
          name: `Custom ${wallpapers.length + 1}`, 
          url: reader.result as string 
        }
        setWallpapers([...wallpapers, newWallpaper])
        setSelectedWallpaper(newWallpaper)
        onWallpaperChange(newWallpaper.url)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleWallpaperSelect = (wallpaper: { name: string; url: string }) => {
    setSelectedWallpaper(wallpaper)
    onWallpaperChange(wallpaper.url)
  }

  return (
    <div className="ios-app h-full w-full bg-gray-100">
      <header className="ios-header fixed top-0 left-0 right-0 p-4 flex items-center justify-between bg-gray-100/80 backdrop-blur-lg z-10 border-b border-gray-200">
        <button 
          onClick={onClose} 
          className="ios-back-button p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-blue-500" />
        </button>
        <h1 className="text-xl font-semibold">Choose Wallpaper</h1>
        <div className="w-10"></div>
      </header>

      <div className="ios-content pt-20 px-4 pb-4 h-full overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 auto-rows-max">
          {wallpapers.map((wallpaper) => (
            <div
              key={wallpaper.name}
              className={`relative aspect-[9/16] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-[1.02] ${
                selectedWallpaper.url === wallpaper.url
                  ? "border-blue-500 scale-[1.02]"
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="bg-white/20 rounded-full p-3 border-2 border-white">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                <span className="text-white text-sm font-medium">{wallpaper.name}</span>
              </div>
            </div>
          ))}
          
          <label
            htmlFor="wallpaper-upload"
            className="aspect-[9/16] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col gap-2 items-center justify-center cursor-pointer hover:bg-gray-200/50 transition-all bg-white/80"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <Plus size={24} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Add New</span>
          </label>
        </div>
      </div>

      <input
        id="wallpaper-upload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}