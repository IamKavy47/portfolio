"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { ArrowLeft, X, Clock, ImageIcon, Trash2, Share2, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface IOSCameraProps {
  onClose: () => void
}

type CameraMode = "PHOTO" | "VIDEO" | "PORTRAIT" | "PANO"
type FlashMode = "AUTO" | "ON" | "OFF"

interface CapturedPhoto {
  id: string
  dataUrl: string
  timestamp: number
}

export default function IOSCamera({ onClose }: IOSCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment")
  const [cameraMode, setCameraMode] = useState<CameraMode>("PHOTO")
  const [flashMode, setFlashMode] = useState<FlashMode>("AUTO")
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerDuration, setTimerDuration] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showGallery, setShowGallery] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)
  const [initialZoom, setInitialZoom] = useState<number>(1)

  // Load saved photos from localStorage on component mount
  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem("ios-camera-photos")
      if (savedPhotos) {
        setCapturedPhotos(JSON.parse(savedPhotos))
      }
    } catch (error) {
      console.error("Error loading saved photos:", error)
    }
  }, [])

  // Save photos to localStorage when capturedPhotos changes
  useEffect(() => {
    if (capturedPhotos.length > 0) {
      try {
        localStorage.setItem("ios-camera-photos", JSON.stringify(capturedPhotos))
      } catch (error) {
        console.error("Error saving photos:", error)
      }
    }
  }, [capturedPhotos])

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        // Stop any existing tracks
        if (videoRef.current && videoRef.current.srcObject) {
          const currentStream = videoRef.current.srcObject as MediaStream
          currentStream.getTracks().forEach((track) => track.stop())
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: cameraFacing,
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.onloadedmetadata = () => {
              setIsCameraOn(true)
              setCameraError(null)
            }
          }
        } else {
          setCameraError("Camera not supported on this device")
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setCameraError("Could not access camera. Please check permissions.")
        setIsCameraOn(false)
      }
    }

    if (!showGallery && !capturedImage) {
      startCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraFacing, showGallery, capturedImage])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0 && isTimerActive) {
      takePhoto()
      setIsTimerActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [countdown, isTimerActive])

  const takePhoto = () => {
    if (isProcessing || !isCameraOn) return

    if (isTimerActive && countdown === 0) {
      setCountdown(timerDuration)
      return
    }

    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true)
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video aspect ratio
        const videoAspectRatio = video.videoWidth / video.videoHeight

        canvas.width = Math.min(1920, video.videoWidth)
        canvas.height = canvas.width / videoAspectRatio

        // Apply zoom
        const scaleFactor = zoomLevel
        const sx = (video.videoWidth - video.videoWidth / scaleFactor) / 2
        const sy = (video.videoHeight - video.videoHeight / scaleFactor) / 2
        const sWidth = video.videoWidth / scaleFactor
        const sHeight = video.videoHeight / scaleFactor

        // Clear canvas and draw the video frame
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height)

        // Add flash effect if flash is on
        if (flashMode === "ON" || (flashMode === "AUTO" && isLowLight())) {
          flashScreen()
        }

        // Get image data and save it
        const imageData = canvas.toDataURL("image/jpeg", 0.95)
        setCapturedImage(imageData)

        // Add to captured photos
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          dataUrl: imageData,
          timestamp: Date.now(),
        }

        setCapturedPhotos((prev) => [newPhoto, ...prev])

        // Play shutter sound
        playShutterSound()

        setTimeout(() => {
          setIsProcessing(false)
        }, 500)
      }
    }
  }

  // Simulate checking for low light conditions
  const isLowLight = (): boolean => {
    // In a real app, this would analyze the video feed
    // For this demo, we'll just return false
    return false
  }

  const flashScreen = () => {
    // Create a flash overlay
    const flashOverlay = document.createElement("div")
    flashOverlay.style.position = "fixed"
    flashOverlay.style.top = "0"
    flashOverlay.style.left = "0"
    flashOverlay.style.width = "100%"
    flashOverlay.style.height = "100%"
    flashOverlay.style.backgroundColor = "white"
    flashOverlay.style.opacity = "0.9"
    flashOverlay.style.zIndex = "9999"
    flashOverlay.style.transition = "opacity 0.5s"

    document.body.appendChild(flashOverlay)

    // Remove the flash effect after a short delay
    setTimeout(() => {
      flashOverlay.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(flashOverlay)
      }, 500)
    }, 100)
  }

  const playShutterSound = () => {
    try {
      const shutterSound = new Audio("/camera-shutter.mp3")
      shutterSound.play().catch((e) => console.log("Could not play shutter sound", e))
    } catch (error) {
      console.error("Error playing shutter sound:", error)
    }
  }

  const startTimerPhoto = () => {
    if (timerDuration > 0) {
      setIsTimerActive(true)
      setCountdown(timerDuration)
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const switchCamera = () => {
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"))
  }

  const toggleFlashMode = () => {
    setFlashMode((prev) => {
      if (prev === "AUTO") return "ON"
      if (prev === "ON") return "OFF"
      return "AUTO"
    })
  }

  const toggleTimer = () => {
    if (timerDuration === 0) setTimerDuration(3)
    else if (timerDuration === 3) setTimerDuration(10)
    else setTimerDuration(0)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Reset pinch zoom state
      setInitialPinchDistance(null)
      setInitialZoom(zoomLevel)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]

      // Calculate distance between touches
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

      // Store initial distance for reference
      if (initialPinchDistance === null) {
        setInitialPinchDistance(distance)
        return
      }

      if (initialPinchDistance > 0) {
        // Calculate new zoom level based on pinch gesture
        const scale = distance / initialPinchDistance
        const newZoom = Math.max(1, Math.min(5, initialZoom * scale))
        setZoomLevel(newZoom)
      }
    }
  }

  const handleTouchEnd = () => {
    setInitialPinchDistance(null)
  }

  const downloadImage = (dataUrl: string) => {
    try {
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `ios-camera-${new Date().toISOString()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading image:", error)
      alert("Could not download image. Please try again.")
    }
  }

  const deletePhoto = (id: string) => {
    setCapturedPhotos((prev) => prev.filter((photo) => photo.id !== id))
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null)
    }
  }

  const saveToGallery = () => {
    if (capturedImage) {
      // In a real app, this would save to the device's gallery
      // For this demo, we'll just add it to our captured photos array if it's not already there
      const alreadyExists = capturedPhotos.some((photo) => photo.dataUrl === capturedImage)

      if (!alreadyExists) {
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          dataUrl: capturedImage,
          timestamp: Date.now(),
        }

        setCapturedPhotos((prev) => [newPhoto, ...prev])
      }

      setCapturedImage(null)
    }
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="h-[758px] w-[350px] bg-black flex flex-col relative overflow-hidden">
      {/* Main Camera View */}
      {!showGallery && !capturedImage && (
        <>
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="p-4 flex items-center justify-between">
              <button onClick={onClose} className="text-white">
                <ArrowLeft size={24} />
              </button>

              <div className="flex space-x-4">
                <button
                  className="w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center"
                  onClick={toggleFlashMode}
                >
                  {flashMode === "AUTO" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7L12 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M15 10L9 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8.5 17H15.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M13 3L13 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M11 3L11 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  {flashMode === "ON" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 7L12 13" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                      <path d="M15 10L9 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8.5 17H15.5" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                      <path d="M13 3L13 7" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                      <path d="M11 3L11 7" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  {flashMode === "OFF" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.5 17H15.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M13 3L13 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M11 3L11 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M5 5L19 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>

                <button
                  className="w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center"
                  onClick={toggleTimer}
                >
                  <Clock className="text-white w-5 h-5" />
                  {timerDuration > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {timerDuration}
                    </div>
                  )}
                </button>
              </div>

              <div className="w-6"></div>
            </div>

            {/* Camera Modes */}
            <div className="flex justify-center mt-2">
              <div className="bg-black/30 backdrop-blur-md rounded-full">
                <div className="flex text-white text-xs font-medium">
                  {(["VIDEO", "PHOTO", "PORTRAIT", "PANO"] as CameraMode[]).map((mode) => (
                    <button
                      key={mode}
                      className={`px-4 py-1.5 ${cameraMode === mode ? "font-bold" : "opacity-80"}`}
                      onClick={() => setCameraMode(mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Camera View */}
          <div
            className="flex-1 relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-white text-center p-4">
                  <p className="mb-2">{cameraError}</p>
                  <button className="bg-white text-black px-4 py-2 rounded-lg" onClick={() => setCameraError(null)}>
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Zoom Indicator */}
            {zoomLevel > 1 && (
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 rounded-full px-2 py-1">
                <span className="text-white text-sm font-medium">{zoomLevel.toFixed(1)}×</span>
              </div>
            )}

            {/* Countdown overlay */}
            <AnimatePresence>
              {countdown > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <span className="text-white text-8xl font-bold">{countdown}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="p-6 flex items-center justify-between">
            <button
              className="w-12 h-12 rounded-full overflow-hidden border border-white/50"
              onClick={() => setShowGallery(true)}
            >
              {capturedPhotos.length > 0 ? (
                <img
                  src={capturedPhotos[0]?.dataUrl || "/placeholder.svg"}
                  alt="Last photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <ImageIcon size={20} className="text-white" />
                </div>
              )}
            </button>

            {timerDuration > 0 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startTimerPhoto}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
                disabled={isProcessing}
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <Clock size={24} className="text-black" />
                </div>
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={takePhoto}
                className="w-20 h-20 rounded-full border-4 border-white"
                disabled={isProcessing || !isCameraOn}
              />
            )}

            <button
              onClick={switchCamera}
              className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 16V10M12 10H8M12 10L8 14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V14M12 14H16M12 14L16 10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Captured Image Preview */}
      {capturedImage && !showGallery && (
        <div className="absolute inset-0 bg-black flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <button onClick={retakePhoto} className="text-white">
              <X size={24} />
            </button>
            <div className="w-6"></div>
          </div>

          <div className="flex-1 relative">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-contain" />
          </div>

          <div className="p-6 flex justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={saveToGallery}
              className="bg-white text-black px-8 py-2 rounded-full font-medium"
            >
              Use Photo
            </motion.button>
          </div>
        </div>
      )}

      {/* Gallery View */}
      {showGallery && (
        <div className="absolute inset-0 bg-white flex flex-col">
          <div className="p-4 flex items-center justify-between bg-gray-100 border-b border-gray-200">
            <button
              onClick={() => {
                setShowGallery(false)
                setSelectedPhoto(null)
              }}
              className="text-blue-500 font-medium"
            >
              Cancel
            </button>
            <h2 className="text-black font-semibold">Photos</h2>
            <div className="w-12"></div>
          </div>

          {selectedPhoto ? (
            <div className="flex-1 flex flex-col bg-black">
              <div className="flex-1 relative">
                <img
                  src={selectedPhoto.dataUrl || "/placeholder.svg"}
                  alt="Selected"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 bg-black">
                <div className="text-white text-sm mb-4">{formatDate(selectedPhoto.timestamp)}</div>
                <div className="flex justify-around">
                  <button
                    className="flex flex-col items-center text-white"
                    onClick={() => downloadImage(selectedPhoto.dataUrl)}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-1">
                      <Download size={20} />
                    </div>
                    <span className="text-xs">Download</span>
                  </button>

                  <button
                    className="flex flex-col items-center text-white"
                    onClick={() => {
                      // In a real app, this would share the image
                      alert("Share functionality would be implemented here")
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-1">
                      <Share2 size={20} />
                    </div>
                    <span className="text-xs">Share</span>
                  </button>

                  <button
                    className="flex flex-col items-center text-white"
                    onClick={() => deletePhoto(selectedPhoto.id)}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-1">
                      <Trash2 size={20} />
                    </div>
                    <span className="text-xs">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white">
              {capturedPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-[2px] p-[2px]">
                  {capturedPhotos.map((photo) => (
                    <div key={photo.id} className="aspect-square relative" onClick={() => setSelectedPhoto(photo)}>
                      <img
                        src={photo.dataUrl || "/placeholder.svg"}
                        alt={`Photo ${photo.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={48} className="mb-4" />
                  <p>No photos yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

