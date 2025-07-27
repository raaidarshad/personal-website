import dynamic from 'next/dynamic'
import { ComponentType, useState, useEffect } from 'react'

interface AudioPlayerProps {
  playList: Array<{
    name: string
    writer: string
    img?: string
    src: string
    id: number
  }>
  activeUI: {
    all: boolean
    playButton: boolean
    prevNnext: boolean
    volume: boolean
    volumeSlider: boolean
    repeatType: boolean
    trackTime: boolean
    trackInfo: boolean
    artwork: boolean
    progress: 'bar' | 'waveform' | boolean
    playList: 'sortable' | 'unSortable' | false
  }
  audioInitialState: {
    repeatType: 'ALL' | 'SINGLE' | 'NONE'
    volume: number
    curPlayId: number
  }
  placement?: {
    player: string
    playList: string
  }
}

// Simple dynamic import with no SSR - cast to any to avoid TS issues
const AudioPlayer = dynamic(() => import('react-modern-audio-player') as any, {
  ssr: false,
  loading: () => <p>Loading audio player...</p>
}) as ComponentType<AudioPlayerProps>

export default function Music() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  // Your playlist data
  const playList = [
    {
      name: 'Edge of Bliss Demo v0',
      writer: 'Raaid',
      img: '/images/raaid-logo.jpeg',
      src: '/audio/EdgeOfBlissDemoV0.mp3',
      id: 1
    },
    {
      name: 'Edge of Bliss Demo v1',
      writer: 'Raaid',
      img: '/images/raaid-logo.jpeg',
      src: '/audio/EdgeOfBlissDemoV1.mp3',
      id: 2
    }
  ]

  // Optional: Customize which UI elements are shown
  const activeUI = {
    all: true, // Show all controls
    playButton: true,
    prevNnext: true,
    volume: !isMobile,
    volumeSlider: !isMobile,
    repeatType: false,
    trackTime: !isMobile,
    trackInfo: true,
    artwork: !isMobile,
    progress: isMobile ? false : ('waveform' as const), // or "waveform" for waveform visualization
    playList: 'sortable' as const // "sortable", "unSortable", or false
  }

  // Optional: Initial player state
  const audioInitialState = {
    repeatType: 'ALL' as const,
    volume: 1.0,
    curPlayId: 2, // Start with first song (id: 1)
    isPlaylistOpen: true
  }

  // Optional: Customize placement
  const placement = {
    player: 'bottom' as const,
    playList: 'bottom' as const
  }

  return (
    <div
      style={{
        maxWidth: isMobile ? '100%' : '800px',
        margin: '0 auto',
        padding: isMobile ? '10px' : '20px',
        width: '100%'
      }}
    >
      <h1>My Songs</h1>

      <div
        style={{
          width: '100%',
          overflow: 'hidden' // Prevent horizontal scroll
        }}
      >
        <AudioPlayer
          playList={playList}
          activeUI={activeUI}
          audioInitialState={audioInitialState}
          //   placement={placement}
        />
      </div>
    </div>
  )
}
