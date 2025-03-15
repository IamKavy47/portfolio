"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Clock, AlarmClock, Timer, ClockIcon as StopwatchIcon } from "lucide-react"
import { motion } from "framer-motion"

interface IOSClockProps {
  onClose: () => void
}

export default function IOSClock({ onClose }: IOSClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"worldclock" | "alarm" | "stopwatch" | "timer">("worldclock")
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false)
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const analogClockRef = useRef<HTMLCanvasElement>(null)

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Draw analog clock
  useEffect(() => {
    const drawClock = () => {
      const canvas = analogClockRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions
      const size = Math.min(window.innerWidth, 300)
      canvas.width = size
      canvas.height = size

      const centerX = size / 2
      const centerY = size / 2
      const radius = size * 0.4

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Draw clock face
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = "#1C1C1E"
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = "#39393D"
      ctx.stroke()

      // Draw hour markers
      for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6 - Math.PI / 2
        const markerRadius = radius * 0.85

        const x = centerX + markerRadius * Math.cos(angle)
        const y = centerY + markerRadius * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(x, y, size * 0.02, 0, 2 * Math.PI)
        ctx.fillStyle = "#FFFFFF"
        ctx.fill()
      }

      // Get current time
      const now = new Date()
      const hours = now.getHours() % 12
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()

      // Draw hour hand
      const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60) - Math.PI / 2
      drawHand(ctx, centerX, centerY, radius * 0.5, hourAngle, size * 0.04, "#FFFFFF")

      // Draw minute hand
      const minuteAngle = (minutes * Math.PI) / 30 + (seconds * Math.PI) / (30 * 60) - Math.PI / 2
      drawHand(ctx, centerX, centerY, radius * 0.7, minuteAngle, size * 0.03, "#FFFFFF")

      // Draw second hand
      const secondAngle = (seconds * Math.PI) / 30 - Math.PI / 2
      drawHand(ctx, centerX, centerY, radius * 0.8, secondAngle, size * 0.01, "#FF3B30")

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, size * 0.02, 0, 2 * Math.PI)
      ctx.fillStyle = "#FF3B30"
      ctx.fill()
    }

    const drawHand = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      length: number,
      angle: number,
      width: number,
      color: string,
    ) => {
      ctx.beginPath()
      ctx.lineWidth = width
      ctx.lineCap = "round"
      ctx.strokeStyle = color

      // Start at center
      ctx.moveTo(centerX, centerY)

      // Draw to end point
      const endX = centerX + length * Math.cos(angle)
      const endY = centerY + length * Math.sin(angle)
      ctx.lineTo(endX, endY)

      ctx.stroke()
    }

    // Draw initially
    drawClock()

    // Set up animation
    const animationFrame = requestAnimationFrame(function animate() {
      drawClock()
      requestAnimationFrame(animate)
    })

    // Handle window resize
    const handleResize = () => {
      drawClock()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Stopwatch functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10)
      }, 10)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStopwatchRunning])

  const formatStopwatchTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  const startStopwatch = () => {
    setIsStopwatchRunning(true)
  }

  const stopStopwatch = () => {
    setIsStopwatchRunning(false)
  }

  const resetStopwatch = () => {
    setStopwatchTime(0)
    setLaps([])
    setIsStopwatchRunning(false)
  }

  const addLap = () => {
    setLaps((prev) => [...prev, stopwatchTime])
  }

  // Updated world clocks with IST added and Sydney removed
  const worldClocks = [
    { city: "Local", timezone: "Local", offset: 0 },
    { city: "New Delhi", timezone: "IST", offset: 5.5 }, // Added IST timezone
    { city: "London", timezone: "GMT", offset: 0 },
    { city: "New York", timezone: "EDT", offset: -4 },
    { city: "Tokyo", timezone: "JST", offset: 9 },
  ]

  const getTimeForOffset = (offset: number) => {
    const localTime = new Date()
    const utc = localTime.getTime() + localTime.getTimezoneOffset() * 60000
    return new Date(utc + 3600000 * offset)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Render analog clock for a specific timezone
  const renderAnalogClockForTimezone = (offset: number) => {
    const time = offset === 0 && worldClocks[0].city === "Local" ? currentTime : getTimeForOffset(offset)

    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    return (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-[#1C1C1E] border border-[#39393D]"></div>

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30 - 90
          const radian = (angle * Math.PI) / 180
          const markerRadius = 8

          const x = 10 + markerRadius * Math.cos(radian)
          const y = 10 + markerRadius * Math.sin(radian)

          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `calc(50% + ${x}px - 0.5px)`,
                top: `calc(50% + ${y}px - 0.5px)`,
              }}
            ></div>
          )
        })}

        {/* Hour hand */}
        <div
          className="absolute w-0.5 bg-white rounded-full origin-bottom"
          style={{
            height: "25%",
            left: "calc(50% - 0.5px)",
            bottom: "50%",
            transformOrigin: "bottom",
            transform: `rotate(${hours * 30 + minutes * 0.5}deg)`,
          }}
        ></div>

        {/* Minute hand */}
        <div
          className="absolute w-0.5 bg-white rounded-full origin-bottom"
          style={{
            height: "35%",
            left: "calc(50% - 0.5px)",
            bottom: "50%",
            transformOrigin: "bottom",
            transform: `rotate(${minutes * 6}deg)`,
          }}
        ></div>

        {/* Second hand */}
        <div
          className="absolute w-[1px] bg-red-500 rounded-full origin-bottom"
          style={{
            height: "40%",
            left: "calc(50% - 0.5px)",
            bottom: "50%",
            transformOrigin: "bottom",
            transform: `rotate(${seconds * 6}deg)`,
          }}
        ></div>

        {/* Center dot */}
        <div
          className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
          style={{ left: "calc(50% - 3px)", top: "calc(50% - 3px)" }}
        ></div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-black text-white flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Clock</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "worldclock" && (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">World Clock</h2>

            {/* Main Analog Clock */}
            <div className="flex flex-col items-center mb-8">
              <canvas ref={analogClockRef} className="mb-4" width={300} height={300}></canvas>
              <div className="text-2xl font-light">{formatTime(currentTime)}</div>
              <div className="text-gray-400">Local Time</div>
            </div>

            <div className="space-y-4">
              {worldClocks.map((clock, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <div className="flex items-center">
                    {renderAnalogClockForTimezone(clock.offset)}
                    <div className="ml-4">
                      <div className="text-lg">{clock.city}</div>
                      <div className="text-gray-400">{clock.timezone}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-light">
                    {clock.city === "Local" ? formatTime(currentTime) : formatTime(getTimeForOffset(clock.offset))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stopwatch" && (
          <div className="p-4 flex flex-col items-center">
            <div className="text-6xl font-thin my-12">{formatStopwatchTime(stopwatchTime)}</div>

            <div className="flex space-x-4 mb-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={isStopwatchRunning ? stopStopwatch : startStopwatch}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isStopwatchRunning ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {isStopwatchRunning ? "Stop" : "Start"}
              </motion.button>

              {isStopwatchRunning ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addLap}
                  className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center"
                >
                  Lap
                </motion.button>
              ) : stopwatchTime > 0 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resetStopwatch}
                  className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center"
                >
                  Reset
                </motion.button>
              ) : (
                <div className="w-16 h-16"></div>
              )}
            </div>

            {laps.length > 0 && (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2">Laps</h3>
                <div className="space-y-2">
                  {laps.map((lap, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-800 pb-2">
                      <div>Lap {laps.length - index}</div>
                      <div>{formatStopwatchTime(lap)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "alarm" && (
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <AlarmClock size={64} className="text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">No alarms set</p>
          </div>
        )}

        {activeTab === "timer" && (
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <Timer size={64} className="text-gray-500 mb-4" />
            <p className="text-gray-400 text-center">Timer functionality not implemented</p>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("worldclock")}
            className={`flex flex-col items-center p-2 ${activeTab === "worldclock" ? "text-white" : "text-gray-500"}`}
          >
            <Clock size={24} />
            <span className="text-xs mt-1">World Clock</span>
          </button>

          <button
            onClick={() => setActiveTab("alarm")}
            className={`flex flex-col items-center p-2 ${activeTab === "alarm" ? "text-white" : "text-gray-500"}`}
          >
            <AlarmClock size={24} />
            <span className="text-xs mt-1">Alarm</span>
          </button>

          <button
            onClick={() => setActiveTab("stopwatch")}
            className={`flex flex-col items-center p-2 ${activeTab === "stopwatch" ? "text-white" : "text-gray-500"}`}
          >
            <StopwatchIcon size={24} />
            <span className="text-xs mt-1">Stopwatch</span>
          </button>

          <button
            onClick={() => setActiveTab("timer")}
            className={`flex flex-col items-center p-2 ${activeTab === "timer" ? "text-white" : "text-gray-500"}`}
          >
            <Timer size={24} />
            <span className="text-xs mt-1">Timer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

