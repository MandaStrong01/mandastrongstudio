interface Page2Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate: (page: number) => void;
}

export default function Page2({ onNext, onBack, onNavigate }: Page2Props) {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-4xl space-y-12">
        <h1 className="text-7xl md:text-9xl font-black text-white tracking-wider" style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.9), 0 0 60px rgba(168, 85, 247, 0.6)' }}>
          WELCOME
        </h1>
        <p className="text-3xl md:text-4xl font-bold text-white leading-relaxed" style={{ textShadow: '0 0 15px rgba(168, 85, 247, 0.7)' }}>
          Make Awesome Family Videos Or Turn Your Dreams Into Film Reality! Enjoy.
        </p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center mt-16">
        <button
          onClick={onBack}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-purple-700 transition-all hover:scale-105 border-2 border-white"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-purple-700 transition-all hover:scale-105 border-2 border-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
