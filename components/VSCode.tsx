"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, GitBranch, Bug, Settings, Files, ExpandIcon as Extensions, ChevronRight, ChevronDown, Folder, FileIcon, X, MoreHorizontal, Play, Bell, Users, AlertCircle, Code, RefreshCw, Plus, Save, Star } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VSCodeProps {
  onClose: () => void
  onFocus: () => void
  initialSize?: { width: number; height: number }
}

interface FileTreeItem {
  name: string
  type: "file" | "folder"
  children?: FileTreeItem[]
  content?: string
  language?: string
}

interface OpenFile {
  path: string
  isDirty: boolean
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
            name: "components",
            type: "folder",
            children: [
              {
                name: "Button.tsx",
                type: "file",
                language: "typescript",
                content: `import React from 'react';

interface ButtonProps {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800';
  const sizeClass = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  return (
    <button
      type="button"
      className={\`rounded font-medium \${mode} \${sizeClass[size]}\`}
      {...props}
    >
      {label}
    </button>
  );
};`,
              },
              {
                name: "Card.tsx",
                type: "file",
                language: "typescript",
                content: `import React from 'react';

interface CardProps {
  title: string;
  description: string;
  image?: string;
  children?: React.ReactNode;
}

export const Card = ({
  title,
  description,
  image,
  children,
}: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image && (
        <img 
          src={image || "/placeholder.svg"} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
};`,
              },
            ],
          },
          {
            name: "App.tsx",
            type: "file",
            language: "typescript",
            content: `import React from 'react';
import { Button } from './components/Button';
import { Card } from './components/Card';

function App() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">React Component Demo</h1>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button label="Default Button" />
          <Button primary label="Primary Button" />
          <Button size="small" label="Small Button" />
          <Button primary size="large" label="Large Primary" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Getting Started"
            description="Learn how to use these components in your project."
            image="/placeholder.svg?height=200&width=400&text=Getting+Started"
          >
            <Button primary label="Learn More" />
          </Card>
          <Card
            title="Advanced Usage"
            description="Discover advanced patterns and best practices."
            image="/placeholder.svg?height=200&width=400&text=Advanced+Usage"
          >
            <Button label="View Documentation" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;`,
          },
          {
            name: "index.tsx",
            type: "file",
            language: "typescript",
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
          },
          {
            name: "styles.css",
            type: "file",
            language: "css",
            content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafb;
  color: #111827;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
          },
        ],
      },
      {
        name: "public",
        type: "folder",
        children: [
          {
            name: "index.html",
            type: "file",
            language: "html",
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
          },
          {
            name: "manifest.json",
            type: "file",
            language: "json",
            content: `{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}`,
          },
        ],
      },
      {
        name: "package.json",
        type: "file",
        language: "json",
        content: `{
  "name": "react-component-demo",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.3.0",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11"
  }
}`,
      },
      {
        name: "tsconfig.json",
        type: "file",
        language: "json",
        content: `{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}`,
      },
      {
        name: "README.md",
        type: "file",
        language: "markdown",
        content: `# React Component Demo

This project demonstrates various React components with TypeScript and Tailwind CSS.

## Available Scripts

In the project directory, you can run:

### \`npm start\`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### \`npm test\`

Launches the test runner in the interactive watch mode.

### \`npm run build\`

Builds the app for production to the \`build\` folder.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).`,
      },
    ],
  },
]

// Language to file icon color mapping
const languageColors: Record<string, string> = {
  typescript: "#3178c6",
  javascript: "#f1e05a",
  html: "#e34c26",
  css: "#563d7c",
  json: "#8bc34a",
  markdown: "#083fa1",
}

// Language to syntax highlighting (simplified)
const getLanguageClass = (language?: string) => {
  switch (language) {
    case "typescript":
    case "javascript":
      return "language-javascript"
    case "html":
      return "language-html"
    case "css":
      return "language-css"
    case "json":
      return "language-json"
    case "markdown":
      return "language-markdown"
    default:
      return "language-plaintext"
  }
}

// Get file icon color based on file extension
const getFileIconColor = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()

  if (extension === "tsx" || extension === "ts") return languageColors.typescript
  if (extension === "jsx" || extension === "js") return languageColors.javascript
  if (extension === "html") return languageColors.html
  if (extension === "css") return languageColors.css
  if (extension === "json") return languageColors.json
  if (extension === "md") return languageColors.markdown

  return "#75beff" // Default color
}

