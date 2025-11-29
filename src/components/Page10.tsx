import { Film } from 'lucide-react';

interface Page10Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page10({ onNext, onBack }: Page10Props) {
  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-4">
      <div className="text-center max-w-6xl w-full mx-auto pt-8">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-orange-400 mb-4">
          🎬 Doxy: The School Bully
        </h1>
        <p className="text-orange-300 text-xl mb-6">A MandaStrong1 Film - 120 Minute Expanded Final Cut</p>

        <div className="bg-neutral-900 border-2 border-orange-500 rounded-2xl p-8 mb-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Film className="w-32 h-32 text-orange-400 opacity-50" />
          </div>

          <h2 className="text-3xl font-bold text-orange-400 mb-4">Movie Coming Soon</h2>

          <div className="bg-black/50 border border-orange-500 rounded-lg p-6 mb-6">
            <p className="text-orange-200 text-lg mb-4">
              The complete 120-minute film "Doxy: The School Bully" is currently in production.
              This powerful story about transformation, courage, and standing up against bullying will be available soon.
            </p>
            <p className="text-orange-300 text-sm">
              In the meantime, you can use MandaStrong's Studio to create your own amazing movie projects!
            </p>
          </div>

          <div className="text-left bg-black/30 rounded-lg p-6 border border-orange-500/30">
            <h3 className="text-xl font-bold text-orange-400 mb-3">About the Film</h3>
            <p className="text-orange-200 mb-4">
              "Doxy: The School Bully" tells the compelling story of redemption and personal growth.
              Watch as a feared school bully discovers the power of empathy and friendship through
              meaningful connections with unlikely allies.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Main Characters</div>
                <div className="text-white">Doxy, Ethan, Lily</div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Setting</div>
                <div className="text-white">Westview High School</div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Themes</div>
                <div className="text-white">Redemption, Friendship, Growth</div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Genre</div>
                <div className="text-white">Drama, Coming-of-Age</div>
              </div>
            </div>
          </div>
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
