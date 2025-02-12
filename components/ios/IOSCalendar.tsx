"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface IOSCalendarProps {
  onClose: () => void
}

export default function IOSCalendar({ onClose }: IOSCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="ios-header">
        <button onClick={onClose} className="ios-back-button">
          <ChevronLeft size={24} />
          <span className="ml-1">Back</span>
        </button>
        <h1 className="text-xl font-semibold">Calendar</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="ios-icon-button">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <button onClick={nextMonth} className="ios-icon-button">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayNames.map((day) => (
            <div key={day} className="text-[var(--ios-gray)] text-xs font-medium py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => (
            <div
              key={index + 1}
              className={`aspect-square flex items-center justify-center text-sm ${
                index + 1 === currentDate.getDate()
                  ? "bg-[var(--ios-blue)] text-white rounded-full"
                  : "text-[var(--ios-gray6)]"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

