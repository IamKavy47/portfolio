"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  Search,
  Home,
  Library,
  Radio,
  ListMusic,
  ChevronRight,
  Clock,
  Music,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface IOSMusicProps {
  onClose: () => void
}

interface Song {
  id: number
  title: string
  artist: string
  album: string
  cover: string
  duration: number
  file: string
}

interface Playlist {
  id: number
  title: string
  description: string
  cover: string
  songs: Song[]
}

export default function IOSMusic({ onClose }: IOSMusicProps) {
  // State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showMiniPlayer, setShowMiniPlayer] = useState(false)
  const [activeView, setActiveView] = useState<"home" | "player" | "playlist" | "library" | "search">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sample data - Updated with working audio URL for the first song
  const playlists: Playlist[] = [
    {
      id: 1,
      title: "Phonk",
      description: "My Favourite phonks",
      cover: "/placeholder.svg?height=400&width=400&text=Today's+Hits",
      songs: [
        {
          id: 1,
          title: "Woops",
          artist: "Bounty Hunter Woops (TECHNO)",
          album: "",
          cover: "/woop.jpg?height=400&width=400&text=Woops",
          duration: 259,
          file: "/woop.mp3", // This is a path that should be valid in your project
        },
        {
          id: 2,
          title: "Urban Rhythm",
          artist: "City Beats",
          album: "Downtown",
          cover: "/placeholder.svg?height=400&width=400&text=Urban+Rhythm",
          duration: 210,
          // Fixed: Use a fallback audio that is more likely to exist in public folder
          file: "/woop.mp3",
        },
        {
          id: 3,
          title: "Ocean Waves",
          artist: "Nature Sounds",
          album: "Relaxation",
          cover: "/placeholder.svg?height=400&width=400&text=Ocean+Waves",
          duration: 240,
          // Fixed: Use a fallback audio that is more likely to exist in public folder
          file: "/woop.mp3",
        },
      ],
    },
    {
      id: 2,
      title: "Chill Vibes",
      description: "Relax and unwind with these smooth tracks",
      cover: "/placeholder.svg?height=400&width=400&text=Chill+Vibes",
      songs: [
        {
          id: 4,
          title: "Sunset Dreams",
          artist: "Lofi Collective",
          album: "Evening Sessions",
          cover: "/placeholder.svg?height=400&width=400&text=Sunset+Dreams",
          duration: 195,
          file: "/woop.mp3",
        },
        {
          id: 5,
          title: "Rainy Day",
          artist: "Ambient Works",
          album: "Weather Moods",
          cover: "/placeholder.svg?height=400&width=400&text=Rainy+Day",
          duration: 225,
          file: "/woop.mp3",
        },
      ],
    },
    {
      id: 3,
      title: "Workout Mix",
      description: "High energy tracks to fuel your workout",
      cover: "/placeholder.svg?height=400&width=400&text=Workout+Mix",
      songs: [
        {
          id: 6,
          title: "Power Up",
          artist: "Fitness Beats",
          album: "Gym Sessions",
          cover: "/placeholder.svg?height=400&width=400&text=Power+Up",
          duration: 165,
          file: "/woop.mp3",
        },
        {
          id: 7,
          title: "Run Faster",
          artist: "Cardio Kings",
          album: "Sprint",
          cover: "/placeholder.svg?height=400&width=400&text=Run+Faster",
          duration: 185,
          file: "/woop.mp3",
        },
      ],
    },
    {
      id: 4,
      title: "Focus Flow",
      description: "Concentration-enhancing instrumental tracks",
      cover: "/placeholder.svg?height=400&width=400&text=Focus+Flow",
      songs: [
        {
          id: 8,
          title: "Deep Focus",
          artist: "Study Beats",
          album: "Concentration",
          cover: "/placeholder.svg?height=400&width=400&text=Deep+Focus",
          duration: 255,
          file: "/woop.mp3",
        },
        {
          id: 9,
          title: "Productivity",
          artist: "Work Mode",
          album: "Flow State",
          cover: "/placeholder.svg?height=400&width=400&text=Productivity",
          duration: 230,
          file: "/woop.mp3",
        },
      ],
    },
  ]

  // Derived state
  const currentPlaylist = playlists[currentPlaylistIndex]
  const currentSong = currentPlaylist.songs[currentSongIndex]

  // Filter songs based on search query
  const filteredSongs = searchQuery
    ? playlists
        .flatMap((p) => p.songs)
        .filter(
          (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.album.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    : []

  // Effect to initialize audio element
  useEffect(() => {
    // Initialize audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.src = currentSong.file
      audioRef.current.volume = volume

      // Add error handling for audio loading
      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio loading error:", e)
        setIsPlaying(false)
      })
    }

    return () => {
      // Cleanup when component unmounts
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  // Effect to handle song changes
  useEffect(() => {
    if (!audioRef.current) return

    // Update the audio source when song changes
    audioRef.current.src = currentSong.file
    audioRef.current.load()
    setAudioLoaded(false)

    // If it was playing, continue playing the new song
    if (isPlaying) {
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioLoaded(true)
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
            setAudioLoaded(false)
          })
      }
    }
  }, [currentSongIndex, currentPlaylistIndex, currentSong.file])

  // Effect to handle play/pause
  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioLoaded(true)
          })
          .catch((error) => {
            console.error("Error playing audio:", error)
            setIsPlaying(false)
            setAudioLoaded(false)
          })
      }
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Effect for audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
        setAudioLoaded(true)
      }
    }

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play().catch((err) => {
          console.error("Error repeating song:", err)
          setIsPlaying(false)
        })
      } else if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * currentPlaylist.songs.length)
        setCurrentSongIndex(randomIndex)
      } else {
        handleNext()
      }
    }

    // Update volume
    audio.volume = volume

    // Add event listeners
    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("canplaythrough", updateDuration)
    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e)
      setIsPlaying(false)
      setAudioLoaded(false)
    })

    return () => {
      // Remove event listeners on cleanup
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("canplaythrough", updateDuration)
      audio.removeEventListener("error", () => {})
    }
  }, [isRepeat, isShuffle, currentPlaylist.songs.length, volume])

  // Handlers
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
    }

    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    setCurrentSongIndex((prev) => {
      if (prev === 0) return currentPlaylist.songs.length - 1
      return prev - 1
    })
  }

  const handleNext = () => {
    setCurrentSongIndex((prev) => {
      if (prev === currentPlaylist.songs.length - 1) return 0
      return prev + 1
    })
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return

    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return

    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    audioRef.current.volume = newVolume
  }

  const handlePlaylistSelect = (index: number) => {
    setCurrentPlaylistIndex(index)
    setCurrentSongIndex(0)
    setActiveView("playlist")
  }

  const handleSongSelect = (playlistIndex: number, songIndex: number) => {
    setCurrentPlaylistIndex(playlistIndex)
    setCurrentSongIndex(songIndex)
    setIsPlaying(true)
    setActiveView("player")
  }

  const handleSearchSongSelect = (song: Song) => {
    // Find which playlist contains this song
    for (let i = 0; i < playlists.length; i++) {
      const songIndex = playlists[i].songs.findIndex((s) => s.id === song.id)
      if (songIndex !== -1) {
        setCurrentPlaylistIndex(i)
        setCurrentSongIndex(songIndex)
        setIsPlaying(true)
        setActiveView("player")
        return
      }
    }
  }

  // Render helpers
  const renderHomeView = () => (
    <div className="flex-1 overflow-y-auto bg-black px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Listen Now</h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Playlists</h3>
          <button className="text-[#FF2D55] text-sm">See All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {playlists.slice(0, 4).map((playlist, index) => (
            <motion.div
              key={playlist.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlaylistSelect(index)}
              className="flex flex-col"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-2 shadow-lg">
                <img
                  src={playlist.cover || "/placeholder.svg"}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-medium text-sm">{playlist.title}</h4>
              <p className="text-xs text-gray-400">{playlist.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recently Played</h3>
          <button className="text-[#FF2D55] text-sm">See All</button>
        </div>
        <div className="space-y-3">
          {playlists
            .flatMap((p) => p.songs)
            .slice(0, 3)
            .map((song) => (
              <motion.div
                key={song.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSearchSongSelect(song)}
                className="flex items-center bg-[#1C1C1E] p-3 rounded-lg"
              >
                <img
                  src={song.cover || "/placeholder.svg"}
                  alt={song.title}
                  className="w-12 h-12 rounded-md mr-3 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{song.title}</h4>
                  <p className="text-xs text-gray-400">{song.artist}</p>
                </div>
                <button className="text-gray-400 p-2">
                  <MoreHorizontal size={16} />
                </button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderPlayerView = () => (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#1E1E1E] to-black">
      <div className="w-full flex items-center justify-between mb-8">
        <button onClick={() => setActiveView("home")} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <div className="text-xs opacity-70">Now Playing</div>
          <div className="text-sm font-medium">{currentPlaylist.title}</div>
        </div>
        <button className="text-white">
          <MoreHorizontal size={24} />
        </button>
      </div>

      <motion.div
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="w-64 h-64 rounded-full overflow-hidden mb-8 shadow-xl"
        style={{ animationPlayState: isPlaying ? "running" : "paused" }}
      >
        <img
          src={currentSong.cover || "/placeholder.svg"}
          alt={currentSong.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="w-full text-center mb-8">
        <h2 className="text-2xl font-bold mb-1">{currentSong.title}</h2>
        <p className="text-gray-300">{currentSong.artist}</p>
        <p className="text-gray-400 text-sm">{currentSong.album}</p>
      </div>

      <div className="w-full mb-6">
        <div className="flex justify-between text-xs mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || currentSong.duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || currentSong.duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #FF2D55 ${(currentTime / (duration || currentSong.duration)) * 100}%, rgba(255,255,255,0.3) 0%)`,
          }}
        />
      </div>

      <div className="flex items-center justify-between w-full px-4 mb-8">
        <button
          className={`text-gray-300 ${isShuffle ? "text-[#FF2D55]" : ""}`}
          onClick={() => setIsShuffle(!isShuffle)}
        >
          <Shuffle size={20} />
        </button>

        <div className="flex items-center space-x-6">
          <motion.button whileTap={{ scale: 0.95 }} onClick={handlePrevious} className="text-white">
            <SkipBack size={28} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={handleNext} className="text-white">
            <SkipForward size={28} />
          </motion.button>
        </div>

        <button className={`text-gray-300 ${isRepeat ? "text-[#FF2D55]" : ""}`} onClick={() => setIsRepeat(!isRepeat)}>
          <Repeat size={20} />
        </button>
      </div>

      <div className="flex items-center w-full mb-4">
        <button className={`mr-4 ${isLiked ? "text-[#FF2D55]" : "text-gray-300"}`} onClick={() => setIsLiked(!isLiked)}>
          <Heart size={20} fill={isLiked ? "#FF2D55" : "none"} />
        </button>
        <Volume2 size={16} className="text-gray-300 mr-2" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, white ${volume * 100}%, rgba(255,255,255,0.3) 0%)`,
          }}
        />
      </div>
    </div>
  )

  const renderPlaylistView = () => (
    <div className="flex-1 overflow-y-auto bg-black">
      <div className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-md p-4 flex items-center">
        <button onClick={() => setActiveView("home")} className="text-white mr-4">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">{currentPlaylist.title}</h2>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-6">
          <img
            src={currentPlaylist.cover || "/placeholder.svg"}
            alt={currentPlaylist.title}
            className="w-24 h-24 rounded-lg mr-4 object-cover shadow-lg"
          />
          <div>
            <h3 className="text-lg font-bold">{currentPlaylist.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{currentPlaylist.description}</p>
            <p className="text-xs text-gray-500">{currentPlaylist.songs.length} songs</p>
          </div>
        </div>

        <div className="flex space-x-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentSongIndex(0)
              setIsPlaying(true)
              setActiveView("player")
            }}
            className="bg-[#FF2D55] text-white px-6 py-2 rounded-full font-medium text-sm"
          >
            Play
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * currentPlaylist.songs.length)
              setCurrentSongIndex(randomIndex)
              setIsPlaying(true)
              setActiveView("player")
            }}
            className="bg-[#1C1C1E] text-white px-6 py-2 rounded-full font-medium text-sm"
          >
            Shuffle
          </motion.button>
        </div>

        <div className="space-y-2">
          {currentPlaylist.songs.map((song, index) => (
            <motion.div
              key={song.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCurrentSongIndex(index)
                setIsPlaying(true)
                setActiveView("player")
              }}
              className={`flex items-center p-3 rounded-lg ${
                currentSongIndex === index && currentPlaylistIndex === currentPlaylistIndex
                  ? "bg-[#1C1C1E]"
                  : "hover:bg-[#1C1C1E]"
              }`}
            >
              <div className="w-8 text-center mr-3 text-sm text-gray-400">{index + 1}</div>
              <img
                src={song.cover || "/placeholder.svg"}
                alt={song.title}
                className="w-10 h-10 rounded-md mr-3 object-cover"
              />
              <div className="flex-1">
                <h4
                  className={`font-medium text-sm ${
                    currentSongIndex === index && currentPlaylistIndex === currentPlaylistIndex ? "text-[#FF2D55]" : ""
                  }`}
                >
                  {song.title}
                </h4>
                <p className="text-xs text-gray-400">{song.artist}</p>
              </div>
              <div className="text-xs text-gray-400 mr-2">{formatTime(song.duration)}</div>
              <button className="text-gray-400">
                <MoreHorizontal size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLibraryView = () => (
    <div className="flex-1 overflow-y-auto bg-black px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Library</h2>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-3 bg-[#1C1C1E] rounded-lg">
          <div className="flex items-center">
            <ListMusic size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium">Playlists</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        <div className="flex items-center justify-between p-3 bg-[#1C1C1E] rounded-lg">
          <div className="flex items-center">
            <Music size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium">Artists</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        <div className="flex items-center justify-between p-3 bg-[#1C1C1E] rounded-lg">
          <div className="flex items-center">
            <Radio size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium">Albums</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        <div className="flex items-center justify-between p-3 bg-[#1C1C1E] rounded-lg">
          <div className="flex items-center">
            <Clock size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium">Recently Added</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Your Playlists</h3>
      <div className="space-y-3">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlaylistSelect(index)}
            className="flex items-center bg-[#1C1C1E] p-3 rounded-lg"
          >
            <img
              src={playlist.cover || "/placeholder.svg"}
              alt={playlist.title}
              className="w-12 h-12 rounded-md mr-3 object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{playlist.title}</h4>
              <p className="text-xs text-gray-400">{playlist.songs.length} songs</p>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderSearchView = () => (
    <div className="flex-1 overflow-y-auto bg-black px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Search</h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Artists, songs, or albums"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1C1C1E] text-white rounded-lg py-3 px-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF2D55]"
        />
        <Search size={18} className="absolute left-3 top-3 text-gray-500" />
      </div>

      {searchQuery ? (
        <div>
          <h3 className="text-lg font-semibold mb-3">Results</h3>
          {filteredSongs.length > 0 ? (
            <div className="space-y-3">
              {filteredSongs.map((song) => (
                <motion.div
                  key={song.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSearchSongSelect(song)}
                  className="flex items-center bg-[#1C1C1E] p-3 rounded-lg"
                >
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-12 h-12 rounded-md mr-3 object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{song.title}</h4>
                    <p className="text-xs text-gray-400">
                      {song.artist} • {song.album}
                    </p>
                  </div>
                  <button className="text-gray-400 p-2">
                    <MoreHorizontal size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-3">Browse Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Hip-Hop", "Pop", "Rock", "Electronic", "R&B", "Jazz", "Classical", "Country"].map((category) => (
              <div
                key={category}
                className="aspect-video bg-gradient-to-br from-[#FF2D55] to-[#FF9500] rounded-lg flex items-center justify-center"
              >
                <span className="font-bold text-white">{category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderMiniPlayer = () => (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="bg-[#1C1C1E] border-t border-gray-800 p-2"
    >
      <div className="flex items-center">
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveView("player")}
          className="flex items-center flex-1"
        >
          <img
            src={currentSong.cover || "/placeholder.svg"}
            alt={currentSong.title}
            className="w-10 h-10 rounded-md mr-3 object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{currentSong.title}</h4>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
          </div>
        </motion.div>

        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#FF2D55] flex items-center justify-center mr-2"
          >
            {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white ml-0.5" />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center"
          >
            <SkipForward size={18} className="text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="h-full w-full bg-black text-white flex flex-col">
      {/* Main content */}
      <AnimatePresence mode="wait">
        {activeView === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="p-4 flex items-center justify-between">
              <button onClick={onClose} className="text-white">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold">Apple Music</h1>
              <button className="text-white">
                <MoreHorizontal size={24} />
              </button>
            </div>
            {renderHomeView()}
          </motion.div>
        )}

        {activeView === "player" && (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {renderPlayerView()}
          </motion.div>
        )}

        {activeView === "playlist" && (
          <motion.div
            key="playlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {renderPlaylistView()}
          </motion.div>
        )}

        {activeView === "library" && (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="p-4 flex items-center justify-between">
              <button onClick={onClose} className="text-white">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold">Library</h1>
              <button className="text-white">
                <MoreHorizontal size={24} />
              </button>
            </div>
            {renderLibraryView()}
          </motion.div>
        )}

        {activeView === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="p-4 flex items-center justify-between">
              <button onClick={onClose} className="text-white">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold">Search</h1>
              <button className="text-white">
                <MoreHorizontal size={24} />
              </button>
            </div>
            {renderSearchView()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini player (when not in player view) */}
      {activeView !== "player" && isPlaying && renderMiniPlayer()}

      {/* Bottom navigation */}
      {activeView !== "player" && (
        <div className="bg-[#1C1C1E] border-t border-gray-800 p-2">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveView("home")}
              className={`flex flex-col items-center p-2 ${activeView === "home" ? "text-[#FF2D55]" : "text-gray-400"}`}
            >
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>

            <button
              onClick={() => setActiveView("search")}
              className={`flex flex-col items-center p-2 ${activeView === "search" ? "text-[#FF2D55]" : "text-gray-400"}`}
            >
              <Search size={20} />
              <span className="text-xs mt-1">Search</span>
            </button>

            <button
              onClick={() => setActiveView("library")}
              className={`flex flex-col items-center p-2 ${activeView === "library" ? "text-[#FF2D55]" : "text-gray-400"}`}
            >
              <Library size={20} />
              <span className="text-xs mt-1">Library</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

