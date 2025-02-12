import { useState } from "react"
import Window from "./Window"
import { File, Plus, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FinderProps {
  onClose: () => void
  onFocus: () => void
  folderName: string
}

export default function Finder({ onClose, onFocus, folderName }: FinderProps) {
  const [file, setFile] = useState<string | null>(null)

  const handleCreateFile = () => {
    if (!file) {
      const fileName = prompt("Enter file name:")
      if (fileName) {
        setFile(fileName)
      }
    }
  }

  return (
    <Window
      title={`Finder - ${folderName}`}
      onClose={onClose}
      onFocus={onFocus}
      initialSize={{ width: 600, height: 400 }}
    >
      <div className="flex flex-col h-full bg-gray-100">
        <div className="flex items-center justify-between p-2 bg-gray-200 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleCreateFile} disabled={!!file}>
              <Plus className="w-4 h-4 mr-1" />
              New File
            </Button>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center">
              <Folder className="w-16 h-16 text-blue-500" />
              <span className="mt-1 text-sm">{folderName}</span>
            </div>
            {file && (
              <div className="flex flex-col items-center justify-center">
                <File className="w-16 h-16 text-gray-500" />
                <span className="mt-1 text-sm">{file}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Window>
  )
}

