"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Search,
  MapPin,
  Navigation,
  Plus,
  Minus,
  ChevronRight,
  X,
  Menu,
  Car,
  Clock,
  Star,
  Compass,
} from "lucide-react"
import { motion, AnimatePresence, useMotionValue, type PanInfo } from "framer-motion"

interface IOSMapsProps {
  onClose: () => void
}

// Sample nearby places data
const nearbyPlaces = [
  {
    id: "1",
    name: "Starbucks Coffee",
    category: "Coffee Shop",
    address: "201 Powell St",
    distance: "0.1 miles",
    coordinates: { x: 45, y: 55 },
    rating: 4.2,
    isOpen: true,
    hours: "Open until 9:00 PM",
  },
  {
    id: "2",
    name: "Chipotle Mexican Grill",
    category: "Restaurant",
    address: "126 O'Farrell St",
    distance: "0.2 miles",
    coordinates: { x: 65, y: 35 },
    rating: 4.5,
    isOpen: true,
    hours: "Open until 10:00 PM",
  },
  {
    id: "3",
    name: "Walgreens",
    category: "Pharmacy",
    address: "456 Powell St",
    distance: "0.3 miles",
    coordinates: { x: 30, y: 25 },
    rating: 3.8,
    isOpen: true,
    hours: "Open 24 hours",
  },
  {
    id: "4",
    name: "Chase Bank",
    category: "Bank",
    address: "350 Powell St",
    distance: "0.4 miles",
    coordinates: { x: 70, y: 65 },
    rating: 4.0,
    isOpen: true,
    hours: "Open until 6:00 PM",
  },
  {
    id: "5",
    name: "Apple Store",
    category: "Electronics",
    address: "300 Post Street",
    distance: "0.5 miles",
    coordinates: { x: 55, y: 45 },
    rating: 4.8,
    isOpen: true,
    hours: "Open until 8:00 PM",
  },
  {
    id: "6",
    name: "Blue Bottle Coffee",
    category: "Coffee Shop",
    address: "315 Montgomery St",
    distance: "0.6 miles",
    coordinates: { x: 25, y: 70 },
    rating: 4.6,
    isOpen: true,
    hours: "Open until 7:00 PM",
  },
]

// Sample search results
const searchResults = [
  {
    id: "s1",
    name: "Apple Park",
    address: "One Apple Park Way, Cupertino, CA",
    distance: "5.2 miles",
    coordinates: { x: 50, y: 50 },
  },
  {
    id: "s2",
    name: "Apple Store",
    address: "300 Post Street, San Francisco, CA",
    distance: "0.8 miles",
    coordinates: { x: 55, y: 45 },
  },
  {
    id: "s3",
    name: "Applebee's",
    address: "225 Geary St, San Francisco, CA",
    distance: "1.2 miles",
    coordinates: { x: 60, y: 40 },
  },
  {
    id: "s4",
    name: "Apple Fitness+ Studio",
    address: "19345 Stevens Creek Blvd",
    distance: "6.5 miles",
    coordinates: { x: 45, y: 55 },
  },
]

// Categories for quick selection
const categories = [
  { id: "c1", name: "Food", icon: "🍔" },
  { id: "c2", name: "Coffee", icon: "☕" },
  { id: "c3", name: "Shopping", icon: "🛍️" },
  { id: "c4", name: "Gas", icon: "⛽" },
  { id: "c5", name: "Hotels", icon: "🏨" },
  { id: "c6", name: "Attractions", icon: "🎭" },
]

