"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Window from "./Window"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  Heart,
  Search,
  ListMusic,
  MusicIcon,
  Radio,
  ChevronRight,
  Home,
  ChevronLeft,
} from "lucide-react"

interface MusicProps {
  onClose: () => void
  onFocus: () => void
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

export default function Music({ onClose, onFocus }: MusicProps) {
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
  const [activeView, setActiveView] = useState<"home" | "player" | "playlist" | "library" | "search">("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
  }

  const handleSearchSongSelect = (song: Song) => {
    // Find which playlist contains this song
    for (let i = 0; i < playlists.length; i++) {
      const songIndex = playlists[i].songs.findIndex((s) => s.id === song.id)
      if (songIndex !== -1) {
        setCurrentPlaylistIndex(i)
        setCurrentSongIndex(songIndex)
        setIsPlaying(true)
        return
      }
    }
  }

  return (
    <Window title="Apple Music" onClose={onClose} onFocus={onFocus} initialSize={{ width: 900, height: 600 }}>
      <div className="flex h-full bg-white text-gray-800">
        {/* Sidebar */}
        <div className={`bg-gray-100 border-r border-gray-200 flex flex-col ${sidebarCollapsed ? "w-16" : "w-56"}`}>
          <div className="p-4 flex items-center justify-between">
            {!sidebarCollapsed && <h2 className="font-semibold text-red-500">Music</h2>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-500 hover:text-gray-700"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-2">
              {!sidebarCollapsed ? (
                <>
                  <div className="mb-6">
                    <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase">Library</h3>
                    <button
                      onClick={() => setActiveView("home")}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeView === "home" ? "bg-gray-200" : "hover:bg-gray-200"}`}
                    >
                      <Home size={18} className="mr-3 text-gray-600" />
                      <span>Home</span>
                    </button>
                    <button
                      onClick={() => setActiveView("search")}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeView === "search" ? "bg-gray-200" : "hover:bg-gray-200"}`}
                    >
                      <Search size={18} className="mr-3 text-gray-600" />
                      <span>Search</span>
                    </button>
                    <button
                      onClick={() => setActiveView("library")}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeView === "library" ? "bg-gray-200" : "hover:bg-gray-200"}`}
                    >
                      <ListMusic size={18} className="mr-3 text-gray-600" />
                      <span>Library</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase">Playlists</h3>
                    {playlists.map((playlist, index) => (
                      <button
                        key={playlist.id}
                        onClick={() => handlePlaylistSelect(index)}
                        className={`w-full flex items-center px-2 py-2 rounded-md text-left ${
                          currentPlaylistIndex === index && activeView === "playlist"
                            ? "bg-gray-200"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src={playlist.cover || "/placeholder.svg"}
                          alt={playlist.title}
                          className="w-8 h-8 rounded mr-3 object-cover"
                        />
                        <span className="truncate">{playlist.title}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-6 mt-4">
                  <button
                    onClick={() => setActiveView("home")}
                    className={`p-2 rounded-md ${activeView === "home" ? "bg-gray-200" : "hover:bg-gray-200"}`}
                  >
                    <Home size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setActiveView("search")}
                    className={`p-2 rounded-md ${activeView === "search" ? "bg-gray-200" : "hover:bg-gray-200"}`}
                  >
                    <Search size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setActiveView("library")}
                    className={`p-2 rounded-md ${activeView === "library" ? "bg-gray-200" : "hover:bg-gray-200"}`}
                  >
                    <ListMusic size={20} className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main View */}
          <div className="flex-1 overflow-y-auto">
            {activeView === "home" && (
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Listen Now</h1>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Top Playlists</h2>
                    <button className="text-red-500 text-sm font-medium">See All</button>
                  </div>
                  <div className="grid grid-cols-4 gap-6">
                    {playlists.map((playlist, index) => (
                      <div
                        key={playlist.id}
                        onClick={() => handlePlaylistSelect(index)}
                        className="cursor-pointer group"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                          <img
                            src={playlist.cover || "/placeholder.svg"}
                            alt={playlist.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium">{playlist.title}</h3>
                        <p className="text-sm text-gray-500">{playlist.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recently Played</h2>
                    <button className="text-red-500 text-sm font-medium">See All</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {playlists
                      .flatMap((p) => p.songs)
                      .slice(0, 6)
                      .map((song) => (
                        <div
                          key={song.id}
                          onClick={() => handleSearchSongSelect(song)}
                          className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        >
                          <img
                            src={song.cover || "/placeholder.svg"}
                            alt={song.title}
                            className="w-12 h-12 rounded mr-3 object-cover"
                          />
                          <div>
                            <h4 className="font-medium">{song.title}</h4>
                            <p className="text-sm text-gray-500">{song.artist}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === "playlist" && (
              <div className="p-6">
                <div className="flex items-start mb-6">
                  <img
                    src={currentPlaylist.cover || "/placeholder.svg"}
                    alt={currentPlaylist.title}
                    className="w-48 h-48 rounded-lg shadow-md object-cover mr-6"
                  />
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{currentPlaylist.title}</h1>
                    <p className="text-gray-600 mb-4">{currentPlaylist.description}</p>
                    <p className="text-sm text-gray-500 mb-4">{currentPlaylist.songs.length} songs</p>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setCurrentSongIndex(0)
                          setIsPlaying(true)
                        }}
                        className="bg-red-500 text-white px-6 py-2 rounded-full font-medium"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => {
                          const randomIndex = Math.floor(Math.random() * currentPlaylist.songs.length)
                          setCurrentSongIndex(randomIndex)
                          setIsPlaying(true)
                        }}
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium"
                      >
                        Shuffle
                      </button>
                    </div>
                  </div>
                </div>

                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-2 font-medium w-8">#</th>
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Artist</th>
                      <th className="pb-2 font-medium">Album</th>
                      <th className="pb-2 font-medium text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPlaylist.songs.map((song, index) => (
                      <tr
                        key={song.id}
                        onClick={() => {
                          setCurrentSongIndex(index)
                          setIsPlaying(true)
                        }}
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          currentSongIndex === index && currentPlaylistIndex === currentPlaylistIndex
                            ? "bg-gray-100"
                            : ""
                        }`}
                      >
                        <td className="py-3 text-sm text-gray-500">{index + 1}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <img
                              src={song.cover || "/placeholder.svg"}
                              alt={song.title}
                              className="w-10 h-10 rounded mr-3 object-cover"
                            />
                            <span
                              className={
                                currentSongIndex === index && currentPlaylistIndex === currentPlaylistIndex
                                  ? "font-medium text-red-500"
                                  : "font-medium"
                              }
                            >
                              {song.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600">{song.artist}</td>
                        <td className="py-3 text-gray-600">{song.album || "-"}</td>
                        <td className="py-3 text-right text-gray-500">{formatTime(song.duration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeView === "search" && (
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Search</h1>

                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for songs, artists, or albums"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
                  </div>
                </div>

                {searchQuery ? (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Results</h2>
                    {filteredSongs.length > 0 ? (
                      <table className="w-full">
                        <thead className="border-b border-gray-200">
                          <tr className="text-left text-sm text-gray-500">
                            <th className="pb-2 font-medium">Title</th>
                            <th className="pb-2 font-medium">Artist</th>
                            <th className="pb-2 font-medium">Album</th>
                            <th className="pb-2 font-medium text-right">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSongs.map((song) => (
                            <tr
                              key={song.id}
                              onClick={() => handleSearchSongSelect(song)}
                              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            >
                              <td className="py-3">
                                <div className="flex items-center">
                                  <img
                                    src={song.cover || "/placeholder.svg"}
                                    alt={song.title}
                                    className="w-10 h-10 rounded mr-3 object-cover"
                                  />
                                  <span className="font-medium">{song.title}</span>
                                </div>
                              </td>
                              <td className="py-3 text-gray-600">{song.artist}</td>
                              <td className="py-3 text-gray-600">{song.album || "-"}</td>
                              <td className="py-3 text-right text-gray-500">{formatTime(song.duration)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
                    <div className="grid grid-cols-4 gap-4">
                      {["Hip-Hop", "Pop", "Rock", "Electronic", "R&B", "Jazz", "Classical", "Country"].map(
                        (category) => (
                          <div
                            key={category}
                            className="aspect-video bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <span className="font-bold text-white">{category}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === "library" && (
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Library</h1>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center hover:bg-gray-200 cursor-pointer">
                    <ListMusic size={24} className="text-red-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Playlists</h3>
                      <p className="text-sm text-gray-500">{playlists.length} playlists</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 flex items-center hover:bg-gray-200 cursor-pointer">
                    <MusicIcon size={24} className="text-red-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Artists</h3>
                      <p className="text-sm text-gray-500">
                        {new Set(playlists.flatMap((p) => p.songs).map((s) => s.artist)).size} artists
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 flex items-center hover:bg-gray-200 cursor-pointer">
                    <Radio size={24} className="text-red-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Albums</h3>
                      <p className="text-sm text-gray-500">
                        {
                          new Set(
                            playlists
                              .flatMap((p) => p.songs)
                              .map((s) => s.album)
                              .filter(Boolean),
                          ).size
                        }{" "}
                        albums
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-semibold mb-4">Your Playlists</h2>
                <div className="grid grid-cols-4 gap-6">
                  {playlists.map((playlist, index) => (
                    <div key={playlist.id} onClick={() => handlePlaylistSelect(index)} className="cursor-pointer group">
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                        <img
                          src={playlist.cover || "/placeholder.svg"}
                          alt={playlist.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{playlist.title}</h3>
                      <p className="text-sm text-gray-500">{playlist.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Player Controls */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex items-center w-1/4">
                <img
                  src={currentSong.cover || "/placeholder.svg"}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded mr-3 object-cover"
                />
                <div className="min-w-0">
                  <h4 className="font-medium text-sm truncate">{currentSong.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-2">
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`text-gray-500 hover:text-gray-700 ${isShuffle ? "text-red-500" : ""}`}
                  >
                    <Shuffle size={16} />
                  </button>

                  <button onClick={handlePrevious} className="text-gray-700 hover:text-gray-900">
                    <SkipBack size={20} />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </button>

                  <button onClick={handleNext} className="text-gray-700 hover:text-gray-900">
                    <SkipForward size={20} />
                  </button>

                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`text-gray-500 hover:text-gray-700 ${isRepeat ? "text-red-500" : ""}`}
                  >
                    <Repeat size={16} />
                  </button>
                </div>

                <div className="w-full flex items-center space-x-2 text-xs text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || currentSong.duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ef4444 ${(currentTime / (duration || currentSong.duration)) * 100}%, #d1d5db 0%)`,
                    }}
                  />
                  <span>{formatTime(duration || currentSong.duration)}</span>
                </div>
              </div>

              <div className="w-1/4 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`${isLiked ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Heart size={16} fill={isLiked ? "#ef4444" : "none"} />
                </button>

                <div className="flex items-center space-x-2">
                  <Volume2 size={16} className="text-gray-500" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #9ca3af ${volume * 100}%, #d1d5db 0%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}

