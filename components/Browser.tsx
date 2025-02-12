"use client"

import { useState, useEffect, useRef } from "react"
import Window from "./Window"
import { Loader2, ArrowLeft, ArrowRight, RotateCw, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BrowserProps {
  onClose: () => void
  onFocus: () => void
}

export default function Browser({ onClose, onFocus }: BrowserProps) {
  const [url, setUrl] = useState<string>("https://www.example.com")
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<string[]>(["https://www.example.com"])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [tabs, setTabs] = useState<string[]>(["https://www.example.com"])
  const [activeTab, setActiveTab] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }, [url])

  const handleUrlChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem("url") as HTMLInputElement
    let newUrl = input.value.trim()
    if (newUrl) {
      if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
        newUrl = `https://${newUrl}`
      }
      setUrl(newUrl)
      setIsLoading(true)
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newUrl])
      setHistoryIndex((prev) => prev + 1)
      updateTab(newUrl)
    }
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setUrl(history[historyIndex - 1])
      setIsLoading(true)
      updateTab(history[historyIndex - 1])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setUrl(history[historyIndex + 1])
      setIsLoading(true)
      updateTab(history[historyIndex + 1])
    }
  }

  const reload = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }

  const updateTab = (newUrl: string) => {
    setTabs((prev) => {
      const newTabs = [...prev]
      newTabs[activeTab] = newUrl
      return newTabs
    })
  }

  const addTab = () => {
    setTabs((prev) => [...prev, "https://www.example.com"])
    setActiveTab(tabs.length)
    setUrl("https://www.example.com")
    setIsLoading(true)
  }

  const closeTab = (index: number) => {
    if (tabs.length > 1) {
      setTabs((prev) => prev.filter((_, i) => i !== index))
      if (activeTab === index) {
        setActiveTab((prev) => (prev > 0 ? prev - 1 : 0))
        setUrl(tabs[activeTab > 0 ? activeTab - 1 : 0])
      } else if (activeTab > index) {
        setActiveTab((prev) => prev - 1)
      }
    }
  }

  return (
    <Window title="Safari" onClose={onClose} onFocus={onFocus} initialSize={{ width: 1024, height: 768 }}>
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center space-x-2 p-2 bg-gray-100">
          <Button variant="ghost" size="icon" onClick={goBack} disabled={historyIndex <= 0}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goForward} disabled={historyIndex >= history.length - 1}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={reload}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <form onSubmit={handleUrlChange} className="flex-grow">
            <Input
              name="url"
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white rounded-full px-4 py-1 text-sm"
            />
          </form>
        </div>
        <div className="flex bg-gray-200 px-2">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`flex items-center px-3 py-1 rounded-t-lg text-sm cursor-pointer ${
                index === activeTab ? "bg-white" : "bg-gray-100 hover:bg-gray-50"
              }`}
              onClick={() => {
                setActiveTab(index)
                setUrl(tab)
                setIsLoading(true)
              }}
            >
              {new URL(tab).hostname}
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-4 w-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(index)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="ghost" size="icon" className="ml-2" onClick={addTab}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Browser Content"
          />
        </div>
      </div>
    </Window>
  )
}

