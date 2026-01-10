import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface Page10Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page10({ onNext, onBack }: Page10Props) {
  const [videoUrl] = useState<string>('https://custom-2-hour-movie-lftx.bolt.host/');

  const handleOpenFullscreen = () => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-4">
      <div className="text-center max-w-6xl w-full mx-auto pt-16">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-purple-400 mb-4">
          🎬 Doxy: The School Bully
        </h1>
        <p className="text-purple-300 text-xl mb-6">A MandaStrong1 Film - 120 Minutes</p>

        <div className="border-2 border-purple-500 rounded-2xl overflow-hidden shadow-2xl mb-8 max-w-5xl mx-auto relative">
          <iframe
            src={videoUrl}
            className="w-full aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Doxy: The School Bully Full Movie"
          />
        </div>
        <button
          onClick={handleOpenFullscreen}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2 mx-auto mb-6"
        >
          <ExternalLink className="w-5 h-5" />
          Open in New Tab
        </button>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-purple-400 mb-4">About the Film</h2>
          <p className="text-purple-200 text-lg leading-relaxed mb-4">
            Experience the compelling 120-minute story of Doxy, a powerful narrative about courage, friendship, and standing up against bullying.
          </p>
          <p className="text-purple-300 mb-6">
            Written and directed by MandaStrong1
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Continue to Editor
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-12">
          <p className="text-white text-sm">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>
    </div>
  );
}