// Window component
function Window({
  children,
  title,
  onClose,
  onFocus,
}: {
  children: React.ReactNode
  title: string
  onClose: () => void
  onFocus: () => void
}) {
  return (
    <div
      className="flex flex-col border border-[#1e1e1e] shadow-xl rounded-lg overflow-hidden w-full h-full"
      onClick={onFocus}
    >
      {/* Content */}
      {children}
    </div>
  )
}

export default function VSCode({ onClose, onFocus, initialSize = { width: 1200, height: 800 } }: VSCodeProps) {
  const [fileTree, setFileTree] = useState<FileTreeItem[]>(initialFileTree)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["project", "project/src", "project/src/components", "project/public"]),
  )
  const [activeFile, setActiveFile] = useState<string | null>("project/src/App.tsx")
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([
    { path: "project/src/App.tsx", isDirty: false },
    { path: "project/src/components/Button.tsx", isDirty: false },
    { path: "project/src/styles.css", isDirty: false },
  ])
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [activeSidebarItem, setActiveSidebarItem] = useState("Explorer")
  const [problems, setProblems] = useState<string[]>([])
  const [output, setOutput] = useState<string[]>([])
  const [terminal, setTerminal] = useState<string[]>([
    "PS C:\\Users\\user\\project> npm start",
    "> react-component-demo@0.1.0 start",
    "> react-scripts start",
    "",
    "Starting the development server...",
    "Compiled successfully!",
    "",
    "You can now view react-component-demo in the browser.",
    "",
    "  Local:            http://localhost:3000",
    "  On Your Network:  http://192.168.1.5:3000",
    "",
    "Note that the development build is not optimized.",
    "To create a production build, use npm run build.",
    "",
    "webpack compiled successfully",
  ])
  const [activePanel, setActivePanel] = useState<string>("terminal")
  const [showPanel, setShowPanel] = useState<boolean>(true)
  const [panelHeight, setPanelHeight] = useState<number>(200)
  const [sidebarWidth, setSidebarWidth] = useState<number>(300)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<{ file: string; line: number; content: string }[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [showMinimap, setShowMinimap] = useState<boolean>(true)
  const [editorFontSize, setEditorFontSize] = useState<number>(14)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const sidebarResizeRef = useRef<HTMLDivElement>(null)
  const panelResizeRef = useRef<HTMLDivElement>(null)

  // Initialize file contents from file tree
  useEffect(() => {
    const extractContents = (items: FileTreeItem[], path = "") => {
      items.forEach((item) => {
        const itemPath = `${path}${item.name}`
        if (item.type === "file" && item.content) {
          setFileContents((prev) => ({ ...prev, [itemPath]: item.content || "" }))
        }
        if (item.children) {
          extractContents(item.children, `${itemPath}/`)
        }
      })
    }

    extractContents(fileTree)
  }, [])

  // Get file language from file tree
  const getFileLanguage = (path: string): string | undefined => {
    const findLanguage = (items: FileTreeItem[], currentPath = ""): string | undefined => {
      for (const item of items) {
        const itemPath = `${currentPath}${item.name}`
        if (item.type === "file" && itemPath === path) {
          return item.language
        }
        if (item.children) {
          const found = findLanguage(item.children, `${itemPath}/`)
          if (found) return found
        }
      }
      return undefined
    }

    return findLanguage(fileTree)
  }

  const activityBarItems = [
    { icon: Files, label: "Explorer", id: "Explorer" },
    { icon: Search, label: "Search", id: "Search" },
    { icon: GitBranch, label: "Source Control", id: "SourceControl" },
    { icon: Bug, label: "Run and Debug", id: "Debug" },
    { icon: Extensions, label: "Extensions", id: "Extensions" },
    { icon: Users, label: "Accounts", id: "Accounts" },
  ]

  const bottomActivityBarItems = [{ icon: Settings, label: "Settings", id: "Settings" }]

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

  const openFile = (path: string) => {
    setActiveFile(path)

    // Add to open files if not already open
    if (!openFiles.some((file) => file.path === path)) {
      setOpenFiles((prev) => [...prev, { path, isDirty: false }])
    }
  }

  const closeFile = (path: string, e?: React.MouseEvent) => {
    e?.stopPropagation()

    setOpenFiles((prev) => prev.filter((file) => file.path !== path))

    // If we're closing the active file, activate another file
    if (activeFile === path) {
      const remainingFiles = openFiles.filter((file) => file.path !== path)
      if (remainingFiles.length > 0) {
        setActiveFile(remainingFiles[0].path)
      } else {
        setActiveFile(null)
      }
    }
  }

  const handleFileContentChange = (content: string) => {
    if (activeFile) {
      setFileContents((prev) => ({ ...prev, [activeFile]: content }))

      // Mark file as dirty
      setOpenFiles((prev) =>
        prev.map((file) =>
          file.path === activeFile ? { ...file, isDirty: content !== fileContents[activeFile] } : file,
        ),
      )
    }
  }

  const saveFile = (path: string) => {
    // In a real app, this would save to the server
    // Here we just mark the file as not dirty
    setOpenFiles((prev) => prev.map((file) => (file.path === path ? { ...file, isDirty: false } : file)))
  }

  const renderFileTree = (items: FileTreeItem[], path = "") => {
    return items.map((item) => {
      const itemPath = `${path}${item.name}`
      if (item.type === "folder") {
        const isExpanded = expandedFolders.has(itemPath)
        return (
          <div key={itemPath} className="select-none">
            <div
              className={`flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer rounded ${
                isExpanded ? "bg-[#37373d]" : ""
              }`}
              onClick={() => toggleFolder(itemPath)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />
              )}
              <Folder className="w-4 h-4 mr-2 text-[#dcb67a] flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </div>
            {isExpanded && item.children && <div className="ml-4">{renderFileTree(item.children, `${itemPath}/`)}</div>}
          </div>
        )
      } else {
        const fileIconColor = getFileIconColor(item.name)
        return (
          <div
            key={itemPath}
            className={`flex items-center py-1 px-2 hover:bg-[#2a2d2e] cursor-pointer rounded ${
              activeFile === itemPath ? "bg-[#37373d]" : ""
            }`}
            onClick={() => openFile(itemPath)}
          >
            <FileIcon className={`w-4 h-4 mr-2 flex-shrink-0`} style={{ color: fileIconColor }} />
            <span className="truncate">{item.name}</span>
          </div>
        )
      }
    })
  }

  const renderExplorerView = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 text-xs uppercase font-semibold flex items-center justify-between">
        <span>Explorer: project</span>
        <div className="flex items-center">
          <button className="p-1 hover:bg-[#2a2d2e] rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-2 py-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <ChevronDown className="w-4 h-4 mr-1" />
            <span className="text-xs font-semibold uppercase">Open Editors</span>
          </div>
          <div className="flex items-center">
            <button className="p-1 hover:bg-[#2a2d2e] rounded">
              <X className="w-3 h-3" />
            </button>
            <button className="p-1 hover:bg-[#2a2d2e] rounded">
              <Save className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="ml-2">
          {openFiles.map((file) => {
            const fileName = file.path.split("/").pop() || ""
            const fileIconColor = getFileIconColor(fileName)

            return (
              <div
                key={file.path}
                className={`flex items-center py-1 px-2 text-sm hover:bg-[#2a2d2e] cursor-pointer rounded group ${
                  activeFile === file.path ? "bg-[#37373d]" : ""
                }`}
                onClick={() => setActiveFile(file.path)}
              >
                <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: fileIconColor }} />
                <span className="truncate flex-1">
                  {fileName}
                  {file.isDirty ? " •" : ""}
                </span>
                <button
                  className="p-1 hover:bg-[#3c3c3c] rounded opacity-0 group-hover:opacity-100"
                  onClick={(e) => closeFile(file.path, e)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-2 py-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <ChevronDown className="w-4 h-4 mr-1" />
            <span className="text-xs font-semibold uppercase">project</span>
          </div>
          <div className="flex items-center">
            <button className="p-1 hover:bg-[#2a2d2e] rounded">
              <Plus className="w-3 h-3" />
            </button>
            <button className="p-1 hover:bg-[#2a2d2e] rounded">
              <RefreshCw className="w-3 h-3" />
            </button>
            <button className="p-1 hover:bg-[#2a2d2e] rounded">
              <Collapse className="w-3 h-3" />
            </button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="ml-2">{renderFileTree(fileTree)}</div>
        </ScrollArea>
      </div>

      <div className="px-2 py-1 mt-auto">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-1" />
            <span className="text-xs font-semibold uppercase">Outline</span>
          </div>
        </div>
      </div>

      <div className="px-2 py-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-1" />
            <span className="text-xs font-semibold uppercase">Timeline</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSearchView = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 text-xs uppercase font-semibold">
        <span>Search</span>
      </div>

      <div className="px-4 py-2">
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#3c3c3c] text-[#cccccc] rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#007fd4]"
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#cccccc]"
            onClick={() => {
              setIsSearching(true)
              // Simulate search results
              setTimeout(() => {
                setSearchResults([
                  { file: "project/src/App.tsx", line: 5, content: "import { Button } from './components/Button';" },
                  { file: "project/src/components/Button.tsx", line: 1, content: "import React from 'react';" },
                  { file: "  line: 1, content: \"import React from 'react';" },
                  { file: "project/src/components/Card.tsx", line: 1, content: "import React from 'react';" },
                  {
                    file: "project/README.md",
                    line: 3,
                    content: "This project demonstrates various React components with TypeScript and Tailwind CSS.",
                  },
                ])
                setIsSearching(false)
              }, 500)
            }}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center text-xs mb-4">
          <button className="px-2 py-1 hover:bg-[#2a2d2e] rounded flex items-center">
            <ChevronDown className="w-3 h-3 mr-1" />
            <span>Replace</span>
          </button>
          <button className="px-2 py-1 hover:bg-[#2a2d2e] rounded flex items-center ml-2">
            <ChevronDown className="w-3 h-3 mr-1" />
            <span>.*</span>
          </button>
          <button className="px-2 py-1 hover:bg-[#2a2d2e] rounded flex items-center ml-2">
            <ChevronDown className="w-3 h-3 mr-1" />
            <span>Aa</span>
          </button>
          <button className="px-2 py-1 hover:bg-[#2a2d2e] rounded ml-auto">
            <MoreHorizontal className="w-3 h-3" />
          </button>
        </div>

        <div className="text-xs text-[#cccccc] mb-2">
          {isSearching ? (
            <div className="flex items-center">
              <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
              <span>Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div>{searchResults.length} results in 3 files</div>
          ) : searchQuery ? (
            <div>No results found</div>
          ) : null}
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {searchResults.map((result, index) => (
            <div key={index} className="mb-2">
              <div
                className="flex items-center py-1 hover:bg-[#2a2d2e] cursor-pointer"
                onClick={() => openFile(result.file)}
              >
                <FileIcon
                  className="w-4 h-4 mr-2"
                  style={{ color: getFileIconColor(result.file.split("/").pop() || "") }}
                />
                <span className="text-sm">{result.file.split("/").pop()}</span>
                <span className="text-xs text-[#8c8c8c] ml-2">{result.file}</span>
              </div>
              <div
                className="ml-6 py-1 px-2 text-xs bg-[#2a2d2e] rounded cursor-pointer hover:bg-[#3c3c3c]"
                onClick={() => openFile(result.file)}
              >
                <span className="text-[#8c8c8c] mr-2">{result.line}:</span>
                <span>{result.content}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )

  const renderSourceControlView = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 text-xs uppercase font-semibold flex items-center justify-between">
        <span>Source Control: Git</span>
        <div className="flex items-center">
          <button className="p-1 hover:bg-[#2a2d2e] rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-2">
        <input
          type="text"
          placeholder="Message (Ctrl+Enter to commit)"
          className="w-full bg-[#3c3c3c] text-[#cccccc] rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#007fd4] mb-2"
        />

        <div className="flex items-center mb-4">
          <button className="px-3 py-1 bg-[#3c3c3c] hover:bg-[#4c4c4c] rounded text-sm flex-1">Commit</button>
          <button className="p-1 hover:bg-[#2a2d2e] rounded ml-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <ChevronDown className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold uppercase">Changes</span>
            </div>
            <div className="flex items-center">
              <button className="p-1 hover:bg-[#2a2d2e] rounded">
                <Plus className="w-3 h-3" />
              </button>
              <button className="p-1 hover:bg-[#2a2d2e] rounded">
                <RefreshCw className="w-3 h-3" />
              </button>
              <button className="p-1 hover:bg-[#2a2d2e] rounded">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="ml-2">
            <div className="flex items-center py-1 px-2 text-sm hover:bg-[#2a2d2e] cursor-pointer rounded group">
              <FileIcon className="w-4 h-4 mr-2 text-[#75beff]" />
              <span className="truncate flex-1">App.tsx</span>
              <span className="text-xs bg-[#3c3c3c] px-1 rounded">M</span>
            </div>
            <div className="flex items-center py-1 px-2 text-sm hover:bg-[#2a2d2e] cursor-pointer rounded group">
              <FileIcon className="w-4 h-4 mr-2 text-[#75beff]" />
              <span className="truncate flex-1">Button.tsx</span>
              <span className="text-xs bg-[#3c3c3c] px-1 rounded">M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDebugView = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 text-xs uppercase font-semibold">
        <span>Run and Debug</span>
      </div>

      <div className="px-4 py-6 flex flex-col items-center justify-center">
        <Play className="w-16 h-16 text-[#75beff] mb-4" />
        <h3 className="text-lg font-semibold mb-2">Run and Debug</h3>
        <p className="text-sm text-[#cccccc] text-center mb-4">To customize Run and Debug create a launch.json file.</p>
        <button className="px-3 py-1 bg-[#3c3c3c] hover:bg-[#4c4c4c] rounded text-sm">Create a launch.json file</button>
      </div>
    </div>
  )

  const renderExtensionsView = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 text-xs uppercase font-semibold">
        <span>Extensions</span>
      </div>

      <div className="px-4 py-2">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Extensions in Marketplace"
            className="w-full bg-[#3c3c3c] text-[#cccccc] rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#007fd4]"
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#cccccc]" />
        </div>

        <div className="flex items-center mb-4 text-sm">
          <button className="px-2 py-1 hover:bg-[#2a2d2e] rounded">Installed</button>
          <button className="px-2 py-1 hover:bg-[#2a2d2e] rounded">Popular</button>
          <button className="px-2 py-1 hover:bg-[#2a2d2e] rounded">Recommended</button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
              <div className="flex items-center mb-1">
                <div className="w-8 h-8 bg-[#3c3c3c] rounded mr-2 flex items-center justify-center">
                  <Code className="w-5 h-5 text-[#75beff]" />
                </div>
                <div>
                  <div className="text-sm font-semibold">ESLint</div>
                  <div className="text-xs text-[#8c8c8c]">Microsoft</div>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-[#ff8e00] mr-1" />
                    <span className="text-xs">4.8</span>
                  </div>
                  <div className="text-xs text-[#8c8c8c]">17M installs</div>
                </div>
              </div>
              <p className="text-xs text-[#cccccc]">Integrates ESLint JavaScript into VS Code.</p>
            </div>

            <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
              <div className="flex items-center mb-1">
                <div className="w-8 h-8 bg-[#3c3c3c] rounded mr-2 flex items-center justify-center">
                  <Code className="w-5 h-5 text-[#75beff]" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Prettier - Code formatter</div>
                  <div className="text-xs text-[#8c8c8c]">Prettier</div>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-[#ff8e00] mr-1" />
                    <span className="text-xs">4.9</span>
                  </div>
                  <div className="text-xs text-[#8c8c8c]">14M installs</div>
                </div>
              </div>
              <p className="text-xs text-[#cccccc]">Code formatter using prettier</p>
            </div>

            <div className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
              <div className="flex items-center mb-1">
                <div className="w-8 h-8 bg-[#3c3c3c] rounded mr-2 flex items-center justify-center">
                  <Code className="w-5 h-5 text-[#75beff]" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Tailwind CSS IntelliSense</div>
                  <div className="text-xs text-[#8c8c8c]">Tailwind Labs</div>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-[#ff8e00] mr-1" />
                    <span className="text-xs">4.7</span>
                  </div>
                  <div className="text-xs text-[#8c8c8c]">8M installs</div>
                </div>
              </div>
              <p className="text-xs text-[#cccccc]">Intelligent Tailwind CSS tooling for VS Code</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )

  const renderSidebar = () => {
    switch (activeSidebarItem) {
      case "Explorer":
        return renderExplorerView()
      case "Search":
        return renderSearchView()
      case "SourceControl":
        return renderSourceControlView()
      case "Debug":
        return renderDebugView()
      case "Extensions":
        return renderExtensionsView()
      default:
        return renderExplorerView()
    }
  }

  const renderEditor = () => {
    if (!activeFile) {
      return (
        <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] text-[#cccccc]">
          <div className="text-center">
            <div className="text-6xl mb-4">VS Code</div>
            <div className="text-xl mb-8">Editing evolved</div>
            <div className="flex space-x-4 justify-center">
              <button className="px-4 py-2 bg-[#3c3c3c] hover:bg-[#4c4c4c] rounded">New File</button>
              <button className="px-4 py-2 bg-[#3c3c3c] hover:bg-[#4c4c4c] rounded">Open Folder</button>
            </div>
          </div>
        </div>
      )
    }

    const language = getFileLanguage(activeFile)
    const languageClass = getLanguageClass(language)

    return (
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex">
          <div className="flex-1 overflow-auto">
            <pre className={`p-4 text-[#d4d4d4] font-mono text-sm h-full ${languageClass}`}>
              <textarea
                ref={editorRef}
                className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm resize-none outline-none"
                value={fileContents[activeFile] || ""}
                onChange={(e) => handleFileContentChange(e.target.value)}
                spellCheck={false}
                style={{ fontSize: `${editorFontSize}px` }}
              />
            </pre>
          </div>

          {showMinimap && (
            <div className="w-[60px] bg-[#1e1e1e] border-l border-[#333333] overflow-hidden">
              <div className="text-[2px] text-[#8c8c8c] opacity-50 whitespace-pre-wrap p-1">
                {fileContents[activeFile]}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderPanel = () => {
    return (
      <div className="bg-[#1e1e1e] border-t border-[#333333]" style={{ height: `${panelHeight}px` }}>
        <div className="flex items-center bg-[#252526] border-b border-[#333333] h-8">
          <div className="flex items-center px-2">
            <button
              className={`px-3 py-1 text-xs ${activePanel === "problems" ? "border-t border-[#007fd4] bg-[#1e1e1e]" : "text-[#8c8c8c]"}`}
              onClick={() => setActivePanel("problems")}
            >
              Problems
            </button>
            <button
              className={`px-3 py-1 text-xs ${activePanel === "output" ? "border-t border-[#007fd4] bg-[#1e1e1e]" : "text-[#8c8c8c]"}`}
              onClick={() => setActivePanel("output")}
            >
              Output
            </button>
            <button
              className={`px-3 py-1 text-xs ${activePanel === "terminal" ? "border-t border-[#007fd4] bg-[#1e1e1e]" : "text-[#8c8c8c]"}`}
              onClick={() => setActivePanel("terminal")}
            >
              Terminal
            </button>
          </div>
          <div className="ml-auto flex items-center px-2">
            <button className="p-1 hover:bg-[#2a2d2e] rounded text-[#8c8c8c]">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-[#2a2d2e] rounded text-[#8c8c8c]" onClick={() => setShowPanel(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-32px)] overflow-auto p-2">
          {activePanel === "problems" && (
            <div className="font-mono text-xs">
              {problems.length === 0 ? (
                <div className="text-[#8c8c8c] p-2">No problems have been detected in the workspace.</div>
              ) : (
                <div>
                  {problems.map((problem, index) => (
                    <div key={index} className="flex items-start py-1">
                      <AlertCircle className="w-4 h-4 text-[#f48771] mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[#f48771]">{problem}</div>
                        <div className="text-[#8c8c8c]">src/App.tsx:10:12</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activePanel === "output" && (
            <div className="font-mono text-xs">
              {output.map((line, index) => (
                <div key={index} className="py-0.5">
                  {line}
                </div>
              ))}
            </div>
          )}

          {activePanel === "terminal" && (
            <div className="font-mono text-xs">
              {terminal.map((line, index) => (
                <div key={index} className="py-0.5">
                  {line}
                </div>
              ))}
              <div className="flex items-center text-[#8c8c8c]">
                <span className="mr-1">PS C:\Users\user\project&gt;</span>
                <span className="animate-pulse">|</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Resize handlers
  const handleSidebarResize = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startWidth = sidebarWidth

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + e.clientX - startX
      if (newWidth > 100 && newWidth < 500) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handlePanelResize = (e: React.MouseEvent) => {
    const startY = e.clientY
    const startHeight = panelHeight

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight - (e.clientY - startY)
      if (newHeight > 100 && newHeight < 500) {
        setPanelHeight(newHeight)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <Window title="Visual Studio Code" onClose={onClose} onFocus={onFocus}>
      <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc]">
        {/* Top Bar */}
        <div className="h-8 bg-[#3c3c3c] flex items-center px-4 text-sm select-none">
          <div className="flex items-center space-x-4">
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">File</span>
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">Edit</span>
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">Selection</span>
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">View</span>
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">Go</span>
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">Run</span>
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">Terminal</span>
            <span className="hover:bg-[#505050] px-1.5 py-0.5 rounded">Help</span>
          </div>
        </div>
      
      {/* Rest of the VSCode UI */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2">
            <TooltipProvider>
              {activityBarItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-12 h-12 flex items-center justify-center hover:bg-[#2a2d2e] relative ${
                        activeSidebarItem === item.id
                          ? "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-0.5 after:bg-white"
                          : ""
                      }`}
                      onClick={() => setActiveSidebarItem(item.id)}
                    >
                      <item.icon
                        className={`w-6 h-6 ${activeSidebarItem === item.id ? "text-white" : "text-[#858585]"}`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#252526] text-white border-[#333333] text-xs py-1 px-2">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ))}
              <div className="flex-1" />
              {bottomActivityBarItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-12 h-12 flex items-center justify-center hover:bg-[#2a2d2e] relative ${
                        activeSidebarItem === item.id
                          ? "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-0.5 after:bg-white"
                          : ""
                      }`}
                      onClick={() => setActiveSidebarItem(item.id)}
                    >
                      <item.icon className="w-6 h-6 text-[#858585]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#252526] text-white border-[#333333] text-xs py-1 px-2">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          {/* Sidebar */}
          <div className="bg-[#252526] overflow-hidden" style={{ width: `${sidebarWidth}px` }}>
            {renderSidebar()}
          </div>

          {/* Sidebar resize handle */}
          <div
            ref={sidebarResizeRef}
            className="w-1 bg-[#1e1e1e] hover:bg-[#007fd4] cursor-col-resize"
            onMouseDown={handleSidebarResize}
          />

          {/* Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="bg-[#2d2d2d] flex items-center h-9 overflow-x-auto">
              {openFiles.map((file) => {
                const fileName = file.path.split("/").pop() || ""
                const fileIconColor = getFileIconColor(fileName)

                return (
                  <div
                    key={file.path}
                    className={`h-full flex items-center px-3 border-t-2 ${
                      activeFile === file.path
                        ? "bg-[#1e1e1e] border-[#007fd4]"
                        : "bg-[#2d2d2d] border-transparent hover:bg-[#2a2d2e]"
                    } cursor-pointer group`}
                    onClick={() => setActiveFile(file.path)}
                  >
                    <FileIcon className="w-4 h-4 mr-2" style={{ color: fileIconColor }} />
                    <span className="text-xs">
                      {fileName}
                      {file.isDirty ? " •" : ""}
                    </span>
                    <button
                      className="ml-2 p-0.5 hover:bg-[#3c3c3c] rounded opacity-0 group-hover:opacity-100"
                      onClick={(e) => closeFile(file.path, e)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Editor */}
            {renderEditor()}

            {/* Panel resize handle */}
            {showPanel && (
              <div
                ref={panelResizeRef}
                className="h-1 bg-[#1e1e1e] hover:bg-[#007fd4] cursor-row-resize"
                onMouseDown={handlePanelResize}
              />
            )}

            {/* Panel */}
            {showPanel && renderPanel()}
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-[#007acc] flex items-center px-2 text-white text-xs">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>main</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span>Ln 1, Col 1</span>
            </div>
            <div className="flex items-center">
              <span>Spaces: 2</span>
            </div>
            <div className="flex items-center">
              <span>UTF-8</span>
            </div>
            <div className="flex items-center">
              <span>{activeFile?.split(".").pop()?.toUpperCase() || "TXT"}</span>
            </div>
            <div className="flex items-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}

// Missing Collapse icon component
function Collapse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
