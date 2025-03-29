"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  User,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Heart,
  Share,
  Edit,
  Plus,
  Search,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface IOSContactAppProps {
  onClose: () => void
}

interface Contact {
  id: string
  name: string
  role: string
  email: string
  phone: string
  website?: string
  address?: string
  avatar: string
  social?: {
    instagram?: string
    linkedin?: string
    twitter?: string
    github?: string
  }
  isFavorite: boolean
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Kavy Porwal",
    role: "Full Stack Developer",
    email: "kavyporwal75@gmail.com",
    phone: "+91 91672 62347",
    website: "https://iamkavy47.vercel.app",
    address: "Mandsaur, Madhya Pradesh, India",
    avatar: "/kavy.jpeg",
    social: {
      instagram: "iamkavy47",
      linkedin: "iamkavy47",
      twitter: "iamkavy47",
      github: "iamkavy47",
    },
    isFavorite: true,
  },
  {
    id: "2",
    name: "Rahul Sharma",
    role: "UI/UX Designer",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    website: "https://rahulsharma.design",
    address: "Koramangala, Bangalore, India",
    avatar: "/placeholder.svg?height=200&width=200&text=RS",
    social: {
      instagram: "rahuldesigns",
      linkedin: "rahulsharma-design",
    },
    isFavorite: false,
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "Product Manager",
    email: "priya.patel@example.com",
    phone: "+91 87654 32109",
    address: "Andheri, Mumbai, India",
    avatar: "/placeholder.svg?height=200&width=200&text=PP",
    social: {
      linkedin: "priyapatel-pm",
      twitter: "priyapatel",
    },
    isFavorite: false, // Changed from true to false
  },
  {
    id: "4",
    name: "Vikram Malhotra",
    role: "Backend Developer",
    email: "vikram.m@example.com",
    phone: "+91 76543 21098",
    website: "https://vikramdev.in",
    address: "Gurgaon, Haryana, India",
    avatar: "/placeholder.svg?height=200&width=200&text=VM",
    social: {
      github: "vikram-dev",
      linkedin: "vikrammalhotra",
    },
    isFavorite: false,
  },
  {
    id: "5",
    name: "Ananya Singh",
    role: "Data Scientist",
    email: "ananya.singh@example.com",
    phone: "+91 65432 10987",
    address: "Salt Lake, Kolkata, India",
    avatar: "/placeholder.svg?height=200&width=200&text=AS",
    social: {
      linkedin: "ananya-singh-data",
      github: "ananya-ds",
    },
    isFavorite: false, // Changed from true to false
  },
  {
    id: "6",
    name: "Chetanya Parmar",
    role: "Mobile App Developer",
    email: "chetanya.parmar@example.com",
    phone: "+91 89765 43210",
    website: "https://chetanyaparmar.dev",
    address: "Indore, Madhya Pradesh, India",
    avatar: "/placeholder.svg?height=200&width=200&text=CP",
    social: {
      github: "chetanya-dev",
      linkedin: "chetanyaparmar",
      twitter: "chetanyaparmar",
    },
    isFavorite: true,
  },
  {
    id: "7",
    name: "Mayur Singh Jadon",
    role: "DevOps Engineer",
    email: "mayur.jadon@example.com",
    phone: "+91 94567 12345",
    website: "https://mayurjadon.tech",
    address: "Jaipur, Rajasthan, India",
    avatar: "/placeholder.svg?height=200&width=200&text=MSJ",
    social: {
      github: "mayur-jadon",
      linkedin: "mayursinghjadon",
      twitter: "mayurjadon",
    },
    isFavorite: true,
  },
]

