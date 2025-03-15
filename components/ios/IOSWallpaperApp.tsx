"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface IOSWallpaperAppProps {
  onClose: () => void
  onWallpaperChange: (url: string) => void
  currentWallpaper?: string
}

interface WallpaperCategory {
  name: string
  wallpapers: string[]
}

export default function IOSWallpaperApp({
  onClose,
  onWallpaperChange,
  currentWallpaper = "/ios1.jpg",
}: IOSWallpaperAppProps) {
  // Organize wallpapers into categories
  const wallpaperCategories: WallpaperCategory[] = [
    {
      name: "iOS",
      wallpapers: [
        "/ios1.jpg",
        "/ios2.jpg?height=812&width=375",
        "/ios3.jpg?height=812&width=375&text=iOS+Wallpaper+1",
        "/ios4.jpg?height=812&width=375&text=iOS+Wallpaper+2",
      ],
    },
    {
      name: "Nature",
      wallpapers: ["/ios5.png?height=812&width=375&text=Nature+1", "/ios6.jpg?height=812&width=375&text=Nature+2"],
    },
    {
      name: "Abstract",
      wallpapers: ["/ios7.jpg?height=812&width=375&text=Abstract+1"],
    },
  ]

  // Flatten all wallpapers for easier access
  const allWallpapers = wallpaperCategories.flatMap((category) => category.wallpapers)

  // State
  const [selectedWallpaper, setSelectedWallpaper] = useState(currentWallpaper)
  const [appliedWallpaper, setAppliedWallpaper] = useState(currentWallpaper)
  const [showPreview, setShowPreview] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Set initial wallpaper
  useEffect(() => {
    // If currentWallpaper is provided and exists in our list, use it
    if (currentWallpaper && allWallpapers.includes(currentWallpaper)) {
      setSelectedWallpaper(currentWallpaper)
      setAppliedWallpaper(currentWallpaper)
    } else {
      // Otherwise use the first wallpaper
      setSelectedWallpaper(allWallpapers[0])
      setAppliedWallpaper(allWallpapers[0])
    }
  }, [currentWallpaper, allWallpapers])

  const handleWallpaperSelect = (wallpaper: string) => {
    setSelectedWallpaper(wallpaper)
  }

  const handleApplyWallpaper = () => {
    setAppliedWallpaper(selectedWallpaper)
    onWallpaperChange(selectedWallpaper)
    setShowPreview(false)
  }

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategory(categoryName)
  }

  const handleBackFromCategory = () => {
    setActiveCategory(null)
  }

  const renderCategoryList = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Wallpaper</div>

      {wallpaperCategories.map((category) => (
        <button
          key={category.name}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200"
          onClick={() => handleCategorySelect(category.name)}
        >
          <span className="text-[17px]">{category.name}</span>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md overflow-hidden mr-2">
              <img
                src={category.wallpapers[0] || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </button>
      ))}

      <div className="bg-white px-4 py-2 mt-6 text-xs text-gray-500 uppercase tracking-wider">Currently Applied</div>

      <div className="flex items-center px-4 py-3 bg-white border-b border-gray-200">
        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
          <img
            src={appliedWallpaper || "/placeholder.svg"}
            alt="Current Wallpaper"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[17px]">Current Wallpaper</span>
      </div>
    </div>
  )

  const renderCategoryWallpapers = () => {
    const category = wallpaperCategories.find((c) => c.name === activeCategory)
    if (!category) return null

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 p-3">
          {category.wallpapers.map((wallpaper, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-lg overflow-hidden aspect-[9/19] shadow-sm"
              onClick={() => {
                handleWallpaperSelect(wallpaper)
                setShowPreview(true)
              }}
            >
              <img
                src={wallpaper || "/placeholder.svg"}
                alt={`${category.name} Wallpaper ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedWallpaper === wallpaper && (
                <div className="absolute bottom-3 right-3 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  const renderPreview = () => (
    <AnimatePresence>
      {showPreview && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-80 z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-[270px] h-[550px] rounded-[40px] overflow-hidden border-4 border-gray-300 shadow-xl">
            <img
              src={selectedWallpaper || "/placeholder.svg"}
              alt="Wallpaper Preview"
              className="w-full h-full object-cover"
            />

            {/* iOS Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-between px-5 text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-4 h-3 bg-white rounded-sm"></div>
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="w-32 h-1 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-2 bg-gray-700 text-white rounded-lg"
              onClick={() => setShowPreview(false)}
            >
              Cancel
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleApplyWallpaper}
            >
              Set
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col relative">
      <div className="bg-[#F2F2F7] px-4 py-3 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        {activeCategory ? (
          <button onClick={handleBackFromCategory} className="text-blue-500 font-medium">
            <div className="flex items-center">
              <ArrowLeft size={18} className="mr-1" />
              <span>Wallpaper</span>
            </div>
          </button>
        ) : (
          <button onClick={onClose} className="text-blue-500 font-medium">
            <div className="flex items-center">
              <ArrowLeft size={18} className="mr-1" />
              <span>Settings</span>
            </div>
          </button>
        )}

        <h1 className="text-[17px] font-semibold">{activeCategory ? activeCategory : "Wallpaper"}</h1>

        <div className="w-20"></div>
      </div>

      {activeCategory ? renderCategoryWallpapers() : renderCategoryList()}
      {renderPreview()}
    </div>
  )
}

