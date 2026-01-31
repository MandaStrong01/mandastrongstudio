import { useState, useEffect } from 'react';
import QuickNav from './QuickNav';

interface Page1Props {
  onNext: () => void;
  onNavigate: (page: number) => void;
  currentPage: number;
}

export default function Page1({ onNext, onNavigate, currentPage }: Page1Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    const bgVideo = document.querySelector('video') as HTMLVideoElement;
    if (bgVideo && !audioEnabled) {
      const enableAudio = () => {
        bgVideo.muted = false;
        bgVideo.play().catch(() => {});
        setAudioEnabled(true);
        document.removeEventListener('click', enableAudio);
      };
      document.addEventListener('click', enableAudio, { once: true });
    }
  }, [audioEnabled]);

  const handlePlayClick = () => {
    const video = document.getElementById('avatar-video') as HTMLVideoElement;
    const bgVideo = document.querySelector('video') as HTMLVideoElement;

    if (bgVideo && !audioEnabled) {
      bgVideo.muted = false;
      bgVideo.play().catch(() => {});
      setAudioEnabled(true);
    }

    if (video) {
      video.loop = false;
      video.currentTime = 0;
      video.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 text-center px-4 pt-6">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-wider mb-4" style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.8), 2px 2px 4px rgba(0,0,0,0.9)' }}>
          MANDASTRONG'S STUDIO
        </h1>
        <p className="text-xl md:text-2xl font-bold text-white tracking-wide" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.6), 2px 2px 4px rgba(0,0,0,0.9)' }}>
          An All In One Make A Movie App! 2 ~ 2.5 Hours Duration
        </p>
      </div>

      <div className="relative z-10 flex-1"></div>

      <div className="fixed bottom-4 left-0 right-0 z-10 px-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-700 transition-all hover:scale-105 border-2 border-white"
          >
            Next
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-700 transition-all hover:scale-105 border-2 border-white"
          >
            Login
          </button>
          <button
            onClick={() => onNavigate(3)}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-700 transition-all hover:scale-105 border-2 border-white"
          >
            Register
          </button>
        </div>
      </div>

      <div
        className="w-28 h-36 border-4 border-purple-500 shadow-2xl overflow-hidden cursor-pointer"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 50,
          borderRadius: '50%'
        }}
        onClick={handlePlayClick}
      >
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-0 h-0 border-l-[20px] border-l-purple-500 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1 drop-shadow-lg"></div>
          </div>
        )}
        <video
          id="avatar-video"
          className="w-full h-full object-cover"
          playsInline
          onEnded={handleVideoEnd}
        >
          <source src="https://umrzctjpjveocpzdyjxs.supabase.co/storage/v1/object/public/videos/avatar_full.mp4" type="video/mp4" />
        </video>
      </div>
      <QuickNav onNavigate={onNavigate} currentPage={currentPage} />
    </div>
  );
}
