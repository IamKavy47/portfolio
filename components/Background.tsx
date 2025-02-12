"use client"

import { useState, useCallback } from "react"
import { Folder, File, Grid, List, SortAsc, SortDesc } from "lucide-react"
import Finder from "./Finder"

interface BackgroundProps {
  wallpaper?: string
  onOpenApp: (appName: string) => void
}

export default function Background({ wallpaper, onOpenApp }: BackgroundProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [itemContextMenu, setItemContextMenu] = useState<{ x: number; y: number; type: "file" | "folder" } | null>(null)
  const [folder, setFolder] = useState<{ name: string; x: number; y: number } | null>(null)
  const [file, setFile] = useState<{ name: string; x: number; y: number } | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isFinderOpen, setIsFinderOpen] = useState(false)

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleItemContextMenu = useCallback((e: React.MouseEvent, type: "file" | "folder") => {
    e.preventDefault()
    e.stopPropagation()
    setItemContextMenu({ x: e.clientX, y: e.clientY, type })
  }, [])

  const handleCreateItem = useCallback(
    (type: "folder" | "file") => {
      const name = prompt(`Enter ${type} name:`)
      if (name) {
        if (type === "folder" && !folder) {
          setFolder({ name, x: contextMenu!.x, y: contextMenu!.y })
        } else if (type === "file" && !file) {
          setFile({ name, x: contextMenu!.x, y: contextMenu!.y })
        }
      }
      setContextMenu(null)
    },
    [contextMenu, folder, file],
  )

  const handleBackgroundClick = useCallback(() => {
    setContextMenu(null)
    setItemContextMenu(null)
  }, [])

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
    setContextMenu(null)
  }, [])

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    setContextMenu(null)
  }, [])

  const openFolder = useCallback(() => {
    setIsFinderOpen(true)
    setItemContextMenu(null)
  }, [])

  return (
    <div
      className="fixed inset-0 z-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${wallpaper || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ww1DQ6z0nNFu7dGuWaC8MLVOWnQDOQ.png"})`,
      }}
      onContextMenu={handleContextMenu}
      onClick={handleBackgroundClick}
    >
      {contextMenu && (
        <div
          className="absolute bg-white/80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden text-sm"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => handleCreateItem("folder")}
            disabled={!!folder}
          >
            New Folder
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => handleCreateItem("file")}
            disabled={!!file}
          >
            New File
          </button>
          <hr className="border-gray-200" />
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={toggleViewMode}
          >
            {viewMode === "grid" ? (
              <>
                <List className="inline-block mr-2" /> List View
              </>
            ) : (
              <>
                <Grid className="inline-block mr-2" /> Grid View
              </>
            )}
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={toggleSortOrder}
          >
            {sortOrder === "asc" ? (
              <>
                <SortAsc className="inline-block mr-2" /> Sort Descending
              </>
            ) : (
              <>
                <SortDesc className="inline-block mr-2" /> Sort Ascending
              </>
            )}
          </button>
          <hr className="border-gray-200" />
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => onOpenApp("WallpaperApp")}
          >
            Change Wallpaper
          </button>
        </div>
      )}
      {itemContextMenu && (
        <div
          className="absolute bg-white/80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden text-sm"
          style={{ left: itemContextMenu.x, top: itemContextMenu.y }}
        >
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => {
              if (itemContextMenu.type === "folder") {
                openFolder()
              } else {
                onOpenApp("TextEdit")
              }
            }}
          >
            Open
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => {
              const newName = prompt(`Enter new name for ${itemContextMenu.type}:`)
              if (newName) {
                if (itemContextMenu.type === "folder") {
                  setFolder((prev) => (prev ? { ...prev, name: newName } : null))
                } else {
                  setFile((prev) => (prev ? { ...prev, name: newName } : null))
                }
              }
              setItemContextMenu(null)
            }}
          >
            Rename
          </button>
          <button
            className="block w-full px-4 py-2 text-left hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => {
              if (itemContextMenu.type === "folder") {
                setFolder(null)
              } else {
                setFile(null)
              }
              setItemContextMenu(null)
            }}
          >
            Delete
          </button>
        </div>
      )}
      <div
        className={`absolute top-10 left-10 ${viewMode === "grid" ? "grid grid-cols-4 gap-4" : "flex flex-col space-y-4"}`}
      >
        {folder && (
          <div
            className={`flex ${viewMode === "grid" ? "flex-col" : "flex-row"} items-center cursor-pointer`}
            onClick={openFolder}
            onContextMenu={(e) => handleItemContextMenu(e, "folder")}
          >
            <Folder className={`${viewMode === "grid" ? "w-16 h-16" : "w-8 h-8 mr-2"} text-blue-500`} />
            <span
              className={`text-white text-sm mt-1 bg-black/50 px-2 py-1 rounded ${viewMode === "grid" ? "text-center" : ""}`}
            >
              {folder.name}
            </span>
          </div>
        )}
        {file && (
          <div
            className={`flex ${viewMode === "grid" ? "flex-col" : "flex-row"} items-center cursor-pointer`}
            onClick={() => onOpenApp("TextEdit")}
            onContextMenu={(e) => handleItemContextMenu(e, "file")}
          >
            <File className={`${viewMode === "grid" ? "w-16 h-16" : "w-8 h-8 mr-2"} text-white`} />
            <span
              className={`text-white text-sm mt-1 bg-black/50 px-2 py-1 rounded ${viewMode === "grid" ? "text-center" : ""}`}
            >
              {file.name}
            </span>
          </div>
        )}
      </div>
      {isFinderOpen && folder && (
        <Finder onClose={() => setIsFinderOpen(false)} onFocus={() => {}} folderName={folder.name} />
      )}
    </div>
  )
}

