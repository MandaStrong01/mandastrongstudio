import React, { useState, useEffect } from 'react';
import { Zap, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Transition {
  id: string;
  timeline_position: number;
  type: string;
  duration: number;
}

interface TransitionEditorProps {
  projectId: string;
}

export default function TransitionEditor({ projectId }: TransitionEditorProps) {
  const [transitions, setTransitions] = useState<Transition[]>([]);
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);

  const transitionTypes = [
    { value: 'fade', label: 'Fade', description: 'Smooth fade between clips' },
    { value: 'dissolve', label: 'Dissolve', description: 'Gradual blend transition' },
    { value: 'wipe', label: 'Wipe', description: 'Directional wipe effect' },
    { value: 'slide', label: 'Slide', description: 'Sliding transition' },
    { value: 'zoom', label: 'Zoom', description: 'Zoom in/out transition' }
  ];

  useEffect(() => {
    loadTransitions();
  }, [projectId]);

  const loadTransitions = async () => {
    try {
      const { data, error } = await supabase
        .from('video_transitions')
        .select('*')
        .eq('project_id', projectId)
        .order('timeline_position', { ascending: true });

      if (error) throw error;
      setTransitions(data || []);
    } catch (error) {
      console.error('Error loading transitions:', error);
    }
  };

  const addTransition = async (type: string) => {
    try {
      const { data, error } = await supabase
        .from('video_transitions')
        .insert({
          project_id: projectId,
          timeline_position: 0,
          type: type,
          duration: 1000
        })
        .select()
        .single();

      if (error) throw error;
      setTransitions([...transitions, data]);
    } catch (error) {
      console.error('Error adding transition:', error);
    }
  };

  const updateTransition = async (transitionId: string, updates: Partial<Transition>) => {
    try {
      const { error } = await supabase
        .from('video_transitions')
        .update(updates)
        .eq('id', transitionId);

      if (error) throw error;
      setTransitions(transitions.map(t => t.id === transitionId ? { ...t, ...updates } : t));
    } catch (error) {
      console.error('Error updating transition:', error);
    }
  };

  const deleteTransition = async (transitionId: string) => {
    try {
      const { error } = await supabase
        .from('video_transitions')
        .delete()
        .eq('id', transitionId);

      if (error) throw error;
      setTransitions(transitions.filter(t => t.id !== transitionId));
      setSelectedTransition(null);
    } catch (error) {
      console.error('Error deleting transition:', error);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  const selectedTransitionData = transitions.find(t => t.id === selectedTransition);

  return (
    <div className="h-full flex gap-4">
      <div className="w-80">
        <h3 className="text-white font-semibold mb-4">Transition Library</h3>
        <div className="grid grid-cols-2 gap-3">
          {transitionTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => addTransition(type.value)}
              className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 text-left transition group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">{type.label}</span>
              </div>
              <p className="text-xs text-slate-400">{type.description}</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition">
                <Plus className="w-4 h-4 text-blue-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">Applied Transitions</h3>
          {transitions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transitions added yet</p>
              <p className="text-sm mt-1">Click a transition type to add it</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transitions.map((transition) => (
                <div
                  key={transition.id}
                  onClick={() => setSelectedTransition(transition.id)}
                  className={`p-3 rounded cursor-pointer transition ${
                    selectedTransition === transition.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">{transition.type}</div>
                      <div className="text-sm opacity-75">
                        Duration: {formatTime(transition.duration)} | Position: {formatTime(transition.timeline_position)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTransition(transition.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTransitionData && (
          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-white font-semibold text-lg mb-4">Transition Properties</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Type</label>
                <select
                  value={selectedTransitionData.type}
                  onChange={(e) => updateTransition(selectedTransition!, { type: e.target.value })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded capitalize"
                >
                  {transitionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Duration (ms)</label>
                <input
                  type="number"
                  value={selectedTransitionData.duration}
                  onChange={(e) => updateTransition(selectedTransition!, { duration: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded"
                  min="100"
                  max="5000"
                  step="100"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {formatTime(selectedTransitionData.duration)}
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Timeline Position (ms)</label>
                <input
                  type="number"
                  value={selectedTransitionData.timeline_position}
                  onChange={(e) => updateTransition(selectedTransition!, { timeline_position: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded"
                  min="0"
                  step="100"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {formatTime(selectedTransitionData.timeline_position)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
