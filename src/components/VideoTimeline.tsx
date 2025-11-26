import React, { useState, useEffect, useRef } from 'react';
import { Plus, Scissors, Trash2, Move } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoClip {
  id: string;
  source_url: string;
  timeline_position: number;
  duration: number;
  trim_start: number;
  trim_end: number;
  order_index: number;
}

interface VideoTimelineProps {
  projectId: string;
}

export default function VideoTimeline({ projectId }: VideoTimelineProps) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadClips();
  }, [projectId]);

  const loadClips = async () => {
    try {
      const { data, error } = await supabase
        .from('video_clips')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setClips(data || []);
    } catch (error) {
      console.error('Error loading clips:', error);
    }
  };

  const addClip = async (sourceUrl: string) => {
    try {
      const maxOrder = clips.length > 0 ? Math.max(...clips.map(c => c.order_index)) : -1;
      const lastPosition = clips.length > 0
        ? Math.max(...clips.map(c => c.timeline_position + c.duration))
        : 0;

      const { data, error } = await supabase
        .from('video_clips')
        .insert({
          project_id: projectId,
          source_url: sourceUrl,
          timeline_position: lastPosition,
          duration: 5000,
          trim_start: 0,
          trim_end: 5000,
          order_index: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;
      setClips([...clips, data]);
    } catch (error) {
      console.error('Error adding clip:', error);
    }
  };

  const deleteClip = async (clipId: string) => {
    try {
      const { error } = await supabase
        .from('video_clips')
        .delete()
        .eq('id', clipId);

      if (error) throw error;
      setClips(clips.filter(c => c.id !== clipId));
      setSelectedClip(null);
    } catch (error) {
      console.error('Error deleting clip:', error);
    }
  };

  const updateClipDuration = async (clipId: string, newDuration: number) => {
    try {
      const { error } = await supabase
        .from('video_clips')
        .update({ duration: newDuration })
        .eq('id', clipId);

      if (error) throw error;
      setClips(clips.map(c => c.id === clipId ? { ...c, duration: newDuration } : c));
    } catch (error) {
      console.error('Error updating clip:', error);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addClip(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition">
            <Plus className="w-4 h-4" />
            Add Clip
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition">
            <Scissors className="w-4 h-4" />
            Split
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Zoom:</span>
          <input
            type="range"
            min="50"
            max="200"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-slate-400 text-sm">{zoom}%</span>
        </div>
      </div>

      <div
        ref={timelineRef}
        className="flex-1 bg-slate-900 rounded-lg p-4 overflow-x-auto overflow-y-auto relative"
        style={{ minHeight: '200px' }}
      >
        <div className="relative h-full" style={{ width: `${clips.length * 200}px`, minWidth: '100%' }}>
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center border-b border-slate-700">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: '100px' }}>
                <span className="text-xs text-slate-500">{formatTime(i * 10000)}</span>
              </div>
            ))}
          </div>

          <div className="absolute top-10 left-0 right-0 bottom-0">
            <div className="relative h-20 bg-slate-800 rounded">
              {clips.map((clip, index) => (
                <div
                  key={clip.id}
                  onClick={() => setSelectedClip(clip.id)}
                  className={`absolute top-2 h-16 rounded cursor-move transition ${
                    selectedClip === clip.id
                      ? 'bg-blue-600 ring-2 ring-blue-400'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  style={{
                    left: `${(clip.timeline_position / 10000) * 100 * (zoom / 100)}px`,
                    width: `${(clip.duration / 10000) * 100 * (zoom / 100)}px`,
                    minWidth: '80px'
                  }}
                >
                  <div className="p-2 h-full flex flex-col justify-between">
                    <div className="text-xs text-white font-medium truncate">
                      Clip {index + 1}
                    </div>
                    <div className="text-xs text-slate-300">
                      {formatTime(clip.duration)}
                    </div>
                  </div>
                  {selectedClip === clip.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClip(clip.id);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedClip && (
        <div className="mt-4 bg-slate-700 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Clip Properties</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 block mb-1">Duration (ms)</label>
              <input
                type="number"
                value={clips.find(c => c.id === selectedClip)?.duration || 0}
                onChange={(e) => updateClipDuration(selectedClip, Number(e.target.value))}
                className="w-full bg-slate-800 text-white px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 block mb-1">Position</label>
              <input
                type="text"
                value={formatTime(clips.find(c => c.id === selectedClip)?.timeline_position || 0)}
                readOnly
                className="w-full bg-slate-800 text-slate-400 px-3 py-2 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
