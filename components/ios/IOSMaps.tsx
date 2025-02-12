"use client"

import { useState } from "react"
import { ChevronLeft, Search, Navigation, MapPin } from "lucide-react"

interface IOSMapsProps {
  onClose: () => void
}

export default function IOSMaps({ onClose }: IOSMapsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Maps</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gray-200">
          {/* Placeholder for map */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">Map Placeholder</div>
        </div>
        <div className="absolute top-4 left-4 right-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a place or address"
              className="w-full bg-white rounded-lg px-4 py-2 pl-10 shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
            <Navigation size={24} className="text-[#007AFF]" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
            <MapPin size={24} className="text-[#007AFF]" />
          </button>
        </div>
      </div>
    </div>
  )
}