export default function IOSContactApp({ onClose }: IOSContactAppProps) {
  const [activeTab, setActiveTab] = useState<"contacts" | "favorites" | "recents">("contacts")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Handle scroll for header transparency effect
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollY(scrollRef.current.scrollTop)
    }
  }

  // Filter contacts based on search query and active tab
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "favorites") {
      return matchesSearch && contact.isFavorite
    }

    return matchesSearch
  })

  // Group contacts by first letter for the contacts list
  const groupedContacts = filteredContacts.reduce(
    (groups, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase()
      if (!groups[firstLetter]) {
        groups[firstLetter] = []
      }
      groups[firstLetter].push(contact)
      return groups
    },
    {} as Record<string, Contact[]>,
  )

  // Sort the keys alphabetically
  const sortedKeys = Object.keys(groupedContacts).sort()

  // Handle contact selection
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
  }

  // Handle back button
  const handleBack = () => {
    if (selectedContact) {
      setSelectedContact(null)
    } else {
      onClose()
    }
  }

  // Reset scroll position when changing tabs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
      setScrollY(0)
    }
  }, [activeTab])

  return (
    <div className="h-full flex flex-col bg-[#F2F2F7]">
      {/* iOS-style header with dynamic transparency */}
      <header
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between transition-colors duration-200"
        style={{
          backgroundColor: scrollY > 10 ? "rgba(242, 242, 247, 0.9)" : "rgba(242, 242, 247, 1)",
          backdropFilter: scrollY > 10 ? "blur(10px)" : "none",
          borderBottom: scrollY > 10 ? "0.5px solid rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <motion.button
              key="back-to-list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={handleBack}
              className="text-[#007AFF] font-medium flex items-center"
            >
              <ChevronLeft size={20} />
              <span>Contacts</span>
            </motion.button>
          ) : (
            <motion.button
              key="back-to-home"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={handleBack}
              className="text-[#007AFF] font-medium flex items-center"
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </motion.button>
          )}
        </AnimatePresence>

        <h1 className="text-[17px] font-semibold absolute left-1/2 transform -translate-x-1/2">
          {selectedContact ? "Contact" : "Contacts"}
        </h1>

        {!selectedContact && (
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearching(!isSearching)} className="text-[#007AFF]">
              {isSearching ? "Cancel" : <Plus size={20} />}
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <div ref={scrollRef} className="flex-1 overflow-auto ios-scroll" onScroll={handleScroll}>
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <ContactDetail contact={selectedContact} />
          ) : (
            <ContactsList
              groupedContacts={groupedContacts}
              sortedKeys={sortedKeys}
              onContactSelect={handleContactSelect}
              isSearching={isSearching}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom tab bar (only shown in contacts list view) */}
      {!selectedContact && (
        <div className="h-14 bg-white border-t border-gray-200 flex items-center justify-around px-2">
          <TabButton
            icon={<User size={20} />}
            label="Contacts"
            isActive={activeTab === "contacts"}
            onClick={() => setActiveTab("contacts")}
          />
          <TabButton
            icon={<Heart size={20} />}
            label="Favorites"
            isActive={activeTab === "favorites"}
            onClick={() => setActiveTab("favorites")}
          />
          <TabButton
            icon={<Phone size={20} />}
            label="Recents"
            isActive={activeTab === "recents"}
            onClick={() => setActiveTab("recents")}
          />
        </div>
      )}
    </div>
  )
}

