"use client"

import {
  ChevronLeft,
  ChevronRight,
  Wifi,
  Bluetooth,
  Bell,
  Moon,
  Battery,
  Settings,
  Lock,
  Accessibility,
} from "lucide-react"

interface IOSSettingsProps {
  onClose: () => void
}

export default function IOSSettings({ onClose }: IOSSettingsProps) {
  const settingsItems = [
    { icon: Wifi, label: "Wi-Fi", color: "bg-blue-500" },
    { icon: Bluetooth, label: "Bluetooth", color: "bg-blue-500" },
    { icon: Bell, label: "Notifications", color: "bg-red-500" },
    { icon: Moon, label: "Focus", color: "bg-indigo-500" },
    { icon: Battery, label: "Battery", color: "bg-green-500" },
    { icon: Lock, label: "Privacy & Security", color: "bg-blue-500" },
    { icon: Settings, label: "General", color: "bg-gray-500" },
    { icon: Accessibility, label: "Accessibility", color: "bg-blue-500" },
  ]

  return (
    <div className="h-full flex flex-col bg-[#F2F2F7]">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-1 overflow-auto">
        {settingsItems.map((item, index) => (
          <div key={index} className="flex items-center px-4 py-3 bg-white border-b border-gray-200">
            <div className={`w-8 h-8 rounded-md ${item.color} flex items-center justify-center mr-3`}>
              <item.icon size={20} className="text-white" />
            </div>
            <span className="flex-grow">{item.label}</span>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  )
}