export default function IOSMaps({ onClose }: IOSMapsProps) {
  // Location permission state
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt")

  // Map state
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(true)
  const [selectedPlace, setSelectedPlace] = useState<(typeof nearbyPlaces)[0] | null>(null)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [mapZoom, setMapZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 })
  const [userLocation, setUserLocation] = useState({ x: 50, y: 50 })
  const [isCompassMode, setIsCompassMode] = useState(false)
  const [mapRotation, setMapRotation] = useState(0)

  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const bottomSheetRef = useRef<HTMLDivElement>(null)

  // For interactive bottom sheet
  const sheetY = useMotionValue(0)
  const [sheetState, setSheetState] = useState<"collapsed" | "partial" | "expanded">("partial")
  const [isDraggingSheet, setIsDraggingSheet] = useState(false)

  // Calculate sheet positions based on container height
  const containerHeight = 758 // Updated height as requested
  const collapsedPosition = containerHeight - 100 // Just showing the handle
  const partialPosition = containerHeight - 300 // Showing about 1/3 of the screen
  const expandedPosition = containerHeight - 600 // Showing about 3/4 of the screen

  // Simulated map tiles
  const [mapTiles, setMapTiles] = useState<{ x: number; y: number; color: string }[]>([])

  // Generate random map tiles
  useEffect(() => {
    const tiles = []
    // Generate buildings
    for (let i = 0; i < 50; i++) {
      tiles.push({
        x: Math.random() * 180 + 10,
        y: Math.random() * 180 + 10,
        color: ["#E0E0E0", "#D0D0D0", "#C0C0C0"][Math.floor(Math.random() * 3)],
      })
    }
    // Generate parks
    for (let i = 0; i < 10; i++) {
      tiles.push({
        x: Math.random() * 180 + 10,
        y: Math.random() * 180 + 10,
        color: ["#C8FACD", "#B5F5C0", "#A0EBB0"][Math.floor(Math.random() * 3)],
      })
    }
    // Generate water
    for (let i = 0; i < 5; i++) {
      tiles.push({
        x: Math.random() * 180 + 10,
        y: Math.random() * 180 + 10,
        color: ["#BAEFFF", "#A0E5FF", "#90DBFF"][Math.floor(Math.random() * 3)],
      })
    }
    setMapTiles(tiles)
  }, [])

  // Set initial sheet position
  useEffect(() => {
    sheetY.set(partialPosition)
  }, [])

  // Simulate compass mode
  useEffect(() => {
    if (isCompassMode) {
      const interval = setInterval(() => {
        setMapRotation((prev) => (prev + 1) % 360)
      }, 100)
      return () => clearInterval(interval)
    } else {
      setMapRotation(0)
    }
  }, [isCompassMode])

  const handleLocationPermission = (decision: "granted" | "denied") => {
    setLocationPermission(decision)
    if (decision === "granted") {
      // Use actual device geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Convert actual coordinates to our map's coordinate system
            // This is a simplified conversion - in a real app you'd use proper mapping
            setUserLocation({
              x: 50, // Center of our map
              y: 50, // Center of our map
            })
            console.log("Actual location:", position.coords.latitude, position.coords.longitude)
          },
          (error) => {
            console.error("Error getting location:", error)
            // Fallback to default position
            setUserLocation({ x: 50, y: 50 })
          },
          { enableHighAccuracy: true },
        )
      } else {
        // Fallback for browsers without geolocation
        setUserLocation({ x: 50, y: 50 })
      }
    }
  }

  const handleSearchFocus = () => {
    setShowSearchResults(true)
    setShowBottomSheet(false)
  }

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setShowSearchResults(false)
      setShowBottomSheet(true)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSearchResults(false)
    setShowBottomSheet(true)
  }

  const handleCurrentLocation = () => {
    // Reset map position to center on user
    setMapPosition({ x: 0, y: 0 })
    setMapZoom(1)

    // If location permission not granted, prompt for it
    if (locationPermission !== "granted") {
      setLocationPermission("prompt")
    } else {
      // Use actual device geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // In a real app, you would convert the actual coordinates to your map's system
            console.log("Current location:", position.coords.latitude, position.coords.longitude)
            // For this demo, we'll just center the map
            setMapPosition({ x: 0, y: 0 })
          },
          (error) => {
            console.error("Error getting current location:", error)
          },
          { enableHighAccuracy: true },
        )
      }
    }
  }

  const handlePlaceSelect = (place: (typeof nearbyPlaces)[0]) => {
    setSelectedPlace(place)
    setShowSearchResults(false)
    setShowBottomSheet(true)
    setSheetState("partial")
    sheetY.set(partialPosition)

    // Center map on selected place
    setMapPosition({
      x: -place.coordinates.x + 50,
      y: -place.coordinates.y + 50,
    })
  }

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev * 1.2, 2))
  }

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev / 1.2, 0.5))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mapRef.current) {
      setIsDragging(true)
      setStartDragPosition({
        x: e.clientX - mapPosition.x,
        y: e.clientY - mapPosition.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && mapRef.current) {
      const newX = e.clientX - startDragPosition.x
      const newY = e.clientY - startDragPosition.y
      setMapPosition({ x: newX, y: newY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mapRef.current && e.touches.length === 1) {
      setIsDragging(true)
      setStartDragPosition({
        x: e.touches[0].clientX - mapPosition.x,
        y: e.touches[0].clientY - mapPosition.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && mapRef.current && e.touches.length === 1) {
      const newX = e.touches[0].clientX - startDragPosition.x
      const newY = e.touches[0].clientY - startDragPosition.y
      setMapPosition({ x: newX, y: newY })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Bottom sheet drag handlers
  const handleSheetDragStart = () => {
    setIsDraggingSheet(true)
  }

  const handleSheetDragEnd = (e: MouseEvent, info: PanInfo) => {
    setIsDraggingSheet(false)

    const currentY = sheetY.get()

    // Determine which position to snap to based on velocity and position
    if (info.velocity.y > 500) {
      // Fast downward swipe - collapse
      sheetY.set(collapsedPosition)
      setSheetState("collapsed")
    } else if (info.velocity.y < -500) {
      // Fast upward swipe - expand
      sheetY.set(expandedPosition)
      setSheetState("expanded")
    } else {
      // Based on position
      const distToCollapsed = Math.abs(currentY - collapsedPosition)
      const distToPartial = Math.abs(currentY - partialPosition)
      const distToExpanded = Math.abs(currentY - expandedPosition)

      const minDist = Math.min(distToCollapsed, distToPartial, distToExpanded)

      if (minDist === distToCollapsed) {
        sheetY.set(collapsedPosition)
        setSheetState("collapsed")
      } else if (minDist === distToPartial) {
        sheetY.set(partialPosition)
        setSheetState("partial")
      } else {
        sheetY.set(expandedPosition)
        setSheetState("expanded")
      }
    }
  }

  // Toggle bottom sheet state
  const toggleBottomSheet = () => {
    if (sheetState === "collapsed") {
      sheetY.set(partialPosition)
      setSheetState("partial")
    } else if (sheetState === "partial") {
      sheetY.set(expandedPosition)
      setSheetState("expanded")
    } else {
      sheetY.set(partialPosition)
      setSheetState("partial")
    }
  }

  // Toggle compass mode
  const toggleCompassMode = () => {
    setIsCompassMode(!isCompassMode)
  }

  // Render location permission dialog
  const renderLocationPermissionDialog = () => (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[300px] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#F2F2F7]">
          <div className="w-12 h-12 bg-[#007AFF] rounded-full mx-auto mb-3 flex items-center justify-center">
            <MapPin size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-center">Allow "Maps" to use your location?</h3>
        </div>

        <div className="p-4 space-y-2 text-sm text-gray-600">
          <p>
            Your current location will be displayed on the map and used for directions, nearby search results, and
            estimated travel times.
          </p>
        </div>

        <div className="border-t border-gray-200">
          <button
            className="w-full p-3 text-[#007AFF] font-medium text-center border-b border-gray-200"
            onClick={() => handleLocationPermission("granted")}
          >
            Allow While Using App
          </button>
          <button
            className="w-full p-3 text-[#007AFF] font-medium text-center"
            onClick={() => handleLocationPermission("denied")}
          >
            Don't Allow
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-[758px] w-[350px] bg-white flex flex-col overflow-hidden relative">
      {/* Search bar */}
      <div className="bg-white p-4 flex items-center justify-between z-10 shadow-sm">
        <button onClick={onClose} className="text-[#007AFF]">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 mx-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Maps"
              className="w-full bg-[#EEEEEF] rounded-lg py-2 px-10 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            {searchQuery && (
              <button onClick={clearSearch} className="absolute right-3 top-2.5 text-gray-500">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <button className="text-[#007AFF]">
          <Menu size={24} />
        </button>
      </div>

      {/* Map container */}
      <div
        ref={mapContainer}
        className="flex-1 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Custom map */}
        <div
          ref={mapRef}
          className={`absolute w-[200%] h-[200%] transition-transform duration-200 ${isDragging ? "" : "ease-out"}`}
          style={{
            transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapZoom}) rotate(${mapRotation}deg)`,
            backgroundColor: "#E8ECEF",
          }}
        >
          {/* Map grid lines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`h-${i}`} className="w-full h-px bg-gray-300" style={{ top: `${(i + 1) * 8.33}%` }} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`v-${i}`} className="h-full w-px bg-gray-300" style={{ left: `${(i + 1) * 8.33}%` }} />
            ))}
          </div>

          {/* Map tiles (buildings, parks, water) */}
          {mapTiles.map((tile, index) => (
            <div
              key={index}
              className="absolute rounded-md"
              style={{
                left: `${tile.x}px`,
                top: `${tile.y}px`,
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 30 + 20}px`,
                backgroundColor: tile.color,
              }}
            ></div>
          ))}

          {/* Roads */}
          <div
            className="absolute h-4 bg-[#FFE8B2] rounded-full"
            style={{ width: "80%", top: "30%", left: "10%", transform: "rotate(15deg)" }}
          ></div>
          <div
            className="absolute h-6 bg-[#FFE8B2] rounded-full"
            style={{ width: "90%", top: "50%", left: "5%", transform: "rotate(-5deg)" }}
          ></div>
          <div
            className="absolute h-5 bg-[#FFE8B2] rounded-full"
            style={{ width: "70%", top: "70%", left: "15%", transform: "rotate(20deg)" }}
          ></div>
          <div
            className="absolute w-4 bg-[#FFE8B2] rounded-full"
            style={{ height: "80%", top: "10%", left: "30%", transform: "rotate(0deg)" }}
          ></div>
          <div
            className="absolute w-5 bg-[#FFE8B2] rounded-full"
            style={{ height: "70%", top: "15%", left: "60%", transform: "rotate(0deg)" }}
          ></div>
          <div
            className="absolute w-6 bg-[#FFE8B2] rounded-full"
            style={{ height: "90%", top: "5%", left: "80%", transform: "rotate(0deg)" }}
          ></div>

          {/* Place markers */}
          {nearbyPlaces.map((place) => (
            <div
              key={place.id}
              className="absolute cursor-pointer"
              style={{
                left: `${place.coordinates.x}%`,
                top: `${place.coordinates.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => handlePlaceSelect(place)}
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <MapPin size={16} className="text-[#FF3B30]" />
              </div>
              {mapZoom > 1.5 && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded-md shadow-md text-xs whitespace-nowrap">
                  {place.name}
                </div>
              )}
            </div>
          ))}

          {/* User location - only show if permission granted */}
          {locationPermission === "granted" && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-[#007AFF] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute -inset-2 bg-[#007AFF]/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            onClick={handleZoomIn}
          >
            <Plus size={20} className="text-gray-700" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            onClick={handleZoomOut}
          >
            <Minus size={20} className="text-gray-700" />
          </motion.button>
        </div>

        {/* Compass button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleCompassMode}
          className={`absolute bottom-32 left-4 bg-white rounded-full p-3 shadow-lg ${isCompassMode ? "bg-[#007AFF]" : "bg-white"}`}
        >
          <Compass size={24} className={isCompassMode ? "text-white" : "text-[#007AFF]"} />
        </motion.button>

        {/* Current location button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCurrentLocation}
          className="absolute bottom-32 right-4 bg-white rounded-full p-3 shadow-lg"
        >
          <Navigation size={24} className="text-[#007AFF]" />
        </motion.button>
      </div>

      {/* Search results */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-[72px] left-0 right-0 bottom-0 bg-white z-20 overflow-y-auto"
          >
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">SEARCH SUGGESTIONS</h3>
              <div className="space-y-3">
                {searchResults
                  .filter((result) => !searchQuery || result.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((result) => (
                    <motion.div
                      key={result.id}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => handlePlaceSelect(result as any)}
                    >
                      <div className="w-10 h-10 bg-[#E9E9EB] rounded-lg flex items-center justify-center mr-3">
                        <MapPin size={18} className="text-[#FF3B30]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-500">{result.address}</div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom sheet with nearby places - using Framer Motion for interactive dragging */}
      <AnimatePresence>
        {showBottomSheet && (
          <motion.div
            ref={bottomSheetRef}
            drag="y"
            dragConstraints={{ top: expandedPosition, bottom: collapsedPosition }}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={handleSheetDragStart}
            onDragEnd={handleSheetDragEnd}
            initial={{ y: partialPosition }}
            animate={{ y: sheetY.get() }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute left-0 right-0 bg-white rounded-t-xl shadow-lg z-10"
            style={{
              height: containerHeight,
              top: 0,
            }}
          >
            <div className="p-2 flex justify-center" onClick={toggleBottomSheet}>
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {selectedPlace ? (
              <div className="px-4 pb-4 overflow-y-auto" style={{ height: containerHeight - 20 }}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{selectedPlace.name}</h3>
                    <button onClick={() => setSelectedPlace(null)} className="text-[#007AFF]">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      <span>{selectedPlace.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="text-sm text-gray-600">{selectedPlace.category}</div>
                    <span className="text-gray-400">•</span>
                    <div className="text-sm text-green-600 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {selectedPlace.hours}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">{selectedPlace.address}</div>
                    <div className="text-sm text-gray-500 mt-1">{selectedPlace.distance} away</div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-[#007AFF] text-white py-3 rounded-lg font-medium flex items-center justify-center"
                    >
                      <Car size={18} className="mr-2" />
                      Directions
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gray-100 py-3 rounded-lg font-medium"
                    >
                      Call
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gray-100 py-3 rounded-lg font-medium"
                    >
                      Website
                    </motion.button>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-lg font-medium mb-3">Photos</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-gray-200 rounded-lg"></div>
                      <div className="aspect-square bg-gray-200 rounded-lg"></div>
                      <div className="aspect-square bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-4 overflow-y-auto" style={{ height: containerHeight - 20 }}>
                <h3 className="text-xl font-semibold mb-4">Around You</h3>

                {/* Categories */}
                <div className="mb-6 overflow-x-auto">
                  <div className="flex space-x-4 pb-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <span className="text-xs">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {nearbyPlaces.map((place) => (
                    <motion.div
                      key={place.id}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                      onClick={() => handlePlaceSelect(place)}
                    >
                      <div className="w-12 h-12 bg-[#E9E9EB] rounded-lg flex items-center justify-center mr-3">
                        <MapPin size={20} className="text-[#FF3B30]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{place.name}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <Star size={12} className="text-yellow-500 mr-1" />
                          <span>{place.rating}</span>
                          <span className="mx-1">•</span>
                          <span>{place.category}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mt-0.5">
                          <span>{place.distance}</span>
                          <span className="mx-1">•</span>
                          <span>{place.address}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location permission dialog */}
      {locationPermission === "prompt" && renderLocationPermissionDialog()}
    </div>
  )
}

