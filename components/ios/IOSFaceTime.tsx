"use client"

import { useState } from "react"
import { ChevronLeft, Video, Phone, Search, Plus } from "lucide-react"

interface IOSFaceTimeProps {
  onClose: () => void
}

const contacts = [
  { name: "John Doe", avatar: "JD" },
  { name: "Jane Smith", avatar: "JS" },
  { name: "Mike Johnson", avatar: "MJ" },
  { name: "Emily Brown", avatar: "EB" },
]

export default function IOSFaceTime({ onClose }: IOSFaceTimeProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-full flex flex-col bg-[#F2F2F7]">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">FaceTime</h1>
        <button className="text-[#007AFF]">
          <Plus size={24} />
        </button>
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#E5E5EA] rounded-lg px-4 py-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {filteredContacts.map((contact, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center text-white font-semibold mr-3">
                {contact.avatar}
              </div>
              <span className="text-black">{contact.name}</span>
            </div>
            <div className="flex space-x-2">
              <button className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center">
                <Video size={16} className="text-white" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center">
                <Phone size={16} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

