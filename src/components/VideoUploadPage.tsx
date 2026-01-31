import { useState, useEffect } from 'react';
import { Upload, Film, CheckCircle, AlertCircle, Home, Play, Pause, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import * as tus from 'tus-js-client';

interface VideoUploadPageProps {
  onHome?: () => void;
  onPlayMovie?: (videoUrl: string) => void;
}

interface UploadStatus {
  fileName: string;
  progress: number;
  status: 'uploading' | 'paused' | 'completed' | 'error';
  message?: string;
  upload?: tus.Upload;
}

export default function VideoUploadPage({ onHome, onPlayMovie }: VideoUploadPageProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoList, setVideoList] = useState<Array<{ name: string; url: string; size?: number }>>([]);

  const loadVideoList = async () => {
    try {
      const { data, error } = await supabase.storage.from('videos').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

      if (error) throw error;

      if (data) {
        const videos = data
          .filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.mov') || file.name.endsWith('.avi'))
          .map(file => ({
            name: file.name,
            size: (file as any).metadata?.size,
            url: supabase.storage.from('videos').getPublicUrl(file.name).data.publicUrl
          }));
        setVideoList(videos);
      }
    } catch (err) {
      console.error('Error loading videos:', err);
    }
  };

  useEffect(() => {
    loadVideoList();
  }, []);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }

    setError(null);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const projectId = import.meta.env.VITE_SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1];

    const upload = new tus.Upload(file, {
      endpoint: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'x-upsert': 'false',
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: 'videos',
        objectName: fileName,
        contentType: file.type,
        cacheControl: '3600',
      },
      chunkSize: 6 * 1024 * 1024,
      onError: (error) => {
        console.error('Upload error:', error);
        setUploadStatus({
          fileName: file.name,
          progress: uploadStatus?.progress || 0,
          status: 'error',
          message: error.message || 'Upload failed'
        });
        setError(error.message || 'Upload failed');
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        setUploadStatus({
          fileName: file.name,
          progress: parseFloat(percentage),
          status: 'uploading',
          upload
        });
      },
      onSuccess: () => {
        const publicUrl = supabase.storage.from('videos').getPublicUrl(fileName).data.publicUrl;

        setUploadStatus({
          fileName: file.name,
          progress: 100,
          status: 'completed',
          message: publicUrl
        });

        loadVideoList();

        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      },
    });

    setUploadStatus({
      fileName: file.name,
      progress: 0,
      status: 'uploading',
      upload
    });

    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  };

  const pauseUpload = () => {
    if (uploadStatus?.upload) {
      uploadStatus.upload.abort();
      setUploadStatus({
        ...uploadStatus,
        status: 'paused'
      });
    }
  };

  const resumeUpload = () => {
    if (uploadStatus?.upload) {
      setUploadStatus({
        ...uploadStatus,
        status: 'uploading'
      });
      uploadStatus.upload.start();
    }
  };

  const cancelUpload = () => {
    if (uploadStatus?.upload) {
      uploadStatus.upload.abort(true);
      setUploadStatus(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute top-6 left-6 z-10">
        {onHome && (
          <button
            onClick={onHome}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-12">
          <Film className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">Upload Your Movie</h1>
          <p className="text-gray-400 text-lg">
            Upload videos of any size - pause and resume anytime
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
          {!uploadStatus && (
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-blue-400 transition-all">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold mb-2">
                  Click to upload video
                </p>
                <p className="text-slate-400 text-sm">
                  Supports MP4, MOV, AVI and other video formats
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Files up to 50GB supported - Upload will resume automatically if interrupted
                </p>
              </label>
            </div>
          )}

          {uploadStatus && (
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold">{uploadStatus.fileName}</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {uploadStatus.status === 'uploading' && 'Uploading...'}
                      {uploadStatus.status === 'paused' && 'Paused'}
                      {uploadStatus.status === 'completed' && 'Upload complete!'}
                      {uploadStatus.status === 'error' && 'Upload failed'}
                    </p>
                  </div>
                  <button
                    onClick={cancelUpload}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                    title="Cancel upload"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                    <span>Progress</span>
                    <span>{uploadStatus.progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${uploadStatus.progress}%` }}
                    />
                  </div>
                </div>

                {uploadStatus.status === 'uploading' && (
                  <button
                    onClick={pauseUpload}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                  >
                    <Pause className="w-5 h-5" />
                    Pause Upload
                  </button>
                )}

                {uploadStatus.status === 'paused' && (
                  <button
                    onClick={resumeUpload}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                  >
                    <Play className="w-5 h-5" />
                    Resume Upload
                  </button>
                )}

                {uploadStatus.status === 'completed' && uploadStatus.message && (
                  <button
                    onClick={() => onPlayMovie && onPlayMovie(uploadStatus.message!)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
                  >
                    <Play className="w-5 h-5" />
                    Watch Now
                  </button>
                )}
              </div>

              {uploadStatus.status === 'completed' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-semibold">Upload Successful!</p>
                    <p className="text-green-300 text-sm mt-1">Your video is ready to watch</p>
                  </div>
                </div>
              )}

              {uploadStatus.status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">Upload Failed</p>
                    <p className="text-red-300 text-sm mt-1">{uploadStatus.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && !uploadStatus && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold">Error</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {videoList.length > 0 && (
          <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Your Videos</h2>
            <div className="space-y-3">
              {videoList.map((video, index) => (
                <div
                  key={index}
                  className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Film className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{video.name}</p>
                      {video.size && (
                        <p className="text-slate-400 text-xs">{formatFileSize(video.size)}</p>
                      )}
                    </div>
                  </div>
                  {onPlayMovie && (
                    <button
                      onClick={() => onPlayMovie(video.url)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold flex-shrink-0 ml-4"
                    >
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Resumable Upload Features
          </h3>
          <ul className="text-blue-200 text-sm space-y-2 ml-7">
            <li>Upload videos up to 50GB in size</li>
            <li>Pause and resume uploads at any time</li>
            <li>Automatic resume if connection is lost</li>
            <li>Keep this tab open during large uploads</li>
            <li>Upload continues from where it left off</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
