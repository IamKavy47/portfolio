"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface LaunchpadProps {
  isOpen: boolean
  onClose: () => void
}

export default function Launchpad({ isOpen, onClose }: LaunchpadProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAppIndex, setSelectedAppIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sample app data - you would replace this with your actual apps
  const apps = [
    { id: 1, name: "Safari", icon: "/placeholder.svg?height=60&width=60" },
    { id: 2, name: "Mail", icon: "/placeholder.svg?height=60&width=60" },
    { id: 3, name: "Calendar", icon: "/placeholder.svg?height=60&width=60" },
    { id: 4, name: "Photos", icon: "/placeholder.svg?height=60&width=60" },
    { id: 5, name: "Messages", icon: "/placeholder.svg?height=60&width=60" },
    { id: 6, name: "Maps", icon: "/placeholder.svg?height=60&width=60" },
    { id: 7, name: "Notes", icon: "/placeholder.svg?height=60&width=60" },
    { id: 8, name: "Reminders", icon: "/placeholder.svg?height=60&width=60" },
    { id: 9, name: "App Store", icon: "/placeholder.svg?height=60&width=60" },
    { id: 10, name: "Music", icon: "/placeholder.svg?height=60&width=60" },
    { id: 11, name: "Podcasts", icon: "/placeholder.svg?height=60&width=60" },
    { id: 12, name: "TV", icon: "/placeholder.svg?height=60&width=60" },
    { id: 13, name: "Books", icon: "/placeholder.svg?height=60&width=60" },
    { id: 14, name: "News", icon: "/placeholder.svg?height=60&width=60" },
    { id: 15, name: "Home", icon: "/placeholder.svg?height=60&width=60" },
    { id: 16, name: "Stocks", icon: "/placeholder.svg?height=60&width=60" },
    { id: 17, name: "Voice Memos", icon: "/placeholder.svg?height=60&width=60" },
    { id: 18, name: "Calculator", icon: "/placeholder.svg?height=60&width=60" },
    { id: 19, name: "Settings", icon: "/placeholder.svg?height=60&width=60" },
    { id: 20, name: "Terminal", icon: "/placeholder.svg?height=60&width=60" },
  ]

  // Filter apps based on search query
  const filteredApps = apps.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Auto-focus search input when component mounts or becomes visible
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      clearSearch()
    }
  }, [isOpen])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open Launchpad with F4
      if (e.key === "F4") {
        e.preventDefault()
        if (!isOpen) {
          // This would be handled by the parent component
          // but we can expose this functionality
          document.dispatchEvent(new CustomEvent("open-launchpad"))
        }
      }

      // Only process other keyboard events if Launchpad is open
      if (!isOpen) return

      // If user starts typing, focus the search input
      if (e.key.length === 1 && e.key.match(/[a-z0-9]/i) && !e.metaKey && !e.ctrlKey) {
        if (document.activeElement !== searchInputRef.current) {
          searchInputRef.current?.focus()
        }
      }

      // Handle keyboard navigation
      if (searchQuery && filteredApps.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedAppIndex((prev) => (prev < filteredApps.length - 1 ? prev + 1 : 0))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedAppIndex((prev) => (prev > 0 ? prev - 1 : filteredApps.length - 1))
        } else if (e.key === "Enter" && selectedAppIndex >= 0) {
          e.preventDefault()
          handleAppClick(filteredApps[selectedAppIndex])
        }
      }

      // Close Launchpad on Escape
      if (e.key === "Escape") {
        clearSearch()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchQuery, selectedAppIndex, filteredApps, isOpen, onClose])

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedAppIndex(-1)
  }

  const handleAppClick = (app: (typeof apps)[0]) => {
    console.log(`Opening app: ${app.name}`)
    // You would add your app opening logic here
    clearSearch()
    onClose()
  }

  // Handle click on blank space
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was directly on the container (not on its children)
    if (e.target === containerRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-start pt-10 bg-black/20 backdrop-blur-md z-50 animate-in fade-in duration-200"
      onClick={handleContainerClick}
    >
      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        {/* Search bar */}
        <div className="relative w-64 mb-8">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/70" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            className="pl-8 pr-8 bg-white/10 border-0 text-white rounded-full h-9 focus-visible:ring-white/30"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSelectedAppIndex(e.target.value ? 0 : -1)
            }}
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-2 top-2.5 text-white/70 hover:text-white">
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        {/* Apps grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-x-6 gap-y-8 w-full max-h-[calc(100vh-150px)] overflow-y-auto pb-8">
          {filteredApps.map((app, index) => (
            <div
              key={app.id}
              className={`flex flex-col items-center group cursor-pointer transition-transform duration-200 ${
                index === selectedAppIndex ? "scale-110" : ""
              }`}
              onClick={() => handleAppClick(app)}
              onMouseEnter={() => setSelectedAppIndex(index)}
            >
              <div className="relative mb-2 group-hover:scale-110 transition-transform duration-200">
                <div
                  className={`absolute inset-0 bg-white/10 rounded-2xl -z-10 ${
                    index === selectedAppIndex ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  } transition-opacity`}
                ></div>
                <img src={app.icon || "/placeholder.svg"} alt={app.name} className="w-16 h-16 rounded-2xl" />
              </div>
              <span className="text-white text-xs text-center">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

