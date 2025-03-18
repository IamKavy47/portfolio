"use client"

import { useState, useRef, useEffect } from "react"
import Window from "./Window"
import { Loader2 } from "lucide-react"

interface YouTubeProps {
  onClose: () => void
  onFocus: () => void
}

export default function YouTube({ onClose, onFocus }: YouTubeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleIframeLoad = () => {
      setIsLoading(false)
    }

    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad)
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad)
      }
    }
  }, [])

  return (
    <Window title="YouTube" onClose={onClose} onFocus={onFocus} initialSize={{ width: 1024, height: 768 }}>
      <div className="flex flex-col h-full bg-white">
        <div className="flex-grow relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="https://youtube-clone-4ibp.vercel.app/"
            className="w-full h-full border-none"
            title="YouTube"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </Window>
  )
}

