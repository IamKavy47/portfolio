"use client"

import { useState, useRef, useEffect } from "react"
import Window from "./Window"
import { Loader2 } from "lucide-react"

interface InstagramProps {
  onClose: () => void
  onFocus: () => void
}

export default function Instagram({ onClose, onFocus }: InstagramProps) {
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
    <Window title="Instagram" onClose={onClose} onFocus={onFocus} initialSize={{ width: 624, height: 468 }}>
      <div className="flex flex-col h-full bg-white">
        <div className="flex-grow relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            src="https://www.instagram.com/iamkavy75/embed"
            className="w-full h-full border-none"
            title="Instagram"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </Window>
  )
}

