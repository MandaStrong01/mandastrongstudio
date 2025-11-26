import { useState } from 'react';
import { Film, Upload, Sparkles, Play } from 'lucide-react';

interface BuilderPageProps {
  onBack: () => void;
}

export default function BuilderPage({ onBack }: BuilderPageProps) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-8">
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-4">
            Create Your Movie
          </h1>
          <p className="text-purple-300 text-lg">Simple 3-step process to create amazing videos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-black border-2 border-purple-500 rounded-2xl p-8 mb-6">
          <div className="flex justify-between mb-8">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-purple-400' : 'text-gray-600'}`}>
              <div className={`w-12 h-12 rounded-full ${step >= 1 ? 'bg-purple-600' : 'bg-gray-700'} mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>1</div>
              <p className="text-sm font-semibold">Name Project</p>
            </div>
            <div className={`flex-1 text-center ${step >= 2 ? 'text-purple-400' : 'text-gray-600'}`}>
              <div className={`w-12 h-12 rounded-full ${step >= 2 ? 'bg-purple-600' : 'bg-gray-700'} mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>2</div>
              <p className="text-sm font-semibold">Add Content</p>
            </div>
            <div className={`flex-1 text-center ${step >= 3 ? 'text-purple-400' : 'text-gray-600'}`}>
              <div className={`w-12 h-12 rounded-full ${step >= 3 ? 'bg-purple-600' : 'bg-gray-700'} mx-auto mb-2 flex items-center justify-center text-white font-bold text-xl`}>3</div>
              <p className="text-sm font-semibold">Edit & Export</p>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Film className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Step 1: Name Your Project</h2>
                <p className="text-purple-300">Give your movie a name to get started</p>
              </div>

              <input
                type="text"
                placeholder="Enter project name (e.g., My First Movie)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-6 py-4 rounded-lg bg-black/50 text-white text-xl border-2 border-purple-500 focus:outline-none focus:border-purple-400 placeholder-purple-300/50"
              />

              <button
                onClick={() => projectName.trim() && setStep(2)}
                disabled={!projectName.trim()}
                className={`w-full py-4 rounded-lg text-xl font-bold transition-all ${
                  projectName.trim()
                    ? 'bg-purple-600 text-white hover:bg-purple-500 hover:scale-105'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next: Add Content
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Step 2: Add Content</h2>
                <p className="text-purple-300">Choose how you want to create your movie</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.hash = 'upload'}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg hover:scale-105 transition-all border-2 border-blue-400"
                >
                  <Upload className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-white font-bold text-lg mb-2">Upload Videos</h3>
                  <p className="text-blue-200 text-sm">Upload your own video files to edit</p>
                </button>

                <button
                  onClick={() => window.location.hash = 'page4'}
                  className="bg-gradient-to-br from-pink-600 to-pink-800 p-6 rounded-lg hover:scale-105 transition-all border-2 border-pink-400"
                >
                  <Sparkles className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-white font-bold text-lg mb-2">Use AI Tools</h3>
                  <p className="text-pink-200 text-sm">Generate content with 600+ AI tools</p>
                </button>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full bg-purple-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-purple-500 hover:scale-105 transition-all"
              >
                Next: Edit & Export
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition-all"
              >
                Back
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Play className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Step 3: Edit & Export</h2>
                <p className="text-purple-300">Arrange your clips and create your masterpiece</p>
              </div>

              <button
                onClick={() => window.location.hash = 'video-studio'}
                className="w-full bg-green-600 text-white py-6 rounded-lg text-2xl font-bold hover:bg-green-500 hover:scale-105 transition-all"
              >
                Open Video Studio
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition-all"
              >
                Back
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="w-full bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
        >
          Cancel & Go Back
        </button>
      </div>

      <footer className="mt-8 py-4 border-t border-purple-500 text-center text-white text-sm">
        <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
      </footer>
    </div>
  );
}
