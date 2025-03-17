"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => void
}

export default function UploadDialog({ open, onClose, onUpload }: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
      setPreview(null)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreview(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Wallpaper</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!preview ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Drag and drop an image here, or click to select a file</p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          ) : (
            <div className="relative">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPreview(null)
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile}>
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

