import { useState, useEffect } from 'react';
import { Film, Info, Loader } from 'lucide-react';
import { getAllVideoMetadata, formatMetadataForDisplay, type VideoMetadata } from '../lib/videoMetadataService';

export default function VideoMetadataViewer() {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllVideos();
  }, []);

  const loadAllVideos = async () => {
    setLoading(true);
    const allVideos = await getAllVideoMetadata();
    setVideos(allVideos);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-3 text-white">Loading video metadata...</span>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-neutral-900 border-2 border-purple-500 rounded-2xl p-8 text-center">
        <Film className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <p className="text-white text-lg">No videos with metadata found</p>
        <p className="text-gray-400 text-sm mt-2">Upload videos to see their metadata here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-3">
        <Info className="w-8 h-8 text-purple-400" />
        All Video Metadata ({videos.length})
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const formatted = formatMetadataForDisplay(video);
          return (
            <div
              key={video.id}
              className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur border-2 border-purple-500 rounded-xl p-6 hover:border-purple-400 transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <Film className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg truncate" title={video.file_name}>
                    {video.file_name}
                  </h3>
                  <p className="text-purple-300 text-xs mt-1">
                    {new Date(video.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-t border-purple-500/30">
                  <span className="text-purple-300 text-sm">Duration</span>
                  <span className="text-white font-semibold">{formatted.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-purple-500/30">
                  <span className="text-purple-300 text-sm">Resolution</span>
                  <span className="text-white font-semibold">{formatted.resolution}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-purple-500/30">
                  <span className="text-purple-300 text-sm">File Size</span>
                  <span className="text-white font-semibold">{formatted.size}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-purple-500/30">
                  <span className="text-purple-300 text-sm">Format</span>
                  <span className="text-white font-semibold">{formatted.format}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-purple-500/30">
                  <span className="text-purple-300 text-sm">Aspect Ratio</span>
                  <span className="text-white font-semibold">{formatted.aspectRatio}</span>
                </div>
              </div>

              <a
                href={video.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg transition-all font-semibold"
              >
                View Video
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
