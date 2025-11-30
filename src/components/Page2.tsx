import { useEffect } from 'react';

interface Page2Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate: (page: number) => void;
}

export default function Page2({ onNext, onBack, onNavigate }: Page2Props) {
  useEffect(() => {
    const bgVideo = document.querySelector('video') as HTMLVideoElement;
    let isAudioPlaying = false;

    const forceAudioPlay = async () => {
      if (bgVideo && !isAudioPlaying) {
        bgVideo.muted = false;
        bgVideo.volume = 1.0;
        try {
          await bgVideo.play();
          isAudioPlaying = true;
        } catch (error) {
          const enableOnClick = async () => {
            if (bgVideo) {
              bgVideo.muted = false;
              bgVideo.volume = 1.0;
              await bgVideo.play();
              isAudioPlaying = true;
              document.removeEventListener('click', enableOnClick);
            }
          };
          document.addEventListener('click', enableOnClick, { once: true });
        }
      }
    };

    forceAudioPlay();

    return () => {
      if (bgVideo) {
        bgVideo.pause();
        bgVideo.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        playsInline
        preload="auto"
      >
        <source src="/video/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative z-10 text-center px-4 pt-6">
        <h1 className="text-3xl md:text-4xl font-black text-black tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif', textShadow: '4px 4px 8px rgba(0,0,0,0.9), -1px -1px 2px rgba(255,255,255,0.3)' }}>
          MANDASTRONG'S STUDIO
        </h1>
        <p className="text-lg md:text-xl font-bold text-black max-w-4xl mx-auto tracking-wide" style={{ fontFamily: 'Georgia, serif', textShadow: '3px 3px 6px rgba(0,0,0,0.9), -1px -1px 2px rgba(255,255,255,0.3)' }}>
          Welcome! Make Awesome Family Videos Or Turn Your Dreams Into Film Reality! Enjoy.
        </p>
      </div>

      <div className="relative z-10 flex-1"></div>

      <div className="relative z-10 pb-12 px-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-black text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-gray-800 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-black text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-gray-800 transition-all hover:scale-105"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
