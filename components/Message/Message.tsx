"use client"

import { useState, useRef, useEffect } from "react"
import Window from "./Window"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Paperclip, Image, Smile, Mic, Send, Loader2 } from "lucide-react"

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

interface MessagesAppProps {
  onClose: () => void
  onFocus: () => void
}

// Empty conversations with just context information
const initialConversations: Conversation[] = [
  {
    id: 1,
    contactName: "Arjun Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Start a conversation",
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
    lastMessage: "Start a conversation",
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
    lastMessage: "Start a conversation",
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
    lastMessage: "Start a conversation",
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
    lastMessage: "Start a conversation",
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

export default function MessagesApp({ onClose, onFocus }: MessagesAppProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<number>(conversations[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get the selected conversation from the state using the ID
  // This ensures we always have the latest version of the conversation
  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) || conversations[0]

  const filteredConversations = conversations.filter((conversation) =>
    conversation.contactName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) {
      return days === 1 ? "Yesterday" : date.toLocaleDateString()
    }

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
                  selectedConversationId === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
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
                      {conversation.messages.length > 0 ? formatTime(conversation.lastMessageTime) : ""}
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
                  <p className="text-xs text-gray-500">{selectedConversation.isOnline ? "Active Now" : "Offline"}</p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {selectedConversation.messages.length === 0 ? (
                    <div className="flex justify-center items-center h-32 text-gray-400 text-sm">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    selectedConversation.messages.map((message) => (
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
                          {message.isLoading ? (
                            <div className="flex items-center justify-center py-1">
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            </div>
                          ) : (
                            <>
                              <p>{message.text}</p>
                              <p
                                className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                              >
                                {formatTime(message.timestamp)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
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
                    disabled={isGenerating}
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
                    disabled={!newMessage.trim() || isGenerating}
                  >
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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

