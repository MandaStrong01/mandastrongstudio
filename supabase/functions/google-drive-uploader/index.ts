import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RequestBody {
  googleDriveUrl: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // The caller must be a signed-in user. Without this check anyone holding the
    // public key can make the server download arbitrary files into storage.
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const { data: userData, error: userError } = token
      ? await supabase.auth.getUser(token)
      : { data: { user: null }, error: new Error('missing token') };

    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { googleDriveUrl }: RequestBody = await req.json();

    const extractFileId = (url: string): string | null => {
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

    const fileId = extractFileId(googleDriveUrl);
    if (!fileId) {
      return new Response(
        JSON.stringify({ error: 'Invalid Google Drive URL' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;

    console.log('Downloading from Google Drive...');
    const response = await fetch(downloadUrl, {
      headers: {
        'Accept': 'video/mp4,video/*,*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      return new Response(
        JSON.stringify({ 
          error: 'Google Drive file is not publicly accessible or requires manual download. Make sure the file is set to "Anyone with the link can view"' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Processing video file...');
    const blob = await response.blob();

    if (blob.size < 1000) {
      throw new Error('File too small - likely an error page');
    }

    const MAX_BYTES = 5 * 1024 * 1024 * 1024;
    if (blob.size > MAX_BYTES) {
      return new Response(
        JSON.stringify({ error: 'File is too large' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`File size: ${blob.size} bytes`);

    const fileName = `${userData.user.id}/doxy_120min_${Date.now()}.mp4`;
    console.log('Uploading to Supabase storage...');

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'video/mp4'
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(data.path);

    console.log('Upload successful!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        fileName: fileName
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Upload failed',
        details: 'The file may be too large or not publicly accessible on Google Drive'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});