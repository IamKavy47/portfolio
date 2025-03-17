"use client"

import { useState, useCallback, useMemo } from "react"
import Window from "./Window"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import UploadDialog from "./UploadDialog"
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

// Lazy loaded image component for better performance
function LazyImage({
  src,
  alt,
  className,
  onClick,
}: {
  src: string
  alt: string
  className?: string
  onClick?: () => void
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  })

  return (
    <div ref={ref} className={className} onClick={onClick}>
      {inView ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      )}
    </div>
  )
}

const wallpaperCategories = {
  custom: [] as Wallpaper[],
  dynamic: [
    {
      name: "Sequoia",
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
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall6.jpg",
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
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall3.jpg?height=400&width=600",
      description: "Majestic redwood trees",
    },
    {
      name: "Mountains",
      url: "https://reriyznm2homh55q.public.blob.vercel-storage.com/wallpaper/wall7.jpg?height=400&width=600",
      description: "Scenic desert landscape",
    },
  ],
  cityscape: [
    {
      name: "San Francisco",
      url: "/placeholder.svg?height=400&width=600",
      description: "City by the bay",
    },
    {
      name: "New York",
      url: "/placeholder.svg?height=400&width=600",
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

  // Memoize the combined wallpapers to prevent unnecessary re-renders
  const allWallpapers = useMemo(() => {
    return {
      ...wallpaperCategories,
      custom: customWallpapers,
    }
  }, [customWallpapers])

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

  // Memoized wallpaper grid component to improve performance
  const WallpaperGrid = useCallback(
    ({ wallpapers, category }: { wallpapers: Wallpaper[]; category: string }) => {
      return (
        <div>
          <h3 className="text-sm font-medium mb-3">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wallpapers.map((wallpaper, index) => (
              <div
                key={`${category}-${index}`}
                className={`group cursor-pointer rounded-lg overflow-hidden relative ${
                  selectedWallpaper.url === wallpaper.url ? "ring-2 ring-blue-500" : "hover:ring-2 hover:ring-gray-300"
                }`}
                onClick={() => handleWallpaperChange(wallpaper)}
              >
                <LazyImage
                  src={wallpaper.url || "/placeholder.svg"}
                  alt={wallpaper.name}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs font-medium">{wallpaper.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    [selectedWallpaper, handleWallpaperChange],
  )

  return (
    <Window
      title="Desktop & Screen Saver"
      onClose={onClose}
      onFocus={onFocus}
      initialSize={{ width: 800, height: 600 }}
    >
      <div className="flex flex-col h-full bg-[#f5f5f7]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <h2 className="text-sm font-medium">Wallpaper</h2>
          <div>
            <Button variant="ghost" size="sm" className="text-blue-500">
              Automatic
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 h-full flex flex-col">
            {/* Current Wallpaper */}
            <div className="flex gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <img
                  src={selectedWallpaper.url || "/placeholder.svg"}
                  alt={selectedWallpaper.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-medium">{selectedWallpaper.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Show as screen saver</span>
                    <Switch checked={showScreenSaver} onCheckedChange={setShowScreenSaver} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Show on all Spaces</span>
                    <Switch checked={showAllSpaces} onCheckedChange={setShowAllSpaces} />
                  </div>
                </div>
              </div>
            </div>

            {/* Add Buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                className="rounded border-gray-300"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Photo
              </Button>
              <Button className="rounded border-gray-300" variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Folder or Album
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Wallpaper Categories */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Custom Wallpapers */}
                {customWallpapers.length > 0 && <WallpaperGrid wallpapers={allWallpapers.custom} category="Custom" />}

                {/* Dynamic Wallpapers */}
                <WallpaperGrid wallpapers={allWallpapers.dynamic} category="Dynamic Wallpapers" />

                {/* Landscape */}
                <WallpaperGrid wallpapers={allWallpapers.landscape} category="Landscape" />

                {/* Cityscape */}
                <WallpaperGrid wallpapers={allWallpapers.cityscape} category="Cityscape" />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <UploadDialog open={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
    </Window>
  )
}

