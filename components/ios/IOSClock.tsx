"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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

  const worldClocks = [
    { city: "Local", timezone: "Local", offset: 0 },
    { city: "London", timezone: "GMT", offset: 0 },
    { city: "New York", timezone: "EDT", offset: -4 },
    { city: "Tokyo", timezone: "JST", offset: 9 },
    { city: "Sydney", timezone: "AEST", offset: 10 },
  ]

  const getTimeForOffset = (offset: number) => {
    const localTime = new Date()
    const utc = localTime.getTime() + localTime.getTimezoneOffset() * 60000
    return new Date(utc + 3600000 * offset)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
            <div className="space-y-4">
              {worldClocks.map((clock, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <div>
                    <div className="text-lg">{clock.city}</div>
                    <div className="text-gray-400">{clock.timezone}</div>
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

