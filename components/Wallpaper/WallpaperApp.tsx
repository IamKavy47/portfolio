"use client"

import { useState, useCallback, useMemo } from "react"
import Window from "./Window"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import UploadDialog from "../UploadDialog"
import { useInView } from "react-intersection-observer"

interface WallpaperAppProps {
  onClose: () => void
  onChangeWallpaper: (wallpaper: string) => void
  onFocus: () => void
}

interface Wallpaper {
  name: string
  url: string
  description?: string
}

// Optimized lazy loaded image component with better error handling and loading states
function LazyImage({
  src,
  alt,
  className,
  onClick,
  selected = false,
}: {
  src: string
  alt: string
  className?: string
  onClick?: () => void
  selected?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  })

  return (
    <div
      ref={ref}
      className={`${className} ${selected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-gray-300"} 
                  rounded-lg overflow-hidden transition-all duration-200 shadow-sm`}
      onClick={onClick}
    >
      {inView ? (
        <>
          {!loaded && !error && <div className="w-full h-full bg-gray-100 animate-pulse absolute inset-0"></div>}
          {error && (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center absolute inset-0">
              <span className="text-xs text-gray-500">Failed to load</span>
            </div>
          )}
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </>
      ) : (
        <div className="w-full h-full bg-gray-100"></div>
      )}
    </div>
  )
}

