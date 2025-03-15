"use client"

import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"
import { motion } from "framer-motion"

interface IOSWallpaperAppProps {
  onClose: () => void
  onWallpaperChange: (url: string) => void
}

export default function IOSWallpaperApp({ onClose, onWallpaperChange }: IOSWallpaperAppProps) {
  const wallpapers = [
    "/ios1.jpg",
    "/ios2.jpg?height=812&width=375",
    "/placeholder.svg?height=812&width=375&text=Wallpaper+2",
    "/placeholder.svg?height=812&width=375&text=Wallpaper+3",
    "/placeholder.svg?height=812&width=375&text=Wallpaper+4",
    "/placeholder.svg?height=812&width=375&text=Wallpaper+5",
    "/placeholder.svg?height=812&width=375&text=Wallpaper+6",
  ]

  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0])

  const handleWallpaperSelect = (wallpaper: string) => {
    setSelectedWallpaper(wallpaper)
    onWallpaperChange(wallpaper)
    // Don't close automatically to allow multiple selections
  }

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={onClose} className="text-blue-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Wallpaper</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Choose a Wallpaper</h2>

        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((wallpaper, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-2xl overflow-hidden aspect-[9/16]"
              onClick={() => handleWallpaperSelect(wallpaper)}
            >
              <img
                src={wallpaper || "/placeholder.svg"}
                alt={`Wallpaper ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedWallpaper === wallpaper && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

