"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDropzone } from "react-dropzone"
import { Image, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => void
}

export default function UploadDialog({ open, onClose, onUpload }: UploadDialogProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onUpload(file)
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setPreview(null)
        onClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Wallpaper</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={cn(
            "mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          )}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative aspect-video">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="rounded-md object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                {isDragActive ? (
                  <Image className="h-10 w-10 text-blue-500" />
                ) : (
                  <Upload className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the image here" : "Drag and drop your image here"}
                </p>
                <p className="text-xs text-gray-500">or click to select a file</p>
              </div>
              <div className="text-xs text-gray-500">Supports: JPG, PNG, WebP</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

