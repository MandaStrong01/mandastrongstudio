import React, { useState, useEffect } from 'react';
import { Upload, Video, Image as ImageIcon, Music, File, Trash2, Download, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Asset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string;
  duration?: number;
  size: number;
  created_at: string;
}

interface AssetLibraryProps {
  projectId: string;
  onAssetSelect?: (asset: Asset) => void;
}

export default function AssetLibrary({ projectId, onAssetSelect }: AssetLibraryProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'audio'>('all');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIAssets();
  }, []);

  const loadAIAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedAssets: Asset[] = data.map(item => ({
          id: item.id,
          name: item.asset_name,
          type: item.asset_type as 'video' | 'image' | 'audio',
          url: item.asset_url,
          size: item.file_size || 0,
          created_at: item.created_at
        }));
        setAssets(formattedAssets);
      }
    } catch (error) {
      console.error('Error loading AI assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newAsset: Asset = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type.startsWith('video') ? 'video' : file.type.startsWith('image') ? 'image' : 'audio',
          url: dataUrl,
          size: file.size,
          created_at: new Date().toISOString()
        };
        setAssets(prev => [...prev, newAsset]);
      };
      reader.readAsDataURL(file);
    }

    setUploading(false);
  };

  const deleteAsset = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('ai_assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      setAssets(assets.filter(a => a.id !== assetId));
    } catch (error) {
      console.error('Error deleting asset:', error);
      setAssets(assets.filter(a => a.id !== assetId));
    }
  };

  const downloadAsset = (asset: Asset) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const filteredAssets = filter === 'all'
    ? assets
    : assets.filter(a => a.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-6 h-6" />;
      case 'image': return <ImageIcon className="w-6 h-6" />;
      case 'audio': return <Music className="w-6 h-6" />;
      default: return <File className="w-6 h-6" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded transition ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded transition ${
              filter === 'video' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setFilter('image')}
            className={`px-4 py-2 rounded transition ${
              filter === 'image' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilter('audio')}
            className={`px-4 py-2 rounded transition ${
              filter === 'audio' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Audio
          </button>
        </div>

        <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition">
          <Upload className="w-4 h-4" />
          Upload Files
          <input
            type="file"
            multiple
            accept="video/*,image/*,audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="text-center py-8">
            <div className="text-blue-400 mb-2">Loading AI-generated assets...</div>
          </div>
        )}

        {uploading && (
          <div className="text-center py-8">
            <div className="text-blue-400 mb-2">Uploading files...</div>
          </div>
        )}

        {filteredAssets.length === 0 && !uploading && !loading ? (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No AI assets yet. Generate some using the AI tools!</p>
          </div>
        ) : !loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition group relative"
              >
                <div className="aspect-video bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden">
                  {asset.type === 'image' && asset.url ? (
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    getIcon(asset.type)
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate mb-1">{asset.name}</p>
                  <p className="text-slate-400 text-xs mb-3">{formatFileSize(asset.size)}</p>

                  <div className="flex gap-2">
                    {onAssetSelect && (
                      <button
                        onClick={() => onAssetSelect(asset)}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded text-xs font-bold transition"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    )}
                    <button
                      onClick={() => downloadAsset(asset)}
                      className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded transition"
                      title="Download"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${asset.name}"?`)) {
                          deleteAsset(asset.id);
                        }
                      }}
                      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
