import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoPreviewProps {
  projectId: string;
}

export default function VideoPreview({ projectId }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol / 100;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full"
          style={{ display: 'none' }}
        />
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="max-w-full max-h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg">Preview Window</p>
            <p className="text-sm text-slate-400 mt-2">Add clips to your timeline to see them here</p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-300 text-sm">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1"
          />
          <span className="text-slate-300 text-sm">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, currentTime - 10);
                }
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                }
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-slate-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
            <span className="text-slate-400 text-sm w-10">{volume}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
