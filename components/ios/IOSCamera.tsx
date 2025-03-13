"use client"

import { useRef, useState, useEffect } from "react"
import { ArrowLeft, CameraIcon as FlipCamera, Image } from "lucide-react"
import { motion } from "framer-motion"

interface IOSCameraProps {
  onClose: () => void
}

export default function IOSCamera({ onClose }: IOSCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment")

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraFacing },
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
            setIsCameraOn(true)
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraFacing])

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL("image/png")
        setCapturedImage(imageData)
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const switchCamera = () => {
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"))
  }

  return (
    <div className="h-full w-full bg-black flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 relative">
        {capturedImage ? (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="p-6 flex items-center justify-between">
        <button className="text-white">
          <Image size={28} />
        </button>

        {capturedImage ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={retakePhoto}
            className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center"
          >
            <span className="text-white text-sm">Retake</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={takePhoto}
            className="w-16 h-16 rounded-full border-4 border-white"
          />
        )}

        <button onClick={switchCamera} className="text-white">
          <FlipCamera size={28} />
        </button>
      </div>
    </div>
  )
}

