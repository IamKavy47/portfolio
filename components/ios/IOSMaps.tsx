"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Search, MapPin, Navigation, Compass, Plus, Minus, ChevronRight, X, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface IOSMapsProps {
  onClose: () => void
}

export default function IOSMaps({ onClose }: IOSMapsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(true)
  const [bottomSheetHeight, setBottomSheetHeight] = useState("25%")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<HTMLIFrameElement>(null)

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to San Francisco if location access is denied
          setUserLocation({ lat: 37.7749, lng: -122.4194 })
        },
      )
    } else {
      // Default to San Francisco if geolocation is not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 })
    }
  }, [])

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
    if (userLocation && mapRef.current) {
      // Update the map iframe src to center on user location
      const iframe = mapRef.current
      const src = `https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.01},${userLocation.lat - 0.01},${userLocation.lng + 0.01},${userLocation.lat + 0.01}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`
      iframe.src = src
    }
  }

  const toggleBottomSheet = () => {
    if (bottomSheetHeight === "25%") {
      setBottomSheetHeight("75%")
    } else {
      setBottomSheetHeight("25%")
    }
  }

  // Sample search results
  const searchResults = [
    { name: "Apple Park", address: "One Apple Park Way, Cupertino, CA", distance: "5.2 miles" },
    { name: "Apple Store", address: "300 Post Street, San Francisco, CA", distance: "0.8 miles" },
    { name: "Applebee's", address: "225 Geary St, San Francisco, CA", distance: "1.2 miles" },
    { name: "Apple Fitness+ Studio", address: "19345 Stevens Creek Blvd", distance: "6.5 miles" },
  ]

  // Sample nearby places
  const nearbyPlaces = [
    { name: "Starbucks Coffee", category: "Coffee Shop", address: "201 Powell St", distance: "0.1 miles" },
    { name: "Chipotle Mexican Grill", category: "Restaurant", address: "126 O'Farrell St", distance: "0.2 miles" },
    { name: "Walgreens", category: "Pharmacy", address: "456 Powell St", distance: "0.3 miles" },
    { name: "Chase Bank", category: "Bank", address: "350 Powell St", distance: "0.4 miles" },
  ]

  // Generate map URL based on user location
  const mapUrl = userLocation
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.01},${userLocation.lat - 0.01},${userLocation.lng + 0.01},${userLocation.lat + 0.01}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`
    : "https://www.openstreetmap.org/export/embed.html?bbox=-122.4394,37.7549,-122.3994,37.7949&layer=mapnik"

  return (
    <div className="h-[812px] w-[375px] bg-white flex flex-col overflow-hidden relative">
      {/* Search bar */}
      <div className="bg-white p-4 flex items-center justify-between z-10 shadow-sm">
        <button onClick={onClose} className="text-blue-500">
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
        <button className="text-blue-500">
          <Menu size={24} />
        </button>
      </div>

      {/* Map container */}
      <div className="flex-1 relative">
        {userLocation ? (
          <iframe ref={mapRef} src={mapUrl} className="w-full h-full border-none" title="Map" allowFullScreen />
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
          >
            <Plus size={20} className="text-gray-700" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Minus size={20} className="text-gray-700" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Compass size={20} className="text-gray-700" />
          </motion.button>
        </div>

        {/* Current location button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCurrentLocation}
          className="absolute bottom-32 right-4 bg-white rounded-full p-3 shadow-lg"
        >
          <Navigation size={24} className="text-blue-500" />
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
                  .map((result, index) => (
                    <motion.div
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-[#E9E9EB] rounded-lg flex items-center justify-center mr-3">
                        <MapPin size={18} className="text-red-500" />
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

      {/* Bottom sheet with nearby places */}
      <AnimatePresence>
        {showBottomSheet && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            style={{ height: bottomSheetHeight }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-10"
          >
            <div className="p-2 flex justify-center" onClick={toggleBottomSheet}>
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-4 pb-4 overflow-y-auto h-full">
              <h3 className="text-xl font-semibold mb-4">Around You</h3>
              <div className="space-y-4">
                {nearbyPlaces.map((place, index) => (
                  <motion.div
                    key={index}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-[#E9E9EB] rounded-lg flex items-center justify-center mr-3">
                      <MapPin size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{place.name}</div>
                      <div className="text-sm text-gray-500">{place.category}</div>
                      <div className="text-xs text-gray-400">
                        {place.distance} • {place.address}
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

