import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';

interface BeginnerTutorialProps {
  onClose: () => void;
  onNavigate: (page: number) => void;
}

export default function BeginnerTutorial({ onClose, onNavigate }: BeginnerTutorialProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to MandaStrong1 Studio!",
      content: "This quick tutorial will show you how to create your first movie in 3 simple phases.",
      icon: "👋",
      action: null,
    },
    {
      title: "Phase 1: Pre-Production",
      content: "Pages 4-10 contain 600+ AI tools to help you create scripts, characters, storyboards, and plan your movie. You don't need to use all tools - pick what you need!",
      icon: "📝",
      action: { label: "Go to AI Tools", page: 4 },
    },
    {
      title: "Phase 2: Production (The Magic Happens Here!)",
      content: "Page 11 is your Media Board where all your AI-created assets appear. Drag them to the timeline, then move through Pages 12-16 to trim, add effects, text, and audio.",
      icon: "🎬",
      action: { label: "Go to Media Board", page: 11 },
    },
    {
      title: "Phase 3: Your Final Movie",
      content: "Page 17 is where you watch, download, and share your completed movie. Export buttons on Page 16 will automatically take you there!",
      icon: "🎥",
      action: { label: "See Movie Viewer", page: 17 },
    },
    {
      title: "Pro Tips",
      content: "• Use the hamburger menu (☰) in top-right to jump to any page\n• Watch the progress indicator in top-left\n• Pages 12-16 have quick nav buttons for easy editing\n• You can skip sections - there's no wrong way to create!",
      icon: "💡",
      action: null,
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleAction = () => {
    if (currentStep.action) {
      onNavigate(currentStep.action.page);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-black border-4 border-purple-500 rounded-2xl max-w-2xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{currentStep.icon}</div>
          <h2 className="text-3xl font-bold text-purple-300 mb-2">{currentStep.title}</h2>
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === step
                    ? 'w-8 bg-purple-500'
                    : idx < step
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-gray-600'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-black/50 border border-purple-500 rounded-lg p-6 mb-6 min-h-[150px]">
          <p className="text-white text-lg leading-relaxed whitespace-pre-line">
            {currentStep.content}
          </p>
        </div>

        {currentStep.action && (
          <button
            onClick={handleAction}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-lg font-semibold mb-4 flex items-center justify-center gap-2 transition-all"
          >
            <Lightbulb className="w-5 h-5" />
            {currentStep.action.label}
          </button>
        )}

        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            {step === steps.length - 1 ? "Get Started!" : "Next"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
