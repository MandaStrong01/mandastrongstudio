import { useState } from 'react';
import AIToolInterface from './AIToolInterface';

interface Page8Props {
  onNext: () => void;
  onBack: () => void;
}

const tools = [
  "Color Grader AI", "Primary Correct", "Secondary Grade AI", "Color Wheels", "Lift Gamma Gain AI", "Contrast Control", "Saturation AI", "Vibrance Adjust",
  "Skin Tone AI", "Face Detector", "Skin Smooth AI", "Complexion Fix", "Eye Brighten AI", "Teeth Whiten", "Blemish Remove AI", "Beauty Grade",
  "Shot Match AI", "Color Match", "Scene Balance AI", "Continuity Color", "Temperature Sync AI", "Exposure Match", "White Balance AI", "Black Level",
  "LUT Creator AI", "Film Look", "Cinematic Grade AI", "Style Preset", "Vintage Look AI", "Modern Style", "Noir Effect AI", "Bleach Bypass",
  "HDR Mapper AI", "Tone Map", "Dynamic Range AI", "Highlight Roll", "Shadow Detail AI", "Midtone Balance", "Curve Designer AI", "Levels Adjust",
  "Color Space AI", "Log to Rec709", "HDR Transform AI", "Gamut Map", "Wide Color AI", "DCI-P3", "Rec2020 AI", "Linear Convert",
  "Scope Tools AI", "Waveform", "Vectorscope AI", "RGB Parade", "Histogram AI", "False Color", "Zebra Pattern AI", "Clipping Alert",
  "Film Grain AI", "Texture Add", "Noise Generator AI", "Halation Effect", "Gate Weave AI", "Dust Scratches", "Light Leak AI", "Vintage Damage",
  "Vignette AI", "Edge Darken", "Graduated Filter AI", "Radial Mask", "Linear Gradient AI", "Power Window", "Custom Shape AI", "Mask Feather",
  "Sharpness AI", "Detail Enhance", "Clarity Boost AI", "Micro Contrast", "Texture Pop AI", "Structure Add", "Edge Define AI", "Focus Pull",
  "Look Designer AI", "Mood Creator", "Genre Style AI", "Time Period", "Location Look AI", "Weather Grade", "Season Color AI", "Day/Night",
  "Render Settings AI", "Export Quality", "Color Space Out AI", "Bit Depth", "Format Select AI", "Codec Choose", "Delivery Spec AI", "Master Output",
  "Hue Shift AI", "Selective Color", "Channel Mixer AI", "Color Replace", "Qualify AI", "Color Key", "HSL Curves AI", "RGB Mixer",
  "Zone System AI", "Ansel Adams", "Push/Pull AI", "Exposure Zone", "Dynamic Split AI", "Region Grade", "Layer Mix AI", "Blend Mode",
  "Printer Light AI", "Film Emulation", "Stock Match AI", "Kodak Look", "Fuji Style AI", "ARRI Alexa", "RED Color AI", "Venice Grade"
];

export default function Page8({ onNext, onBack }: Page8Props) {
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
            Color Grading AI
          </h1>
          <p className="text-purple-300 text-center mb-8 text-sm">Color Correction & Cinematic Looks</p>

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
          toolCategory="color-grading"
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}
