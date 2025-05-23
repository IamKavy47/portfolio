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
      description: "Some phonks",
      cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/phonk/phonk.jpeg?height=400&width=400&text=Today's+Hits",
      songs: [
        {
          id: 1,
          title: "Woops",
          artist: "Bounty Hunter Woops (TECHNO)",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/phonk/woops.jpeg?height=400&width=400&text=Woops",
          duration: 259,
          file: "/woop.mp3", // This is a path that should be valid in your project
        },
        {
          id: 2,
          title: "Matushka",
          artist: "satirin",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/phonk/matushka.jpg?height=400&width=400&text=Urban+Rhythm",
          duration: 146,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/phonk/M%F0%9D%9A%8A%F0%9D%9A%9D%F0%9D%9A%9E%F0%9D%9A%9C%F0%9D%9A%91%F0%9D%9A%94%F0%9D%9A%8A%20%20U%F0%9D%9A%95%F0%9D%9A%9D%F0%9D%9A%9B%F0%9D%9A%8A%F0%9D%9A%8F%F0%9D%9A%9E%F0%9D%9A%97%F0%9D%9A%94.mp3",
        },
        {
          id: 3,
          title: "Aura",
          artist: "Ogryzek",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/phonk/aura.jpg?height=400&width=400&text=Ocean+Waves",
          duration: 120,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/phonk/Ogryzek%20-%20AURA%20%28Official%20Visualiser%29.mp3",
        },
      ],
    },
    {
      id: 2,
      title: "Yo Yo Honey Singh",
      description: "Some Honey Singh's Songs..",
      cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/yoyo/millionaire.jpg?height=400&width=400&text=Chill+Vibes",
      songs: [
        {
          id: 4,
          title: "Millionaire",
          artist: "YOYO Honey Singh",
          album: "Glory",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/yoyo/millionaire.jpg?height=400&width=400&text=Sunset+Dreams",
          duration: 209,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/yoyo/millionaire.mp3",
        },
        {
          id: 5,
          title: "Goliyan",
          artist: "YOYO Honey Singh and Diljit Dosanjh",
          album: "International Villager",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/yoyo/iv.jpeg?height=400&width=400&text=Rainy+Day",
          duration: 190,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/yoyo/Goliyan",
        },
      ],
    },
    {
      id: 3,
      title: "Workout Mix",
      description: "High energy tracks to fuel your workout",
      cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/128Sultan%20-%20Sultan%20128%20Kbps-0Ei4Fe3BpA1ULK8v7BXwJhtGiax47J.jpg?height=400&width=400&text=Workout+Mix",
      songs: [
        {
          id: 6,
          title: "Sultan",
          artist: "Sukhwindar Singh",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/128Sultan%20-%20Sultan%20128%20Kbps-0Ei4Fe3BpA1ULK8v7BXwJhtGiax47J.jpg?height=400&width=400&text=Power+Up",
          duration: 255,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/sultan-Qlhd7xFcGsqmgMY4dr6UvZpprA9RtN.mp3",
        },
        {
          id: 7,
          title: "Kar har maidan fateh",
          artist: "Rajkumar Hirani",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/128Kar%20Har%20Maidaan%20Fateh%20-%20Sanju%20128%20Kbps-fo8bOFaCptlSIaBO8q4HoDklbuGOpf.jpg?height=400&width=400&text=Run+Faster",
          duration: 215,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/khmf-ogbOsNr53gDS3zFm3fBmmB75DHwDrM.mp3",
        },
        {
          id: 8,
          title: "Jagga Jiteya",
          artist: "Dalar Mehndi",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/128Jagga%20Jiteya%20-%20Uri%20-%20The%20Surgical%20Strike%20128%20Kbps-v9X7y0lej4eFnoRMPoXYv8Qw01okff.jpg?height=400&width=400&text=Run+Faster",
          duration: 200,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/jj-Gaf6Bpeyzv9kxtlVUVNcUowEnl31lX.mp3",
        },
        {
          id: 9,
          title: "Zinda",
          artist: "Siddharth Mahadevan",
          album: "",
          cover:
            "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/128Bhaag%20Milkha%20Bhaag%20-%20Bhaag%20Milkha%20Bhaag%20128%20Kbps-HK15b834m5prLVjFUf0wBVx17dW5Fa.jpg?height=400&width=400&text=Run+Faster",
          duration: 222,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/workout/128-Zinda%20-%20Bhaag%20Milkha%20Bhaag%20128%20Kbps.mp3",
        },
      ],
    },
    {
      id: 4,
      title: "Hanumankind",
      description: "Hanumankind.....",
      cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/hanumankind/MbJ72KO5khs-HD.jpg",
      songs: [
        {
          id: 10,
          title: "Run it up",
          artist: "Hanumankind",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/hanumankind/MbJ72KO5khs-HD.jpg",
          duration: 193,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/hanumankind/Hanumankind%20-%20Run%20It%20Up%20%28%20Prod.%20By%20Kalmi%20%29%20%20%28Official%20Music%20Video%29.mp3",
        },
        {
          id: 11,
          title: "Big Dawgs",
          artist: "Hanumankind",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/hanumankind/Big_Dawgs_Hanumankind.jpg",
          duration: 190,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/hanumankind/Big%20Dawgs%20-%20Hanumankind%20%28pagalall.com%29.mp3",
        },
      ],
    },
    {
      id: 5,
      title: "Requested",
      description: "Songs requested by visitors.",
      cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/requested/aashiyan.jpeg?height=400&width=400&text=Focus+Flow",
      songs: [
        {
          id: 12,
          title: "Aashiyan",
          artist: "Gini",
          album: "",
          cover: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/requested/aashiyan.jpeg?height=400&width=400&text=Deep+Focus",
          duration: 185,
          file: "https://reriyznm2homh55q.public.blob.vercel-storage.com/music/requested/gini%20-%20Aashiyan%20%20Official%20Performance%20Video.mp3",
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
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Listen Now</h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Playlists</h3>
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
              <h4 className="font-medium text-sm text-gray-900">{playlist.title}</h4>
              <p className="text-xs text-gray-500">{playlist.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recently Played</h3>
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
                className="flex items-center bg-gray-100 p-3 rounded-lg"
              >
                <img
                  src={song.cover || "/placeholder.svg"}
                  alt={song.title}
                  className="w-12 h-12 rounded-md mr-3 object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{song.title}</h4>
                  <p className="text-xs text-gray-500">{song.artist}</p>
                </div>
                <button className="text-gray-500 p-2">
                  <MoreHorizontal size={16} />
                </button>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderPlayerView = () => (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full flex items-center justify-between mb-8">
        <button onClick={() => setActiveView("home")} className="text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <div className="text-xs opacity-70 text-gray-500">Now Playing</div>
          <div className="text-sm font-medium text-gray-900">{currentPlaylist.title}</div>
        </div>
        <button className="text-gray-900">
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
        <h2 className="text-2xl font-bold mb-1 text-gray-900">{currentSong.title}</h2>
        <p className="text-gray-700">{currentSong.artist}</p>
        <p className="text-gray-500 text-sm">{currentSong.album}</p>
      </div>

      <div className="w-full mb-6">
        <div className="flex justify-between text-xs mb-1 text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || currentSong.duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || currentSong.duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #FF2D55 ${(currentTime / (duration || currentSong.duration)) * 100}%, #E5E7EB 0%)`,
          }}
        />
      </div>

      <div className="flex items-center justify-between w-full px-4 mb-8">
        <button
          className={`text-gray-500 ${isShuffle ? "text-[#FF2D55]" : ""}`}
          onClick={() => setIsShuffle(!isShuffle)}
        >
          <Shuffle size={20} />
        </button>

        <div className="flex items-center space-x-6">
          <motion.button whileTap={{ scale: 0.95 }} onClick={handlePrevious} className="text-gray-900">
            <SkipBack size={28} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[#FF2D55] text-white flex items-center justify-center"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={handleNext} className="text-gray-900">
            <SkipForward size={28} />
          </motion.button>
        </div>

        <button className={`text-gray-500 ${isRepeat ? "text-[#FF2D55]" : ""}`} onClick={() => setIsRepeat(!isRepeat)}>
          <Repeat size={20} />
        </button>
      </div>

      <div className="flex items-center w-full mb-4">
        <button className={`mr-4 ${isLiked ? "text-[#FF2D55]" : "text-gray-500"}`} onClick={() => setIsLiked(!isLiked)}>
          <Heart size={20} fill={isLiked ? "#FF2D55" : "none"} />
        </button>
        <Volume2 size={16} className="text-gray-500 mr-2" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #FF2D55 ${volume * 100}%, #E5E7EB 0%)`,
          }}
        />
      </div>
    </div>
  )

  const renderPlaylistView = () => (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-md p-4 flex items-center">
        <button onClick={() => setActiveView("home")} className="text-gray-900 mr-4">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-900">{currentPlaylist.title}</h2>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-6">
          <img
            src={currentPlaylist.cover || "/placeholder.svg"}
            alt={currentPlaylist.title}
            className="w-24 h-24 rounded-lg mr-4 object-cover shadow-lg"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{currentPlaylist.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{currentPlaylist.description}</p>
            <p className="text-xs text-gray-400">{currentPlaylist.songs.length} songs</p>
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
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium text-sm"
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
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
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
                    currentSongIndex === index && currentPlaylistIndex === currentPlaylistIndex
                      ? "text-[#FF2D55]"
                      : "text-gray-900"
                  }`}
                >
                  {song.title}
                </h4>
                <p className="text-xs text-gray-500">{song.artist}</p>
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
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Library</h2>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <ListMusic size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium text-gray-900">Playlists</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <Music size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium text-gray-900">Artists</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <Radio size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium text-gray-900">Albums</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <Clock size={20} className="text-[#FF2D55] mr-3" />
            <span className="font-medium text-gray-900">Recently Added</span>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4 text-gray-900">Your Playlists</h3>
      <div className="space-y-3">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlaylistSelect(index)}
            className="flex items-center bg-gray-100 p-3 rounded-lg"
          >
            <img
              src={playlist.cover || "/placeholder.svg"}
              alt={playlist.title}
              className="w-12 h-12 rounded-md mr-3 object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-900">{playlist.title}</h4>
              <p className="text-xs text-gray-500">{playlist.songs.length} songs</p>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderSearchView = () => (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Search</h2>

      <div className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-md mb-6 pt-2 pb-4">
        <input
          type="text"
          placeholder="Artists, songs, or albums"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 text-gray-900 rounded-lg py-3 px-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF2D55]"
        />
        <Search size={18} className="absolute left-3 top-5 text-gray-500" />
      </div>

      {searchQuery ? (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Results</h3>
          {filteredSongs.length > 0 ? (
            <div className="space-y-3">
              {filteredSongs.map((song) => (
                <motion.div
                  key={song.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSearchSongSelect(song)}
                  className="flex items-center bg-gray-100 p-3 rounded-lg"
                >
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-12 h-12 rounded-md mr-3 object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{song.title}</h4>
                    <p className="text-xs text-gray-500">
                      {song.artist} • {song.album}
                    </p>
                  </div>
                  <button className="text-gray-500 p-2">
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
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Browse Categories</h3>
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
      className="bg-gray-100 border-t border-gray-200 p-2 sticky bottom-[56px] w-full z-10"
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
            <h4 className="font-medium text-sm truncate text-gray-900">{currentSong.title}</h4>
            <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
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
            <SkipForward size={18} className="text-gray-900" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="h-[748px] w-[340px] bg-white text-gray-900 flex flex-col overflow-y-auto">
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
            <div className="p-4 flex items-center sticky justify-between">
              <button onClick={onClose} className="text-gray-900">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Apple Music</h1>
              <button className="text-gray-900">
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
              <button onClick={onClose} className="text-gray-900">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Library</h1>
              <button className="text-gray-900">
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
              <button onClick={onClose} className="text-gray-900">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Search</h1>
              <button className="text-gray-900">
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
        <div className="bg-gray-100 border-t border-gray-200 p-2 sticky bottom-0 w-full">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveView("home")}
              className={`flex flex-col items-center p-2 ${activeView === "home" ? "text-[#FF2D55]" : "text-gray-500"}`}
            >
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>

            <button
              onClick={() => setActiveView("search")}
              className={`flex flex-col items-center p-2 ${activeView === "search" ? "text-[#FF2D55]" : "text-gray-500"}`}
            >
              <Search size={20} />
              <span className="text-xs mt-1">Search</span>
            </button>

            <button
              onClick={() => setActiveView("library")}
              className={`flex flex-col items-center p-2 ${activeView === "library" ? "text-[#FF2D55]" : "text-gray-500"}`}
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

