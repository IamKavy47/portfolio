"use client"

import { useState } from "react"
import { ChevronLeft, Search, Plus, Phone, Mail, MessageSquare } from "lucide-react"

interface IOSContactsProps {
  onClose: () => void
}

const contacts = [
  { id: 1, name: "John Doe", phone: "+1 (123) 456-7890", email: "john@example.com" },
  { id: 2, name: "Jane Smith", phone: "+1 (234) 567-8901", email: "jane@example.com" },
  { id: 3, name: "Mike Johnson", phone: "+1 (345) 678-9012", email: "mike@example.com" },
]

export default function IOSContacts({ onClose }: IOSContactsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="h-full flex flex-col bg-[#F2F2F7]">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Contacts</h1>
        <button className="text-[#007AFF]">
          <Plus size={24} />
        </button>
      </header>
      <div className="flex-1 overflow-auto">
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
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="px-4 py-3 bg-white border-b border-gray-200">
            <h3 className="font-semibold mb-1">{contact.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Phone size={14} className="mr-2" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Mail size={14} className="mr-2" />
              <span>{contact.email}</span>
            </div>
            <div className="flex mt-3 space-x-2">
              <button className="flex-1 bg-[#007AFF] text-white rounded-full py-2 flex items-center justify-center">
                <Phone size={16} className="mr-2" />
                Call
              </button>
              <button className="flex-1 bg-[#007AFF] text-white rounded-full py-2 flex items-center justify-center">
                <MessageSquare size={16} className="mr-2" />
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

