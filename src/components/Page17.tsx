import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, Save, FileDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Page17Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate: (page: number) => void;
  currentPage: number;
}

export default function Page17({ onNext, onBack }: Page17Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setMessage('Starting download...');
    try {
      const response = await fetch('/video/dtsb_120min.mp4');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MandaStrong_Movie_120min.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setMessage('Download started!');
      setTimeout(() => setMessage(null), 3000);
      setShowFullPlayer(true);
    } catch (error) {
      console.error('Download error:', error);
      setMessage('Download failed. Please try again.');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExport = async () => {
    setMessage('Preparing export...');
    try {
      const response = await fetch('/video/dtsb_120min.mp4');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MandaStrong_Export_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setMessage('Export complete!');
      setTimeout(() => setMessage(null), 3000);
      setShowFullPlayer(true);
    } catch (error) {
      console.error('Export error:', error);
      setMessage('Export failed. Please try again.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('Saving movie...');
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('ai_assets')
        .insert({
          user_id: user?.id || null,
          tool_name: 'Full Movie Export',
          tool_category: 'post-production',
          asset_type: 'video',
          asset_url: '/video/dtsb_120min.mp4',
          prompt: '120-minute complete movie - MandaStrong Production',
          status: 'completed',
          asset_data: {
            duration: '120 minutes',
            format: 'mp4',
            resolution: '1920x1080',
            savedAt: new Date().toISOString()
          }
        });

      if (insertError) {
        console.error('Save error:', insertError);
        setMessage('Failed to save. Error: ' + insertError.message);
      } else {
        setMessage('Movie saved to Media Board (Page 11)!');
      }
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Failed to save movie.');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-3">FINISHED! 🎉</div>
          <h1 className="text-3xl font-bold text-purple-400">Your Complete Movie</h1>
        </div>
        <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded-r-lg mb-6 max-w-3xl mx-auto">
          <p className="text-green-200 text-center"><strong>Congratulations!</strong> Your movie is ready. Click Play to watch, Download to save it, or Share to show the world!</p>
        </div>

        {message && (
          <div className="mb-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
            {message}
          </div>
        )}

        <div className="w-full max-w-7xl bg-black border-4 border-purple-500 rounded-xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src="/video/dtsb_120min.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="bg-purple-900/50 p-6 border-t-2 border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Your Movie is Ready!</h2>
            <p className="text-purple-200 mb-4">
              Watch, download, export, or save your complete 120-minute masterpiece
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button
                onClick={togglePlay}
                className="bg-green-600 hover:bg-green-500 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
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
                className="bg-purple-600 hover:bg-purple-500 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleFullScreen}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <Maximize className="w-5 h-5" />
                Full
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-orange-600 hover:bg-orange-500 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Export Movie File
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-pink-600 hover:bg-pink-500 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save to Media Board'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex gap-4 justify-center border-t-2 border-purple-500">
        <button
          onClick={onBack}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
        >
          Next
        </button>
      </div>

      <footer className="border-t-2 border-purple-500 py-4 text-center text-white text-sm">
        <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
      </footer>

      {showFullPlayer && (
        <div className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-7xl w-full border-4 border-purple-500 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 border-b-2 border-purple-500 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">Your Movie is Ready!</h2>
                <p className="text-lg text-purple-200 mt-2">120-Minute Complete Production</p>
              </div>
              <button
                onClick={() => setShowFullPlayer(false)}
                className="text-purple-300 hover:text-white transition-colors text-4xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="bg-black p-6">
              <video
                ref={modalVideoRef}
                className="w-full aspect-video rounded-lg"
                controls
                autoPlay
                src="/video/dtsb_120min.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 border-t-2 border-purple-500 flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-500 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Again
              </button>
              <button
                onClick={handleExport}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-cyan-500 transition-all flex items-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Export Copy
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-500 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save to Media Board'}
              </button>
              <button
                onClick={() => setShowFullPlayer(false)}
                className="bg-gray-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
