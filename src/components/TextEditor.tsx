import React, { useState, useEffect } from 'react';
import { Type, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TextLayer {
  id: string;
  text_content: string;
  timeline_position: number;
  duration: number;
  font_family: string;
  font_size: number;
  color: string;
  position_x: number;
  position_y: number;
  animation_type: string;
}

interface TextEditorProps {
  projectId: string;
}

export default function TextEditor({ projectId }: TextEditorProps) {
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  useEffect(() => {
    loadTextLayers();
  }, [projectId]);

  const loadTextLayers = async () => {
    try {
      const { data, error } = await supabase
        .from('video_text_layers')
        .select('*')
        .eq('project_id', projectId)
        .order('timeline_position', { ascending: true });

      if (error) throw error;
      setTextLayers(data || []);
    } catch (error) {
      console.error('Error loading text layers:', error);
    }
  };

  const addTextLayer = async () => {
    try {
      const { data, error } = await supabase
        .from('video_text_layers')
        .insert({
          project_id: projectId,
          text_content: 'New Text',
          timeline_position: 0,
          duration: 3000,
          font_family: 'Arial',
          font_size: 48,
          color: '#ffffff',
          position_x: 50,
          position_y: 50,
          animation_type: 'fade'
        })
        .select()
        .single();

      if (error) throw error;
      setTextLayers([...textLayers, data]);
      setSelectedLayer(data.id);
    } catch (error) {
      console.error('Error adding text layer:', error);
    }
  };

  const updateTextLayer = async (layerId: string, updates: Partial<TextLayer>) => {
    try {
      const { error } = await supabase
        .from('video_text_layers')
        .update(updates)
        .eq('id', layerId);

      if (error) throw error;
      setTextLayers(textLayers.map(l => l.id === layerId ? { ...l, ...updates } : l));
    } catch (error) {
      console.error('Error updating text layer:', error);
    }
  };

  const deleteTextLayer = async (layerId: string) => {
    try {
      const { error } = await supabase
        .from('video_text_layers')
        .delete()
        .eq('id', layerId);

      if (error) throw error;
      setTextLayers(textLayers.filter(l => l.id !== layerId));
      setSelectedLayer(null);
    } catch (error) {
      console.error('Error deleting text layer:', error);
    }
  };

  const selectedLayerData = textLayers.find(l => l.id === selectedLayer);

  return (
    <div className="h-full flex gap-4">
      <div className="w-64 flex flex-col">
        <button
          onClick={addTextLayer}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4 transition"
        >
          <Plus className="w-4 h-4" />
          Add Text
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {textLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`p-3 rounded cursor-pointer transition ${
                selectedLayer === layer.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span className="text-sm truncate">{layer.text_content}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTextLayer(layer.id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-slate-700 rounded-lg p-6">
        {selectedLayerData ? (
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">Text Properties</h3>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Text Content</label>
              <textarea
                value={selectedLayerData.text_content}
                onChange={(e) => updateTextLayer(selectedLayer!, { text_content: e.target.value })}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Font Family</label>
                <select
                  value={selectedLayerData.font_family}
                  onChange={(e) => updateTextLayer(selectedLayer!, { font_family: e.target.value })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier">Courier</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Font Size</label>
                <input
                  type="number"
                  value={selectedLayerData.font_size}
                  onChange={(e) => updateTextLayer(selectedLayer!, { font_size: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Color</label>
                <input
                  type="color"
                  value={selectedLayerData.color}
                  onChange={(e) => updateTextLayer(selectedLayer!, { color: e.target.value })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded h-10"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Animation</label>
                <select
                  value={selectedLayerData.animation_type}
                  onChange={(e) => updateTextLayer(selectedLayer!, { animation_type: e.target.value })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded"
                >
                  <option value="none">None</option>
                  <option value="fade">Fade In</option>
                  <option value="slide">Slide In</option>
                  <option value="zoom">Zoom In</option>
                  <option value="typewriter">Typewriter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Duration (ms)</label>
                <input
                  type="number"
                  value={selectedLayerData.duration}
                  onChange={(e) => updateTextLayer(selectedLayer!, { duration: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white px-4 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Position</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="X"
                    value={selectedLayerData.position_x}
                    onChange={(e) => updateTextLayer(selectedLayer!, { position_x: Number(e.target.value) })}
                    className="w-1/2 bg-slate-800 text-white px-4 py-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    value={selectedLayerData.position_y}
                    onChange={(e) => updateTextLayer(selectedLayer!, { position_y: Number(e.target.value) })}
                    className="w-1/2 bg-slate-800 text-white px-4 py-2 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 mt-6">
              <p className="text-slate-400 text-sm mb-2">Preview</p>
              <div
                className="text-center py-8"
                style={{
                  fontFamily: selectedLayerData.font_family,
                  fontSize: `${selectedLayerData.font_size * 0.5}px`,
                  color: selectedLayerData.color
                }}
              >
                {selectedLayerData.text_content}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <Type className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a text layer or add a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
