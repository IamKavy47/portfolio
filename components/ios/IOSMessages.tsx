"use client"

import { useState } from "react"
import { ChevronLeft, Search, Edit, Send } from "lucide-react"

interface IOSMessagesProps {
  onClose: () => void
}

const conversations = [
  { id: 1, name: "John Doe", lastMessage: "Hey, how's it going?", time: "10:30 AM" },
  { id: 2, name: "Jane Smith", lastMessage: "Don't forget about our meeting tomorrow!", time: "Yesterday" },
  { id: 3, name: "Mike Johnson", lastMessage: "Thanks for the help!", time: "Tue" },
]

export default function IOSMessages({ onClose }: IOSMessagesProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Messages</h1>
        <button className="text-[#007AFF]">
          <Edit size={24} />
        </button>
      </header>
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#E5E5EA] rounded-lg px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {filteredConversations.map((conv) => (
          <div key={conv.id} className="px-4 py-3 border-b border-gray-200 flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold">{conv.name}</h3>
                <span className="text-sm text-gray-500">{conv.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      <footer className="bg-[#F2F2F7] border-t border-gray-200 p-4">
        <button className="w-full bg-[#007AFF] text-white rounded-full py-2 flex items-center justify-center">
          <Send size={18} className="mr-2" />
          New Message
        </button>
      </footer>
    </div>
  )
}

