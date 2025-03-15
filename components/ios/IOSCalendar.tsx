"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface IOSCalendarProps {
  onClose: () => void
}

export default function IOSCalendar({ onClose }: IOSCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const today = new Date()
  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth.getMonth() &&
    today.getFullYear() === currentMonth.getFullYear()

  const events = [
    { day: 20, title: "Jamming", time: "6:00 PM", color: "bg-blue-500" },
    { day: 21, title: "Hackathon starts", time: "9:30 AM", color: "bg-green-500" },
    { day: 21, title: "Cultural Night", time: "6:30 PM", color: "bg-red-500" },
    { day: 21, title: "Celebrity Night", time: "7:00 PM", color: "bg-yellow-500" },
    // { day: today.getDate(), title: "Lunch with Sarah", time: "12:30 PM", color: "bg-red-500" },
  ]

  const getEventsForDay = (day: number) => {
    return events.filter((event) => event.day === day)
  }

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={onClose} className="text-blue-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Calendar</h1>
        <button className="text-blue-500">
          <Plus size={24} />
        </button>
      </div>

      <div className="bg-white p-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{monthName}</h2>
          <p className="text-gray-500">{year}</p>
        </div>
        <div className="flex space-x-4">
          <button onClick={prevMonth} className="text-blue-500">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextMonth} className="text-blue-500">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 bg-white p-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-gray-500 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 bg-white p-4">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="h-14"></div>
          ))}

          {days.map((day) => (
            <motion.div
              key={day}
              whileTap={{ scale: 0.95 }}
              className={`h-14 p-1 relative ${isToday(day) ? "bg-blue-50 rounded-lg" : ""}`}
            >
              <div
                className={`
                w-8 h-8 flex items-center justify-center rounded-full
                ${isToday(day) ? "bg-blue-500 text-white" : ""}
              `}
              >
                {day}
              </div>
              {getEventsForDay(day).map((event, index) => (
                <div key={index} className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${event.color}`}></div>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Today's Events</h3>
          {getEventsForDay(today.getDate()).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDay(today.getDate()).map((event, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                  <div className={`w-3 h-12 ${event.color} rounded-full mr-3`}></div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg text-center text-gray-500">No events scheduled for today</div>
          )}
        </div>
      </div>
    </div>
  )
}

