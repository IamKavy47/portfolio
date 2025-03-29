"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Search, Home, Compass, LogInIcon as Subscription, Library, X } from "lucide-react"

interface IOSYouTubeProps {
  onClose: () => void
}

export default function IOSYouTube({ onClose }: IOSYouTubeProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
  }

  // Toggle search bar
  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setTimeout(() => {
        const searchInput = document.getElementById("youtube-search")
        if (searchInput) searchInput.focus()
      }, 100)
    }
  }

  return (
    <div className="h-[758px] w-[350px] bg-black text-white flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="bg-[#212121] px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center">
          <button onClick={onClose} className="text-white mr-4">
            <ArrowLeft size={24} />
          </button>
          <h2>Youtube</h2>
        </div>
      </div>

      {/* Main content - iframe */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="animate-pulse flex flex-col items-center">
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="https://youtube-clone-4ibp.vercel.app/"
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          title="YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Bottom navigation */}
      <div className="bg-[#212121] border-t border-[#303030] py-2 px-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-white">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>

          <button className="flex flex-col items-center text-gray-400">
            <Compass size={20} />
            <span className="text-xs mt-1">Explore</span>
          </button>

          <button className="flex flex-col items-center text-gray-400">
            <Subscription size={20} />
            <span className="text-xs mt-1">Subscriptions</span>
          </button>

          <button className="flex flex-col items-center text-gray-400">
            <Library size={20} />
            <span className="text-xs mt-1">Library</span>
          </button>
        </div>
      </div>
    </div>
  )
}

