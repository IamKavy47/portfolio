"use client"

import { useState, useEffect } from "react"

export function useDeviceDetect() {
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")

  const checkDeviceType = () => {
    const width = window.innerWidth

    if (width <= 500) {
      setDeviceType("mobile")
    } else if (width <= 1280) {
      setDeviceType("tablet")
    } else {
      setDeviceType("desktop")
    }
  }

  useEffect(() => {
    // Check device type on mount
    checkDeviceType()

    // Detect changes in viewport size (resize event)
    const handleResize = () => {
      checkDeviceType()
    }

    window.addEventListener("resize", handleResize)

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { deviceType }
}

