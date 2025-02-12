"use client"

import { useState } from "react"
import { ChevronLeft, Search, Grid, ImageIcon } from "lucide-react"

interface IOSPhotosProps {
  onClose: () => void
}

const photos = [
  { id: 1, url: "/placeholder.svg?height=100&width=100" },
  { id: 2, url: "/placeholder.svg?height=100&width=100" },
  { id: 3, url: "/placeholder.svg?height=100&width=100" },
  { id: 4, url: "/placeholder.svg?height=100&width=100" },
  { id: 5, url: "/placeholder.svg?height=100&width=100" },
  { id: 6, url: "/placeholder.svg?height=100&width=100" },
  { id: 7, url: "/placeholder.svg?height=100&width=100" },
  { id: 8, url: "/placeholder.svg?height=100&width=100" },
]

export default function IOSPhotos({ onClose }: IOSPhotosProps) {
  const [activeTab, setActiveTab] = useState<"library" | "forYou" | "albums">("library")

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Photos</h1>
        <button className="text-[#007AFF]">
          <Search size={24} />
        </button>
      </header>
      <div className="flex justify-around bg-white border-b border-gray-200">
        <button
          className={`py-2 px-4 ${activeTab === "library" ? "text-[#007AFF] border-b-2 border-[#007AFF]" : "text-gray-500"}`}
          onClick={() => setActiveTab("library")}
        >
          Library
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "forYou" ? "text-[#007AFF] border-b-2 border-[#007AFF]" : "text-gray-500"}`}
          onClick={() => setActiveTab("forYou")}
        >
          For You
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "albums" ? "text-[#007AFF] border-b-2 border-[#007AFF]" : "text-gray-500"}`}
          onClick={() => setActiveTab("albums")}
        >
          Albums
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="aspect-square">
              <img
                src={photo.url || "/placeholder.svg"}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
        <button className="text-[#007AFF] flex flex-col items-center">
          <Grid size={24} />
          <span className="text-xs mt-1">Library</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center">
          <ImageIcon size={24} />
          <span className="text-xs mt-1">For You</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center">
          <Grid size={24} />
          <span className="text-xs mt-1">Albums</span>
        </button>
      </footer>
    </div>
  )
}

