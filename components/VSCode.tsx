"use client"

import { useState, useRef, useEffect } from "react"
import Window from "./Window"
import {
  Search,
  GitBranch,
  Bug,
  Settings,
  Files,
  ExpandIcon as Extensions,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VSCodeProps {
  onClose: () => void
  onFocus: () => void
}

interface FileTreeItem {
  name: string
  type: "file" | "folder"
  children?: FileTreeItem[]
  content?: string
}

const initialFileTree: FileTreeItem[] = [
  {
    name: "project",
    type: "folder",
    children: [
      {
        name: "src",
        type: "folder",
        children: [
          {
            name: "index.js",
            type: "file",
            content: 'console.log("Hello, World!");',
          },
          {
            name: "styles.css",
            type: "file",
            content: "body { font-family: sans-serif; }",
          },
        ],
      },
      {
        name: "package.json",
        type: "file",
        content: '{\n  "name": "project",\n  "version": "1.0.0"\n}',
      },
    ],
  },
]

export default function VSCode({ onClose, onFocus }: VSCodeProps) {
  const [fileTree, setFileTree] = useState<FileTreeItem[]>(initialFileTree)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["project", "src"]))
  const [activeFile, setActiveFile] = useState<string | null>("project/src/index.js")
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>({
    "project/src/index.js": 'console.log("Hello, World!");',
    "project/src/styles.css": "body { font-family: sans-serif; }",
    "project/package.json": '{\n  "name": "project",\n  "version": "1.0.0"\n}',
  })
  const [activeSidebarItem, setActiveSidebarItem] = useState("Explorer")
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const activityBarItems = [
    { icon: Files, label: "Explorer", id: "Explorer" },
    { icon: Search, label: "Search", id: "Search" },
    { icon: GitBranch, label: "Source Control", id: "SourceControl" },
    { icon: Bug, label: "Run and Debug", id: "Debug" },
    { icon: Extensions, label: "Extensions", id: "Extensions" },
  ]

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const renderFileTree = (items: FileTreeItem[], path = "") => {
    return items.map((item) => {
      const itemPath = `${path}${item.name}`
      if (item.type === "folder") {
        const isExpanded = expandedFolders.has(itemPath)
        return (
          <div key={itemPath}>
            <div
              className={`flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer ${
                isExpanded ? "bg-[#37373d]" : ""
              }`}
              onClick={() => toggleFolder(itemPath)}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              <Folder className="w-4 h-4 mr-2 text-[#dcb67a]" />
              <span>{item.name}</span>
            </div>
            {isExpanded && item.children && <div className="ml-4">{renderFileTree(item.children, `${itemPath}/`)}</div>}
          </div>
        )
      } else {
        return (
          <div
            key={itemPath}
            className={`flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer ${
              activeFile === itemPath ? "bg-[#37373d]" : ""
            }`}
            onClick={() => setActiveFile(itemPath)}
          >
            <File className="w-4 h-4 mr-2 text-[#519aba]" />
            <span>{item.name}</span>
          </div>
        )
      }
    })
  }

  const handleFileContentChange = (content: string) => {
    if (activeFile) {
      setFileContents((prev) => ({ ...prev, [activeFile]: content }))
    }
  }

  useEffect(() => {
    if (editorRef.current && activeFile) {
      editorRef.current.value = fileContents[activeFile] || ""
    }
  }, [activeFile, fileContents])

  return (
    <Window title="Visual Studio Code" onClose={onClose} onFocus={onFocus} initialSize={{ width: 1200, height: 800 }}>
      <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc]">
        {/* Top Bar */}
        <div className="h-8 bg-[#3c3c3c] flex items-center px-4 text-sm">
          <div className="flex items-center space-x-4">
            <span>File</span>
            <span>Edit</span>
            <span>Selection</span>
            <span>View</span>
            <span>Go</span>
            <span>Run</span>
            <span>Terminal</span>
            <span>Help</span>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Activity Bar */}
          <div className="w-12 bg-[#333333] flex flex-col items-center py-2">
            {activityBarItems.map((item) => (
              <button
                key={item.id}
                className={`w-12 h-12 flex items-center justify-center hover:bg-[#2a2d2e] relative ${
                  activeSidebarItem === item.id ? "border-l-2 border-white" : ""
                }`}
                onClick={() => setActiveSidebarItem(item.id)}
              >
                <item.icon className="w-6 h-6" />
                <span className="absolute left-14 bg-[#252526] text-white px-2 py-1 rounded text-xs whitespace-nowrap hidden group-hover:block">
                  {item.label}
                </span>
              </button>
            ))}
            <div className="flex-1" />
            <button className="w-12 h-12 flex items-center justify-center hover:bg-[#2a2d2e]">
              <Settings className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar */}
          {activeSidebarItem === "Explorer" && (
            <div className="w-64 bg-[#252526] overflow-hidden flex flex-col">
              <div className="p-2 text-xs uppercase font-bold">Explorer</div>
              <ScrollArea className="flex-1">
                <div className="p-2">{renderFileTree(fileTree)}</div>
              </ScrollArea>
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <Tabs defaultValue={activeFile} className="w-full">
              <TabsList className="bg-[#2d2d2d] h-9">
                {Object.keys(fileContents).map((file) => (
                  <TabsTrigger
                    key={file}
                    value={file}
                    className="px-3 py-1 data-[state=active]:bg-[#1e1e1e]"
                    onClick={() => setActiveFile(file)}
                  >
                    {file.split("/").pop()}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.keys(fileContents).map((file) => (
                <TabsContent key={file} value={file} className="flex-1 p-0 m-0">
                  <div className="h-full flex flex-col">
                    <textarea
                      ref={editorRef}
                      className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none outline-none"
                      value={fileContents[file]}
                      onChange={(e) => handleFileContentChange(e.target.value)}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-[#007acc] flex items-center px-2 text-white text-xs">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>main</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-2">
            <span>Ln 1, Col 1</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>JavaScript</span>
          </div>
        </div>
      </div>
    </Window>
  )
}

