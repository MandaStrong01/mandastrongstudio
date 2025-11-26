import { useState } from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

interface Page14Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (pageNum: number) => void;
}

export default function Page14({ onNext, onBack, onNavigate }: Page14Props) {
  const [text, setText] = useState('Your Title Here');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState('#FFFFFF');

  const fontFamilies = ['Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Bebas Neue', 'Dancing Script'];

  const presets = [
    { name: 'Opening Title', style: { fontSize: 64, color: '#FFD700', family: 'Bebas Neue' } },
    { name: 'Subtitle', style: { fontSize: 32, color: '#FFFFFF', family: 'Inter' } },
    { name: 'Lower Third', style: { fontSize: 24, color: '#00FFFF', family: 'Roboto' } },
    { name: 'End Credits', style: { fontSize: 28, color: '#CCCCCC', family: 'Montserrat' } },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[95vw] mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">STEP 4</div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Type className="w-8 h-8 text-pink-400" />
              Text & Titles Editor
            </h1>
          </div>
          <p className="text-slate-400">Create professional titles and text overlays</p>
          <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-lg mt-3">
            <p className="text-blue-200 text-sm"><strong>Beginner Tip:</strong> Type your text, pick a font and color, then use presets for instant professional titles!</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-8">
            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-6 mb-4">
              <h2 className="font-semibold mb-4 text-purple-300">Preview</h2>
              <div className="aspect-video bg-gradient-to-br from-black to-purple-900/20 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-purple-600">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
                <div className="relative z-10 px-8">
                  <h1
                    style={{
                      fontSize: `${fontSize}px`,
                      fontFamily: fontFamily,
                      textAlign: textAlign,
                      color: textColor,
                      textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                    }}
                    className="font-bold leading-tight"
                  >
                    {text}
                  </h1>
                </div>
              </div>

              <div className="mt-3 bg-black border border-purple-600 rounded-lg p-2">
                <div className="text-xs font-semibold text-purple-300 mb-2">Quick Navigation</div>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => onNavigate?.(11)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P11 Media</button>
                  <button onClick={() => onNavigate?.(12)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P12 Trim</button>
                  <button onClick={() => onNavigate?.(13)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P13 FX</button>
                  <button onClick={() => onNavigate?.(14)} className="bg-purple-600 px-3 py-1 rounded text-xs font-bold">P14 Text</button>
                  <button onClick={() => onNavigate?.(15)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P15 Audio</button>
                  <button onClick={() => onNavigate?.(16)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P16 Export</button>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-6">
              <h2 className="font-semibold mb-4">Text Properties</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Text Content</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-black border border-purple-500 rounded-lg p-3 text-white"
                    placeholder="Enter your text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Font Family</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full bg-black border border-purple-500 rounded-lg p-3 text-white"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="128"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Text Alignment</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTextAlign('left')}
                      className={`flex-1 p-3 rounded-lg transition-all ${
                        textAlign === 'left'
                          ? 'bg-purple-600'
                          : 'bg-purple-800 hover:bg-purple-700'
                      }`}
                    >
                      <AlignLeft className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => setTextAlign('center')}
                      className={`flex-1 p-3 rounded-lg transition-all ${
                        textAlign === 'center'
                          ? 'bg-purple-600'
                          : 'bg-purple-800 hover:bg-purple-700'
                      }`}
                    >
                      <AlignCenter className="w-5 h-5 mx-auto" />
                    </button>
                    <button
                      onClick={() => setTextAlign('right')}
                      className={`flex-1 p-3 rounded-lg transition-all ${
                        textAlign === 'right'
                          ? 'bg-purple-600'
                          : 'bg-purple-800 hover:bg-purple-700'
                      }`}
                    >
                      <AlignRight className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-800 hover:bg-purple-700 p-3 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Bold className="w-4 h-4" />
                    <span>Bold</span>
                  </button>
                  <button className="flex-1 bg-purple-800 hover:bg-purple-700 p-3 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Italic className="w-4 h-4" />
                    <span>Italic</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4">
              <h3 className="font-semibold mb-4">Title Presets</h3>
              <div className="space-y-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFontSize(preset.style.fontSize);
                      setTextColor(preset.style.color);
                      setFontFamily(preset.style.family);
                    }}
                    className="w-full p-4 rounded-lg text-left transition-all bg-purple-800 hover:bg-purple-700"
                  >
                    <div className="font-semibold mb-1">{preset.name}</div>
                    <div className="text-xs text-slate-400">
                      {preset.style.fontSize}px • {preset.style.family}
                    </div>
                    <div
                      className="text-sm mt-2 font-semibold"
                      style={{
                        color: preset.style.color,
                        fontFamily: preset.style.family,
                      }}
                    >
                      Preview Text
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/30 backdrop-blur rounded-xl border-2 border-purple-500 p-4 mt-4">
              <h3 className="font-semibold mb-2 text-sm">Pro Tip</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use contrasting colors and shadows to ensure your text is readable on any background. Test on different scenes!
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/30"
          >
            Next: Audio Mixing
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
