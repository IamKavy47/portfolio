"\"use client"

import { ChevronLeft } from "lucide-react"

interface IOSMusicProps {
  onClose: () => void
}

export default function IOSMusic({ onClose }: IOSMusicProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="ios-header">
        <button onClick={onClose} className="ios-back-button">
          <ChevronLeft size={24} />
          <span className="ml-1">Back</span>
        </button>
        <h1 className="text-xl font-semibold">Music</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 overflow-auto p-4">
        {/* Placeholder for music player */}
        <div className="text-center text-gray-500">Music Player Placeholder</div>
      </div>
    </div>
  )
}

