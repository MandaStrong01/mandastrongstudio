import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, Link } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoUploaderProps {
  onUploadComplete?: (url: string) => void;
  bucketName?: string;
  acceptedFormats?: string;
}

export default function VideoUploader({
  onUploadComplete,
  bucketName = 'videos',
  acceptedFormats = 'video/mp4,video/webm,video/ogg'
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');

  const extractGoogleDriveFileId = (url: string): string | null => {
    const patterns = [
      /\/file\/d\/([^\/]+)/,
      /id=([^&]+)/,
      /^([a-zA-Z0-9_-]{25,})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleGoogleDriveUpload = async () => {
    if (!googleDriveUrl) {
      setUploadStatus('error');
      setStatusMessage('Please enter a Google Drive URL.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setUploadStatus('idle');
    setStatusMessage('Sending request to server...');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-drive-uploader`;

      setStatusMessage('Server is downloading from Google Drive (this may take several minutes)...');
      setUploadProgress(30);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleDriveUrl })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || result.details || 'Upload failed');
      }

      setUploadedUrl(result.url);
      setUploadProgress(100);
      setUploadStatus('success');
      setStatusMessage('Video uploaded successfully from Google Drive!');

      if (onUploadComplete) {
        onUploadComplete(result.url);
      }
    } catch (error) {
      console.error('Google Drive upload error:', error);
      setUploadStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to download from Google Drive.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus('error');
      setStatusMessage('File size must be less than 5GB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      setUploadedUrl(publicUrl);
      setUploadProgress(100);
      setUploadStatus('success');
      setStatusMessage('Video uploaded successfully!');

      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-purple-900/30 border-2 border-purple-500 rounded-2xl">
      <h3 className="text-2xl font-bold text-purple-400 mb-4">Upload Video</h3>

      <div className="mb-6">
        <label className="block text-purple-300 font-semibold mb-2 flex items-center gap-2">
          <Link className="w-5 h-5" />
          Option 1: Paste Google Drive Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={googleDriveUrl}
            onChange={(e) => setGoogleDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="flex-1 px-4 py-2 bg-purple-950/50 border border-purple-500 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={uploading}
          />
          <button
            onClick={handleGoogleDriveUpload}
            disabled={uploading || !googleDriveUrl}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Upload
          </button>
        </div>
        <p className="text-xs text-purple-400 mt-2">
          Make sure your Google Drive file is set to "Anyone with the link can view"
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-purple-500"></div>
        <span className="text-purple-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-purple-500"></div>
      </div>

      <div className="mb-4">
        <label className="block text-purple-300 font-semibold mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Option 2: Upload from Computer
        </label>
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-500 rounded-lg cursor-pointer hover:bg-purple-900/50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-3" />
            ) : (
              <Upload className="w-12 h-12 text-purple-400 mb-3" />
            )}
            <p className="mb-2 text-sm text-purple-300">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-purple-400">MP4, WebM, or OGG (MAX. 5GB)</p>
          </div>
          <input
            id="video-upload"
            type="file"
            className="hidden"
            accept={acceptedFormats}
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-purple-900/50 rounded-full h-2.5">
            <div
              className="bg-purple-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-purple-300 text-sm mt-2 text-center">
            {statusMessage} {uploadProgress}%
          </p>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-900/30 border border-green-500 rounded-lg mb-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div className="flex-1">
            <p className="text-green-400 font-semibold">{statusMessage}</p>
            {uploadedUrl && (
              <p className="text-green-300 text-xs mt-1 break-all">{uploadedUrl}</p>
            )}
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-900/30 border border-red-500 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{statusMessage}</p>
        </div>
      )}

      <div className="text-purple-300 text-sm">
        <p className="mb-2">Upload your 120-minute Doxy movie file to Supabase Storage.</p>
        <p className="text-xs text-purple-400 mb-2">Note: Large files may take several minutes to upload.</p>
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3 text-xs">
          <p className="text-blue-300 font-semibold mb-1">Server-side upload enabled!</p>
          <p className="text-blue-200">The server will handle downloading from Google Drive, so large files work great.</p>
        </div>
      </div>
    </div>
  );
}
