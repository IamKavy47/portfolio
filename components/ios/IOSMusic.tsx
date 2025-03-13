"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, List, Repeat, Shuffle } from "lucide-react"
import { motion } from "framer-motion"

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

export default function IOSMusic({ onClose }: IOSMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const songs: Song[] = [
    {
      id: 1,
      title: "Dreamy Nights",
      artist: "Ambient Collective",
      album: "Chill Sessions",
      cover: "/placeholder.svg?height=300&width=300&text=Dreamy+Nights",
      duration: 180,
      file: "https://example.com/song1.mp3",
    },
    {
      id: 2,
      title: "Urban Rhythm",
      artist: "City Beats",
      album: "Downtown",
      cover: "/placeholder.svg?height=300&width=300&text=Urban+Rhythm",
      duration: 210,
      file: "https://example.com/song2.mp3",
    },
    {
      id: 3,
      title: "Ocean Waves",
      artist: "Nature Sounds",
      album: "Relaxation",
      cover: "/placeholder.svg?height=300&width=300&text=Ocean+Waves",
      duration: 240,
      file: "https://example.com/song3.mp3",
    },
    {
      id: 4,
      title: "Electric Dreams",
      artist: "Synth Masters",
      album: "Retrowave",
      cover: "/placeholder.svg?height=300&width=300&text=Electric+Dreams",
      duration: 195,
      file: "https://example.com/song4.mp3",
    },
  ]

  const currentSong = songs[currentSongIndex]

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSongIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
    if (isPlaying) {
      setIsPlaying(false)
      setTimeout(() => setIsPlaying(true), 100)
    }
  }

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
    if (isPlaying) {
      setIsPlaying(false)
      setTimeout(() => setIsPlaying(true), 100)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-purple-900 to-black text-white flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <button onClick={onClose} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="text-center">
          <div className="text-xs opacity-70">Now Playing</div>
          <div className="text-sm font-medium">My Playlist</div>
        </div>
        <button className="text-white">
          <List size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
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
              background: `linear-gradient(to right, white ${(currentTime / (duration || currentSong.duration)) * 100}%, rgba(255,255,255,0.3) 0%)`,
            }}
          />
        </div>

        <div className="flex items-center justify-between w-full px-4 mb-8">
          <button className="text-gray-300">
            <Shuffle size={20} />
          </button>

          <div className="flex items-center space-x-6">
            <motion.button whileTap={{ scale: 0.95 }} onClick={handlePrevious} className="text-white">
              <SkipBack size={28} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-purple-900 flex items-center justify-center"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </motion.button>

            <motion.button whileTap={{ scale: 0.95 }} onClick={handleNext} className="text-white">
              <SkipForward size={28} />
            </motion.button>
          </div>

          <button className="text-gray-300">
            <Repeat size={20} />
          </button>
        </div>

        <div className="flex items-center w-full">
          <Volume2 size={16} className="text-gray-300 mr-2" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={0.7}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.file} onEnded={handleNext} />
    </div>
  )
}

