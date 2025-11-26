import { useState } from 'react';
import AIToolInterface from './AIToolInterface';

interface Page5Props {
  onNext: () => void;
  onBack: () => void;
}

const tools = [
  "Scene Generator AI", "Background Builder AI", "Environment Creator AI", "Location Renderer AI", "Set Designer AI", "Room Generator AI", "Architecture AI", "Landscape Builder AI",
  "Lighting Designer AI", "Key Light AI", "Fill Light AI", "Rim Light AI", "Practical Light AI", "Natural Light AI", "Studio Light AI", "Mood Lighting AI",
  "Camera Operator AI", "Shot Composer AI", "Angle Optimizer AI", "Frame Designer AI", "Focal Length AI", "Aperture Selector AI", "ISO Adjuster AI", "Exposure Controller AI",
  "Camera Movement AI", "Dolly Track AI", "Crane Motion AI", "Steadicam Path AI", "Handheld Motion AI", "Static Shot AI", "Pan Designer AI", "Tilt Controller AI",
  "AI Character Poser", "Body Position AI", "Gesture Creator AI", "Stance Designer AI", "Walk Cycle AI", "Run Animation AI", "Action Pose AI", "Emotion Pose AI",
  "Facial Animation AI", "Expression Generator AI", "Lip Sync AI", "Eye Direction AI", "Brow Movement AI", "Mouth Shape AI", "Micro Expression AI", "Emotion Blend AI",
  "Props Placer AI", "Object Arranger AI", "Furniture Layout AI", "Set Dressing AI", "Item Generator AI", "Asset Placer AI", "Detail Adder AI", "Scatter Tool AI",
  "Weather Generator AI", "Rain Effect AI", "Snow Creator AI", "Fog Machine AI", "Wind Simulator AI", "Cloud Builder AI", "Storm Generator AI", "Sunny Day AI",
  "Time of Day AI", "Sunrise Creator AI", "Sunset Designer AI", "Noon Light AI", "Twilight AI", "Night Scene AI", "Golden Hour AI", "Blue Hour AI",
  "Color Palette AI", "Scene Tone AI", "Color Harmony AI", "Contrast Designer AI", "Saturation AI", "Hue Shifter AI", "Temperature AI", "Mood Color AI",
  "Depth Creator AI", "Focus Distance AI", "Bokeh Generator AI", "Blur Designer AI", "Sharp Zone AI", "Soft Focus AI", "Rack Focus AI", "Pull Focus AI",
  "Motion Director AI", "Action Choreographer AI", "Movement Flow AI", "Timing Designer AI", "Speed Adjuster AI", "Rhythm Creator AI", "Pace Controller AI", "Beat Mapper AI",
  "Zoom Controller AI", "Track In AI", "Track Out AI", "Push In AI", "Pull Out AI", "Orbit Camera AI", "Arc Shot AI", "Dutch Angle AI",
  "Texture Painter AI", "Surface Detail AI", "Material Creator AI", "Reflection AI", "Refraction AI", "Bump Map AI", "Normal Map AI", "Displacement AI",
  "Particle System AI", "Smoke Generator AI", "Fire Creator AI", "Water Simulator AI", "Dust Particles AI", "Sparks AI", "Magic Effects AI", "Energy Beams AI"
];

export default function Page5({ onNext, onBack }: Page5Props) {
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
            Production AI Tools
          </h1>
          <p className="text-purple-300 text-center mb-8 text-sm">Scene Creation & Shot Generation</p>

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
          toolCategory="production"
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}
