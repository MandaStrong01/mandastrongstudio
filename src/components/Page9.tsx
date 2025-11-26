import { useState } from 'react';
import AIToolInterface from './AIToolInterface';

interface Page9Props {
  onNext: () => void;
  onBack: () => void;
}

const tools = [
  "Audio Mix AI", "Dialogue Balance", "Music Level AI", "SFX Volume", "Voice Clarity AI", "Noise Remove", "Echo Cancel AI", "Reverb Add",
  "Voice Generator AI", "Text to Speech", "Dialogue Creator AI", "Accent Selector", "Emotion Voice AI", "Age Modifier", "Gender Voice AI", "Character Voice",
  "Music Composer AI", "Score Generator", "Theme Creator AI", "Mood Music", "Genre Select AI", "Tempo Set", "Instrument Mix AI", "Orchestra Build",
  "Sound FX AI", "Foley Generator", "Impact Sound AI", "Ambience Creator", "Nature Sounds AI", "Urban Noise", "Sci-Fi FX AI", "Fantasy Sound",
  "Audio Sync AI", "Lip Sync", "Timing Match AI", "Beat Align", "Dialogue ADR AI", "Voice Replace", "Audio Warp AI", "Time Stretch",
  "Spatial Audio AI", "Surround Mix", "3D Sound AI", "Binaural", "Atmos Creator AI", "Head Track", "Distance Sim AI", "Room Acoustics",
  "Master Mix AI", "Final Balance", "Loudness Normal AI", "Peak Limit", "Dynamic Range AI", "Compression", "EQ Master AI", "Stereo Width",
  "Export Audio AI", "Format Select", "Sample Rate AI", "Bit Depth", "Codec Choose AI", "Stem Export", "Mix Down AI", "Deliverable",
  "Caption AI", "Subtitle Generate", "Transcribe AI", "Translate", "Multi-Language AI", "Timing Sync", "Style Format AI", "Accessibility",
  "Thumbnail AI", "Frame Select", "Title Card AI", "Visual Design", "Text Overlay AI", "Branding", "Channel Art AI", "Preview Image",
  "SEO Optimizer AI", "Title Generator", "Tag Creator AI", "Description Write", "Keyword Find AI", "Search Rank", "Trend Analyzer AI", "Viral Predict",
  "Distribution AI", "Platform Export", "Format Convert AI", "Quality Preset", "Upload Scheduler AI", "Social Post", "Marketing AI", "Analytics Track",
  "Podcast Mix AI", "Voice EQ", "De-Esser AI", "Pop Filter", "Gate Threshold AI", "Compressor Ratio", "Broadcast Ready AI", "Radio Mix",
  "Soundtrack AI", "Score Editor", "MIDI Generator AI", "Orchestrator", "Arrangement AI", "Harmony Create", "Melody AI", "Beat Maker",
  "Dolby Atmos AI", "5.1 Surround", "7.1 Mix AI", "Immersive Audio", "IMAX Enhanced AI", "Theater Mix", "Cinema Sound AI", "Home Theater"
];

export default function Page9({ onNext, onBack }: Page9Props) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col px-4 py-8">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-400 mb-2 text-center">
            Audio & Delivery AI
          </h1>
          <p className="text-purple-300 text-center mb-8 text-sm">Sound Design, Mixing & Distribution</p>

          <div className="max-w-7xl mx-auto overflow-y-scroll max-h-[calc(100vh-280px)] pr-2">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {tools.map((tool, index) => (
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
          toolCategory="audio-delivery"
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}
