"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BootAnimationProps {
  onComplete: () => void
}

export default function BootAnimation({ onComplete }: BootAnimationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-black flex items-center justify-center"
        >
          <video autoPlay playsInline className="w-[60vw] h-[60vh] object-contain">
            <source src="/Boot.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

