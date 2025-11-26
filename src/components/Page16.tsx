import { Download, Save, FileVideo, Upload } from 'lucide-react';

interface Page16Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (pageNum: number) => void;
}

const handleExportAndNavigate = (onNext: () => void) => {
  onNext();
};

export default function Page16({ onNext, onBack, onNavigate }: Page16Props) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">STEP 6</div>
          <h1 className="text-4xl font-bold text-purple-400">Final Edit - Save, Download & Export</h1>
        </div>
        <div className="bg-green-900/30 border-l-4 border-green-500 p-3 rounded-r-lg mb-6">
          <p className="text-green-200 text-sm"><strong>You're almost done!</strong> Click any export button below to automatically go to Page 17 and watch your finished movie!</p>
        </div>

        <div className="mb-6 bg-black border border-purple-600 rounded-lg p-2">
          <div className="text-xs font-semibold text-purple-300 mb-2">Quick Navigation</div>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => onNavigate?.(11)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P11 Media</button>
            <button onClick={() => onNavigate?.(12)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P12 Trim</button>
            <button onClick={() => onNavigate?.(13)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P13 FX</button>
            <button onClick={() => onNavigate?.(14)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P14 Text</button>
            <button onClick={() => onNavigate?.(15)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P15 Audio</button>
            <button onClick={() => onNavigate?.(16)} className="bg-purple-600 px-3 py-1 rounded text-xs font-bold">P16 Export</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Save className="w-6 h-6 text-purple-400" />
              Save Project
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                className="w-full bg-black border border-purple-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <textarea
                placeholder="Project Description"
                rows={3}
                className="w-full bg-black border border-purple-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              ></textarea>
              <button
                onClick={() => handleExportAndNavigate(onNext)}
                className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Project
              </button>
            </div>
          </div>

          <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Download className="w-6 h-6 text-purple-400" />
              Download Movie
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => handleExportAndNavigate(onNext)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download 8K (7680x4320)
              </button>
              <button
                onClick={() => handleExportAndNavigate(onNext)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download 4K (3840x2160)
              </button>
              <button
                onClick={() => handleExportAndNavigate(onNext)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download 1080p HD
              </button>
              <button
                onClick={() => handleExportAndNavigate(onNext)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download 720p
              </button>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <FileVideo className="w-6 h-6 text-purple-400" />
            Export Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-purple-300 mb-2">Format</label>
              <select className="w-full bg-black border border-purple-500 rounded-lg px-4 py-3 text-white">
                <option>MP4 (H.264)</option>
                <option>MP4 (H.265)</option>
                <option>MOV (ProRes)</option>
                <option>AVI</option>
                <option>WEBM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-purple-300 mb-2">Quality</label>
              <select className="w-full bg-black border border-purple-500 rounded-lg px-4 py-3 text-white">
                <option>Maximum Quality</option>
                <option>High Quality</option>
                <option>Medium Quality</option>
                <option>Web Optimized</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-purple-300 mb-2">Frame Rate</label>
              <select className="w-full bg-black border border-purple-500 rounded-lg px-4 py-3 text-white">
                <option>24 fps (Cinematic)</option>
                <option>30 fps (Standard)</option>
                <option>60 fps (Smooth)</option>
                <option>120 fps (Ultra Smooth)</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => handleExportAndNavigate(onNext)}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <Upload className="w-6 h-6" />
            Export with These Settings
          </button>
        </div>

        <div className="flex gap-4 justify-center">
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
            Next - View Movie
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center">
          <p className="text-white text-sm">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>
    </div>
  );
}
