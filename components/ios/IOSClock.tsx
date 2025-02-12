"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Clock, Bell, ClockIcon as StopwatchIcon, Timer } from "lucide-react"

interface IOSClockProps {
  onClose: () => void
}

export default function IOSClock({ onClose }: IOSClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"worldclock" | "alarm" | "stopwatch" | "timer">("worldclock")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-full flex flex-col bg-black text-white">
      <header className="px-4 py-2 flex items-center justify-between">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Clock</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "worldclock" && (
          <div className="text-center">
            <h2 className="text-6xl font-light mb-2">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </h2>
            <p className="text-xl text-gray-400">
              {currentTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        )}
        {/* Placeholder content for other tabs */}
        {activeTab === "alarm" && <div className="text-center text-2xl">Alarm Content</div>}
        {activeTab === "stopwatch" && <div className="text-center text-2xl">Stopwatch Content</div>}
        {activeTab === "timer" && <div className="text-center text-2xl">Timer Content</div>}
      </div>
      <footer className="bg-[#1C1C1E] px-4 py-2 flex justify-around">
        <button
          className={`text-${activeTab === "worldclock" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("worldclock")}
        >
          <Clock size={24} />
          <span className="text-xs mt-1">World Clock</span>
        </button>
        <button
          className={`text-${activeTab === "alarm" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("alarm")}
        >
          <Bell size={24} />
          <span className="text-xs mt-1">Alarm</span>
        </button>
        <button
          className={`text-${activeTab === "stopwatch" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("stopwatch")}
        >
          <StopwatchIcon size={24} />
          <span className="text-xs mt-1">Stopwatch</span>
        </button>
        <button
          className={`text-${activeTab === "timer" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("timer")}
        >
          <Timer size={24} />
          <span className="text-xs mt-1">Timer</span>
        </button>
      </footer>
    </div>
  )
}

