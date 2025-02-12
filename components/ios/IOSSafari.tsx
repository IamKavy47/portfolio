"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, RotateCw, Share, BookOpen } from "lucide-react"

interface IOSSafariProps {
  onClose: () => void
}

export default function IOSSafari({ onClose }: IOSSafariProps) {
  const [url, setUrl] = useState("https://www.apple.com")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <form onSubmit={handleSubmit} className="flex-1 mx-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-white rounded-lg px-4 py-2 text-sm"
            placeholder="Search or enter website name"
          />
        </form>
        <button onClick={() => setIsLoading(true)} className="text-[#007AFF]">
          <RotateCw size={24} />
        </button>
      </header>
      <div className="flex-1 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <iframe src={url} className="w-full h-full border-none" title="Safari Content" />
        )}
      </div>
      <footer className="bg-[#F2F2F7] border-t border-gray-200 px-4 py-2 flex justify-around">
        <button className="text-[#007AFF] flex flex-col items-center">
          <ChevronLeft size={24} />
          <span className="text-xs mt-1">Back</span>
        </button>
        <button className="text-[#007AFF] flex flex-col items-center">
          <ChevronRight size={24} />
          <span className="text-xs mt-1">Forward</span>
        </button>
        <button className="text-[#007AFF] flex flex-col items-center">
          <Share size={24} />
          <span className="text-xs mt-1">Share</span>
        </button>
        <button className="text-[#007AFF] flex flex-col items-center">
          <BookOpen size={24} />
          <span className="text-xs mt-1">Bookmarks</span>
        </button>
      </footer>
    </div>
  )
}

