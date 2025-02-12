"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Phone,
  Star,
  Clock,
  ContactIcon as Contacts,
  KeyboardIcon as Keypad,
  Voicemail,
} from "lucide-react"

interface IOSPhoneProps {
  onClose: () => void
}

export default function IOSPhone({ onClose }: IOSPhoneProps) {
  const [activeTab, setActiveTab] = useState<"favorites" | "recents" | "contacts" | "keypad" | "voicemail">("favorites")
  const [dialPad, setDialPad] = useState("")

  const handleKeypadPress = (key: string) => {
    setDialPad((prev) => prev + key)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "favorites":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Favorites</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Mobile</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">Home</p>
                </div>
              </div>
            </div>
          </div>
        )
      case "recents":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recents</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">Mike Johnson</p>
                    <p className="text-sm text-gray-500">Mobile • 5m ago</p>
                  </div>
                </div>
                <Phone className="text-[#007AFF]" size={20} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">Sarah Lee</p>
                    <p className="text-sm text-gray-500">Work • 2h ago</p>
                  </div>
                </div>
                <Phone className="text-[#007AFF]" size={20} />
              </div>
            </div>
          </div>
        )
      case "contacts":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Contacts</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">Alice Brown</p>
                  <p className="text-sm text-gray-500">Mobile</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">Bob Green</p>
                  <p className="text-sm text-gray-500">Work</p>
                </div>
              </div>
            </div>
          </div>
        )
      case "keypad":
        return (
          <div className="p-4">
            <div className="text-center mb-6">
              <p className="text-4xl font-light">{dialPad || "Enter a number"}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
                <button
                  key={key}
                  className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium"
                  onClick={() => handleKeypadPress(key.toString())}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button className="w-16 h-16 rounded-full bg-[#4CD964] flex items-center justify-center">
                <Phone className="text-white" size={24} />
              </button>
            </div>
          </div>
        )
      case "voicemail":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Voicemail</h2>
            <p className="text-center text-gray-500">No voicemails</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Phone</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 overflow-auto">{renderContent()}</div>
      <footer className="bg-[#F2F2F7] border-t border-gray-200 px-4 py-2 flex justify-around">
        <button
          className={`text-${activeTab === "favorites" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("favorites")}
        >
          <Star size={24} />
          <span className="text-xs mt-1">Favorites</span>
        </button>
        <button
          className={`text-${activeTab === "recents" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("recents")}
        >
          <Clock size={24} />
          <span className="text-xs mt-1">Recents</span>
        </button>
        <button
          className={`text-${activeTab === "contacts" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("contacts")}
        >
          <Contacts size={24} />
          <span className="text-xs mt-1">Contacts</span>
        </button>
        <button
          className={`text-${activeTab === "keypad" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("keypad")}
        >
          <Keypad size={24} />
          <span className="text-xs mt-1">Keypad</span>
        </button>
        <button
          className={`text-${activeTab === "voicemail" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("voicemail")}
        >
          <Voicemail size={24} />
          <span className="text-xs mt-1">Voicemail</span>
        </button>
      </footer>
    </div>
  )
}

