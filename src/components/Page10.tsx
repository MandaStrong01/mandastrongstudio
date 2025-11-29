import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Maximize2 } from 'lucide-react';

interface Page10Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page10({ onNext, onBack }: Page10Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = [
    { file: '/video/dtsb_120min.mp4', title: 'Full Movie - 120 Minutes', desc: 'Complete uninterrupted viewing experience' },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
    }
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-4">
      <div className="text-center max-w-6xl w-full mx-auto pt-8">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-orange-400 mb-4">
          🎬 Doxy: The School Bully
        </h1>
        <p className="text-orange-300 text-xl mb-6">A MandaStrong1 Film - 120 Minute Expanded Final Cut</p>

        <div className="bg-neutral-900 border-2 border-orange-500 rounded-2xl p-6 mb-8 max-w-5xl mx-auto">
          <div className="text-orange-400 font-bold text-lg mb-4">
            Now Playing: {videos[currentIndex].title}
          </div>

          <div className="border-2 border-orange-500 rounded-xl overflow-hidden shadow-2xl mb-6 relative">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              controls
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnd}
            >
              <source src={videos[currentIndex].file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg font-bold transition-all hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
              title="Previous"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg font-bold transition-all hover:scale-105"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === videos.length - 1}
              className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg font-bold transition-all hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
              title="Next"
            >
              <SkipForward className="w-6 h-6" />
            </button>
            <button
              onClick={handleFullscreen}
              className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg font-bold transition-all hover:scale-105"
              title="Fullscreen"
            >
              <Maximize2 className="w-6 h-6" />
            </button>
          </div>

          <p className="text-orange-200 text-sm">
            {videos[currentIndex].desc}
          </p>
        </div>

        <div className="bg-neutral-900 border-2 border-orange-500 rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-orange-400 mb-4">Movie Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Duration</div>
              <div className="text-white">120 Minutes</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Quality</div>
              <div className="text-white">768P HD</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Characters</div>
              <div className="text-white">Doxy, Ethan, Lily</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Genre</div>
              <div className="text-white">Drama</div>
            </div>
          </div>
          <p className="text-orange-200 text-lg leading-relaxed mb-4">
            Experience the compelling 120-minute story of Doxy, a powerful narrative about courage, friendship, and standing up against bullying. Watch as a school bully transforms through meaningful connections and discovers the power of empathy and change.
          </p>
          <p className="text-orange-300">
            Written and directed by MandaStrong1
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-orange-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-orange-500 transition-all hover:scale-105"
          >
            Continue to Editor
          </button>
        </div>

        <footer className="border-t-2 border-orange-500 pt-6 mt-12">
          <p className="text-white text-sm">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>
    </div>
  );
}
