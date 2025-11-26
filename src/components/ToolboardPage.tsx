interface ToolboardPageProps {
  pageNum: number;
  onNext: () => void;
  onBack: () => void;
}

const toolsByPage: Record<number, { title: string; description: string; tools: Array<{ id: number; name: string; icon: string; description: string }> }> = {
  3: {
    title: 'PRE-PRODUCTION - Story & Planning',
    description: 'Start your movie journey here! Create your script, characters, and plan your scenes.',
    tools: [
      { id: 1, name: 'AI Script Generator', icon: '📝', description: 'Generate movie scripts from ideas' },
      { id: 2, name: 'Character Creator', icon: '👤', description: 'Design your main characters' },
      { id: 3, name: 'Storyboard Builder', icon: '🎬', description: 'Plan your scenes visually' },
      { id: 4, name: 'Plot Outliner', icon: '📋', description: 'Organize your story structure' },
      { id: 5, name: 'Dialogue Writer', icon: '💬', description: 'Create realistic conversations' },
      { id: 6, name: 'Location Scout', icon: '🗺️', description: 'Find and generate locations' },
    ]
  },
  4: {
    title: 'PRE-PRODUCTION - Visual Planning',
    description: 'Design the look and feel of your movie before production.',
    tools: [
      { id: 7, name: 'Shot List Creator', icon: '📸', description: 'Plan every camera shot' },
      { id: 8, name: 'Mood Board', icon: '🎨', description: 'Design color palettes & themes' },
      { id: 9, name: 'Costume Designer', icon: '👔', description: 'Create character wardrobes' },
      { id: 10, name: 'Props Generator', icon: '🎭', description: 'Design scene props' },
      { id: 11, name: 'Set Designer', icon: '🏛️', description: 'Build virtual sets' },
      { id: 12, name: 'Casting Assistant', icon: '🎪', description: 'Match actors to roles' },
    ]
  },
  5: {
    title: 'PRODUCTION - Scene Creation',
    description: 'Bring your story to life! Generate scenes, videos, and visual content.',
    tools: [
      { id: 13, name: 'Scene Builder', icon: '🎬', description: 'Generate complete scenes' },
      { id: 14, name: 'Image Generator', icon: '🖼️', description: 'Create scene backgrounds' },
      { id: 15, name: 'Video Generator', icon: '🎥', description: 'Generate video clips' },
      { id: 16, name: 'Camera Angles', icon: '📷', description: 'Set camera perspectives' },
      { id: 17, name: 'Lighting Setup', icon: '💡', description: 'Design scene lighting' },
      { id: 18, name: 'Green Screen', icon: '🟢', description: 'Replace backgrounds' },
    ]
  },
  6: {
    title: 'PRODUCTION - Audio & Performance',
    description: 'Add voices, sound, and character performances to your scenes.',
    tools: [
      { id: 19, name: 'Voice Generator', icon: '🎙️', description: 'Generate character voices' },
      { id: 20, name: 'Lip Sync', icon: '👄', description: 'Match voices to video' },
      { id: 21, name: 'Face Animation', icon: '😊', description: 'Animate facial expressions' },
      { id: 22, name: 'Motion Capture', icon: '🕺', description: 'Record character movements' },
      { id: 23, name: 'Sound Effects', icon: '🔊', description: 'Add environmental sounds' },
      { id: 24, name: 'Foley Generator', icon: '🎵', description: 'Create realistic sound effects' },
    ]
  },
  7: {
    title: 'POST-PRODUCTION - Editing & Assembly',
    description: 'Edit your scenes together and create the final movie flow.',
    tools: [
      { id: 25, name: 'Video Editor', icon: '✂️', description: 'Cut and arrange clips' },
      { id: 26, name: 'Transition Effects', icon: '🔄', description: 'Add scene transitions' },
      { id: 27, name: 'Pacing Tool', icon: '⏱️', description: 'Adjust movie timing' },
      { id: 28, name: 'Multi-cam Editor', icon: '📹', description: 'Edit multiple angles' },
      { id: 29, name: 'Trimmer', icon: '📐', description: 'Trim and fine-tune clips' },
      { id: 30, name: 'Speed Control', icon: '⚡', description: 'Adjust playback speed' },
    ]
  },
  8: {
    title: 'POST-PRODUCTION - Visual Enhancement',
    description: 'Polish your visuals with color, effects, and enhancements.',
    tools: [
      { id: 31, name: 'Color Grading', icon: '🎨', description: 'Professional color correction' },
      { id: 32, name: 'Video Effects', icon: '✨', description: 'Add visual effects' },
      { id: 33, name: 'Style Transfer', icon: '🖌️', description: 'Apply artistic styles' },
      { id: 34, name: 'Upscaler', icon: '⬆️', description: 'Increase video resolution' },
      { id: 35, name: 'Stabilizer', icon: '🎯', description: 'Smooth shaky footage' },
      { id: 36, name: 'Face Swap', icon: '🎭', description: 'Swap faces in scenes' },
    ]
  },
  9: {
    title: 'POST-PRODUCTION - Finishing Touches',
    description: 'Add music, titles, and final polish to complete your movie.',
    tools: [
      { id: 37, name: 'Background Music', icon: '🎵', description: 'Generate movie soundtrack' },
      { id: 38, name: 'Audio Mixer', icon: '🎚️', description: 'Balance all audio levels' },
      { id: 39, name: 'Title Generator', icon: '🏷️', description: 'Create opening titles' },
      { id: 40, name: 'Credits Maker', icon: '📜', description: 'Generate end credits' },
      { id: 41, name: 'Subtitle Creator', icon: '📄', description: 'Add subtitles/captions' },
      { id: 42, name: 'Motion Graphics', icon: '🎞️', description: 'Animated text & graphics' },
    ]
  },
};

export default function ToolboardPage({ pageNum, onNext, onBack }: ToolboardPageProps) {
  const pageData = toolsByPage[pageNum];

  if (!pageData) {
    return <div>Page not found</div>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-8">
      <div className="flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-400 mb-3">
              {pageData.title}
            </h1>
            <p className="text-purple-300 text-lg max-w-3xl mx-auto">
              {pageData.description}
            </p>
            <div className="mt-4 text-purple-500 text-sm">
              Page {pageNum - 2} of 7 - Movie Creation Tools
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageData.tools.map((tool) => (
                <button
                  key={tool.id}
                  className="bg-gradient-to-br from-purple-900/50 to-black hover:from-purple-700/50 hover:to-purple-900/50 text-white p-6 rounded-xl shadow-lg transition-all hover:scale-105 flex flex-col items-start gap-3 border-2 border-purple-500 hover:border-purple-400 group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-4xl">{tool.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-lg text-purple-300 group-hover:text-purple-200">
                        {tool.name}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-purple-400 group-hover:text-purple-300 text-left">
                    {tool.description}
                  </p>
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
      </div>

      <footer className="mt-8 py-4 border-t-2 border-purple-500 text-center text-white text-sm">
        <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
      </footer>
    </div>
  );
}
