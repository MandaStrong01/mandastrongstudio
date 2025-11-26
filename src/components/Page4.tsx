import { useState } from 'react';
import AIToolInterface from './AIToolInterface';

interface Page4Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (page: number | string) => void;
}

const tools = [
  "Text to Video Generator", "Professional Script Writer", "Story Generator", "Plot Designer Enhanced", "Theme Builder Pro", "Premise Creator AI", "Logline Writer Pro", "Synopsis Generator Plus", "Treatment Builder Studio", "Story Arc Designer",
  "Genre Analyzer Pro", "Tone Selector Enhanced", "Mood Designer Studio", "Style Picker Pro", "Audience Analyzer", "Demographics AI", "Market Research Pro", "Trend Predictor Enhanced", "Character Creator Studio", "Hero Designer Pro",
  "Villain Builder AI", "Supporting Cast Generator", "Character Arc Mapper", "Backstory Creator Pro", "Motivation Analyzer", "Personality Builder Enhanced", "Dialogue Writer Pro", "Conversation Designer", "Voice Pattern Studio", "Accent Generator Pro",
  "Speech Designer AI", "Subtext Generator Enhanced", "Conflict Writer Pro", "Resolution Designer", "Scene Planner Studio", "Act Structure Pro", "Beat Sheet Generator", "Storyboard Creator AI", "Sequence Builder Pro", "Chapter Designer",
  "Pacing Analyzer Enhanced", "Rhythm Designer Pro", "World Builder Studio", "Setting Creator Pro", "Virtual Location Generator", "Environment Designer Plus", "Time Period Selector", "Era Designer Pro", "Geography Builder AI", "Climate Generator",
  "Script Formatter Pro", "Screenplay Writer Enhanced", "Scene Header Generator", "Action Line Writer", "Character Name Creator", "Parenthetical Designer", "Transition Generator Pro", "Shot Description AI", "Revision Assistant Pro", "Draft Analyzer Enhanced",
  "Plot Hole Detector", "Continuity Checker Pro", "Logic Validator AI", "Story Optimizer Studio", "Rewrite Assistant", "Polish Tool Enhanced", "Visual Concept Designer", "Art Direction Pro", "Style Guide Generator", "Color Scheme Studio",
  "Design Language AI", "Aesthetic Builder Pro", "Reference Generator Enhanced", "Mood Board Creator", "Virtual Set Designer", "3D Environment Studio", "Background Generator Pro", "Props Creator Enhanced", "Asset Builder AI", "Texture Generator Pro",
  "Material Designer Studio", "Detail Mapper Enhanced", "Character Design Studio", "Body Type Generator", "Facial Features Designer", "Wardrobe Generator Pro", "Costume Designer AI", "Accessory Creator Enhanced", "Style Matcher Pro", "Outfit Builder Studio",
  "Storyboard Generator", "Visual Planner Pro", "Shot Designer Enhanced", "Angle Selector Studio", "Frame Composer Pro", "Camera Planner AI", "Movement Designer Enhanced", "Coverage Planner Pro", "Budget Calculator", "Cost Estimator Pro",
  "Resource Planner Enhanced", "Production Scheduler", "Timeline Creator Studio", "Production Manager Pro", "Shot List Generator", "Call Sheet Designer", "Scene Breakdown AI", "Asset Organizer Pro", "File Manager Enhanced", "Project Structure Studio",
  "Naming System AI", "Version Control Pro", "Backup Manager Enhanced", "Cloud Sync Studio", "Team Collaboration AI", "Permission Manager Pro", "Role Assignment System", "Workflow Optimizer Enhanced", "Task Manager Pro", "Deadline Tracker AI", "Progress Monitor Studio"
];

export default function Page4({ onNext, onBack, onNavigate }: Page4Props) {
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
            Pre-Production AI Tools
          </h1>
          <p className="text-purple-300 text-center mb-8 text-sm">Story Development & Production Planning - 120 Professional Tools</p>

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

          <div className="flex flex-wrap gap-4 justify-center mt-8">
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
          toolCategory="pre-production"
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
}
