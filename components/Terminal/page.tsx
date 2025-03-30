"use client"

import type React from "react"
import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Settings, Search } from "lucide-react"
import Window from "./Window"

interface MacTerminalProps {
  onClose: () => void
  onFocus: () => void
}

// Virtual file system structure
interface FileSystemNode {
  name: string
  type: "file" | "directory"
  content?: string
  children?: Record<string, FileSystemNode>
  createdAt: Date
  modifiedAt: Date
  permissions: string
  owner: string
  group: string
  size: number
}

// Command history entry
interface HistoryEntry {
  command: string
  output: string[]
  isError?: boolean
  workingDirectory: string
}

// Terminal tab
interface TerminalTab {
  id: string
  title: string
  history: HistoryEntry[]
  currentDirectory: string[]
  commandHistory: string[]
  historyIndex: number
  currentCommand: string
  cursorPosition: number
}

export default function MacTerminal({ onClose, onFocus }: MacTerminalProps) {
  // State for terminal tabs
  const [tabs, setTabs] = useState<TerminalTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>("")
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light" | "default">("default")
  const [fontSize, setFontSize] = useState(13)
  const [opacity, setOpacity] = useState(0.95)
  const [fontFamily, setFontFamily] = useState("'SF Mono', Menlo, monospace")

  // Refs
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Virtual file system (simplified)
  const [fileSystem, setFileSystem] = useState<FileSystemNode>({
    name: "/",
    type: "directory",
    createdAt: new Date(),
    modifiedAt: new Date(),
    permissions: "drwxr-xr-x",
    owner: "user",
    group: "staff",
    size: 4096,
    children: {
      Users: {
        name: "Users",
        type: "directory",
        createdAt: new Date(),
        modifiedAt: new Date(),
        permissions: "drwxr-xr-x",
        owner: "root",
        group: "wheel",
        size: 4096,
        children: {
          user: {
            name: "user",
            type: "directory",
            createdAt: new Date(),
            modifiedAt: new Date(),
            permissions: "drwxr-xr-x",
            owner: "user",
            group: "staff",
            size: 4096,
            children: {
              Documents: {
                name: "Documents",
                type: "directory",
                createdAt: new Date(),
                modifiedAt: new Date(),
                permissions: "drwxr-xr-x",
                owner: "user",
                group: "staff",
                size: 4096,
                children: {
                  "notes.txt": {
                    name: "notes.txt",
                    type: "file",
                    content: "These are my important notes.\nDon't forget to check the project deadline!",
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    permissions: "-rw-r--r--",
                    owner: "user",
                    group: "staff",
                    size: 64,
                  },
                  projects: {
                    name: "projects",
                    type: "directory",
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    permissions: "drwxr-xr-x",
                    owner: "user",
                    group: "staff",
                    size: 4096,
                    children: {
                      "react-app": {
                        name: "react-app",
                        type: "directory",
                        createdAt: new Date(),
                        modifiedAt: new Date(),
                        permissions: "drwxr-xr-x",
                        owner: "user",
                        group: "staff",
                        size: 4096,
                        children: {
                          "package.json": {
                            name: "package.json",
                            type: "file",
                            content:
                              '{\n  "name": "react-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}',
                            createdAt: new Date(),
                            modifiedAt: new Date(),
                            permissions: "-rw-r--r--",
                            owner: "user",
                            group: "staff",
                            size: 120,
                          },
                          "README.md": {
                            name: "README.md",
                            type: "file",
                            content:
                              "# React App\n\nThis is a sample React application.\n\n## Getting Started\n\nRun `npm install` to install dependencies.",
                            createdAt: new Date(),
                            modifiedAt: new Date(),
                            permissions: "-rw-r--r--",
                            owner: "user",
                            group: "staff",
                            size: 98,
                          },
                        },
                      },
                    },
                  },
                },
              },
              Downloads: {
                name: "Downloads",
                type: "directory",
                createdAt: new Date(),
                modifiedAt: new Date(),
                permissions: "drwxr-xr-x",
                owner: "user",
                group: "staff",
                size: 4096,
                children: {
                  "image.jpg": {
                    name: "image.jpg",
                    type: "file",
                    createdAt: new Date(),
                    modifiedAt: new Date(),
                    permissions: "-rw-r--r--",
                    owner: "user",
                    group: "staff",
                    size: 1024,
                  },
                },
              },
              Desktop: {
                name: "Desktop",
                type: "directory",
                createdAt: new Date(),
                modifiedAt: new Date(),
                permissions: "drwxr-xr-x",
                owner: "user",
                group: "staff",
                size: 4096,
                children: {},
              },
              ".bash_profile": {
                name: ".bash_profile",
                type: "file",
                content:
                  'export PATH="/usr/local/bin:$PATH"\nalias ll="ls -la"\n\n# Custom prompt\nexport PS1="\\[\\033[36m\\]\\u@\\h:\\[\\033[33m\\]\\w\\[\\033[00m\\]$ "',
                createdAt: new Date(),
                modifiedAt: new Date(),
                permissions: "-rw-r--r--",
                owner: "user",
                group: "staff",
                size: 132,
              },
            },
          },
        },
      },
      Applications: {
        name: "Applications",
        type: "directory",
        createdAt: new Date(),
        modifiedAt: new Date(),
        permissions: "drwxr-xr-x",
        owner: "root",
        group: "wheel",
        size: 4096,
        children: {},
      },
      Library: {
        name: "Library",
        type: "directory",
        createdAt: new Date(),
        modifiedAt: new Date(),
        permissions: "drwxr-xr-x",
        owner: "root",
        group: "wheel",
        size: 4096,
        children: {},
      },
      System: {
        name: "System",
        type: "directory",
        createdAt: new Date(),
        modifiedAt: new Date(),
        permissions: "drwxr-xr-x",
        owner: "root",
        group: "wheel",
        size: 4096,
        children: {},
      },
      var: {
        name: "var",
        type: "directory",
        createdAt: new Date(),
        modifiedAt: new Date(),
        permissions: "drwxr-xr-x",
        owner: "root",
        group: "wheel",
        size: 4096,
        children: {
          log: {
            name: "log",
            type: "directory",
            createdAt: new Date(),
            modifiedAt: new Date(),
            permissions: "drwxr-xr-x",
            owner: "root",
            group: "wheel",
            size: 4096,
            children: {
              "system.log": {
                name: "system.log",
                type: "file",
                content:
                  "Apr 10 13:24:18 mac kernel[0]: System booted\nApr 10 13:25:02 mac UserEventAgent[11]: Launched application: Terminal.app",
                createdAt: new Date(),
                modifiedAt: new Date(),
                permissions: "-rw-r--r--",
                owner: "root",
                group: "wheel",
                size: 256,
              },
            },
          },
        },
      },
    },
  })

  // Initialize with a default tab
  useEffect(() => {
    const initialTab: TerminalTab = {
      id: generateId(),
      title: "Terminal",
      history: [
        {
          command: "",
          output: [
            "Last login: " + new Date().toLocaleString() + " on ttys001",
            "Welcome to Terminal. Type 'help' to see available commands.",
            "",
          ],
          workingDirectory: "/Users/user",
        },
      ],
      currentDirectory: ["Users", "user"],
      commandHistory: [],
      historyIndex: -1,
      currentCommand: "",
      cursorPosition: 0,
    }

    setTabs([initialTab])
    setActiveTabId(initialTab.id)
  }, [])

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }

    // Focus input when active tab changes
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [tabs, activeTabId])

  // Generate a unique ID for tabs
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9)
  }

  // Get the active tab
  const getActiveTab = (): TerminalTab | undefined => {
    return tabs.find((tab) => tab.id === activeTabId)
  }

  // Update the active tab
  const updateActiveTab = (updater: (tab: TerminalTab) => TerminalTab) => {
    setTabs((prevTabs) => prevTabs.map((tab) => (tab.id === activeTabId ? updater(tab) : tab)))
  }

  // Add a new tab
  const addTab = () => {
    const newTab: TerminalTab = {
      id: generateId(),
      title: "Terminal",
      history: [
        {
          command: "",
          output: ["Last login: " + new Date().toLocaleString(), ""],
          workingDirectory: "/Users/user",
        },
      ],
      currentDirectory: ["Users", "user"],
      commandHistory: [],
      historyIndex: -1,
      currentCommand: "",
      cursorPosition: 0,
    }

    setTabs((prevTabs) => [...prevTabs, newTab])
    setActiveTabId(newTab.id)
  }

  // Close a tab
  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      // Don't close the last tab
      return
    }

    const tabIndex = tabs.findIndex((tab) => tab.id === id)

    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id))

    // If closing the active tab, activate another tab
    if (id === activeTabId) {
      const newActiveIndex = tabIndex === 0 ? 0 : tabIndex - 1
      setActiveTabId(tabs[newActiveIndex === tabs.length - 1 ? newActiveIndex - 1 : newActiveIndex].id)
    }
  }

  // Get the current working directory path
  const getCurrentPath = (tab: TerminalTab): string => {
    return "/" + tab.currentDirectory.join("/")
  }

  // Get the current directory node
  const getCurrentDirectoryNode = (tab: TerminalTab): FileSystemNode | null => {
    let current: FileSystemNode = fileSystem

    for (const dir of tab.currentDirectory) {
      if (current.children && current.children[dir]) {
        current = current.children[dir]
      } else {
        return null
      }
    }

    return current
  }

  // Get node at a specific path
  const getNodeAtPath = (path: string): FileSystemNode | null => {
    // Handle absolute and relative paths
    let pathParts: string[] = []

    if (path.startsWith("/")) {
      // Absolute path
      pathParts = path.split("/").filter(Boolean)
    } else {
      // Relative path
      const activeTab = getActiveTab()
      if (!activeTab) return null

      if (path === "." || path === "./") {
        return getCurrentDirectoryNode(activeTab)
      } else if (path === ".." || path === "../") {
        if (activeTab.currentDirectory.length === 0) {
          return fileSystem
        } else {
          const parentPath = activeTab.currentDirectory.slice(0, -1)
          let current: FileSystemNode = fileSystem

          for (const dir of parentPath) {
            if (current.children && current.children[dir]) {
              current = current.children[dir]
            } else {
              return null
            }
          }

          return current
        }
      } else {
        // Other relative path
        pathParts = [...activeTab.currentDirectory]

        // Handle paths with ../ and ./
        const parts = path.split("/").filter(Boolean)
        for (const part of parts) {
          if (part === ".") {
            continue
          } else if (part === "..") {
            if (pathParts.length > 0) {
              pathParts.pop()
            }
          } else {
            pathParts.push(part)
          }
        }
      }
    }

    // Navigate to the node
    let current: FileSystemNode = fileSystem

    for (const part of pathParts) {
      if (current.children && current.children[part]) {
        current = current.children[part]
      } else {
        return null
      }
    }

    return current
  }

  // Format file size
  const formatSize = (size: number): string => {
    if (size < 1024) {
      return `${size}B`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)}K`
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)}M`
    }
  }

  // Format date for ls -l
  const formatDate = (date: Date): string => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = months[date.getMonth()]
    const day = date.getDate().toString().padStart(2, " ")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${month} ${day} ${hours}:${minutes}`
  }

  // Execute a command
  const executeCommand = (command: string) => {
    const activeTab = getActiveTab()
    if (!activeTab) return

    const trimmedCommand = command.trim()
    const commandParts = trimmedCommand.split(/\s+/)
    const cmd = commandParts[0]
    const args = commandParts.slice(1)

    // Add to command history
    const updatedCommandHistory = [...activeTab.commandHistory]
    if (
      trimmedCommand &&
      (updatedCommandHistory.length === 0 || updatedCommandHistory[updatedCommandHistory.length - 1] !== trimmedCommand)
    ) {
      updatedCommandHistory.push(trimmedCommand)
    }

    let output: string[] = []
    let isError = false

    // Execute the command
    switch (cmd) {
      case "":
        // Empty command, just add a new line
        output = [""]
        break

      case "clear":
        // Clear the terminal
        updateActiveTab((tab) => ({
          ...tab,
          history: [
            {
              command: "",
              output: [""],
              workingDirectory: getCurrentPath(tab),
            },
          ],
          commandHistory: updatedCommandHistory,
          historyIndex: -1,
          currentCommand: "",
          cursorPosition: 0,
        }))
        return

      case "ls":
        // List directory contents
        const currentDir = getCurrentDirectoryNode(activeTab)
        if (!currentDir || currentDir.type !== "directory") {
          output = ["ls: not a directory"]
          isError = true
          break
        }

        // Parse options
        const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al")
        const longFormat = args.includes("-l") || args.includes("-la") || args.includes("-al")

        // Get target directory
        let targetDir = currentDir
        const targetPathArg = args.find((arg) => !arg.startsWith("-"))

        if (targetPathArg) {
          const targetNode = getNodeAtPath(targetPathArg)
          if (!targetNode) {
            output = [`ls: ${targetPathArg}: No such file or directory`]
            isError = true
            break
          }

          if (targetNode.type !== "directory") {
            if (longFormat) {
              output = [
                `${targetNode.permissions} 1 ${targetNode.owner} ${targetNode.group} ${targetNode.size.toString().padStart(5)} ${formatDate(targetNode.modifiedAt)} ${targetNode.name}`,
              ]
            } else {
              output = [targetNode.name]
            }
            break
          }

          targetDir = targetNode
        }

        if (!targetDir.children) {
          output = [""]
          break
        }

        if (longFormat) {
          output = ["total " + Object.keys(targetDir.children).length]

          // Sort entries: directories first, then files, alphabetically
          const entries = Object.values(targetDir.children)
            .filter((entry) => showHidden || !entry.name.startsWith("."))
            .sort((a, b) => {
              if (a.type === "directory" && b.type === "file") return -1
              if (a.type === "file" && b.type === "directory") return 1
              return a.name.localeCompare(b.name)
            })

          for (const entry of entries) {
            output.push(
              `${entry.permissions} 1 ${entry.owner} ${entry.group} ${entry.size.toString().padStart(5)} ${formatDate(entry.modifiedAt)} ${entry.name}`,
            )
          }
        } else {
          // Regular format
          const entries = Object.values(targetDir.children)
            .filter((entry) => showHidden || !entry.name.startsWith("."))
            .map((entry) => entry.name)
            .sort()

          output = [entries.join("  ")]
        }
        break

      case "cd":
        // Change directory
        if (args.length === 0 || args[0] === "~") {
          // cd to home directory
          updateActiveTab((tab) => ({
            ...tab,
            currentDirectory: ["Users", "user"],
            history: [
              ...tab.history,
              {
                command: trimmedCommand,
                output: [""],
                workingDirectory: getCurrentPath(tab),
              },
            ],
            commandHistory: updatedCommandHistory,
            historyIndex: -1,
            currentCommand: "",
            cursorPosition: 0,
          }))
          return
        }

        const targetPath = args[0]

        if (targetPath === "/") {
          // cd to root
          updateActiveTab((tab) => ({
            ...tab,
            currentDirectory: [],
            history: [
              ...tab.history,
              {
                command: trimmedCommand,
                output: [""],
                workingDirectory: getCurrentPath(tab),
              },
            ],
            commandHistory: updatedCommandHistory,
            historyIndex: -1,
            currentCommand: "",
            cursorPosition: 0,
          }))
          return
        }

        if (targetPath === "..") {
          // cd to parent directory
          if (activeTab.currentDirectory.length > 0) {
            updateActiveTab((tab) => ({
              ...tab,
              currentDirectory: tab.currentDirectory.slice(0, -1),
              history: [
                ...tab.history,
                {
                  command: trimmedCommand,
                  output: [""],
                  workingDirectory: getCurrentPath(tab),
                },
              ],
              commandHistory: updatedCommandHistory,
              historyIndex: -1,
              currentCommand: "",
              cursorPosition: 0,
            }))
          }
          return
        }

        if (targetPath === ".") {
          // Stay in current directory
          updateActiveTab((tab) => ({
            ...tab,
            history: [
              ...tab.history,
              {
                command: trimmedCommand,
                output: [""],
                workingDirectory: getCurrentPath(tab),
              },
            ],
            commandHistory: updatedCommandHistory,
            historyIndex: -1,
            currentCommand: "",
            cursorPosition: 0,
          }))
          return
        }

        // Handle absolute paths
        if (targetPath.startsWith("/")) {
          const pathParts = targetPath.split("/").filter(Boolean)
          let current: FileSystemNode = fileSystem

          for (const part of pathParts) {
            if (current.children && current.children[part] && current.children[part].type === "directory") {
              current = current.children[part]
            } else {
              output = [`cd: ${targetPath}: No such file or directory`]
              isError = true
              break
            }
          }

          if (!isError) {
            updateActiveTab((tab) => ({
              ...tab,
              currentDirectory: pathParts,
              history: [
                ...tab.history,
                {
                  command: trimmedCommand,
                  output: [""],
                  workingDirectory: getCurrentPath(tab),
                },
              ],
              commandHistory: updatedCommandHistory,
              historyIndex: -1,
              currentCommand: "",
              cursorPosition: 0,
            }))
            return
          }
        } else {
          // Handle relative paths
          const pathParts = targetPath.split("/").filter(Boolean)
          const newDirectory = [...activeTab.currentDirectory]

          for (const part of pathParts) {
            if (part === "..") {
              if (newDirectory.length > 0) {
                newDirectory.pop()
              }
            } else if (part !== ".") {
              // Check if directory exists
              let current: FileSystemNode = fileSystem
              const checkPath = [...newDirectory, part]

              let valid = true
              for (const dir of checkPath) {
                if (current.children && current.children[dir]) {
                  current = current.children[dir]
                  if (current.type !== "directory" && dir === part) {
                    output = [`cd: ${part}: Not a directory`]
                    isError = true
                    valid = false
                    break
                  }
                } else {
                  output = [`cd: ${part}: No such file or directory`]
                  isError = true
                  valid = false
                  break
                }
              }

              if (!valid) break

              newDirectory.push(part)
            }
          }

          if (!isError) {
            updateActiveTab((tab) => ({
              ...tab,
              currentDirectory: newDirectory,
              history: [
                ...tab.history,
                {
                  command: trimmedCommand,
                  output: [""],
                  workingDirectory: getCurrentPath(tab),
                },
              ],
              commandHistory: updatedCommandHistory,
              historyIndex: -1,
              currentCommand: "",
              cursorPosition: 0,
            }))
            return
          }
        }
        break

      case "pwd":
        // Print working directory
        output = [getCurrentPath(activeTab)]
        break

      case "cat":
        // Concatenate and print files
        if (args.length === 0) {
          output = ["cat: missing file operand"]
          isError = true
          break
        }

        const filePath = args[0]
        const fileNode = getNodeAtPath(filePath)

        if (!fileNode) {
          output = [`cat: ${filePath}: No such file or directory`]
          isError = true
          break
        }

        if (fileNode.type === "directory") {
          output = [`cat: ${filePath}: Is a directory`]
          isError = true
          break
        }

        output = fileNode.content ? fileNode.content.split("\n") : [""]
        break

      case "mkdir":
        // Make directory
        if (args.length === 0) {
          output = ["mkdir: missing operand"]
          isError = true
          break
        }

        const dirName = args[0]

        // Check if directory already exists
        const currentDirForMkdir = getCurrentDirectoryNode(activeTab)
        if (!currentDirForMkdir || currentDirForMkdir.type !== "directory") {
          output = ["mkdir: failed to create directory"]
          isError = true
          break
        }

        if (currentDirForMkdir.children && currentDirForMkdir.children[dirName]) {
          output = [`mkdir: ${dirName}: File exists`]
          isError = true
          break
        }

        // Create the directory
        const newDir: FileSystemNode = {
          name: dirName,
          type: "directory",
          createdAt: new Date(),
          modifiedAt: new Date(),
          permissions: "drwxr-xr-x",
          owner: "user",
          group: "staff",
          size: 4096,
          children: {},
        }

        // Update file system
        setFileSystem((prevFileSystem) => {
          // Navigate to current directory
          let current = { ...prevFileSystem }
          let parent = current

          for (const dir of activeTab.currentDirectory) {
            if (current.children && current.children[dir]) {
              parent = current
              current = { ...current.children[dir] }
              parent.children = { ...parent.children, [dir]: current }
            }
          }

          // Add new directory
          if (current.children) {
            current.children = { ...current.children, [dirName]: newDir }
          }

          return prevFileSystem
        })

        output = [""]
        break

      case "touch":
        // Create an empty file
        if (args.length === 0) {
          output = ["touch: missing file operand"]
          isError = true
          break
        }

        const touchFileName = args[0]

        // Check if file already exists
        const currentDirForTouch = getCurrentDirectoryNode(activeTab)
        if (!currentDirForTouch || currentDirForTouch.type !== "directory") {
          output = ["touch: failed to create file"]
          isError = true
          break
        }

        if (currentDirForTouch.children && currentDirForTouch.children[touchFileName]) {
          // Update modification time
          setFileSystem((prevFileSystem) => {
            // Navigate to current directory
            let current = { ...prevFileSystem }
            let parent = current

            for (const dir of activeTab.currentDirectory) {
              if (current.children && current.children[dir]) {
                parent = current
                current = { ...current.children[dir] }
                parent.children = { ...parent.children, [dir]: current }
              }
            }

            // Update file
            if (current.children && current.children[touchFileName]) {
              const updatedFile = { ...current.children[touchFileName], modifiedAt: new Date() }
              current.children = { ...current.children, [touchFileName]: updatedFile }
            }

            return prevFileSystem
          })
        } else {
          // Create the file
          const newFile: FileSystemNode = {
            name: touchFileName,
            type: "file",
            content: "",
            createdAt: new Date(),
            modifiedAt: new Date(),
            permissions: "-rw-r--r--",
            owner: "user",
            group: "staff",
            size: 0,
          }

          // Update file system
          setFileSystem((prevFileSystem) => {
            // Navigate to current directory
            let current = { ...prevFileSystem }
            let parent = current

            for (const dir of activeTab.currentDirectory) {
              if (current.children && current.children[dir]) {
                parent = current
                current = { ...current.children[dir] }
                parent.children = { ...parent.children, [dir]: current }
              }
            }

            // Add new file
            if (current.children) {
              current.children = { ...current.children, [touchFileName]: newFile }
            }

            return prevFileSystem
          })
        }

        output = [""]
        break

      case "echo":
        // Echo text
        output = [args.join(" ")]
        break

      case "date":
        // Print date
        output = [new Date().toString()]
        break

      case "whoami":
        // Enhanced whoami command with more personal information
        output = [
          "user",
          "",
          "Personal Information:",
          "----------------",
          "Name: Kavy Porwal",
          "Role: Frontend Developer",
          "Location: Mandsaur, India",
          "Email: kavyporwal75@gmail.com",
          "",
          "Type 'about' for more information about me",
          "Type 'projects' to see my portfolio projects",
          "Type 'skills' to see my technical skills",
        ]
        break

      case "about":
        // About me command
        output = [
          "About Kavy Porwal",
          "----------------",
          "I'm a passionate frontend developer focused on creating beautiful and functional",
          "user interfaces using modern web technologies. I love turning complex problems",
          "into simple, beautiful, and intuitive designs.",
          "",
          "Currently pursuing B.Tech in Computer Science at Mandsaur University (2024-2028).",
          "I'm actively participating in coding competitions and hackathons while focusing on",
          "modern web development technologies and computer science fundamentals.",
          "",
          "In my free time, I enjoy learning about new technologies, contributing to open source,",
          "and building side projects to improve my skills.",
        ]
        break

      case "projects":
        // Projects command
        output = [
          "My Projects",
          "----------------",
          "1. Personal Portfolio",
          "   A modern portfolio website built with Next.js and Tailwind CSS featuring",
          "   a macOS-inspired UI with interactive elements and smooth animations.",
          "   Technologies: Next.js, TypeScript, Tailwind CSS",
          "   Link: https://iamkavy47.vercel.app",
          "",
          "2. Codestorm Website",
          "   National level 36 hours Hackathon website for Mandsaur University.",
          "   Built with Next.js, TypeScript, and Aceternity UI.",
          "   Technologies: Next.js, TypeScript, Tailwind CSS",
          "   Link: https://mufests.com",
          "",
          "Type 'open [project-number]' to view more details about a specific project",
        ]
        break

      case "skills":
        // Skills command
        output = [
          "Technical Skills",
          "----------------",
          "Frontend:",
          "  • React, Next.js, TypeScript",
          "  • HTML5, CSS3, Tailwind CSS",
          "  • JavaScript, ES6+",
          "",
          "Backend:",
          "  • Node.js, Python",
          "",
          "Other:",
          "  • Git, GitHub",
          "  • Responsive Design",
          "  • UI/UX Principles",
          "  • Machine Learning (Learning)",
        ]
        break

      case "open":
        // Open project command
        if (args.length === 0) {
          output = ["open: missing project number"]
          isError = true
          break
        }

        const projectNumber = args[0]

        switch (projectNumber) {
          case "1":
            output = [
              "Opening Personal Portfolio project...",
              "",
              "Project: Personal Portfolio",
              "----------------",
              "Description: A modern portfolio website built with Next.js and Tailwind CSS",
              "featuring a macOS-inspired UI. The site includes interactive elements and",
              "smooth animations.",
              "",
              "Features:",
              "• macOS-inspired user interface with window management",
              "• Interactive desktop environment with draggable windows",
              "• Smooth animations and transitions",
              "• Responsive design for all devices",
              "• Dark/light mode support",
              "",
              "Technologies:",
              "• Next.js, TypeScript, Tailwind CSS, Framer Motion",
              "",
              "GitHub: https://github.com/iamkavy47/portfolio",
              "Live URL: https://iamkavy47.vercel.app",
              "",
              "Note: In a real terminal, this would open the project in your browser.",
            ]
            break

          case "2":
            output = [
              "Opening Codestorm Website project...",
              "",
              "Project: Codestorm Website",
              "----------------",
              "Description: Codestorm is a National level 36 hours Hackathon conducted by",
              "Chancellor Brigade in Mandsaur University. Built with Next.js, TypeScript,",
              "and Aceternity UI.",
              "",
              "Features:",
              "• Event information and registration system",
              "• Team formation and management",
              "• Schedule and timeline display",
              "• Participant dashboard",
              "• Responsive design for all devices",
              "",
              "Technologies:",
              "• Next.js, TypeScript, Aceternity UI, Tailwind CSS",
              "",
              "GitHub: https://github.com/iamkavy47/codestorm",
              "Live URL: https://mufests.com",
              "",
              "Note: In a real terminal, this would open the project in your browser.",
            ]
            break

          default:
            output = [`open: project ${projectNumber} not found`]
            isError = true
        }
        break

      case "hostname":
        // Print hostname
        output = ["macbook-pro"]
        break

      case "rm":
        // Remove files
        if (args.length === 0) {
          output = ["rm: missing operand"]
          isError = true
          break
        }

        const pathToRemove = args[0]
        const isRecursive = args.includes("-r") || args.includes("-rf")

        // Get the node to remove
        const nodeToRemove = getNodeAtPath(pathToRemove)

        if (!nodeToRemove) {
          output = [`rm: ${pathToRemove}: No such file or directory`]
          isError = true
          break
        }

        if (nodeToRemove.type === "directory" && !isRecursive) {
          output = [`rm: ${pathToRemove}: is a directory`]
          isError = true
          break
        }

        // Get parent directory
        const parentPath = pathToRemove.split("/").slice(0, -1).join("/") || "/"
        const fileName = pathToRemove.split("/").pop() || ""
        const parentNode = getNodeAtPath(parentPath)

        if (!parentNode || parentNode.type !== "directory" || !parentNode.children) {
          output = [`rm: cannot remove '${pathToRemove}'`]
          isError = true
          break
        }

        // Remove the file/directory
        setFileSystem((prevFileSystem) => {
          const newFileSystem = { ...prevFileSystem }

          // Navigate to parent directory
          let current = newFileSystem
          const pathParts = parentPath === "/" ? [] : parentPath.split("/").filter(Boolean)

          for (const part of pathParts) {
            if (current.children && current.children[part]) {
              current = current.children[part]
            }
          }

          // Remove the file/directory
          if (current.children && current.children[fileName]) {
            const newChildren = { ...current.children }
            delete newChildren[fileName]
            current.children = newChildren
          }

          return newFileSystem
        })

        output = [""]
        break

      case "man":
        // Manual pages
        if (args.length === 0) {
          output = ["What manual page do you want?"]
          isError = true
          break
        }

        const command = args[0]

        switch (command) {
          case "ls":
            output = [
              "LS(1)                    BSD General Commands Manual                   LS(1)",
              "",
              "NAME",
              "     ls -- list directory contents",
              "",
              "SYNOPSIS",
              "     ls [-a] [-l] [file ...]",
              "",
              "DESCRIPTION",
              "     For each operand that names a file of a type other than directory, ls",
              "     displays its name as well as any requested, associated information.",
              "     For each operand that names a file of type directory, ls displays the names",
              "     of files contained within that directory, as well as any requested, associated",
              "     information.",
              "",
              "     The following options are available:",
              "",
              "     -a    Include directory entries whose names begin with a dot (.).",
              "     -l    (The lowercase letter ``ell''.)  List in long format.",
            ]
            break

          case "cd":
            output = [
              "CD(1)                    BSD General Commands Manual                   CD(1)",
              "",
              "NAME",
              "     cd -- change the working directory",
              "",
              "SYNOPSIS",
              "     cd [directory]",
              "",
              "DESCRIPTION",
              "     The cd utility changes the working directory of the current shell execution",
              "     environment.",
              "",
              "     The following operands are supported:",
              "",
              "     directory  An absolute or relative pathname of the directory that becomes the new",
              "                working directory. If directory is not specified, the user's home directory",
              "                is used.",
            ]
            break

          default:
            output = [`No manual entry for ${command}`]
            isError = true
        }
        break

      case "history":
        // Command history
        output = activeTab.commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`)
        break

      case "help":
        // Help command
        output = [
          "╭───────────────────────────────────────────────╮",
          "│             Terminal Commands Help             │",
          "╰───────────────────────────────────────────────╯",
          "",
          "File System Commands:",
          "  ls       - List directory contents (options: -a, -l)",
          "  cd       - Change directory (usage: cd [directory])",
          "  pwd      - Print working directory",
          "  cat      - Concatenate and print files (usage: cat [file])",
          "  mkdir    - Make directories (usage: mkdir [directory])",
          "  touch    - Create empty files (usage: touch [file])",
          "  rm       - Remove files or directories (usage: rm [-r] [path])",
          "",
          "System Commands:",
          "  clear    - Clear the terminal screen",
          "  date     - Display the current date and time",
          "  whoami   - Display user information",
          "  hostname - Print system hostname",
          "  history  - Show command history",
          "  man      - Display manual pages (usage: man [command])",
          "  echo     - Display a line of text",
          "",
          "Personal Commands:",
          "  about    - Display information about me",
          "  projects - List my portfolio projects",
          "  skills   - Display my technical skills",
          "  open [n] - View details about project number [n]",
          "",
          "Type 'man [command]' for more detailed information on a command.",
        ]
        break

      default:
        output = [`zsh: command not found: ${cmd}`]
        isError = true
    }

    // Update terminal history
    updateActiveTab((tab) => ({
      ...tab,
      history: [
        ...tab.history,
        {
          command: trimmedCommand,
          output,
          isError,
          workingDirectory: getCurrentPath(tab),
        },
      ],
      commandHistory: updatedCommandHistory,
      historyIndex: -1,
      currentCommand: "",
      cursorPosition: 0,
    }))
  }

  // Handle key events
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const activeTab = getActiveTab()
    if (!activeTab) return

    // Handle special keys
    switch (e.key) {
      case "Enter":
        e.preventDefault()
        executeCommand(activeTab.currentCommand)
        break

      case "ArrowUp":
        e.preventDefault()
        if (activeTab.commandHistory.length > 0) {
          const newIndex =
            activeTab.historyIndex < activeTab.commandHistory.length - 1
              ? activeTab.historyIndex + 1
              : activeTab.commandHistory.length - 1

          updateActiveTab((tab) => ({
            ...tab,
            historyIndex: newIndex,
            currentCommand: tab.commandHistory[tab.commandHistory.length - 1 - newIndex] || "",
            cursorPosition: tab.commandHistory[tab.commandHistory.length - 1 - newIndex]?.length || 0,
          }))
        }
        break

      case "ArrowDown":
        e.preventDefault()
        if (activeTab.historyIndex > 0) {
          const newIndex = activeTab.historyIndex - 1

          updateActiveTab((tab) => ({
            ...tab,
            historyIndex: newIndex,
            currentCommand: tab.commandHistory[tab.commandHistory.length - 1 - newIndex] || "",
            cursorPosition: tab.commandHistory[tab.commandHistory.length - 1 - newIndex]?.length || 0,
          }))
        } else if (activeTab.historyIndex === 0) {
          updateActiveTab((tab) => ({
            ...tab,
            historyIndex: -1,
            currentCommand: "",
            cursorPosition: 0,
          }))
        }
        break

      case "ArrowLeft":
        if (activeTab.cursorPosition > 0) {
          updateActiveTab((tab) => ({
            ...tab,
            cursorPosition: tab.cursorPosition - 1,
          }))
        }
        break

      case "ArrowRight":
        if (activeTab.cursorPosition < activeTab.currentCommand.length) {
          updateActiveTab((tab) => ({
            ...tab,
            cursorPosition: tab.cursorPosition + 1,
          }))
        }
        break

      case "Home":
        e.preventDefault()
        updateActiveTab((tab) => ({
          ...tab,
          cursorPosition: 0,
        }))
        break

      case "End":
        e.preventDefault()
        updateActiveTab((tab) => ({
          ...tab,
          cursorPosition: tab.currentCommand.length,
        }))
        break

      case "Tab":
        e.preventDefault()
        // Simple tab completion
        const command = activeTab.currentCommand
        const lastWord = command.split(" ").pop() || ""

        if (lastWord) {
          const currentDir = getCurrentDirectoryNode(activeTab)
          if (currentDir && currentDir.children) {
            const matches = Object.keys(currentDir.children).filter((name) => name.startsWith(lastWord))

            if (matches.length === 1) {
              // Complete the word
              const newCommand = command.substring(0, command.length - lastWord.length) + matches[0]
              updateActiveTab((tab) => ({
                ...tab,
                currentCommand: newCommand,
                cursorPosition: newCommand.length,
              }))
            }
          }
        }
        break

      case "c":
        // Ctrl+C - cancel current command
        if (e.ctrlKey) {
          e.preventDefault()
          updateActiveTab((tab) => ({
            ...tab,
            history: [
              ...tab.history,
              {
                command: tab.currentCommand,
                output: ["^C"],
                workingDirectory: getCurrentPath(tab),
              },
            ],
            currentCommand: "",
            cursorPosition: 0,
          }))
        }
        break

      case "l":
        // Ctrl+L - clear screen
        if (e.ctrlKey) {
          e.preventDefault()
          updateActiveTab((tab) => ({
            ...tab,
            history: [
              {
                command: "",
                output: [""],
                workingDirectory: getCurrentPath(tab),
              },
            ],
            currentCommand: "",
            cursorPosition: 0,
          }))
        }
        break
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    updateActiveTab((tab) => ({
      ...tab,
      currentCommand: value,
      cursorPosition: e.target.selectionStart || value.length,
    }))
  }

  // Get prompt string
  const getPrompt = (tab: TerminalTab): string => {
    const username = "kavy"
    const hostname = "macbook-pro"
    const path = getCurrentPath(tab).replace(/^\/Users\/user/, "~")

    return `${username}@${hostname} ${path} % `
  }

  // Render terminal content
  const renderTerminalContent = () => {
    const activeTab = getActiveTab()
    if (!activeTab) return null

    return (
      <div className="flex flex-col">
        {activeTab.history.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.command !== "" && (
              <div className="flex">
                <span className="text-[#56C1FF]">
                  {getPrompt({ ...activeTab, currentDirectory: entry.workingDirectory.split("/").filter(Boolean) })}
                </span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output.map((line, j) => (
              <div key={j} className={`${entry.isError ? "text-[#FF6B6B]" : ""} whitespace-pre-wrap break-all`}>
                {line}
              </div>
            ))}
          </div>
        ))}

        <div className="flex relative">
          <span className="text-[#56C1FF]">{getPrompt(activeTab)}</span>
          <span className="relative flex-1">
            <span>{activeTab.currentCommand}</span>
            <span
              className="absolute top-0 left-0 h-full w-px bg-white animate-pulse"
              style={{
                left: `${activeTab.cursorPosition}ch`,
                animation: "pulse 1s infinite",
              }}
            ></span>
          </span>
          <textarea
            ref={inputRef}
            value={activeTab.currentCommand}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="absolute top-0 left-0 w-full h-full opacity-0 outline-none"
            autoFocus
          />
        </div>
      </div>
    )
  }

  // Render settings panel
  const renderSettings = () => {
    return (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-4">
        <div className="bg-[#F5F5F7]/95 dark:bg-[#323232]/95 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Terminal Preferences</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={14} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appearance</label>
              <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-lg flex">
                <button
                  onClick={() => setTheme("default")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                    theme === "default"
                      ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                    theme === "dark"
                      ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                    theme === "light"
                      ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Light
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</label>
                <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10px</span>
                <span>20px</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Background Opacity</label>
                <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(Number.parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="'SF Mono', monospace">SF Mono</option>
                <option value="Menlo, monospace">Menlo</option>
                <option value="Monaco, monospace">Monaco</option>
                <option value="'Courier New', monospace">Courier New</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get terminal background color based on theme
  const getTerminalBackground = () => {
    switch (theme) {
      case "dark":
        return `rgba(0, 0, 0, ${opacity})`
      case "light":
        return `rgba(255, 255, 255, ${opacity})`
      default:
        return `rgba(28, 28, 30, ${opacity})`
    }
  }

  // Get terminal text color based on theme
  const getTerminalTextColor = () => {
    switch (theme) {
      case "dark":
        return "text-white"
      case "light":
        return "text-black"
      default:
        return "text-white"
    }
  }

  return (
    <Window title="Terminal" onClose={onClose} onFocus={onFocus} initialSize={{ width: 800, height: 500 }}>
      <div className="flex flex-col h-full">
        {/* Terminal toolbar */}
        <div className="flex items-center px-2 py-1 bg-[#E5E5E5] dark:bg-[#3c3c3c] border-b border-[#D1D1D1] dark:border-[#1A1A1A]">
          <div className="flex space-x-0.5 mr-4">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center px-3 py-1.5 text-sm rounded-t-lg transition-colors ${
                  tab.id === activeTabId
                    ? "bg-[#FFFFFF] dark:bg-[#1E1E1E] text-gray-800 dark:text-white border-t border-l border-r border-[#D1D1D1] dark:border-[#444444]"
                    : "bg-[#F2F2F2] dark:bg-[#3A3A3A] text-gray-600 dark:text-gray-300 hover:bg-[#E8E8E8] dark:hover:bg-[#444444]"
                }`}
              >
                <button className="mr-2 truncate max-w-[120px]" onClick={() => setActiveTabId(tab.id)}>
                  {tab.title}
                </button>
                {tabs.length > 1 && (
                  <button
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 w-4 h-4 flex items-center justify-center"
                    onClick={() => closeTab(tab.id)}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            <button
              className="flex items-center justify-center w-6 h-6 bg-[#F2F2F2] dark:bg-[#3A3A3A] text-gray-600 dark:text-gray-300 hover:bg-[#E8E8E8] dark:hover:bg-[#444444] rounded-md ml-1"
              onClick={addTab}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex-1"></div>

          <div className="flex space-x-2">
            <button
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-[#E8E8E8] dark:hover:bg-[#444444]"
              onClick={() => setShowSettings(true)}
            >
              <Settings size={14} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-[#E8E8E8] dark:hover:bg-[#444444]">
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className={`flex-1 p-3 overflow-auto font-mono ${getTerminalTextColor()}`}
          style={{
            backgroundColor: getTerminalBackground(),
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            lineHeight: "1.3",
          }}
        >
          {renderTerminalContent()}
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSettings()}
          </motion.div>
        )}
      </AnimatePresence>
    </Window>
  )
}

