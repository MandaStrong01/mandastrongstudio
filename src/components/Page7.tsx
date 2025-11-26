import { useState } from 'react';
import AIToolInterface from './AIToolInterface';

interface Page7Props {
  onNext: () => void;
  onBack: () => void;
}

const tools = [
  "VFX Compositor AI", "Layer Manager", "Green Screen AI", "Chroma Key Pro", "Matte Generator AI", "Edge Refiner", "Spill Suppressor AI", "Alpha Channel",
  "Tracking AI", "Motion Track", "Planar Tracker AI", "3D Camera Solve", "Point Track AI", "Face Tracker", "Object Track AI", "Stabilization",
  "Rotoscope AI", "Mask Creator", "Edge Detector AI", "Auto Trace", "Feather Tool AI", "Mask Tracker", "Smart Mask AI", "Hair Detail",
  "Sky Replacer AI", "Cloud Generator", "Weather FX AI", "Rain Effect", "Snow Creator AI", "Lightning", "Fog Generator AI", "Mist Overlay",
  "Fire Builder AI", "Flame Animator", "Spark Effect AI", "Explosion Creator", "Smoke Plume AI", "Energy Blast", "Magic Effects AI", "Power Glow",
  "Particle System AI", "Dust Creator", "Debris Generator AI", "Sparkle Effect", "Star Field AI", "Galaxy Builder", "Nebula Creator AI", "Space FX",
  "Water FX AI", "Splash Creator", "Wave Generator AI", "Ripple Effect", "Bubble Maker AI", "Foam Designer", "Liquid Sim AI", "Ocean Effect",
  "Light FX AI", "Lens Flare", "Light Leak AI", "Sun Rays", "Glow Effect AI", "Bloom Designer", "Halo Generator AI", "Aura Creator",
  "3D Integration AI", "Object Insert", "CGI Blend AI", "Shadow Caster", "Reflection AI", "Light Wrap", "Ambient Occlusion AI", "Depth Pass",
  "Cleanup AI", "Wire Remover", "Object Eraser AI", "Rig Removal", "Scratch Fix AI", "Dust Removal", "Boom Mic Remove AI", "Marker Erase",
  "Enhancement AI", "Detail Boost", "Sharpness AI", "Clarity Tool", "Deblur AI", "Denoise Pro", "Upscaler AI", "Resolution Enhance",
  "Clone Tool AI", "Content Fill", "Patch Maker AI", "Duplicate", "Mirror Effect AI", "Multiplier", "Crowd Generator AI", "Army Builder",
  "Screen Replace AI", "Monitor Insert", "Phone Screen AI", "Device Content", "Sign Change AI", "Billboard Edit", "Product Place AI", "Brand Swap",
  "Morph AI", "Face Swap", "Age Changer AI", "Gender Swap", "Expression AI", "Smile Tool", "Blink Fixer AI", "Eye Opener",
  "Time Freeze AI", "Bullet Time", "Speed Ramp AI", "Flow Motion", "Motion Blur AI", "Directional Blur", "Radial Blur AI", "Transform Effect"
];

export default function Page7({ onNext, onBack }: Page7Props) {
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
            VFX & Compositing AI
          </h1>
          <p className="text-purple-300 text-center mb-8 text-sm">Visual Effects & Special Effects</p>

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
          toolCategory="vfx"
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}
