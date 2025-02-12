"use client"

import { useState } from "react"
import { ChevronLeft, Search, Edit, Inbox, Send, Archive, Trash } from "lucide-react"

interface IOSMailProps {
  onClose: () => void
}

const emails = [
  {
    id: 1,
    sender: "John Doe",
    subject: "Meeting Tomorrow",
    preview: "Hi, just a reminder about our...",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "Jane Smith",
    subject: "Project Update",
    preview: "I've finished the first draft of...",
    time: "Yesterday",
  },
  { id: 3, sender: "Mike Johnson", subject: "Vacation Plans", preview: "Hey, I was thinking we could...", time: "Mon" },
]

export default function IOSMail({ onClose }: IOSMailProps) {
  const [activeTab, setActiveTab] = useState<"inbox" | "sent" | "archive" | "trash">("inbox")

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Mail</h1>
        <button className="text-[#007AFF]">
          <Edit size={24} />
        </button>
      </header>
      <div className="px-4 py-2">
        <div className="relative">
          <input type="text" placeholder="Search" className="w-full bg-[#E5E5EA] rounded-lg px-4 py-2 pl-10" />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {emails.map((email) => (
          <div key={email.id} className="px-4 py-3 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <span className="font-semibold">{email.sender}</span>
              <span className="text-sm text-gray-500">{email.time}</span>
            </div>
            <div className="font-medium">{email.subject}</div>
            <div className="text-sm text-gray-500 truncate">{email.preview}</div>
          </div>
        ))}
      </div>
      <footer className="bg-[#F2F2F7] border-t border-gray-200 px-4 py-2 flex justify-around">
        <button
          className={`text-${activeTab === "inbox" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("inbox")}
        >
          <Inbox size={24} />
          <span className="text-xs mt-1">Inbox</span>
        </button>
        <button
          className={`text-${activeTab === "sent" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("sent")}
        >
          <Send size={24} />
          <span className="text-xs mt-1">Sent</span>
        </button>
        <button
          className={`text-${activeTab === "archive" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("archive")}
        >
          <Archive size={24} />
          <span className="text-xs mt-1">Archive</span>
        </button>
        <button
          className={`text-${activeTab === "trash" ? "[#007AFF]" : "gray-500"} flex flex-col items-center`}
          onClick={() => setActiveTab("trash")}
        >
          <Trash size={24} />
          <span className="text-xs mt-1">Trash</span>
        </button>
      </footer>
    </div>
  )
}