// Virtualized wallpaper grid for better performance
function VirtualizedWallpaperGrid({
  wallpapers,
  category,
  selectedWallpaper,
  onSelect,
}: {
  wallpapers: Wallpaper[]
  category: string
  selectedWallpaper: Wallpaper
  onSelect: (wallpaper: Wallpaper) => void
}) {
  // Only render what's in view
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "100px 0px",
  })

  if (wallpapers.length === 0) return null

  return (
    <div ref={ref} className="mb-6">
      {inView && (
        <>
          <h3 className="text-sm font-medium text-gray-700 mb-3">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {wallpapers.map((wallpaper, index) => (
              <div key={`${category}-${index}`} className="aspect-[4/3]">
                <LazyImage
                  src={wallpaper.url}
                  alt={wallpaper.name}
                  className="w-full h-full cursor-pointer"
                  onClick={() => onSelect(wallpaper)}
                  selected={selectedWallpaper.url === wallpaper.url}
                />
                <p className="text-xs font-medium mt-1 truncate">{wallpaper.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const wallpaperCategories = {
  custom: [] as Wallpaper[],
  dynamic: [
    {
      name: "Big sur",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall5.jpeg",
      description: "Dynamic color waves",
    },
    {
      name: "Monterey",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall1.jpg",
      description: "Abstract patterns",
    },
    {
      name: "Aurora",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall9.jpg",
      description: "Colorful gradients",
    },
    {
      name: "Flower",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall4.jpg",
    },
  ],
  landscape: [
    {
      name: "California Coast",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall2.jpg",
      description: "Beautiful coastline view",
    },
    {
      name: "Beautiful Landscape",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall3.jpg",
      description: "Majestic redwood trees",
    },
    {
      name: "Mountains",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall7.jpg",
      description: "Scenic desert landscape",
    },
  ],
  cityscape: [
    {
      name: "Sequio",
      url: "/wall/wall6.png?height=400&width=600",
      description: "City by the bay",
    },
    {
      name: "",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall8-kz9cGEw3O9z2HgvLGRVsAHbOpobnY9.webp",
      description: "The big apple at night",
    },
  ],
}

export default function WallpaperApp({ onClose, onChangeWallpaper, onFocus }: WallpaperAppProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpaperCategories.dynamic[0])
  const [showScreenSaver, setShowScreenSaver] = useState(false)
  const [showAllSpaces, setShowAllSpaces] = useState(true)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [customWallpapers, setCustomWallpapers] = useState<Wallpaper[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("Apple")
  const [searchQuery, setSearchQuery] = useState("")

  // Memoize the combined wallpapers to prevent unnecessary re-renders
  const allWallpapers = useMemo(() => {
    return {
      ...wallpaperCategories,
      custom: customWallpapers,
    }
  }, [customWallpapers])

  // Filter wallpapers based on search query
  const filteredWallpapers = useMemo(() => {
    if (!searchQuery) return allWallpapers

    const filtered: Record<string, Wallpaper[]> = {}

    Object.entries(allWallpapers).forEach(([category, wallpapers]) => {
      filtered[category] = wallpapers.filter(
        (wallpaper) =>
          wallpaper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (wallpaper.description && wallpaper.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    })

    return filtered
  }, [allWallpapers, searchQuery])

  // Use useCallback to prevent unnecessary re-renders
  const handleWallpaperChange = useCallback(
    (wallpaper: Wallpaper) => {
      setSelectedWallpaper(wallpaper)
      onChangeWallpaper(wallpaper.url)
    },
    [onChangeWallpaper],
  )

  const handleUpload = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file)
      const newWallpaper = {
        name: file.name.split(".")[0],
        url,
        description: "Custom wallpaper",
      }
      setCustomWallpapers((prev) => [newWallpaper, ...prev])
      handleWallpaperChange(newWallpaper)
      setIsUploadOpen(false)
    },
    [handleWallpaperChange],
  )

  // Categories for the sidebar
  const categories = useMemo(
    () => [
      { id: "Apple", label: "Apple" },
      { id: "Desktop Pictures", label: "Desktop Pictures" },
      { id: "Colors", label: "Colors" },
      { id: "Photos", label: "Photos" },
    ],
    [],
  )

  return (
    <Window
      title="Desktop & Screen Saver"
      onClose={onClose}
      onFocus={onFocus}
      initialSize={{ width: 800, height: 600 }}
    >
      <div className="flex h-full bg-[#f5f5f7] overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#f5f5f7] border-r border-gray-200 flex flex-col">
          <div className="p-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-200 border-none rounded-md py-1 pl-7 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`w-full text-left px-3 py-1.5 text-sm ${
                  activeCategory === category.id ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Current Wallpaper Preview */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-32 h-20 rounded-md overflow-hidden shadow-sm border border-gray-200">
                <img
                  src={selectedWallpaper.url || "/placeholder.svg"}
                  alt={selectedWallpaper.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">{selectedWallpaper.name}</h3>
                {selectedWallpaper.description && (
                  <p className="text-xs text-gray-500 mb-2">{selectedWallpaper.description}</p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Show as screen saver</span>
                    <Switch checked={showScreenSaver} onCheckedChange={setShowScreenSaver} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Show on all Spaces</span>
                    <Switch checked={showAllSpaces} onCheckedChange={setShowAllSpaces} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallpaper Grid */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <Button
                    className="rounded-md text-xs h-7 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 border-none"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadOpen(true)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Photo
                  </Button>
                  <Button
                    className="rounded-md text-xs h-7 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 border-none"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Folder
                  </Button>
                </div>

                {/* Custom Wallpapers */}
                {filteredWallpapers.custom.length > 0 && (
                  <VirtualizedWallpaperGrid
                    wallpapers={filteredWallpapers.custom}
                    category="Custom"
                    selectedWallpaper={selectedWallpaper}
                    onSelect={handleWallpaperChange}
                  />
                )}

                {/* Dynamic Wallpapers */}
                <VirtualizedWallpaperGrid
                  wallpapers={filteredWallpapers.dynamic}
                  category="Dynamic"
                  selectedWallpaper={selectedWallpaper}
                  onSelect={handleWallpaperChange}
                />

                {/* Landscape */}
                <VirtualizedWallpaperGrid
                  wallpapers={filteredWallpapers.landscape}
                  category="Landscape"
                  selectedWallpaper={selectedWallpaper}
                  onSelect={handleWallpaperChange}
                />

                {/* Cityscape */}
                <VirtualizedWallpaperGrid
                  wallpapers={filteredWallpapers.cityscape}
                  category="Cityscape"
                  selectedWallpaper={selectedWallpaper}
                  onSelect={handleWallpaperChange}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <UploadDialog open={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
    </Window>
  )
}
