import { useState, useEffect } from 'react';
import { Download, Trash2, RefreshCw, Upload, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

import QuickNav from './QuickNav';

interface Page11Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate: (pageNum: number) => void;
  currentPage: number;
}

interface Asset {
  id: string;
  tool_name: string;
  tool_category: string;
  asset_type: string;
  asset_url: string;
  prompt: string;
  created_at: string;
  asset_data?: {
    content?: string;
    [key: string]: any;
  };
}

interface TimelineClip {
  id: string;
  name: string;
  url: string;
  type: string;
}

export default function Page11({ onNext, onBack, onNavigate, currentPage }: Page11Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewingText, setViewingText] = useState<string | null>(null);
  const [viewingVideo, setViewingVideo] = useState<Asset | null>(null);
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);

  const handleDownloadAsset = (asset: Asset) => {
    if (asset.asset_type === 'text' && asset.asset_data?.content) {
      const blob = new Blob([asset.asset_data.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${asset.tool_name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (asset.asset_url) {
      const link = document.createElement('a');
      link.href = asset.asset_url;
      link.download = `${asset.tool_name.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const categories = [
    { value: 'all', label: 'All Assets' },
    { value: 'pre-production', label: 'Pre-Production' },
    { value: 'production', label: 'Production' },
    { value: 'post-production', label: 'Post-Production' },
    { value: 'vfx', label: 'VFX' },
    { value: 'color', label: 'Color' },
    { value: 'audio', label: 'Audio' }
  ];

  const loadAssets = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setAssets([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('ai_assets')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('tool_category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [selectedCategory]);

  const handleDelete = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('ai_assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleAddToTimeline = (asset: Asset) => {
    const newClip: TimelineClip = {
      id: asset.id,
      name: asset.tool_name,
      url: asset.asset_url,
      type: asset.asset_type
    };
    setTimelineClips([...timelineClips, newClip]);
  };

  const tracks = [
    { id: 1, name: 'VIDEO', color: 'bg-blue-600' },
    { id: 2, name: 'AUDIO', color: 'bg-green-600' },
    { id: 3, name: 'SRT', color: 'bg-pink-600' },
    { id: 4, name: 'VIDEO 2', color: 'bg-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-[98vw] mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">STEP 1</div>
          <h1 className="font-serif text-4xl font-bold text-purple-400">Timeline Editor & Media Board</h1>
        </div>
        <div className="bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4">
          <p className="text-blue-200 text-sm">
            <strong>How it works:</strong> Your AI-created assets appear in the Media Board below. Click "Add to Timeline" to add them to your movie, then set the duration slider (0-180 minutes).
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-8 bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-3">Viewer</h2>
            <div className="aspect-video bg-black border-2 border-purple-600 rounded-lg flex items-center justify-center">
              {timelineClips.length > 0 && timelineClips[0].type === 'video' ? (
                <video
                  src={timelineClips[0].url}
                  controls
                  className="w-full h-full"
                />
              ) : timelineClips.length > 0 && timelineClips[0].type === 'image' ? (
                <img
                  src={timelineClips[0].url}
                  alt={timelineClips[0].name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-purple-400 text-lg">Preview Window - Add clips from Media Board</p>
              )}
            </div>

            <div className="mt-3 bg-black border border-purple-600 rounded-lg p-2">
              <div className="text-xs font-semibold text-purple-300 mb-2">Quick Navigation</div>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => onNavigate?.(11)} className="bg-purple-600 px-3 py-1 rounded text-xs font-bold">P11 Media</button>
                <button onClick={() => onNavigate?.(12)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P12 Trim</button>
                <button onClick={() => onNavigate?.(13)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P13 FX</button>
                <button onClick={() => onNavigate?.(14)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P14 Text</button>
                <button onClick={() => onNavigate?.(15)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P15 Audio</button>
                <button onClick={() => onNavigate?.(16)} className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-xs">P16 Export</button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">Duration: <span id="durationValue">0</span> minutes</label>
              <input
                type="range"
                min="0"
                max="180"
                defaultValue="0"
                className="w-full accent-purple-600"
                onChange={(e) => {
                  const val = e.target.value;
                  const display = document.getElementById('durationValue');
                  if (display) display.textContent = val;
                }}
              />
              <div className="flex justify-between text-xs text-purple-400 mt-1">
                <span>0 min</span>
                <span>90 min</span>
                <span>180 min</span>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-4">
            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">Media Board</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Upload Media"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*,audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) alert('Upload functionality: ' + file.name);
                    }}
                  />
                  <button
                    onClick={loadAssets}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full mb-3 bg-black border border-purple-500 rounded p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <div className="h-48 overflow-y-auto space-y-2">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-purple-400">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-purple-400 text-sm text-center py-8">
                    No assets yet. Create some using the AI tools!
                  </div>
                ) : (
                  assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-black border border-purple-500 rounded p-2 hover:bg-purple-900/50 cursor-pointer transition-all group"
                    >
                      <div className="flex gap-2">
                        {asset.asset_type === 'text' ? (
                          <div className="w-16 h-16 bg-purple-900 border border-purple-600 rounded flex items-center justify-center">
                            <span className="text-2xl">📝</span>
                          </div>
                        ) : asset.asset_type === 'video' ? (
                          <div className="w-16 h-16 bg-red-900 border border-red-600 rounded flex items-center justify-center">
                            <span className="text-2xl">🎬</span>
                          </div>
                        ) : asset.asset_url ? (
                          <img
                            src={asset.asset_url}
                            alt={asset.tool_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-purple-300 truncate">
                            {asset.tool_name}
                          </div>
                          <div className="text-xs text-purple-400/70 truncate">
                            {asset.prompt}
                          </div>
                          <div className="text-xs text-purple-500 mt-1">
                            {asset.asset_type === 'text' ? 'Text Document' : asset.asset_type === 'video' ? 'Video File' : 'Image'}
                          </div>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            <button
                              onClick={() => handleAddToTimeline(asset)}
                              className="text-xs bg-blue-600 px-2 py-1 rounded hover:bg-blue-500 transition-all flex items-center gap-1"
                              title="Add to Timeline"
                            >
                              <Plus className="w-3 h-3" />
                              Add
                            </button>
                            {asset.asset_type === 'text' && asset.asset_data?.content && (
                              <button
                                onClick={() => setViewingText(asset.asset_data?.content || '')}
                                className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-500 transition-all"
                                title="View Text"
                              >
                                View
                              </button>
                            )}
                            {asset.asset_type === 'video' && (
                              <button
                                onClick={() => setViewingVideo(asset)}
                                className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-500 transition-all"
                                title="Play Video"
                              >
                                Play
                              </button>
                            )}
                            <button
                              onClick={() => handleDownloadAsset(asset)}
                              className="text-xs bg-purple-600 px-2 py-1 rounded hover:bg-purple-500 transition-all"
                              title="Download"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(asset.id)}
                              className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-500 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-3">Action List</h2>
              <div className="space-y-2 h-48 overflow-y-auto">
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Cut
                </button>
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Trim
                </button>
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Split
                </button>
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Merge
                </button>
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Add Effect
                </button>
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Color Grade
                </button>
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Audio Mix
                </button>
                <button className="w-full bg-black border border-purple-500 rounded p-2 text-sm hover:bg-purple-900 transition-all text-left">
                  Add Transition
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">Timeline - Track Layers</h2>
            {timelineClips.length > 0 && (
              <span className="text-purple-300 text-sm">{timelineClips.length} clip{timelineClips.length !== 1 ? 's' : ''} added</span>
            )}
          </div>

          {timelineClips.length > 0 && (
            <div className="mb-4 bg-black/50 border border-purple-500 rounded-lg p-3">
              <h3 className="text-sm font-bold text-purple-300 mb-2">Timeline Clips:</h3>
              <div className="flex gap-2 overflow-x-auto">
                {timelineClips.map((clip, index) => (
                  <div key={clip.id} className="bg-purple-900/50 border border-purple-500 rounded p-2 min-w-[100px]">
                    <div className="text-xs font-semibold text-white mb-1">{index + 1}. {clip.name}</div>
                    <div className="text-xs text-purple-400">{clip.type}</div>
                    <button
                      onClick={() => setTimelineClips(timelineClips.filter(c => c.id !== clip.id))}
                      className="mt-1 text-xs bg-red-600 px-2 py-0.5 rounded hover:bg-red-500 w-full"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {tracks.map((track) => (
              <div key={track.id} className="flex items-center gap-2">
                <div className="w-32 text-sm font-bold bg-black/50 px-3 py-2 rounded border border-purple-600 text-center">{track.name}</div>
                <div className="flex-1 h-12 bg-black border-2 border-purple-600 rounded relative overflow-hidden">
                  <div className={`h-full ${track.color} opacity-70 w-1/3`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-purple-500 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">Timeline Duration:</span>
              <input
                type="range"
                min="0"
                max="180"
                defaultValue="60"
                className="flex-1 accent-purple-600"
                onChange={(e) => {
                  const val = e.target.value;
                  const display = document.getElementById('timelineDurationValue');
                  if (display) display.textContent = val + ' min';
                }}
              />
              <span id="timelineDurationValue" className="text-sm w-16 text-right">60 min</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all"
          >
            Next
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center">
          <p className="text-white text-sm">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>

      {viewingText && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500">
            <div className="sticky top-0 bg-gray-900 border-b border-purple-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-400">Text Asset</h2>
              <button
                onClick={() => setViewingText(null)}
                className="text-purple-400 hover:text-purple-300 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="bg-black rounded-lg p-6 text-purple-100 whitespace-pre-wrap border border-purple-600">
                {viewingText}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewingText);
                  alert('Copied to clipboard!');
                }}
                className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-500 transition-all"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingVideo && (
        <div className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-6xl w-full border-4 border-purple-500 overflow-hidden">
            <div className="bg-purple-900/50 p-6 border-b-2 border-purple-500 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-purple-400">{viewingVideo.tool_name}</h2>
                <p className="text-sm text-purple-300 mt-1">{viewingVideo.prompt}</p>
                {viewingVideo.asset_data?.duration && (
                  <p className="text-xs text-purple-400 mt-1">Duration: {viewingVideo.asset_data.duration}</p>
                )}
              </div>
              <button
                onClick={() => setViewingVideo(null)}
                className="text-purple-400 hover:text-purple-300 transition-colors text-3xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="bg-black p-4">
              <video
                className="w-full aspect-video rounded-lg"
                controls
                autoPlay
                src={viewingVideo.asset_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="bg-purple-900/50 p-4 border-t-2 border-purple-500 flex gap-3 justify-center">
              <button
                onClick={() => handleDownloadAsset(viewingVideo)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-500 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Movie
              </button>
              <button
                onClick={() => setViewingVideo(null)}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <QuickNav onNavigate={onNavigate} currentPage={currentPage} />
    </div>
  );
}
