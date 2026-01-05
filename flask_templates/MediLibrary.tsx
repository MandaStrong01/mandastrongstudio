import React, { useState } from 'react';
import VideoEditor from './VideoEditor'; // Ensure you created this file!

export default function MediaLibrary() {
  const [showEditor, setShowEditor] = useState(false);

  // Mock data for your library clips
  const clips = [
    { id: 1, title: "Doxy_Scene_01.mp4" },
    { id: 2, title: "Ocean_Broll.mp4" },
    { id: 3, title: "Dialogue_Take_05.mp4" },
    { id: 4, title: "Cinematic_Intro.mp4" },
  ];

  return (
    <div className="w-full h-screen bg-black text-white p-8 font-cinematic relative overflow-hidden">
      {/* Top Header Section */}
      <div className="flex justify-between items-center border-b-2 border-purple-900 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Media Library</h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase">Page 11 ~ Master Asset Collection</p>
        </div>

        {/* The New Button - Cinecraft Style */}
        <button 
          onClick={() => setShowEditor(true)}
          className="bg-purple-800 hover:bg-purple-700 text-white px-8 py-3 font-bold uppercase text-sm border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
        >
          Open Video Editor
        </button>
      </div>

      {/* Media Clips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[60vh] pr-4">
        {clips.map((clip) => (
          <div key={clip.id} className="group relative bg-zinc-900 border border-zinc-800 p-2 hover:border-purple-500 transition-all cursor-pointer">
            <div className="aspect-video bg-black flex items-center justify-center mb-2 overflow-hidden">
               <span className="text-4xl opacity-20 group-hover:opacity-100 transition-opacity">🎬</span>
            </div>
            <p className="text-[10px] font-bold truncate uppercase tracking-widest">{clip.title}</p>
            <div className="absolute top-2 right-2 bg-purple-600 text-[8px] px-1 font-bold">4K</div>
          </div>
        ))}
        
        {/* Empty Slot Placeholder */}
        <div className="aspect-video border-2 border-dashed border-zinc-800 flex items-center justify-center hover:bg-zinc-900/50 cursor-pointer">
          <span className="text-zinc-600 text-xs font-bold font-cinematic uppercase">+ Add Media</span>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-900 border-t border-purple-900 flex items-center px-8 justify-between text-[10px] text-zinc-500 font-bold uppercase">
        <span>Storage: 45.2 GB Used</span>
        <span>MandaStrong Studio v2.0</span>
      </div>

      {/* THE EDITOR ATTACHMENT (The Page Behind) */}
      {showEditor && (
        <VideoEditor onClose={() => setShowEditor(false)} />
      )}
    </div>
  );
}