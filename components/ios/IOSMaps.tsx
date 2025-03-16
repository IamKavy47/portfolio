"use client"

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
    name: "Pashupatinath Temple Mandsaur",
    category: "Hindu Temple",
    address: "334F+649, Pashupatinath Mandir Road, Mandsaur",
    distance: "",
    coordinates: { lat: 24.0559, lng: 75.0728 },
    rating: 4.5,
    isOpen: true,
    hours: "Open until 10:00 PM",
  },
  {
    id: "2",
    name: "Shri Mahakaleshwar Jyotirlinga Temple",
    category: "Hindu Temple",
    address: "Jaisinghpura, Ujjain",
    distance: "",
    coordinates: { lat: 23.1829, lng: 75.7682 },
    rating: 4.8,
    isOpen: true,
    hours: "Open until 10:00 PM",
  },
  {
    id: "3",
    name: "Mandsaur University",
    category: "University",
    address: "Daulatpura",
    distance: "",
    coordinates: { lat: 24.0747, lng: 75.0304 },
    rating: 4.2,
    isOpen: true,
    hours: "9:00 AM - 5:00 PM",
  },
  {
    id: "4",
    name: "Apple Park",
    category: "Headquater",
    address: "Cupertino, California",
    distance: "",
    coordinates: { lat: 37.3346, lng: -122.0091 },
    rating: 4.2,
    isOpen: true,
    hours: "Open until 8:00 PM",
  },
]

