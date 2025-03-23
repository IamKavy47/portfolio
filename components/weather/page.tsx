"use client"

import { useState, useEffect } from "react"
import { MapPin, Search, ChevronRight, ChevronDown, X } from "lucide-react"
import Window from "../Window"
import { motion } from "framer-motion"

interface WeatherProps {
  onClose: () => void
  onFocus: () => void
}

interface WeatherData {
  location: string
  country: string
  temperature: number
  condition: string
  icon: string
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  uvIndex: number
  visibility: number
  pressure: number
  sunrise: string
  sunset: string
  forecast: {
    date: string
    day: string
    high: number
    low: number
    condition: string
    icon: string
    precipitation: number
  }[]
  hourly: {
    time: string
    temperature: number
    condition: string
    icon: string
    precipitation: number
  }[]
}

interface Location {
  name: string
  country: string
  isCurrent: boolean
}

// Weather condition to emoji mapping
const weatherIconMap: Record<string, string> = {
  clear: "☀️",
  sunny: "☀️",
  "partly cloudy": "⛅",
  cloudy: "☁️",
  overcast: "☁️",
  mist: "🌫️",
  fog: "🌫️",
  "light rain": "🌦️",
  "patchy rain": "🌦️",
  rain: "🌧️",
  "moderate rain": "🌧️",
  "heavy rain": "🌧️",
  "light snow": "🌨️",
  snow: "❄️",
  "heavy snow": "❄️",
  thunderstorm: "⛈️",
  thunder: "⛈️",
  storm: "🌩️",
  default: "☁️",
}

// Get appropriate emoji for weather condition
const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase()

  for (const [key, value] of Object.entries(weatherIconMap)) {
    if (lowerCondition.includes(key)) {
      return value
    }
  }

  return weatherIconMap.default
}

// Generate mock weather data for a location
const generateMockWeatherData = (location: string): WeatherData => {
  const now = new Date()
  const currentHour = now.getHours()

  // Random temperature between 15-35°C for Indian cities
  const currentTemp = Math.floor(Math.random() * 20) + 15

  // Random conditions based on season and time
  const conditions = ["Sunny", "Partly cloudy", "Cloudy", "Clear", "Light rain", "Moderate rain"]
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

  // Generate hourly forecast
  const hourlyForecast = []
  for (let i = 0; i < 12; i++) {
    const hour = (currentHour + i) % 24
    const hourTemp = currentTemp + Math.floor(Math.random() * 5) - 2 // Vary by -2 to +2 degrees
    const hourCondition = conditions[Math.floor(Math.random() * conditions.length)]

    hourlyForecast.push({
      time: i === 0 ? "Now" : `${hour}:00`,
      temperature: hourTemp,
      condition: hourCondition,
      icon: getWeatherIcon(hourCondition),
      precipitation: Math.floor(Math.random() * 30),
    })
  }

  // Generate daily forecast
  const dailyForecast = []
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const currentDay = now.getDay()

  for (let i = 0; i < 7; i++) {
    const dayIndex = (currentDay + i) % 7
    const dayName = days[dayIndex]
    const dayTemp = currentTemp + Math.floor(Math.random() * 8) - 3 // Vary by -3 to +4 degrees
    const lowTemp = dayTemp - Math.floor(Math.random() * 8) - 2
    const dayCondition = conditions[Math.floor(Math.random() * conditions.length)]

    dailyForecast.push({
      date: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayName,
      day: dayName,
      high: dayTemp,
      low: lowTemp,
      condition: dayCondition,
      icon: getWeatherIcon(dayCondition),
      precipitation: Math.floor(Math.random() * 40),
    })
  }

  return {
    location: location,
    country: "India",
    temperature: currentTemp,
    condition: randomCondition,
    icon: getWeatherIcon(randomCondition),
    feelsLike: currentTemp - 1,
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
    uvIndex: Math.floor(Math.random() * 10) + 1, // 1-10
    visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
    pressure: Math.floor(Math.random() * 30) + 1000, // 1000-1030 hPa
    sunrise: "6:15 AM",
    sunset: "6:45 PM",
    forecast: dailyForecast,
    hourly: hourlyForecast,
  }
}

