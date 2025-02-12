"use client"

import { useState } from "react"
import { ChevronLeft, Camera, RotateCw, Image } from "lucide-react"

interface IOSCameraProps {
  onClose: () => void
}

export default function IOSCamera({ onClose }: IOSCameraProps) {
  const [cameraMode, setCameraMode] = useState<"photo" | "video">("photo")

  return (
    <div className="h-full flex flex-col bg-black text-white">
      <header className="px-4 py-2 flex items-center justify-between">
        <button onClick={onClose} className="text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex space-x-4">
          <button
            className={`px-3 py-1 rounded-full ${cameraMode === "photo" ? "bg-white text-black" : "text-white"}`}
            onClick={() => setCameraMode("photo")}
          >
            Photo
          </button>
          <button
            className={`px-3 py-1 rounded-full ${cameraMode === "video" ? "bg-white text-black" : "text-white"}`}
            onClick={() => setCameraMode("video")}
          >
            Video
          </button>
        </div>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full border-4 border-white flex items-center justify-center">
          <Camera size={48} />
        </div>
      </div>
      <footer className="p-4 flex justify-between items-center">
        <button className="text-white">
          <Image size={24} />
        </button>
        <button className="w-16 h-16 rounded-full border-4 border-white"></button>
        <button className="text-white">
          <RotateCw size={24} />
        </button>
      </footer>
    </div>
  )
}

