"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, Plus, Mic, Send, Loader2, Camera, Video, ArrowLeft, ChevronRight } from "lucide-react"

interface Message {
  id: number
  text: string
  sender: "user" | "contact"
  timestamp: Date
  isLoading?: boolean
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
  context?: string // AI context for this conversation
}

interface IOSMessagesProps {
  onClose: () => void
}

// Empty conversations with just context information
const initialConversations: Conversation[] = [
  {
    id: 1,
    contactName: "Arjun Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Software Developer",
    lastMessageTime: new Date(),
    unread: 0,
    isOnline: true,
    context:
      "You are Arjun Sharma, a software developer who works with the user on a project. You're friendly and professional.",
    messages: [],
  },
  {
    id: 2,
    contactName: "Priya Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Marketing Specialist",
    lastMessageTime: new Date(),
    unread: 0,
    isOnline: true,
    context:
      "You are Priya Patel, a marketing specialist who works with the user. You're enthusiastic and detail-oriented.",
    messages: [],
  },
  {
    id: 3,
    contactName: "Vikram Malhotra",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Old Friend",
    lastMessageTime: new Date(),
    unread: 0,
    isOnline: false,
    context:
      "You are Vikram Malhotra, an old friend of the user. You're casual and friendly. You haven't spoken to the user in a while and want to catch up.",
    messages: [],
  },
  {
    id: 4,
    contactName: "Neha Gupta",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your Colleague",
    lastMessageTime: new Date(),
    unread: 0,
    isOnline: false,
    context:
      "You are Neha Gupta, a colleague who recently asked the user for help with something. You're grateful and professional.",
    messages: [],
  },
  {
    id: 5,
    contactName: "Raj Kapoor",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Movie Enthusiast Person",
    lastMessageTime: new Date(),
    unread: 0,
    isOnline: true,
    context:
      "You are Raj Kapoor, a movie enthusiast and friend of the user. You're passionate about films and love discussing them.",
    messages: [],
  },
]

// API key should be stored in environment variables in a real app
const API_KEY = "AIzaSyB9uxgaMi1lbceCTnUNQ5Uj-H7X6_r6zps" // Replace with your actual API key

