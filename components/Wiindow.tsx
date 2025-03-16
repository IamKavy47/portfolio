"use client"

import { useState, type ReactNode, useRef, useEffect } from "react"
import { motion, useDragControls } from "framer-motion"

interface WindowProps {
  title: string
  onClose: () => void
  onFocus: () => void
  children: ReactNode
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
}

export default function Window({
  title,
  onClose,
  onFocus,
  children,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 800, height: 600 },
}: WindowProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [size, setSize] = useState(initialSize)
  const [position, setPosition] = useState(initialPosition)
  const dragControls = useDragControls()
  const windowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const resizeDirection = useRef<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (windowRef.current && !windowRef.current.contains(event.target as Node)) {
        onFocus()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onFocus])

  const handleDragStart = () => {
    isDragging.current = true
    onFocus()
  }

  const handleDragEnd = () => {
    isDragging.current = false
  }

  const handleResize = (event: React.MouseEvent | React.TouchEvent, direction: string) => {
    if (isMaximized) return

    const startX = "touches" in event ? event.touches[0].clientX : event.clientX
    const startY = "touches" in event ? event.touches[0].clientY : event.clientY
    const startWidth = size.width
    const startHeight = size.height
    const startPosition = { ...position }

    resizeDirection.current = direction

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) {
        const currentX = "touches" in e ? e.touches[0].clientX : e.clientX
        const currentY = "touches" in e ? e.touches[0].clientY : e.clientY
        const deltaX = currentX - startX
        const deltaY = currentY - startY

        if (direction.includes("right")) {
          setSize((prev) => ({ ...prev, width: Math.max(400, startWidth + deltaX) }))
        }
        if (direction.includes("bottom")) {
          setSize((prev) => ({ ...prev, height: Math.max(300, startHeight + deltaY) }))
        }
        if (direction.includes("left")) {
          const newWidth = Math.max(400, startWidth - deltaX)
          setSize((prev) => ({ ...prev, width: newWidth }))
          setPosition((prev) => ({ ...prev, x: startPosition.x + (startWidth - newWidth) }))
        }
        if (direction.includes("top")) {
          const newHeight = Math.max(300, startHeight - deltaY)
          setSize((prev) => ({ ...prev, height: newHeight }))
          setPosition((prev) => ({ ...prev, y: startPosition.y + (startHeight - newHeight) }))
        }
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove as EventListener)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleMouseMove as EventListener)
      document.removeEventListener("touchend", handleMouseUp)
      resizeDirection.current = null
    }

    document.addEventListener("mousemove", handleMouseMove as EventListener)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleMouseMove as EventListener)
    document.addEventListener("touchend", handleMouseUp)
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (!isMaximized) {
      setSize({ width: window.innerWidth, height: window.innerHeight - 30 }) // Take full space except 30px from top
      setPosition({ x: 0, y: 30 })
    } else {
      setSize(initialSize)
      setPosition(initialPosition)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) {
        setSize({ width: window.innerWidth, height: window.innerHeight - 30 }) // Dynamically update on resize
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMaximized])

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ power: 0, timeConstant: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{
        scale: 0.5,
        opacity: 0,
        y: 100,
      }}
      animate={{
        scale: isMinimized ? 0.5 : 1,
        opacity: isMinimized ? 0 : 1,
        y: isMinimized ? 100 : position.y,
        width: isMaximized ? "100vw" : size.width,
        height: isMaximized ? "calc(100vh - 30px)" : size.height,
        x: isMaximized ? 0 : position.x,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="absolute z-40 bg-transparent rounded-[10px] shadow-lg overflow-hidden max-w-full max-h-full"
      style={{
        zIndex: isMinimized ? 0 : 10,
        width: isMaximized ? "100%" : Math.min(size.width, window.innerWidth - 20),
        height: isMaximized ? "calc(100% - 30px)" : Math.min(size.height, window.innerHeight - 60),
      }}
    >
      <div
        className="bg-white/60 border-r-[541.5px] border-white px-4 py-2 flex justify-between items-center cursor-move select-none"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex space-x-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
          <button onClick={() => setIsMinimized(true)} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
          <button onClick={toggleMaximize} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
        </div>
        <h2 className="text-sm font-medium absolute left-1/2 transform -translate-x-1/2">{title}</h2>
      </div>
      <div className="relative bg-transparent" style={{ height: "calc(100% - 32px)", overflow: "hidden" }}>
        {children}
      </div>
    </motion.div>
  )
}
