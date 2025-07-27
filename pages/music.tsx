import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface AudioPlayerProps {
    playList: Array<{
      name: string;
      writer: string;
      img?: string;
      src: string;
      id: number;
    }>;
    activeUI: {
      all: boolean;
      playButton: boolean;
      prevNnext: boolean;
      volume: boolean;
      volumeSlider: boolean;
      repeatType: boolean;
      trackTime: boolean;
      trackInfo: boolean;
      artwork: boolean;
      progress: "bar" | "waveform" | false;
      playList: "sortable" | "unSortable" | false;
    };
    audioInitialState: {
      repeatType: "ALL" | "SINGLE" | "NONE";
      volume: number;
      curPlayId: number;
    };
    placement?: {
      player: string;
      playList: string;
    };
  }

// Simple dynamic import with no SSR - cast to any to avoid TS issues
const AudioPlayer = dynamic(() => import('react-modern-audio-player') as any, {
  ssr: false,
  loading: () => <p>Loading audio player...</p>,
}) as ComponentType<AudioPlayerProps>;

export default function Music() {
  // Your playlist data
  const playList = [
    {
      name: 'Edge of Bliss Demo v0',
      writer: 'Raaid',
      img: '/images/raaid-logo.jpeg',
      src: '/audio/EdgeOfBlissDemoV0.mp3',
      id: 1,
    },
    {
      name: 'Edge of Bliss Demo v1',
      writer: 'Raaid',
      img: '/images/raaid-logo.jpeg',
      src: '/audio/EdgeOfBlissDemoV1.mp3',
      id: 2,
    },
  ];

  // Optional: Customize which UI elements are shown
  const activeUI = {
    all: true,        // Show all controls
    playButton: true,
    prevNnext: true,
    volume: true,
    volumeSlider: true,
    repeatType: true,
    trackTime: true,
    trackInfo: true,
    artwork: true,
    progress: "waveform" as const, // or "waveform" for waveform visualization
    playList: "sortable" as const, // "sortable", "unSortable", or false
  };

  // Optional: Initial player state
  const audioInitialState = {
    repeatType: "ALL" as const,
    volume: 1.0,
    curPlayId: 2, // Start with first song (id: 1)
    isPlaylistOpen: true,
  };

  // Optional: Customize placement
  const placement = {
    player: "bottom" as const,
    playList: "bottom" as const,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>My Songs</h1>
      
      <AudioPlayer
        playList={playList}
        activeUI={activeUI}
        audioInitialState={audioInitialState}
        // placement={placement}
      />
    </div>
  );
}