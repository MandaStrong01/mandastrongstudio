import { useState } from 'react';
import AIToolInterface from './AIToolInterface';

interface Page6Props {
  onNext: () => void;
  onBack: () => void;
}

const tools = [
  "Video Editor AI", "Timeline Builder", "Clip Arranger AI", "Scene Assembler", "Sequence Creator AI", "Cut Optimizer", "Trim Tool AI", "Split Designer",
  "Transition AI", "Cut Generator", "Dissolve Maker AI", "Fade Designer", "Wipe Creator AI", "Slide Effect", "Zoom Transition AI", "Morph Builder",
  "Pacing Analyzer AI", "Rhythm Detector", "Beat Matcher AI", "Tempo Finder", "Flow Optimizer AI", "Speed Controller", "Slow Motion AI", "Time Remap",
  "Shot Selector AI", "Best Take", "Scene Picker AI", "Clip Ranker", "Quality Checker AI", "Focus Analyzer", "Exposure Check AI", "Audio Sync",
  "Multi-Cam AI", "Angle Switcher", "View Selector AI", "Camera Match", "Sync Tool AI", "Edit Point", "J-Cut AI", "L-Cut Designer",
  "B-Roll Finder AI", "Cutaway Generator", "Insert Shot AI", "Coverage Builder", "Supplemental AI", "Detail Shot", "Establishing AI", "Close-Up Finder",
  "Montage Builder AI", "Sequence Creator", "Quick Cut AI", "Fast Edit", "Jump Cut AI", "Match Cut", "Smash Cut AI", "Cross Cut",
  "Audio Mix AI", "Dialogue Balance", "Music Level AI", "SFX Volume", "Voice Clarity AI", "Background Noise", "Ambience Mix AI", "Sound Layer",
  "Color Match AI", "Shot Matcher", "Scene Balance AI", "Continuity Color", "Temperature Match AI", "Exposure Match", "Contrast Balance AI", "Saturation Sync",
  "VFX Placeholder AI", "Effect Marker", "Green Screen AI", "Chroma Key", "Matte Creator AI", "Mask Designer", "Track Point AI", "Stabilizer",
  "Text Overlay AI", "Title Creator", "Caption AI", "Subtitle Generator", "Lower Third AI", "Name Tag", "Credit Scroll AI", "End Card",
  "Export Optimizer AI", "Format Selector", "Quality Preset AI", "Codec Chooser", "Resolution AI", "Bitrate Calculator", "Delivery Spec AI", "Platform Format",
  "Ripple Edit AI", "Rolling Edit AI", "Slip Tool AI", "Slide Tool AI", "Extend Edit AI", "Fill Gap AI", "Close Gap AI", "Snap To Grid AI",
  "Marker Tool AI", "Flag Clip AI", "Label Manager AI", "Color Code AI", "Keyword Tag AI", "Smart Search AI", "Find Replace AI", "Batch Process AI",
  "Audio Ducking AI", "Voice Isolate AI", "Noise Gate AI", "Compressor AI", "EQ Adjust AI", "Limiter AI", "Normalizer AI", "Peak Meter AI"
];

export default function Page6({ onNext, onBack }: Page6Props) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool =>
    tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col px-4 py-8">
        <div className="flex-1">
          <div className="max-w-7xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-purple-900/50 text-white border border-purple-500 focus:outline-none focus:border-purple-400 placeholder-purple-300"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-2 text-center">
            Editing AI Tools
          </h1>
          <p className="text-purple-300 text-center mb-8 text-sm">Video Assembly & Cut Optimization</p>

          <div className="max-w-7xl mx-auto overflow-y-scroll max-h-[calc(100vh-280px)] pr-2">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {filteredTools.map((tool, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTool(tool)}
                  className="bg-purple-900/80 text-white p-3 rounded-lg shadow-lg flex items-center justify-center text-center border border-purple-500 min-h-[60px] hover:bg-purple-800 hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="text-xs font-semibold">{tool}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
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
              Next
            </button>
          </div>
        </div>

        <footer className="mt-8 py-4 border-t border-purple-500 text-center text-white text-sm">
          <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
        </footer>
      </div>

      {selectedTool && (
        <AIToolInterface
          toolName={selectedTool}
          toolCategory="editing"
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}
