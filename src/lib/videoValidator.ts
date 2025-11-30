export interface VideoValidationResult {
  isValid: boolean;
  error?: string;
  metadata?: {
    duration: number;
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska'
];

export const MAX_VIDEO_SIZE = 5 * 1024 * 1024 * 1024;

export async function validateVideoFile(file: File): Promise<VideoValidationResult> {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided'
    };
  }

  if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported format: ${file.type}. Supported formats: MP4, WebM, OGG, MOV, AVI, MKV`
    };
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return {
      isValid: false,
      error: `File too large: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB. Maximum: 5GB`
    };
  }

  try {
    const metadata = await getVideoMetadata(file);

    if (!metadata) {
      return {
        isValid: false,
        error: 'Unable to read video metadata'
      };
    }

    if (metadata.duration === 0) {
      return {
        isValid: false,
        error: 'Video appears to be corrupted or has zero duration'
      };
    }

    return {
      isValid: true,
      metadata: {
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        format: file.type,
        size: file.size
      }
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}

export function getVideoMetadata(file: File): Promise<{
  duration: number;
  width: number;
  height: number;
} | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };

    video.src = URL.createObjectURL(file);
  });
}

export async function testVideoPlayback(videoUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    const timeout = setTimeout(() => {
      video.remove();
      resolve(false);
    }, 10000);

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      if (video.duration > 0) {
        video.remove();
        resolve(true);
      } else {
        video.remove();
        resolve(false);
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      video.remove();
      resolve(false);
    };

    video.src = videoUrl;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
