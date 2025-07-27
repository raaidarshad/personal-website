import dynamic from 'next/dynamic';

// Dynamically import the AudioPlayer to prevent SSR issues
const AudioPlayer = dynamic(() => import('react-modern-audio-player'), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => <p>Loading audio player...</p>, // Optional loading component
});

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