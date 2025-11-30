import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Upload, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateVideoFile, testVideoPlayback, formatFileSize, formatDuration } from '../lib/videoValidator';
import { extractAndSaveVideoMetadata, formatMetadataForDisplay, type VideoMetadata } from '../lib/videoMetadataService';

interface Page10Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate?: (page: number) => void;
  currentPage?: number;
}

export default function Page10({ onNext, onBack }: Page10Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [currentVideoSource, setCurrentVideoSource] = useState('/video/dtsb_120min.mp4');
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 1.0;
      videoRef.current.muted = false;
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setValidationSuccess(false);
    const validation = await validateVideoFile(file);

    if (!validation.isValid) {
      alert(validation.error || 'Invalid video file');
      return;
    }

    if (validation.metadata) {
      const duration = formatDuration(validation.metadata.duration);
      const size = formatFileSize(validation.metadata.size);
      const resolution = `${validation.metadata.width}x${validation.metadata.height}`;
      console.log(`Validated video: ${duration}, ${size}, ${resolution}`);
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = `doxy_movie_${Date.now()}_${file.name}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          }
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      const canPlay = await testVideoPlayback(publicUrl);

      if (!canPlay) {
        alert('Video uploaded but playback test failed. The video may be corrupted or in an unsupported format.');
        setIsUploading(false);
        setUploadProgress(0);
        return;
      }

      const metadataResult = await extractAndSaveVideoMetadata(file, data.path, publicUrl);

      if (!metadataResult.success) {
        console.error('Failed to save video metadata:', metadataResult.error);
      } else if (metadataResult.metadata) {
        setVideoMetadata(metadataResult.metadata);
        console.log('Video metadata saved successfully:', metadataResult.metadata);
      }

      setCustomVideoUrl(publicUrl);
      setCurrentVideoSource(publicUrl);
      setIsUploading(false);
      setUploadProgress(0);
      setValidationSuccess(true);

      if (videoRef.current) {
        videoRef.current.load();
      }

      setTimeout(() => {
        setValidationSuccess(false);
      }, 5000);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      alert(`Upload failed: ${errorMessage}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-4">
      <div className="text-center max-w-6xl w-full mx-auto pt-8">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-orange-400 mb-4">
          🎬 Doxy: The School Bully
        </h1>
        <p className="text-orange-300 text-xl mb-6">A MandaStrong1 Film - 120 Minute Expanded Final Cut</p>

        <div className="bg-neutral-900 border-2 border-orange-500 rounded-2xl p-6 mb-8 max-w-5xl mx-auto">
          <div className="text-orange-400 font-bold text-lg mb-4">
            {customVideoUrl ? 'Now Playing: Your Custom Movie' : 'Now Playing: Doxy - The School Bully (120 Minutes)'}
          </div>

          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload Your 120-Minute Movie'}
            </button>
            {isUploading && (
              <div className="mt-3 bg-black/50 rounded-lg p-2">
                <div className="bg-orange-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
            {validationSuccess && (
              <div className="mt-3 bg-green-500/20 border border-green-500 rounded-lg p-3 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Video validated and ready to play!</span>
              </div>
            )}
          </div>

          <div className="border-2 border-orange-500 rounded-xl overflow-hidden shadow-2xl mb-6">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              key={currentVideoSource}
              playsInline
            >
              <source src={currentVideoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={togglePlay}
              className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play
                </>
              )}
            </button>
            <button
              onClick={toggleMute}
              className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button
              onClick={toggleFullscreen}
              className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2"
            >
              <Maximize2 className="w-5 h-5" />
              Fullscreen
            </button>
          </div>

          <p className="text-orange-200 text-sm">
            Complete uninterrupted 120-minute viewing experience
          </p>
        </div>

        {videoMetadata && customVideoUrl && (
          <div className="bg-blue-900/30 border-2 border-blue-500 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Info className="w-6 h-6" />
              Video Metadata
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/50 p-4 rounded-lg">
                <div className="text-blue-400 font-bold mb-1">Duration</div>
                <div className="text-white">{formatMetadataForDisplay(videoMetadata).duration}</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg">
                <div className="text-blue-400 font-bold mb-1">Resolution</div>
                <div className="text-white">{formatMetadataForDisplay(videoMetadata).resolution}</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg">
                <div className="text-blue-400 font-bold mb-1">File Size</div>
                <div className="text-white">{formatMetadataForDisplay(videoMetadata).size}</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg">
                <div className="text-blue-400 font-bold mb-1">Format</div>
                <div className="text-white">{formatMetadataForDisplay(videoMetadata).format}</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg">
                <div className="text-blue-400 font-bold mb-1">Aspect Ratio</div>
                <div className="text-white">{formatMetadataForDisplay(videoMetadata).aspectRatio}</div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg">
                <div className="text-blue-400 font-bold mb-1">File Name</div>
                <div className="text-white text-xs truncate" title={videoMetadata.file_name}>{videoMetadata.file_name}</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-neutral-900 border-2 border-orange-500 rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-orange-400 mb-4">Movie Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Duration</div>
              <div className="text-white">120 Minutes</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Quality</div>
              <div className="text-white">768P HD</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Characters</div>
              <div className="text-white">Doxy, Ethan, Lily</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Genre</div>
              <div className="text-white">Drama</div>
            </div>
          </div>
          <p className="text-orange-200 text-lg leading-relaxed mb-4">
            Experience the compelling 120-minute story of Doxy, a powerful narrative about courage, friendship, and standing up against bullying. Watch as a school bully transforms through meaningful connections and discovers the power of empathy and change.
          </p>
          <p className="text-orange-300">
            Written and directed by MandaStrong1
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-orange-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-orange-500 transition-all hover:scale-105"
          >
            Continue to Editor
          </button>
        </div>

        <footer className="border-t-2 border-orange-500 pt-6 mt-12">
          <p className="text-white text-sm">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>
    </div>
  );
}