// Contact Detail Component
function ContactDetail({ contact }: { contact: Contact }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pb-8"
    >
      {/* Contact header with avatar and name */}
      <div className="flex flex-col items-center pt-6 pb-8 bg-white">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={contact.avatar || "/placeholder.svg"}
              alt={contact.name}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-[#007AFF] text-white p-1 rounded-full">
            <Edit size={14} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center">{contact.name}</h2>
        <p className="text-gray-500 text-center">{contact.role}</p>

        <div className="flex mt-4 space-x-4">
          <ActionButton icon={<MessageCircle size={18} />} label="Message" color="#34C759" />
          <ActionButton icon={<Phone size={18} />} label="Call" color="#007AFF" />
          <ActionButton icon={<Mail size={18} />} label="Mail" color="#FF9500" />
        </div>
      </div>

      {/* Contact information sections */}
      <div className="mt-2 space-y-2">
        {/* Phone section */}
        <section className="bg-white rounded-lg overflow-hidden">
          <a href={`tel:${contact.phone}`} className="flex items-center px-4 py-3 active:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center mr-3">
              <Phone size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[15px]">{contact.phone}</p>
              <p className="text-[13px] text-gray-500">mobile</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle size={16} className="text-[#007AFF]" />
            </div>
          </a>
        </section>

        {/* Email section */}
        <section className="bg-white rounded-lg overflow-hidden">
          <a href={`mailto:${contact.email}`} className="flex items-center px-4 py-3 active:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#FF9500] flex items-center justify-center mr-3">
              <Mail size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[15px]">{contact.email}</p>
              <p className="text-[13px] text-gray-500">work</p>
            </div>
          </a>
        </section>

        {/* Website section (if available) */}
        {contact.website && (
          <section className="bg-white rounded-lg overflow-hidden">
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 active:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-[#5856D6] flex items-center justify-center mr-3">
                <Globe size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[15px]">{contact.website}</p>
                <p className="text-[13px] text-gray-500">website</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Share size={16} className="text-[#007AFF]" />
              </div>
            </a>
          </section>
        )}

        {/* Address section (if available) */}
        {contact.address && (
          <section className="bg-white rounded-lg overflow-hidden">
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-[#FF2D55] flex items-center justify-center mr-3">
                <MapPin size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[15px]">{contact.address}</p>
                <p className="text-[13px] text-gray-500">work</p>
              </div>
            </div>
          </section>
        )}

        {/* Social media section (if available) */}
        {contact.social && Object.keys(contact.social).length > 0 && (
          <section className="bg-white rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-[13px] text-gray-500 uppercase">Social Profiles</p>
            </div>

            {contact.social.instagram && (
              <a
                href={`https://instagram.com/${contact.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center mr-3">
                  <Instagram size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px]">@{contact.social.instagram}</p>
                  <p className="text-[13px] text-gray-500">Instagram</p>
                </div>
                <ChevronLeft size={16} className="text-gray-400 rotate-180" />
              </a>
            )}

            {contact.social.linkedin && (
              <a
                href={`https://linkedin.com/in/${contact.social.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center mr-3">
                  <Linkedin size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px]">{contact.social.linkedin}</p>
                  <p className="text-[13px] text-gray-500">LinkedIn</p>
                </div>
                <ChevronLeft size={16} className="text-gray-400 rotate-180" />
              </a>
            )}

            {contact.social.twitter && (
              <a
                href={`https://twitter.com/${contact.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center mr-3">
                  <Twitter size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px]">@{contact.social.twitter}</p>
                  <p className="text-[13px] text-gray-500">Twitter</p>
                </div>
                <ChevronLeft size={16} className="text-gray-400 rotate-180" />
              </a>
            )}

            {contact.social.github && (
              <a
                href={`https://github.com/${contact.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-3 active:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center mr-3">
                  <Github size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px]">{contact.social.github}</p>
                  <p className="text-[13px] text-gray-500">GitHub</p>
                </div>
                <ChevronLeft size={16} className="text-gray-400 rotate-180" />
              </a>
            )}
          </section>
        )}

        {/* Action buttons */}
        <section className="bg-white rounded-lg overflow-hidden mt-6">
          <button className="w-full text-center py-3 text-[#FF3B30] font-medium active:bg-gray-100">
            Share Contact
          </button>
        </section>

        <section className="bg-white rounded-lg overflow-hidden mt-2">
          <button className="w-full text-center py-3 text-[#FF3B30] font-medium active:bg-gray-100">
            Add to Favorites
          </button>
        </section>
      </div>
    </motion.div>
  )
}

// Contacts List Component
function ContactsList({
  groupedContacts,
  sortedKeys,
  onContactSelect,
  isSearching,
  searchQuery,
  setSearchQuery,
  activeTab,
}: {
  groupedContacts: Record<string, Contact[]>
  sortedKeys: string[]
  onContactSelect: (contact: Contact) => void
  isSearching: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pb-8"
    >
      {/* Search bar */}
      <div className="px-4 py-2 sticky top-0 z-10 bg-[#F2F2F7]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#E5E5EA] text-black rounded-lg py-2 pl-10 pr-4 text-[16px] focus:outline-none"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setSearchQuery("")}
            >
              <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">×</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Empty state for no results */}
      {sortedKeys.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
          <User size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">No contacts found</p>
          {searchQuery && <p className="text-gray-400 text-sm text-center mt-2">Try a different search term</p>}
        </div>
      )}

      {/* Contacts list */}
      <div className="px-4">
        {sortedKeys.map((letter) => (
          <div key={letter} className="mb-4">
            <div className="sticky top-14 bg-[#F2F2F7] py-1 z-10">
              <h2 className="text-[17px] font-semibold text-gray-500">{letter}</h2>
            </div>
            <ul className="bg-white rounded-lg overflow-hidden shadow-sm">
              {groupedContacts[letter].map((contact, index) => (
                <li
                  key={contact.id}
                  className={`
                    border-b border-gray-100 last:border-b-0
                    ${index === 0 ? "rounded-t-lg" : ""}
                    ${index === groupedContacts[letter].length - 1 ? "rounded-b-lg" : ""}
                  `}
                >
                  <button
                    onClick={() => onContactSelect(contact)}
                    className="w-full flex items-center px-4 py-3 active:bg-gray-100 text-left"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[17px]">{contact.name}</p>
                      <p className="text-[14px] text-gray-500">{contact.role}</p>
                    </div>
                    {contact.isFavorite && activeTab !== "favorites" && (
                      <Heart size={16} className="text-[#FF3B30] mr-2" fill="#FF3B30" />
                    )}
                    <ChevronLeft size={16} className="text-gray-400 rotate-180" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// Tab Button Component
function TabButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full">
      <div className={`${isActive ? "text-[#007AFF]" : "text-gray-500"}`}>{icon}</div>
      <span className={`text-[10px] mt-1 ${isActive ? "text-[#007AFF] font-medium" : "text-gray-500"}`}>{label}</span>
    </button>
  )
}

// Action Button Component
function ActionButton({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <button className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: color }}>
        {icon && <div className="text-white">{icon}</div>}
      </div>
      <span className="text-[12px] text-[#007AFF]">{label}</span>
    </button>
  )
}
