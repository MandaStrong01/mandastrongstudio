import { useState } from 'react';
import { Play } from 'lucide-react';

export default function AvatarVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const video = document.getElementById('avatar-video') as HTMLVideoElement;
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
    <div className="fixed bottom-8 right-8 w-[140px] h-[180px] border-4 border-white rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.5)] overflow-hidden">
      <video
        id="avatar-video"
        className="w-full h-full object-cover"
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src="/video/avatar.mp4" type="video/mp4" />
      </video>
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          aria-label="Play avatar video"
        >
          <div className="w-0 h-0 border-l-[30px] border-l-white border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent ml-2" />
        </button>
      )}
    </div>
  );
}