// Sample search results
const searchResults = [
  {
    id: "s1",
    name: "Mahankal Temple",
    address: "Jaisinghpura, Ujjain",
    distance: "",
    coordinates: { lat: 23.1829, lng: 75.7682 },
  },
  {
    id: "s2",
    name: "Pashupatinath Temple Mandsaur",
    address: "334F+649, Pashupatinath Mandir Road, Mandsaur",
    distance: "",
    coordinates: { lat: 24.0559, lng: 75.0728 },
  },
  {
    id: "s3",
    name: "Apple Park",
    address: "One Apple Park Way, Cupertino, CA",
    distance: "",
    coordinates: { lat: 37.3346, lng: -122.009 },
  },
  {
    id: "s4",
    name: "Mandsaur University",
    address: "Daulatpura , Mandsaur",
    distance: "",
    coordinates: { lat: 24.0747, lng: 75.0304 },
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isCompassMode, setIsCompassMode] = useState(false)
  // Add a mapType state to track current view type
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard")

  const mapRef = useRef<HTMLIFrameElement>(null)
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

  // Set initial sheet position
  useEffect(() => {
    sheetY.set(partialPosition)
  }, [])

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationPermission("granted")
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to San Francisco if location access is denied
          setUserLocation({ lat: 37.7749, lng: -122.4194 })
          setLocationPermission("denied")
        },
      )
    } else {
      // Default to San Francisco if geolocation is not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 })
      setLocationPermission("denied")
    }
  }, [])

  // Generate map URL based on user location
  const getMapUrl = (location: { lat: number; lng: number }, zoom = 16) => {
    if (mapType === "satellite") {
      // Use Esri's satellite imagery through OpenStreetMap
      return `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=hot&marker=${location.lat},${location.lng}&zoom=${zoom}`
    } else {
      // Standard map view
      return `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}&zoom=${zoom}`
    }
  }

  const handleLocationPermission = (decision: "granted" | "denied") => {
    setLocationPermission(decision)
    if (decision === "granted") {
      // Use actual device geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            setUserLocation(newLocation)

            // Update map to show new location
            if (mapRef.current) {
              mapRef.current.src = getMapUrl(newLocation)
            }
          },
          (error) => {
            console.error("Error getting location:", error)
            // Fallback to default position
            setUserLocation({ lat: 37.7749, lng: -122.4194 })
          },
          { enableHighAccuracy: true },
        )
      } else {
        // Fallback for browsers without geolocation
        setUserLocation({ lat: 37.7749, lng: -122.4194 })
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
    // If location permission not granted, prompt for it
    if (locationPermission !== "granted") {
      setLocationPermission("prompt")
    } else if (userLocation && mapRef.current) {
      // Get current zoom level if possible
      const currentSrc = mapRef.current.src
      const zoomMatch = currentSrc.match(/zoom=(\d+)/)
      const currentZoom = zoomMatch ? Number.parseInt(zoomMatch[1]) : 16

      // Update the map iframe src to center on user location
      mapRef.current.src = getMapUrl(userLocation, currentZoom)
    }
  }

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place)
    setShowSearchResults(false)
    setShowBottomSheet(true)
    setSheetState("partial")
    sheetY.set(partialPosition)

    // Center map on selected place
    if (mapRef.current && place.coordinates) {
      // Get current zoom level if possible
      const currentSrc = mapRef.current.src
      const zoomMatch = currentSrc.match(/zoom=(\d+)/)
      const currentZoom = zoomMatch ? Number.parseInt(zoomMatch[1]) : 16

      mapRef.current.src = getMapUrl(place.coordinates, currentZoom)
    }
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

  // Add a function to toggle map type
  const toggleMapType = () => {
    const newType = mapType === "standard" ? "satellite" : "standard"
    setMapType(newType)

    // Update the map if we have a location
    if (userLocation && mapRef.current) {
      mapRef.current.src = getMapUrl(userLocation)
    }
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
    <div className="h-[758px] w-[340px] bg-white flex flex-col overflow-hidden relative">
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
              className="w-full bg-[#EEEEEF] rounded-[10px] py-2 px-10 text-sm focus:outline-none"
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
      <div className="flex-1 relative">
        {userLocation ? (
          <iframe
            ref={mapRef}
            src={getMapUrl(userLocation)}
            className="w-full h-full border-none"
            title="Map"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <p>Loading map...</p>
          </div>
        )}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            onClick={() => {
              if (mapRef.current) {
                // Zoom in by updating the map URL
                const currentSrc = mapRef.current.src
                const zoomMatch = currentSrc.match(/zoom=(\d+)/)
                const currentZoom = zoomMatch ? Number.parseInt(zoomMatch[1]) : 16
                const newZoom = Math.min(currentZoom + 1, 19)

                if (userLocation) {
                  mapRef.current.src = getMapUrl(userLocation, newZoom)
                }
              }
            }}
          >
            <Plus size={20} className="text-gray-700" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            onClick={() => {
              if (mapRef.current) {
                // Zoom out by updating the map URL
                const currentSrc = mapRef.current.src
                const zoomMatch = currentSrc.match(/zoom=(\d+)/)
                const currentZoom = zoomMatch ? Number.parseInt(zoomMatch[1]) : 16
                const newZoom = Math.max(currentZoom - 1, 1)

                if (userLocation) {
                  mapRef.current.src = getMapUrl(userLocation, newZoom)
                }
              }
            }}
          >
            <Minus size={20} className="text-gray-700" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
            onClick={toggleMapType}
          >
            <span className="text-xs font-bold">{mapType === "standard" ? "Map" : "Sat"}</span>
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
                      onClick={() => handlePlaceSelect(result)}
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
                      className="flex-1 bg-[#007AFF] text-white py-3 rounded-[10px] font-medium flex items-center justify-center"
                    >
                      <Car size={18} className="mr-2" />
                      Directions
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gray-100 py-3 rounded-[10px] font-medium"
                    >
                      Call
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gray-100 py-3 rounded-[10px] font-medium"
                    >
                      Website
                    </motion.button>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-lg font-medium mb-3">Photos</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-gray-200 rounded-[10px]"></div>
                      <div className="aspect-square bg-gray-200 rounded-[10px]"></div>
                      <div className="aspect-square bg-gray-200 rounded-[10px]"></div>
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

