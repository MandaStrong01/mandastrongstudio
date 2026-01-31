import { useState } from 'react';
import { Heart, ExternalLink, Users, DollarSign, BookOpen } from 'lucide-react';
import UserGuide from './UserGuide';

interface Page21Props {
  onBack: () => void;
  onHome: () => void;
}

export default function Page21({ onBack, onHome }: Page21Props) {
  const [showGuide, setShowGuide] = useState(false);
  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="border-2 border-purple-500 rounded-2xl overflow-hidden shadow-2xl mb-12 max-w-4xl mx-auto">
          <video
            className="w-full"
            controls
            autoPlay
            playsInline
          >
            <source src="/video/thatsallfolks" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h1 className="text-5xl font-bold mb-8 text-center cinematic-title text-purple-400" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          That's All Folks!
        </h1>

        <div className="space-y-6 mb-12 max-w-4xl mx-auto">
          <div className="bg-purple-900/40 backdrop-blur rounded-2xl border-2 border-purple-500 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">A Personal Thank You From MandaStrong1</h2>
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-white">
              <p className="text-xl font-semibold text-white">
                Dear Friend and Fellow Creator,
              </p>
              <p>
                Thank you from the bottom of my heart for using MandaStrong Studio. This platform was born from a dream - to empower EVERY person, regardless of their technical background or resources, to tell their stories through film.
              </p>
              <p>
                I created this tool because I believe that every voice matters, every story deserves to be heard, and every creator deserves access to professional-grade filmmaking tools. You are now part of a movement that's democratizing movie creation.
              </p>
              <p>
                Whether you're making your first short film, documenting important moments, or crafting the next viral sensation, know that I'm cheering for you every step of the way.
              </p>
              <p className="text-white font-semibold">
                Your creativity inspires me. Your courage to create moves me. Your stories matter.
              </p>
              <p className="text-right italic text-purple-300">
                With gratitude and respect,<br/>
                <span className="text-2xl font-bold text-purple-400">MandaStrong1</span>
              </p>
            </div>
          </div>

          <div className="bg-purple-900/40 backdrop-blur rounded-2xl border-2 border-purple-500 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">Humanity First Fundraiser</h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-white">
              <div className="bg-purple-900/30 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h3 className="text-2xl font-bold text-purple-300 mb-3">Mission Statement</h3>
                <p className="mb-4">
                  I'm Amanda, and I'm dedicated to building a kinder, more inclusive environment through my Education Humanitarian Campaign. With honesty, transparency, and unwavering principles, I stand up for Veterans, Kids and those in need.
                </p>
                <p className="font-semibold text-white italic">
                  One year in: self-taught, battle-tested. New mission: build razor-sharp visual tools that turn messy emotions into clarity, so people connect with real empathy, speak with intent, and treat each other right—no matter what.
                </p>
                <p className="mt-3 text-white">
                  Stay true, stick to your principles, always do the right thing, and lift others up. We're creating a kinder, stronger world. Still grinding. Onward. Together.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/30 border-2 border-purple-500 rounded-xl p-5">
                  <h4 className="text-xl font-bold text-purple-300 mb-2 text-center">Why</h4>
                  <p className="text-sm text-white">
                    Building razor-sharp visual tools that turn messy emotions into clarity. We're creating a platform where people connect with real empathy, speak with intent, and treat each other right.
                  </p>
                </div>

                <div className="bg-black/30 border-2 border-purple-500 rounded-xl p-5">
                  <h4 className="text-xl font-bold text-purple-300 mb-2 text-center">Who</h4>
                  <p className="text-sm text-white">
                    Veterans who've served our country. Kids who need advocates. Underserved communities. Single parents. Activists. Young dreamers. Everyone who deserves a voice.
                  </p>
                </div>

                <div className="bg-black/30 border-2 border-purple-500 rounded-xl p-5">
                  <h4 className="text-xl font-bold text-purple-300 mb-2 text-center">What</h4>
                  <p className="text-sm text-white">
                    Free 30 Minute Booking with Creator. Film workshops and training. Scholarships. Equipment grants. Mental health resources. A kinder, stronger world. Together.
                  </p>
                </div>
              </div>

              <div className="bg-purple-900/50 border-2 border-purple-400 rounded-xl p-6">
                <p className="text-center text-2xl font-bold text-purple-300 mb-4">
                  Join the Movement
                </p>
                <p className="text-center text-white mb-4">
                  Every purchase from my Etsy shop contributes to this mission. Every dollar supports Veterans, Kids, and creators in need.
                </p>
                <a
                  href="https://MandaStrong1.Etsy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all hover:scale-105 border-2 border-white font-bold text-lg text-white"
                >
                  <DollarSign className="w-6 h-6" />
                  Support the Cause - Visit Etsy Store
                  <ExternalLink className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/40 backdrop-blur rounded-2xl border-2 border-purple-500 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Connected</h2>
            <div className="space-y-3">
              <a
                href="https://MandaStrong1.Etsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-black/50 rounded-lg hover:bg-purple-900/50 transition-all border border-purple-500"
              >
                <ExternalLink className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="font-bold text-white">Visit My Etsy Store</div>
                  <div className="text-sm text-purple-300">MandaStrong1.Etsy.com</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-2xl mb-4 text-purple-300 font-semibold">
            Thank you for being part of this journey!
          </p>
          <p className="text-purple-400 mb-6">
            Continue creating, keep inspiring, and never stop telling your story.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all hover:scale-105 font-bold text-white border-2 border-white"
          >
            Back
          </button>
          <button
            onClick={onHome}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all hover:scale-105 font-bold text-white border-2 border-white"
          >
            Back to Home
          </button>
        </div>

        <footer className="mt-12 py-6 border-t-2 border-purple-500 text-center">
          <button
            onClick={() => setShowGuide(true)}
            className="mb-6 inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all hover:scale-105 font-bold text-lg border-2 border-white text-white"
          >
            <BookOpen className="w-6 h-6" />
            Complete User Guide - How To Use MandaStrong1 Studio
          </button>
          <p className="text-purple-400">MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
        </footer>
      </div>

      {showGuide && <UserGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}
