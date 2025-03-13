"use client"

import { useState } from "react"
import { ArrowLeft, Search, MapPin, Navigation, Compass, Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"

interface IOSMapsProps {
  onClose: () => void
}

export default function IOSMaps({ onClose }: IOSMapsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="h-full w-full bg-gray-100 flex flex-col">
      <div className="bg-white p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-blue-500">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a place or address"
              className="w-full bg-gray-200 rounded-lg py-2 px-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 relative">
        {/* Map placeholder */}
        <div className="absolute inset-0 bg-blue-100">
          <img
            src="/placeholder.svg?height=800&width=400&text=Map+View"
            alt="Map"
            className="w-full h-full object-cover"
          />

          {/* Fake map pins */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MapPin size={32} className="text-red-500" />
          </div>
          <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <MapPin size={32} className="text-red-500" />
          </div>
        </div>

        {/* Map controls */}
        <div className="absolute bottom-24 right-4 flex flex-col space-y-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Plus size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Minus size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
          >
            <Compass size={20} />
          </motion.button>
        </div>

        {/* Current location button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg"
        >
          <Navigation size={24} />
        </motion.button>
      </div>

      {/* Bottom sheet with search results */}
      <div className="bg-white rounded-t-xl shadow-lg p-4">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">Nearby Places</h3>
        <div className="space-y-3">
          {["Coffee Shop", "Restaurant", "Grocery Store", "Gas Station"].map((place, index) => (
            <motion.div
              key={index}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                <MapPin size={20} className="text-gray-600" />
              </div>
              <div>
                <div className="font-medium">{place}</div>
                <div className="text-sm text-gray-500">0.{index + 1} miles away</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

