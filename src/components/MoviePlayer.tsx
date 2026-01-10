import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Home, ArrowLeft } from 'lucide-react';

interface MoviePlayerProps {
  onBack?: () => void;
  onHome?: () => void;
  videoUrl?: string;
  autoTransition?: boolean;
  transitionDelay?: number;
}

export default function MoviePlayer({ onBack, onHome, videoUrl = '/video/dtsb_120min.mp4', autoTransition = false, transitionDelay = 10000 }: MoviePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  useState(() => {
    if (autoTransition && onHome) {
      const playVideo = async () => {
        if (videoRef) {
          try {
            await videoRef.play();
          } catch (error) {
            console.log('Autoplay prevented:', error);
          }
        }
      };
      playVideo();

      const timer = setTimeout(() => {
        onHome();
      }, transitionDelay);
      return () => clearTimeout(timer);
    }
  });

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.requestFullscreen();
      }
    }
  };

  const skipForward = () => {
    if (videoRef) {
      videoRef.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef) {
      videoRef.currentTime -= 10;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="absolute top-6 left-6 flex gap-3 z-10">
        {onBack && (
          <button
            onClick={onBack}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}
        {onHome && (
          <button
            onClick={onHome}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        )}
      </div>
      <div className="w-full max-w-6xl">
        <div className="bg-black rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative group">
            <video
              ref={setVideoRef}
              className="w-full aspect-video bg-black"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls
              controlsList="nodownload"
              autoPlay={autoTransition}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={skipBackward}
                  className="text-white hover:text-blue-400 transition-colors p-3 rounded-full hover:bg-white/10"
                  title="Skip back 10s"
                >
                  <SkipBack className="w-8 h-8" />
                </button>

                <button
                  onClick={togglePlay}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full transition-all transform hover:scale-110 shadow-lg"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                </button>

                <button
                  onClick={skipForward}
                  className="text-white hover:text-blue-400 transition-colors p-3 rounded-full hover:bg-white/10"
                  title="Skip forward 10s"
                >
                  <SkipForward className="w-8 h-8" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-white/10"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-white/10"
                  title="Fullscreen"
                >
                  <Maximize className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-900">
            <h1 className="text-2xl font-bold text-white mb-2">Your Movie</h1>
            <p className="text-gray-400">Click play to start watching. Use the controls to navigate through the video.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