export default function Weather({ onClose, onFocus }: WeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const [selectedLocation, setSelectedLocation] = useState("Delhi")
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState<"weather" | "map">("weather")
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  // Saved locations - updated to Indian cities
  const [locations, setLocations] = useState<Location[]>([
    { name: "Mandsaur", country: "India", isCurrent: true },
    { name: "Mumbai", country: "India", isCurrent: false },
    { name: "Bangalore", country: "India", isCurrent: false },
    { name: "Kolkata", country: "India", isCurrent: false },
    { name: "Chennai", country: "India", isCurrent: false },
    { name: "Ujjain", country: "India", isCurrent: false },
  ])

  // Fetch real weather data
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      setError(null)

      try {
        if (useMockData) {
          // Use mock data if API is not working
          const mockData = generateMockWeatherData(selectedLocation)
          setWeatherData(mockData)
          setLoading(false)
          return
        }

        // Try to fetch real data from WeatherAPI
        const apiKey = "b93d08e12ea04e5dbe794716252303"
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedLocation}&days=7&aqi=no&alerts=no`

        console.log("Fetching weather data from:", url)

        const response = await fetch(url)

        if (!response.ok) {
          console.error("API response not OK:", response.status, response.statusText)
          throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("API data received:", data)

        // Format the data to match our interface
        const formattedData: WeatherData = {
          location: data.location.name,
          country: data.location.country,
          temperature: data.current.temp_c,
          condition: data.current.condition.text,
          icon: getWeatherIcon(data.current.condition.text),
          feelsLike: data.current.feelslike_c,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
          windDirection: data.current.wind_dir,
          uvIndex: data.current.uv,
          visibility: data.current.vis_km,
          pressure: data.current.pressure_mb,
          sunrise: data.forecast.forecastday[0].astro.sunrise,
          sunset: data.forecast.forecastday[0].astro.sunset,
          forecast: data.forecast.forecastday.map((day: any) => {
            const date = new Date(day.date)
            return {
              date:
                date.toLocaleDateString("en-US", { weekday: "short" }) ===
                new Date().toLocaleDateString("en-US", { weekday: "short" })
                  ? "Today"
                  : date.getDate() === new Date().getDate() + 1
                    ? "Tomorrow"
                    : date.toLocaleDateString("en-US", { weekday: "short" }),
              day: date.toLocaleDateString("en-US", { weekday: "short" }),
              high: day.day.maxtemp_c,
              low: day.day.mintemp_c,
              condition: day.day.condition.text,
              icon: getWeatherIcon(day.day.condition.text),
              precipitation: day.day.daily_chance_of_rain,
            }
          }),
          hourly: data.forecast.forecastday[0].hour
            .filter((hour: any) => {
              const hourTime = new Date(hour.time)
              const currentTime = new Date()
              return hourTime >= currentTime || hourTime.getHours() === currentTime.getHours()
            })
            .slice(0, 12)
            .map((hour: any) => {
              const hourTime = new Date(hour.time)
              const currentTime = new Date()
              const isNow = hourTime.getHours() === currentTime.getHours()

              return {
                time: isNow ? "Now" : hourTime.toLocaleTimeString("en-US", { hour: "numeric" }),
                temperature: hour.temp_c,
                condition: hour.condition.text,
                icon: getWeatherIcon(hour.condition.text),
                precipitation: hour.chance_of_rain,
              }
            }),
        }

        setWeatherData(formattedData)
      } catch (err) {
        console.error("Error fetching weather data:", err)

        // Fall back to mock data if API fails
        console.log("Falling back to mock data")
        const mockData = generateMockWeatherData(selectedLocation)
        setWeatherData(mockData)

        // Set useMockData to true for future requests
        setUseMockData(true)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()

    // Set up auto-refresh every 10 minutes
    const refreshInterval = setInterval(fetchWeather, 10 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [selectedLocation, useMockData])

  // Convert temperature based on selected unit
  const convertTemp = (temp: number) => {
    if (unit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32)
    }
    return Math.round(temp)
  }

  // Handle search
  const handleSearch = (location: string) => {
    setSelectedLocation(location)
    setShowSearch(false)
    setSearchQuery("")

    // Update locations if not already in the list
    if (!locations.some((loc) => loc.name === location)) {
      setLocations([...locations, { name: location, country: "India", isCurrent: false }])
    }
  }

  // Toggle between real and mock data
  const toggleDataSource = () => {
    setUseMockData(!useMockData)
  }

  // Indian cities for search
  const searchLocations = [
    // "Delhi",
    "Mumbai",
    "Bangalore",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Allahabad",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Chandigarh",
    "Guwahati",
    "Solapur",
    "Hubli",
    "Mysore",
    "Tiruchirappalli",
    "Bareilly",
    "Aligarh",
    "Tiruppur",
    "Gurgaon",
    "Moradabad",
    "Jalandhar",
    "Bhubaneswar",
    "Salem",
    "Warangal",
    "Mira-Bhayandar",
    "Jalgaon",
    "Guntur",
    "Thiruvananthapuram",
    "Bhiwandi",
    "Saharanpur",
    "Gorakhpur",
    "Bikaner",
    "Amravati",
    "Noida",
    "Jamshedpur",
    "Bhilai",
    "Cuttack",
    "Firozabad",
    "Kochi",
    "Nellore",
    "Bhavnagar",
    "Dehradun",
    "Durgapur",
    "Asansol",
    "Rourkela",
    "Nanded",
    "Kolhapur",
    "Ajmer",
    "Akola",
    "Gulbarga",
    "Jamnagar",
    "Ujjain",
    "Loni",
    "Siliguri",
    "Jhansi",
    "Ulhasnagar",
    "Jammu",
    "Sangli-Miraj",
    "Erode",
    "Mandsaur",
  ].filter((loc) => loc.toLowerCase().includes(searchQuery.toLowerCase()))

  // Background gradient based on time of day and weather
  const getBackgroundGradient = () => {
    const now = new Date().getHours()
    const condition = weatherData?.condition.toLowerCase() || ""

    if (now >= 6 && now < 10) {
      // Morning
      return "bg-gradient-to-b from-blue-400 to-blue-200"
    } else if (now >= 10 && now < 17) {
      // Day
      if (condition.includes("cloud")) {
        return "bg-gradient-to-b from-blue-400 to-gray-300"
      } else if (condition.includes("rain")) {
        return "bg-gradient-to-b from-gray-500 to-gray-400"
      } else {
        return "bg-gradient-to-b from-blue-500 to-blue-300"
      }
    } else if (now >= 17 && now < 20) {
      // Evening
      return "bg-gradient-to-b from-orange-400 to-purple-500"
    } else {
      // Night
      return "bg-gradient-to-b from-blue-900 to-gray-900"
    }
  }

  return (
    <Window
      title="Weather"
      onClose={onClose}
      onFocus={onFocus}
      initialSize={{ width: 800, height: 600 }}
      toolbar={
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowSidebar(!showSidebar)} className="p-1 rounded hover:bg-black/5 text-gray-600">
            {showSidebar ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setActiveTab("weather")}
              className={`px-3 py-1 text-xs ${activeTab === "weather" ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`}
            >
              Weather
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`px-3 py-1 text-xs ${activeTab === "map" ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`}
            >
              Map
            </button>
          </div>
          <button
            onClick={toggleDataSource}
            className="px-2 py-1 text-xs rounded hover:bg-black/5 bg-gray-100"
            title={useMockData ? "Using simulated data" : "Using real data"}
          >
            {useMockData ? "Sim" : "Live"}
          </button>
          <button
            onClick={() => setUnit(unit === "celsius" ? "fahrenheit" : "celsius")}
            className="ml-auto px-2 py-1 text-xs rounded hover:bg-black/5"
          >
            {unit === "celsius" ? "°C" : "°F"}
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className="p-1 rounded hover:bg-black/5 text-gray-600">
            <Search size={16} />
          </button>
        </div>
      }
    >
      <div className="flex h-full">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Locations</h3>
              <div className="space-y-1">
                {locations.map((location) => (
                  <div
                    key={location.name}
                    className={`p-2 rounded-md cursor-pointer ${selectedLocation === location.name ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"}`}
                    onClick={() => setSelectedLocation(location.name)}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{location.name}</p>
                        <p className="text-xs text-gray-500">{location.country}</p>
                      </div>
                      {location.isCurrent && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Current</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "weather" ? (
            <div className={`h-full ${getBackgroundGradient()}`}>
              {/* Search overlay */}
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 bg-white z-10 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Search Locations</h2>
                    <button onClick={() => setShowSearch(false)} className="p-1 rounded-full hover:bg-gray-100">
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-100 text-gray-800 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200"
                      placeholder="Search for a city"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1">
                    {searchLocations.map((location) => (
                      <div
                        key={location}
                        className="p-2 rounded-md hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSearch(location)}
                      >
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        <span className="text-gray-800">{location}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center p-4">
                    <p className="text-xl mb-2">😕</p>
                    <p>{error}</p>
                    <button
                      onClick={() => setSelectedLocation("Delhi")}
                      className="mt-4 px-3 py-1 bg-white/20 rounded-md text-sm hover:bg-white/30"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : weatherData ? (
                <div className="p-4 text-white h-full overflow-y-auto">
                  {/* Current weather */}
                  <div className="mb-6 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <MapPin size={14} className="mr-1" />
                      <h1 className="text-xl font-medium">{weatherData.location}</h1>
                    </div>
                    <p className="text-xs text-white/80 mb-4">{weatherData.country}</p>

                    <div className="text-6xl font-light mb-2 flex items-center justify-center">
                      <span className="text-7xl mr-2">{weatherData.icon}</span>
                      <div>
                        <span>{convertTemp(weatherData.temperature)}</span>
                        <span className="text-4xl">°</span>
                      </div>
                    </div>

                    <p className="text-lg mb-1">{weatherData.condition}</p>
                    <p className="text-xs text-white/80">
                      H: {convertTemp(weatherData.forecast[0].high)}° L: {convertTemp(weatherData.forecast[0].low)}°
                    </p>
                    {useMockData && (
                      <p className="text-xs mt-1 bg-yellow-500/20 inline-block px-2 py-0.5 rounded">Simulated Data</p>
                    )}
                  </div>

                  {/* Hourly forecast */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-4">
                    <h2 className="text-sm font-medium mb-3">Hourly Forecast</h2>
                    <div className="flex overflow-x-auto pb-2 space-x-4">
                      {weatherData.hourly.map((hour, index) => (
                        <div key={index} className="flex flex-col items-center min-w-[50px]">
                          <p className="text-xs mb-1">{hour.time}</p>
                          <p className="text-xl mb-1">{hour.icon}</p>
                          <p className="text-sm font-medium">{convertTemp(hour.temperature)}°</p>
                          {hour.precipitation > 0 && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-blue-300">💧</span>
                              <span className="text-xs">{hour.precipitation}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7-day forecast */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-4">
                    <h2 className="text-sm font-medium mb-3">7-Day Forecast</h2>
                    <div className="space-y-2">
                      {weatherData.forecast.map((day, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <p className="w-20 text-xs">{day.date}</p>
                          <span className="text-lg mr-2">{day.icon}</span>
                          {day.precipitation > 0 && (
                            <div className="w-6 flex items-center mr-2">
                              <span className="text-xs text-blue-300">💧</span>
                              <span className="text-xs">{day.precipitation}%</span>
                            </div>
                          )}
                          {day.precipitation === 0 && <div className="w-6 mr-2"></div>}
                          <div className="flex-1 relative h-1 bg-white/20 rounded-full">
                            <div
                              className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500"
                              style={{
                                left: `${(convertTemp(day.low) - 5) * 5}%`,
                                right: `${100 - (convertTemp(day.high) + 5) * 5}%`,
                              }}
                            ></div>
                          </div>
                          <div className="w-16 flex justify-end text-xs">
                            <span className="font-medium">{convertTemp(day.low)}°</span>
                            <span className="mx-1 text-white/40">|</span>
                            <span className="font-medium">{convertTemp(day.high)}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weather details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                      <h2 className="text-sm font-medium mb-3">Details</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-white/70 mb-1">Feels Like</p>
                          <p className="text-sm font-medium">{convertTemp(weatherData.feelsLike)}°</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Humidity</p>
                          <p className="text-sm font-medium">{weatherData.humidity}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Wind</p>
                          <p className="text-sm font-medium">{weatherData.windSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">UV Index</p>
                          <p className="text-sm font-medium">{weatherData.uvIndex}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                      <h2 className="text-sm font-medium mb-3">Sunrise & Sunset</h2>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-white/70 mb-1">Sunrise</p>
                          <div className="flex items-center">
                            <span className="text-lg mr-1">🌅</span>
                            <p className="text-sm font-medium">{weatherData.sunrise}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Sunset</p>
                          <div className="flex items-center">
                            <span className="text-lg mr-1">🌇</span>
                            <p className="text-sm font-medium">{weatherData.sunset}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                      <h2 className="text-sm font-medium mb-3">Visibility</h2>
                      <p className="text-sm font-medium">{weatherData.visibility} km</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                      <h2 className="text-sm font-medium mb-3">Pressure</h2>
                      <p className="text-sm font-medium">{weatherData.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <p>Unable to load weather data</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">🗺️</div>
                <p className="text-gray-600">Weather Map View</p>
                <p className="text-xs text-gray-500 mt-2">Map data would be displayed here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  )
}

