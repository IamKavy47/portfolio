"use client"

import { useState } from "react"
import { ChevronLeft, Plus, Search } from "lucide-react"

interface IOSNotesProps {
  onClose: () => void
}

export default function IOSNotes({ onClose }: IOSNotesProps) {
  const [notes, setNotes] = useState([
    { id: 1, title: "Shopping List", content: "Milk, Bread, Eggs" },
    { id: 2, title: "Meeting Notes", content: "Discuss project timeline" },
    { id: 3, title: "Ideas", content: "New app concept: AI-powered to-do list" },
  ])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="bg-[#F2F2F7] px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onClose} className="text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Notes</h1>
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
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-yellow-100 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">{note.title}</h3>
            <p className="text-sm text-gray-600">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

