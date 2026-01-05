import React, { useState } from 'react';

export default function VideoEditor({ onClose }: { onClose: () => void }) {
  const [duration, setDuration] = useState(0);

  return (
    <div className="fixed inset-0 bg-black z-[999] flex flex-col font-sans text-white border-2 border-purple-600">
      <div className="h-12 bg-zinc-900 flex justify-between items-center px-6 border-b border-purple-500">
        <span className="text-purple-400 font-bold uppercase text-xs tracking-widest">Cinecraft Master Editor</span>
        <button onClick={onClose} className="text-white hover:text-purple-400 text-xl font-bold">✕</button>
      </div>

      <div className="flex-1 flex p-8 gap-8 bg-black">
        {/* Preview Area */}
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-center italic text-zinc-700">
           Preview Monitor (Page 11 Attachment)
        </div>

        {/* Editor Controls */}
        <div className="w-80 bg-zinc-900 p-6 border border-purple-900 flex flex-col gap-6">
          <h3 className="text-sm font-bold border-b border-purple-900 pb-2 uppercase tracking-tighter">Enhancement Suite</h3>
          
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold">Timeline Duration: {duration} Min</label>
            <input 
              type="range" min="0" max="180" value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500"><span>0M</span><span>180M</span></div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button className="text-left text-xs p-3 border border-zinc-800 hover:border-purple-500 bg-black">✨ Cinematic Auto-Fix</button>
            <button className="text-left text-xs p-3 border border-zinc-800 hover:border-purple-500 bg-black">🎨 LUT Color Grade</button>
          </div>

          <button 
            className="mt-auto bg-purple-700 hover:bg-purple-600 py-4 font-black uppercase text-xs border border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            onClick={() => alert(`AI Generating ${duration} min asset...`)}
          >
            AI Generate Asset
          </button>
        </div>
      </div>
    </div>
  );
}