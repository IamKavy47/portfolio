"use client"

import { SpeedInsights } from "@vercel/speed-insights/next"
import { useState } from "react"
import { useDeviceDetect } from "@/hooks/useDeviceDetect"
import MacOSInterface from "@/components/MacOSInterface"
import IOSInterface from "@/components/IOSInterface"
import BootAnimation from "@/components/BootAnimation"

export default function Home() {
  const [isBooting, setIsBooting] = useState(true)
  const { deviceType } = useDeviceDetect()

  const handleBootComplete = () => {
    setIsBooting(false)
  }

  return (
    <>
      {isBooting ? (
        <BootAnimation onComplete={handleBootComplete} />
      ) : (
        <>{deviceType === "mobile" ? <IOSInterface /> : <MacOSInterface />}</>
      )}
    </>
  )
}

