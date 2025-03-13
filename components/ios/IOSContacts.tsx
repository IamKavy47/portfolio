"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Search, User, Phone, MessageSquare, Video } from "lucide-react"
import { motion } from "framer-motion"

interface IOSContactsProps {
  onClose: () => void
}

interface Contact {
  id: number
  name: string
  phone: string
  email: string
  isFavorite: boolean
}

export default function IOSContacts({ onClose }: IOSContactsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const contacts: Contact[] = [
    { id: 1, name: "Alice Johnson", phone: "(555) 123-4567", email: "alice@example.com", isFavorite: true },
    { id: 2, name: "Bob Smith", phone: "(555) 234-5678", email: "bob@example.com", isFavorite: false },
    { id: 3, name: "Charlie Brown", phone: "(555) 345-6789", email: "charlie@example.com", isFavorite: true },
    { id: 4, name: "David Miller", phone: "(555) 456-7890", email: "david@example.com", isFavorite: false },
    { id: 5, name: "Emma Wilson", phone: "(555) 567-8901", email: "emma@example.com", isFavorite: false },
    { id: 6, name: "Frank Thomas", phone: "(555) 678-9012", email: "frank@example.com", isFavorite: true },
    { id: 7, name: "Grace Lee", phone: "(555) 789-0123", email: "grace@example.com", isFavorite: false },
    { id: 8, name: "Henry Davis", phone: "(555) 890-1234", email: "henry@example.com", isFavorite: false },
  ]

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const groupedContacts = filteredContacts.reduce(
    (acc, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase()
      if (!acc[firstLetter]) {
        acc[firstLetter] = []
      }
      acc[firstLetter].push(contact)
      return acc
    },
    {} as Record<string, Contact[]>,
  )

  const sortedLetters = Object.keys(groupedContacts).sort()

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
  }

  const handleBackToList = () => {
    setSelectedContact(null)
  }

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      <div className="bg-white p-4 flex items-center justify-between border-b border-gray-200">
        <button onClick={onClose} className="text-blue-500">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Contacts</h1>
        <button className="text-blue-500">
          <Plus size={24} />
        </button>
      </div>

      {selectedContact ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 bg-white">
            <button onClick={handleBackToList} className="text-blue-500 mb-4">
              Back to Contacts
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <User size={40} className="text-gray-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">{selectedContact.name}</h2>

            <div className="flex justify-around mb-8">
              <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <span className="text-xs">Message</span>
              </motion.button>

              <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <Phone size={20} className="text-white" />
                </div>
                <span className="text-xs">Call</span>
              </motion.button>

              <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-1">
                  <Video size={20} className="text-white" />
                </div>
                <span className="text-xs">Video</span>
              </motion.button>
            </div>

            <div className="bg-white rounded-xl shadow-sm mb-4">
              <div className="p-4 border-b border-gray-200">
                <div className="text-sm text-gray-500">Phone</div>
                <div className="text-blue-500">{selectedContact.phone}</div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-blue-500">{selectedContact.email}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-200 rounded-lg py-2 px-10 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sortedLetters.map((letter) => (
              <div key={letter}>
                <div className="sticky top-0 bg-gray-100 px-4 py-1 text-xs font-bold text-gray-500">{letter}</div>
                <div className="bg-white">
                  {groupedContacts[letter].map((contact) => (
                    <motion.button
                      key={contact.id}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center p-4 border-b border-gray-200"
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{contact.name}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