export default function IOSMessages({ onClose }: IOSMessagesProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get the selected conversation from the state using the ID
  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null

  const filteredConversations = conversations.filter((conversation) =>
    conversation.contactName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) {
      return days === 1 ? "Yesterday" : date.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  const generateAIResponse = async (conversation: Conversation, userMessage: string) => {
    try {
      // Dynamically import the Google Generative AI SDK
      const { GoogleGenerativeAI } = await import("@google/generative-ai")

      // Initialize the API with your API key
      const genAI = new GoogleGenerativeAI(API_KEY)

      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

      // Create a conversation history for context
      const lastMessages = conversation.messages.slice(-5) // Get last 5 messages for context
      let conversationHistory = lastMessages
        .map((msg) => `${msg.sender === "user" ? "User" : conversation.contactName}: ${msg.text}`)
        .join("\n")

      // Add the new user message
      conversationHistory += `\nUser: ${userMessage}`

      // Create the prompt with context and conversation history
      const prompt = `${conversation.context || ""}
      
The following is a conversation between the user and ${conversation.contactName}.
${conversationHistory}

${conversation.contactName}:`

      // Generate content based on the prompt
      const result = await model.generateContent(prompt)
      const response = result.response.text()

      // Return a cleaned response (remove any name prefixes if the AI included them)
      return response.replace(/^(.*?):\s*/g, "")
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "Sorry, I couldn't respond right now. Let's talk later."
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    // Create a copy of the current conversations array
    const currentConversations = [...conversations]

    // Find the index of the selected conversation
    const conversationIndex = currentConversations.findIndex((c) => c.id === selectedConversationId)
    if (conversationIndex === -1) return

    // Get the next message ID
    const nextMessageId =
      selectedConversation.messages.length > 0 ? Math.max(...selectedConversation.messages.map((m) => m.id)) + 1 : 1

    // Create the user message object
    const userMessageObj: Message = {
      id: nextMessageId,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    // Create a loading message object
    const loadingMessageObj: Message = {
      id: nextMessageId + 1,
      text: "...",
      sender: "contact",
      timestamp: new Date(),
      isLoading: true,
    }

    // Update the selected conversation with the user message and loading message
    const updatedConversation = {
      ...selectedConversation,
      lastMessage: newMessage,
      lastMessageTime: new Date(),
      messages: [...selectedConversation.messages, userMessageObj, loadingMessageObj],
    }

    // Update the conversations array
    currentConversations[conversationIndex] = updatedConversation

    // Update state
    setConversations(currentConversations)
    setNewMessage("")
    setIsGenerating(true)

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(updatedConversation, newMessage)

      // Get the latest state of conversations
      setConversations((prevConversations) => {
        // Find the index again using the latest state
        const idx = prevConversations.findIndex((c) => c.id === selectedConversationId)
        if (idx === -1) return prevConversations

        // Get the current conversation
        const currentConv = prevConversations[idx]

        // Filter out loading messages
        const messagesWithoutLoading = currentConv.messages.filter((msg) => !msg.isLoading)

        // Create the AI message
        const aiMessageObj: Message = {
          id: messagesWithoutLoading.length > 0 ? Math.max(...messagesWithoutLoading.map((m) => m.id)) + 1 : 1,
          text: aiResponse,
          sender: "contact",
          timestamp: new Date(),
        }

        // Create the updated conversation
        const updatedConv = {
          ...currentConv,
          lastMessage: aiResponse,
          lastMessageTime: new Date(),
          messages: [...messagesWithoutLoading, aiMessageObj],
        }

        // Return the updated conversations array
        return [...prevConversations.slice(0, idx), updatedConv, ...prevConversations.slice(idx + 1)]
      })
    } catch (error) {
      console.error("Error in AI response:", error)

      // Handle error by updating state
      setConversations((prevConversations) => {
        const idx = prevConversations.findIndex((c) => c.id === selectedConversationId)
        if (idx === -1) return prevConversations

        const currentConv = prevConversations[idx]
        const messagesWithoutLoading = currentConv.messages.filter((msg) => !msg.isLoading)

        const errorMessageObj: Message = {
          id: messagesWithoutLoading.length > 0 ? Math.max(...messagesWithoutLoading.map((m) => m.id)) + 1 : 1,
          text: "Sorry, I couldn't respond right now. Let's talk later.",
          sender: "contact",
          timestamp: new Date(),
        }

        const updatedConv = {
          ...currentConv,
          lastMessage: errorMessageObj.text,
          lastMessageTime: new Date(),
          messages: [...messagesWithoutLoading, errorMessageObj],
        }

        return [...prevConversations.slice(0, idx), updatedConv, ...prevConversations.slice(idx + 1)]
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectConversation = (conversationId: number) => {
    // Mark as read when selecting
    setConversations(conversations.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)))
    setSelectedConversationId(conversationId)
  }

  const handleBackToConversations = () => {
    setSelectedConversationId(null)
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation?.messages])

  // Focus input when conversation is selected
  useEffect(() => {
    if (selectedConversationId && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [selectedConversationId])

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = message.timestamp.toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }))
  }

  const messageGroups = selectedConversation ? groupMessagesByDate(selectedConversation.messages) : []

  return (
    <div className="h-[740px] w-[330px] bg-white flex flex-col overflow-hidden">
      {selectedConversationId ? (
        // Chat View
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center bg-gray-50">
            <button onClick={handleBackToConversations} className="text-blue-500 flex items-center mr-2">
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Messages</span>
            </button>
            <div className="flex-1 flex justify-center">
              <div className="flex flex-col items-center">
                <img
                  src={selectedConversation?.avatar || "/placeholder.svg"}
                  alt={selectedConversation?.contactName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <h3 className="text-sm font-semibold">{selectedConversation?.contactName}</h3>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="text-blue-500">
                <Video size={20} />
              </button>
              <button className="text-blue-500">
                <Phone size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 py-2 bg-[#F5F5F5]">
            {selectedConversation?.messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-400 text-sm">
                <img
                  src={selectedConversation?.avatar || "/placeholder.svg"}
                  alt={selectedConversation?.contactName}
                  className="w-16 h-16 rounded-full object-cover mb-3"
                />
                <p className="font-medium text-gray-800">{selectedConversation?.contactName}</p>
                <p className="text-xs text-gray-500 mb-4">
                  {selectedConversation?.isOnline ? "Active Now" : "Offline"}
                </p>
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messageGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-2">
                    <div className="flex justify-center my-2">
                      <div className="bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                        {new Date(group.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {group.messages.map((message, messageIndex) => {
                      const showAvatar =
                        message.sender === "contact" &&
                        (messageIndex === 0 || group.messages[messageIndex - 1]?.sender !== "contact")

                      const isLastInGroup =
                        messageIndex === group.messages.length - 1 ||
                        group.messages[messageIndex + 1]?.sender !== message.sender

                      return (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.sender === "contact" && showAvatar && (
                            <img
                              src={selectedConversation?.avatar || "/placeholder.svg"}
                              alt={selectedConversation?.contactName}
                              className="w-8 h-8 rounded-full object-cover mr-1 self-end mb-1"
                            />
                          )}
                          {message.sender === "contact" && !showAvatar && <div className="w-8 mr-1"></div>}

                          <div
                            className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                              message.sender === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-800 border border-gray-200"
                            } ${isLastInGroup ? (message.sender === "user" ? "rounded-br-md" : "rounded-bl-md") : ""}`}
                          >
                            {message.isLoading ? (
                              <div className="flex items-center justify-center py-1">
                                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                              </div>
                            ) : (
                              <>
                                <p className="text-[15px]">{message.text}</p>
                                {isLastInGroup && (
                                  <p
                                    className={`text-[10px] mt-1 text-right ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                                  >
                                    {formatMessageTime(message.timestamp)}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-2 border-t border-gray-200 bg-[#F5F5F5]">
            <div className="flex items-center bg-white rounded-full px-3 py-1 border border-gray-300">
              <button className="text-gray-400 mr-1">
                <Plus size={20} />
              </button>
              <Input
                ref={inputRef}
                type="text"
                placeholder="iMessage"
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] py-1.5 h-auto"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isGenerating}
              />
              {newMessage.trim() ? (
                <button
                  className="text-blue-500 ml-1"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isGenerating}
                >
                  {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={20} />}
                </button>
              ) : (
                <>
                  <button className="text-gray-400 ml-1">
                    <Camera size={20} />
                  </button>
                  <button className="text-gray-400 ml-1">
                    <Mic size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Conversations List View
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
            {showSearch ? (
              <div className="flex items-center w-full">
                <button onClick={() => setShowSearch(false)} className="text-blue-500 mr-2">
                  <ArrowLeft size={20} />
                </button>
                <Input
                  type="text"
                  placeholder="Search"
                  className="flex-1 border-0 bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg h-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <button onClick={onClose} className="text-blue-500 mr-2">
                    <ArrowLeft size={20} />
                  </button>
                  <h1 className="text-xl font-bold">Messages</h1>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => setShowSearch(true)} className="text-blue-500">
                    <Search size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "text-blue-500 font-medium" : "text-blue-500"}
                  >
                    {isEditing ? "Done" : "Edit"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Conversations List - Add padding at bottom for fixed button */}
          <div className="flex-1 overflow-y-auto pb-20">
            {filteredConversations.length === 0 ? (
              <div className="flex justify-center items-center h-32 text-gray-400 text-sm">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="px-4 py-3 border-b border-gray-100 flex items-center"
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  {isEditing && (
                    <button className="text-red-500 mr-3">
                      <MinusCircle size={20} />
                    </button>
                  )}
                  <div className="relative mr-3">
                    <img
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.contactName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3
                        className={`font-semibold truncate ${conversation.unread > 0 ? "text-black" : "text-gray-800"}`}
                      >
                        {conversation.contactName}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {conversation.messages.length > 0 ? formatTime(conversation.lastMessageTime) : ""}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unread > 0 ? "text-black" : "text-gray-600"}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                  {!isEditing && !conversation.unread && conversation.messages.length > 0 && (
                    <ChevronRight size={16} className="text-gray-400 ml-1" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* New Message Button - Fixed Position */}
          <div className="absolute bottom-4 right-4 z-10">
            <button className="bg-white text-blue-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
              <Edit size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Additional icons
function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MinusCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function Edit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

