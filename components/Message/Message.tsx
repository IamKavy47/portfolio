"use client"

import { useState, useRef, useEffect } from "react"
import Window from "./Window"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Paperclip, Image, Smile, Mic, Send } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: "user" | "contact"
  timestamp: Date
}

interface Conversation {
  id: number
  contactName: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unread: number
  messages: Message[]
  isOnline: boolean
}

interface MessagesAppProps {
  onClose: () => void
  onFocus: () => void
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    contactName: "Arjun Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Are we meeting tomorrow?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 2,
    isOnline: true,
    messages: [
      {
        id: 1,
        text: "Hey, how are you doing?",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: 2,
        text: "I'm good, thanks! How about you?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      },
      {
        id: 3,
        text: "Doing well. Just wanted to check about our project.",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      },
      {
        id: 4,
        text: "Yes, I've been working on it. Should be done by Friday.",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      },
      {
        id: 5,
        text: "Great! Are we meeting tomorrow?",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
    ],
  },
  {
    id: 2,
    contactName: "Priya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The presentation looks great!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    unread: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        text: "Hi, I just reviewed the presentation",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 70), // 70 minutes ago
      },
      {
        id: 2,
        text: "What do you think?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 65), // 65 minutes ago
      },
      {
        id: 3,
        text: "The presentation looks great!",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 60 minutes ago
      },
    ],
  },
  {
    id: 3,
    contactName: "Vikram Malhotra",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let's catch up soon",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unread: 0,
    isOnline: false,
    messages: [
      {
        id: 1,
        text: "It's been a while since we talked",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
      {
        id: 2,
        text: "Yes, it has been. How have you been?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
      },
      {
        id: 3,
        text: "Let's catch up soon",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      },
    ],
  },
  {
    id: 4,
    contactName: "Neha Gupta",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for your help!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 0,
    isOnline: false,
    messages: [
      {
        id: 1,
        text: "I was wondering if you could help me with something",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
      },
      {
        id: 2,
        text: "Sure, what do you need?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), // 24.5 hours ago
      },
      {
        id: 3,
        text: "Thanks for your help!",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
      },
    ],
  },
  {
    id: 5,
    contactName: "Raj Kapoor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The movie was amazing!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unread: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        text: "Did you watch that new movie?",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50), // 50 hours ago
      },
      {
        id: 2,
        text: "Yes, I did!",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49), // 49 hours ago
      },
      {
        id: 3,
        text: "The movie was amazing!",
        sender: "contact",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
      },
    ],
  },
]

export default function MessagesApp({ onClose, onFocus }: MessagesAppProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const filteredConversations = conversations.filter((conversation) =>
    conversation.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) {
      return days === 1 ? "Yesterday" : date.toLocaleDateString()
    }
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === selectedConversation.id) {
        const newMessageObj: Message = {
          id: conversation.messages.length + 1,
          text: newMessage,
          sender: "user",
          timestamp: new Date(),
        }
        
        return {
          ...conversation,
          lastMessage: newMessage,
          lastMessageTime: new Date(),
          messages: [...conversation.messages, newMessageObj],
        }
      }
      return conversation
    })

    setConversations(updatedConversations)
    setSelectedConversation(
      updatedConversations.find((c) => c.id === selectedConversation.id) || null
    )
    setNewMessage("")

    // Simulate a reply after a random delay
    setTimeout(() => {
      const replies = [
        "That sounds good!",
        "I'll get back to you on that.",
        "Thanks for letting me know.",
        "Great idea!",
        "Let me think about it.",
        "Perfect!",
        "I agree with you.",
        "Can we discuss this further?",
      ]
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)]
      
      setConversations((prevConversations) => 
        prevConversations.map((conversation) => {
          if (conversation.id === selectedConversation.id) {
            const replyMessage: Message = {
              id: conversation.messages.length + 2,
              text: randomReply,
              sender: "contact",
              timestamp: new Date(),
            }
            
            return {
              ...conversation,
              lastMessage: randomReply,
              lastMessageTime: new Date(),
              messages: [...conversation.messages, replyMessage],
            }
          }
          return conversation
        })
      )
      
      setSelectedConversation((prev) => {
        if (!prev) return null
        const updated = conversations.find((c) => c.id === prev.id)
        return updated || prev
      })
    }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
  }

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark as read when selecting
    setConversations(
      conversations.map((c) => 
        c.id === conversation.id ? { ...c, unread: 0 } : c
      )
    )
    setSelectedConversation(conversation)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation?.messages])

  return (
    <Window title="Messages" onClose={onClose} onFocus={onFocus} initialSize={{ width: 902, height: 600 }}>
      <div className="flex h-full bg-white">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-1.5 w-full bg-gray-100 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 flex items-start ${
                  selectedConversation?.id === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="relative mr-3">
                  <img
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.contactName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold truncate">{conversation.contactName}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
          <div className="p-3 border-t border-gray-200">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-gray-200 flex items-center">
                <div className="relative mr-3">
                  <img
                    src={selectedConversation.avatar || "/placeholder.svg"}
                    alt={selectedConversation.contactName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {selectedConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConversation.contactName}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.isOnline ? "Active Now" : "Offline"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-800 rounded-tl-none"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Plus className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Image className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="iMessage"
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Smile className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Mic className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 text-blue-500"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </Window>
  )
}
