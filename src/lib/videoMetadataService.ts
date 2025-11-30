import { supabase } from './supabase';
import { getVideoMetadata } from './videoValidator';

export interface VideoMetadata {
  id?: string;
  user_id?: string;
  file_name: string;
  file_path: string;
  public_url: string;
  duration: number;
  width: number;
  height: number;
  file_size: number;
  format: string;
  fps?: number;
  bitrate?: number;
  codec?: string;
  aspect_ratio?: string;
  created_at?: string;
  updated_at?: string;
}

export async function saveVideoMetadata(metadata: VideoMetadata): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const metadataToSave = {
      ...metadata,
      user_id: user?.id || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('video_metadata')
      .upsert(metadataToSave, {
        onConflict: 'file_path'
      });

    if (error) {
      console.error('Error saving video metadata:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveVideoMetadata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getVideoMetadataFromDB(filePath: string): Promise<VideoMetadata | null> {
  try {
    const { data, error } = await supabase
      .from('video_metadata')
      .select('*')
      .eq('file_path', filePath)
      .maybeSingle();

    if (error) {
      console.error('Error fetching video metadata:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getVideoMetadataFromDB:', error);
    return null;
  }
}

export async function getAllVideoMetadata(): Promise<VideoMetadata[]> {
  try {
    const { data, error } = await supabase
      .from('video_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all video metadata:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllVideoMetadata:', error);
    return [];
  }
}

export async function extractAndSaveVideoMetadata(
  file: File,
  filePath: string,
  publicUrl: string
): Promise<{ success: boolean; metadata?: VideoMetadata; error?: string }> {
  try {
    const videoMetadata = await getVideoMetadata(file);

    if (!videoMetadata) {
      return {
        success: false,
        error: 'Failed to extract video metadata'
      };
    }

    const aspectRatio = calculateAspectRatio(videoMetadata.width, videoMetadata.height);

    const metadata: VideoMetadata = {
      file_name: file.name,
      file_path: filePath,
      public_url: publicUrl,
      duration: videoMetadata.duration,
      width: videoMetadata.width,
      height: videoMetadata.height,
      file_size: file.size,
      format: file.type,
      aspect_ratio: aspectRatio
    };

    const result = await saveVideoMetadata(metadata);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, metadata };
  } catch (error) {
    console.error('Error in extractAndSaveVideoMetadata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export function formatMetadataForDisplay(metadata: VideoMetadata): {
  duration: string;
  resolution: string;
  size: string;
  aspectRatio: string;
  format: string;
} {
  const hours = Math.floor(metadata.duration / 3600);
  const minutes = Math.floor((metadata.duration % 3600) / 60);
  const seconds = Math.floor(metadata.duration % 60);

  let durationStr = '';
  if (hours > 0) durationStr += `${hours}h `;
  if (minutes > 0) durationStr += `${minutes}m `;
  durationStr += `${seconds}s`;

  const sizeInGB = metadata.file_size / (1024 * 1024 * 1024);
  const sizeInMB = metadata.file_size / (1024 * 1024);
  const sizeStr = sizeInGB >= 1
    ? `${sizeInGB.toFixed(2)} GB`
    : `${sizeInMB.toFixed(2)} MB`;

  return {
    duration: durationStr.trim(),
    resolution: `${metadata.width}x${metadata.height}`,
    size: sizeStr,
    aspectRatio: metadata.aspect_ratio || 'Unknown',
    format: metadata.format.split('/')[1]?.toUpperCase() || 'Unknown'
  };
}
