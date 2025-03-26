"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

interface BootAnimationProps {
  onComplete: () => void
}

export default function BootAnimation({ onComplete }: BootAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoUrl = "https://reriyznm2homh55q.public.blob.vercel-storage.com/Boot.mp4"

  useEffect(() => {
    // Set up a safety timeout in case video never loads or ends
    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout triggered - animation taking too long")
      handleComplete()
    }, 15000) // 15 seconds max wait time

    return () => clearTimeout(safetyTimeout)
  }, [])

  // Handle completion of the animation
  const handleComplete = () => {
    setIsVisible(false)
    // Add a small delay for the exit animation
    setTimeout(onComplete, 500)
  }

  // Preload the video
  useEffect(() => {
    const preloadVideo = async () => {
      try {
        console.log("Starting to preload video")
        // Create a fetch request to start downloading the video
        const response = await fetch(videoUrl, {
          method: "GET",
          cache: "force-cache",
        })

        if (!response.ok) {
          throw new Error(`Failed to load video: ${response.status}`)
        }

        // Create a blob from the response
        const blob = await response.blob()

        // Create an object URL from the blob
        const objectUrl = URL.createObjectURL(blob)

        console.log("Video preloaded successfully")

        // Set the video source to the object URL
        if (videoRef.current) {
          videoRef.current.src = objectUrl
          videoRef.current.load()

          // Try to play the video after loading
          try {
            await videoRef.current.play()
            console.log("Video started playing")
          } catch (playError) {
            console.error("Error playing video:", playError)
            // If autoplay fails, show a play button or handle accordingly
            setHasError(true)
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error preloading video:", error)
        setHasError(true)
        setIsLoading(false)
        // If video fails to load, proceed to desktop
        handleComplete()
      }
    }

    preloadVideo()
  }, [])

  // Handle video events
  const handleVideoEnded = () => {
    console.log("Video playback completed")
    handleComplete()
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e)
    setHasError(true)
    // If video errors, proceed to desktop
    handleComplete()
  }

  const handleCanPlayThrough = () => {
    console.log("Video can play through without buffering")
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-black flex items-center justify-center"
        >
          {/* {isLoading && (
            <div className="flex flex-col items-center justify-center text-white">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p>Loading boot animation...</p>
            </div>
          )} */}

          {/* {hasError && (
            <div className="text-white text-center">
              <p className="text-xl mb-2">Unable to load boot animation</p>
              <p>Continuing to desktop...</p>
            </div>
          )} */}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted // Important for autoplay to work in most browsers
            className={`w-[60vw] h-[60vh] object-contain ${isLoading ? "opacity-0" : "opacity-100"}`}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            onCanPlayThrough={handleCanPlayThrough}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

