"use client"

import { useState } from "react"
import { ChevronLeft, Search, Grid, Compass, Star } from "lucide-react"

interface IOSAppStoreProps {
  onClose: () => void
}

export default function IOSAppStore({ onClose }: IOSAppStoreProps) {
  const [activeTab, setActiveTab] = useState<"today" | "games" | "apps" | "search">("today")
  const [searchQuery, setSearchQuery] = useState("")

  const featuredApps = [
    { name: "Fitness App", description: "Track your workouts", icon: "🏋️" },
    { name: "Meditation App", description: "Find your inner peace", icon: "🧘" },
    { name: "Recipe App", description: "Discover new dishes", icon: "🍳" },
  ]

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">App Store</h1>
        <div className="w-6"> </div>
      </header>
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "search" && (
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search for apps"
              className="w-full bg-[#E5E5EA] rounded-lg px-4 py-2 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        )}
        {activeTab === "today" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Today's Featured Apps</h2>
            {featuredApps.map((app, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-2xl mr-3">
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <p className="text-sm text-gray-500">{app.description}</p>
                  </div>
                </div>
                <button className="bg-[#007AFF] text-white rounded-full px-4 py-2 w-full">Get</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="bg-[#F2F2F7] border-t border-gray-200 px-4 py-2 flex justify-around">
        <button
          className={`text-${activeTab === "today" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("today")}
        >
          <Star size={24} />
          <span className="text-xs mt-1">Today</span>
        </button>
        <button
          className={`text-${activeTab === "games" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("games")}
        >
          <Grid size={24} />
          <span className="text-xs mt-1">Games</span>
        </button>
        <button
          className={`text-${activeTab === "apps" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("apps")}
        >
          <Compass size={24} />
          <span className="text-xs mt-1">Apps</span>
        </button>
        <button
          className={`text-${activeTab === "search" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("search")}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </button>
      </footer>
    </div>
  )
}

