interface Page2Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate: (page: number) => void;
}

export default function Page2({ onNext, onBack, onNavigate }: Page2Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-wider mb-8" style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.5)' }}>
          WELCOME
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-white mb-12 leading-relaxed" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.6)' }}>
          Make Awesome Family Videos Or Turn Your Dreams Into Film Reality! Enjoy.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-12">
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
  );
}
