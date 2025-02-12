"use client"

import { useState } from "react"
import { ChevronLeft, RotateCw, Search } from "lucide-react"

interface IOSBrowserProps {
  onClose: () => void
}

export default function IOSBrowser({ onClose }: IOSBrowserProps) {
  const [url, setUrl] = useState("https://www.example.com")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="ios-header">
        <button onClick={onClose} className="ios-back-button">
          <ChevronLeft size={24} />
          <span className="ml-1">Back</span>
        </button>
        <form onSubmit={handleSubmit} className="flex-1 mx-2">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="ios-input pr-8 w-full text-sm"
              placeholder="Search or enter website name"
            />
            <Search size={18} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </form>
        <button onClick={() => setIsLoading(true)} className="ios-icon-button">
          <RotateCw size={24} />
        </button>
      </header>
      <div className="flex-1 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-[var(--ios-blue)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <iframe src={url} className="w-full h-full border-none" title="Browser Content" />
        )}
      </div>
    </div>
  )
}

