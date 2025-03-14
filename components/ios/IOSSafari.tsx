"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Share,
  BookOpen,
  X,
  Plus,
  Grid,
  ExternalLink,
  Download,
  Printer,
  Copy,
  Search,
} from "lucide-react"

interface IOSSafariProps {
  onClose: () => void
}

interface Tab {
  id: string
  url: string
  title: string
  favicon?: string
}

export default function IOSSafari({ onClose }: IOSSafariProps) {
  // Browser state
  const [currentUrl, setCurrentUrl] = useState("https://mufests.com")
  const [displayUrl, setDisplayUrl] = useState("apple.com")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddressBarFocused, setIsAddressBarFocused] = useState(false)
  const [isScrolledDown, setIsScrolledDown] = useState(false)

  // Browser history
  const [history, setHistory] = useState<string[]>(["https://mufests.com"])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Tabs management
  const [tabs, setTabs] = useState<Tab[]>([{ id: "tab-1", url: "https://mufests.com", title: "MU CodeStorm" }])
  const [activeTabId, setActiveTabId] = useState("tab-1")
  const [showTabsView, setShowTabsView] = useState(false)

  // Share menu
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<{ url: string; title: string }[]>([
    { url: "https://www.mufests.com", title: "MU CodeStorm" },
    { url: "https://www.github.com/iamkavy47", title: "Github" },
  ])
  const [showBookmarks, setShowBookmarks] = useState(false)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Get active tab
  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0]

  // Update display URL when current URL changes
  useEffect(() => {
    try {
      const urlObj = new URL(currentUrl)
      setDisplayUrl(urlObj.hostname.replace("www.", ""))
    } catch (e) {
      setDisplayUrl(currentUrl)
    }
  }, [currentUrl])

  // Handle form submission (URL navigation)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigateToUrl(currentUrl)
  }

  // Navigate to a URL
  const navigateToUrl = (url: string) => {
    setIsLoading(true)
    setIsAddressBarFocused(false)

    // Add https:// if not present
    let processedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      processedUrl = `https://${url}`
      setCurrentUrl(processedUrl)
    }

    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(processedUrl)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    // Update tab
    setTabs(tabs.map((tab) => (tab.id === activeTabId ? { ...tab, url: processedUrl } : tab)))

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      // Update tab title (in a real browser this would come from the page)
      const domain = new URL(processedUrl).hostname.replace("www.", "")
      setTabs(tabs.map((tab) => (tab.id === activeTabId ? { ...tab, url: processedUrl, title: domain } : tab)))
    }, 1000)
  }

  // Handle scroll to hide/show address bar
  const handleScroll = () => {
    if (contentRef.current) {
      const scrollTop = contentRef.current.scrollTop
      setIsScrolledDown(scrollTop > 50)
    }
  }

  // Address bar focus/blur handlers
  const handleAddressBarFocus = () => {
    setIsAddressBarFocused(true)
    if (inputRef.current) {
      inputRef.current.select()
    }
  }

  const handleAddressBarBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setIsAddressBarFocused(false)
      }
    }, 100)
  }

  // Tab management
  const handleNewTab = () => {
    const newTabId = `tab-${Date.now()}`
    setTabs([
      ...tabs,
      {
        id: newTabId,
        url: "https://www.apple.com",
        title: "New Tab",
      },
    ])
    setActiveTabId(newTabId)
    setCurrentUrl("https://www.apple.com")
    setDisplayUrl("apple.com")
    setIsLoading(false)
    setHistory(["https://www.apple.com"])
    setHistoryIndex(0)
    setShowTabsView(false)
  }

  const handleCloseTab = (tabId: string) => {
    if (tabs.length <= 1) {
      onClose()
      return
    }

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)

    // If closing active tab, activate another tab
    if (tabId === activeTabId) {
      const newActiveIndex = tabIndex === 0 ? 0 : tabIndex - 1
      const newActiveTab = newTabs[newActiveIndex]
      setActiveTabId(newActiveTab.id)
      setCurrentUrl(newActiveTab.url)

      // Reset history for the new active tab
      setHistory([newActiveTab.url])
      setHistoryIndex(0)
    }
  }

  const handleSelectTab = (tabId: string) => {
    const tab = tabs.find((tab) => tab.id === tabId)
    if (tab) {
      setActiveTabId(tabId)
      setCurrentUrl(tab.url)
      setShowTabsView(false)

      // Reset history for the selected tab
      setHistory([tab.url])
      setHistoryIndex(0)
    }
  }

  // Navigation handlers
  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])

      // Update tab
      setTabs(tabs.map((tab) => (tab.id === activeTabId ? { ...tab, url: history[newIndex] } : tab)))

      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])

      // Update tab
      setTabs(tabs.map((tab) => (tab.id === activeTabId ? { ...tab, url: history[newIndex] } : tab)))

      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  // Bookmark handlers
  const handleAddBookmark = () => {
    const newBookmark = {
      url: currentUrl,
      title: activeTab.title,
    }

    // Check if bookmark already exists
    const exists = bookmarks.some((bookmark) => bookmark.url === currentUrl)
    if (!exists) {
      setBookmarks([...bookmarks, newBookmark])
    }

    setShowShareMenu(false)
  }

  const handleBookmarkClick = (url: string) => {
    navigateToUrl(url)
    setShowBookmarks(false)
  }

  // Render the tabs view
  const renderTabsView = () => (
    <div className="absolute inset-0 bg-[#F6F6F6] z-20 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <button className="text-[#007AFF]" onClick={() => setShowTabsView(false)}>
          Done
        </button>
        <button className="text-[#007AFF]" onClick={handleNewTab}>
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative bg-white rounded-lg overflow-hidden shadow-md h-40 flex flex-col">
            <div
              className="absolute top-2 right-2 z-10 bg-gray-800 bg-opacity-50 rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation()
                handleCloseTab(tab.id)
              }}
            >
              <X size={16} className="text-white" />
            </div>

            <div
              className="flex-1 bg-gray-100 flex items-center justify-center cursor-pointer"
              onClick={() => handleSelectTab(tab.id)}
            >
              {tab.favicon ? (
                <img src={tab.favicon || "/placeholder.svg"} alt="" className="w-6 h-6" />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-500">{tab.title.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="p-2 text-center truncate text-sm" onClick={() => handleSelectTab(tab.id)}>
              {tab.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Render the share menu
  const renderShareMenu = () => (
    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-xl z-20 p-4 shadow-lg transform transition-transform duration-300">
      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

      <div className="text-center mb-4">
        <h3 className="font-semibold">{displayUrl}</h3>
        <p className="text-sm text-gray-500 truncate">{currentUrl}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#007AFF] flex items-center justify-center mb-1">
            <Copy size={20} className="text-white" />
          </div>
          <span className="text-xs">Copy</span>
        </button>

        <button className="flex flex-col items-center" onClick={handleAddBookmark}>
          <div className="w-12 h-12 rounded-full bg-[#FF9500] flex items-center justify-center mb-1">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="text-xs">Add Bookmark</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#34C759] flex items-center justify-center mb-1">
            <Download size={20} className="text-white" />
          </div>
          <span className="text-xs">Download</span>
        </button>

        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#5856D6] flex items-center justify-center mb-1">
            <ExternalLink size={20} className="text-white" />
          </div>
          <span className="text-xs">Open in App</span>
        </button>
      </div>

      <div className="space-y-2">
        <button className="w-full py-3 px-4 bg-gray-100 rounded-lg text-left flex items-center">
          <Printer size={20} className="text-gray-600 mr-3" />
          <span>Print</span>
        </button>

        <button className="w-full py-3 px-4 bg-gray-100 rounded-lg text-left" onClick={() => setShowShareMenu(false)}>
          Cancel
        </button>
      </div>
    </div>
  )

  // Render the bookmarks view
  const renderBookmarksView = () => (
    <div className="absolute inset-0 bg-white z-20 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <button className="text-[#007AFF]" onClick={() => setShowBookmarks(false)}>
          Done
        </button>
        <h2 className="text-lg font-semibold">Bookmarks</h2>
        <button className="text-[#007AFF]">Edit</button>
      </div>

      <div className="flex-1 overflow-auto">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <BookOpen size={48} className="mb-2" />
            <p>No Bookmarks</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookmarks.map((bookmark, index) => (
              <li key={index}>
                <button
                  className="w-full py-3 px-4 flex items-center text-left"
                  onClick={() => handleBookmarkClick(bookmark.url)}
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                    <span className="font-semibold text-gray-600">{bookmark.title.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{bookmark.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{bookmark.url}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-center bg-[#F2F2F7]"
        style={{
          borderBottom: scrollY > 10 ? "0.5px solid rgba(0,0,0,0.2)" : "none",
        }}
      >
        <button onClick={onClose} className="absolute left-2 text-[#007AFF] font-medium flex items-center">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-[17px] font-semibold">Safari</h1>
      </div>
      {/* Content Area */}
      <div ref={contentRef} className="flex-1 overflow-auto" onScroll={handleScroll}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            className="w-full h-full border-none"
            title="Safari Content"
            sandbox="allow-same-origin allow-scripts allow-forms"
            onLoad={() => setIsLoading(false)}
          />
        )}
      </div>

      {/* Bottom Bar with Address Bar and Navigation */}
      <div
        className={`bg-[#F6F6F6] border-t border-gray-200 transition-transform duration-300 ${
          isScrolledDown && !isAddressBarFocused && !showTabsView && !showShareMenu && !showBookmarks
            ? "translate-y-full"
            : ""
        }`}
      >
        {/* Address Bar */}
        <div className="px-4 py-2">
          <div
            className={`relative flex items-center ${
              isAddressBarFocused ? "bg-white border border-[#007AFF]" : "bg-[#E9E9EA]"
            } rounded-lg px-3 py-2`}
            onClick={handleAddressBarFocus}
          >
            {!isAddressBarFocused && (
              <>
                <div className="flex items-center mr-2">
                  <div className="w-4 h-4 rounded-full bg-[#34C759] flex items-center justify-center">
                    <span className="text-white text-xs">🔒</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-center flex-1">{displayUrl}</div>
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin ml-2"></div>
                )}
              </>
            )}

            {isAddressBarFocused && (
              <form onSubmit={handleSubmit} className="w-full flex items-center">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Search size={16} className="text-gray-400 mr-2" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={currentUrl}
                  onChange={(e) => setCurrentUrl(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  placeholder="Search or enter website name"
                  autoFocus
                  onBlur={handleAddressBarBlur}
                />
                {currentUrl && (
                  <button type="button" className="text-gray-400 ml-2" onClick={() => setCurrentUrl("")}>
                    <X size={16} />
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Navigation Toolbar */}
        <div className="flex justify-between items-center px-6 py-2">
          <div className="flex space-x-10">
            <button
              className={`text-[#8E8E93] flex flex-col items-center ${historyIndex > 0 ? "opacity-100" : "opacity-50"}`}
              onClick={handleBack}
              disabled={historyIndex <= 0}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`text-[#8E8E93] flex flex-col items-center ${historyIndex < history.length - 1 ? "opacity-100" : "opacity-50"}`}
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex space-x-10">
            <button
              className="text-[#8E8E93] flex flex-col items-center"
              onClick={() => {
                setShowShareMenu(true)
                setShowTabsView(false)
                setShowBookmarks(false)
              }}
            >
              <Share size={20} />
            </button>
            <button
              className="text-[#8E8E93] flex flex-col items-center"
              onClick={() => {
                setShowBookmarks(true)
                setShowTabsView(false)
                setShowShareMenu(false)
              }}
            >
              <BookOpen size={20} />
            </button>
            <button
              className="text-[#8E8E93] flex flex-col items-center relative"
              onClick={() => {
                setShowTabsView(true)
                setShowShareMenu(false)
                setShowBookmarks(false)
              }}
            >
              <Grid size={20} />
              {tabs.length > 1 && (
                <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {tabs.length}
                </span>
              )}
            </button>
            <button className="text-[#8E8E93] flex flex-col items-center" onClick={handleNewTab}>
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="h-1 w-36 bg-black mx-auto rounded-full my-2"></div>

      {/* Overlay Views */}
      {showTabsView && renderTabsView()}
      {showShareMenu && renderShareMenu()}
      {showBookmarks && renderBookmarksView()}

      {/* Overlay for share menu */}
      {showShareMenu && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" onClick={() => setShowShareMenu(false)}></div>
      )}
    </div>
  )
}

