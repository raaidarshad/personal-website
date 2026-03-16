import dynamic from 'next/dynamic'
import { ComponentType, useState, useEffect, useRef } from 'react'

export interface Track {
  name: string
  writer: string
  img: string
  src: string
  id: number
}

interface AudioPlayerProps {
  playList: Track[]
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
}

const AudioPlayer = dynamic(() => import('react-modern-audio-player') as any, {
  ssr: false,
  loading: () => <p>Loading audio player...</p>
}) as ComponentType<AudioPlayerProps>

export default function MusicPlayer({ tracks, title, initialTrackId = 1, children }: {
  tracks: Track[]
  title: string
  initialTrackId?: number
  children?: React.ReactNode
}) {
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  useEffect(() => {
    // The library initializes the playlist as closed with no external API to open it.
    // The AudioPlayer is loaded via dynamic import so we wait a tick before clicking.
    const id = setTimeout(() => {
      const trigger = containerRef.current?.querySelector<HTMLElement>('.drawer-trigger-wrapper')
      trigger?.click()
    }, 50)
    return () => clearTimeout(id)
  }, [])

  const activeUI = {
    all: true,
    playButton: true,
    prevNnext: true,
    volume: !isMobile,
    volumeSlider: !isMobile,
    repeatType: false,
    trackTime: !isMobile,
    trackInfo: true,
    artwork: !isMobile,
    progress: isMobile ? false : ('waveform' as const),
    playList: 'sortable' as const,
  }

  const audioInitialState = {
    repeatType: 'ALL' as const,
    volume: 1.0,
    curPlayId: initialTrackId,
  }

  return (
    <div ref={containerRef} style={{
      maxWidth: isMobile ? '100%' : '800px',
      margin: '0 auto',
      padding: isMobile ? '10px' : '20px',
      width: '100%',
    }}>
      {title && <h1>{title}</h1>}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <AudioPlayer
          playList={tracks}
          activeUI={activeUI}
          audioInitialState={audioInitialState}
        />
      </div>
      {children}
    </div>
  )
}
