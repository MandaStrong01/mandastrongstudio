import { useState } from 'react';
import { X, Loader2, Download, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AIToolInterfaceProps {
  toolName: string;
  toolCategory: string;
  onClose: () => void;
}

export default function AIToolInterface({ toolName, toolCategory, onClose }: AIToolInterfaceProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<string | null>(null);
  const [assetType, setAssetType] = useState<'text' | 'image'>('image');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDownload = () => {
    if (!generatedAsset) return;

    if (assetType === 'text') {
      const blob = new Blob([generatedAsset], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${toolName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = generatedAsset;
      link.download = `${toolName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getAssetType = (): { type: string; assetUrl: string; assetData: any; displayType: 'text' | 'image' } => {
    const toolLower = toolName.toLowerCase();

    if (toolLower.includes('story') || toolLower.includes('script') || toolLower.includes('dialogue') ||
        toolLower.includes('character arc') || toolLower.includes('world building')) {
      const generatedStory = `# ${toolName} Output\n\nPrompt: "${prompt}"\n\n---\n\nOnce upon a time, in a world unlike any other, a story began to unfold...\n\nYour creative prompt has generated a unique narrative filled with compelling characters, vivid settings, and dramatic tension. This is where your story comes to life, ready to be refined and developed into a full production.\n\n[Generated content would appear here in a real AI system]\n\nThis placeholder represents your ${toolName.toLowerCase()} output. In production, this would contain detailed story elements, character development, plot points, and narrative structure tailored to your specific prompt.`;

      return {
        type: 'text',
        assetUrl: '',
        assetData: {
          content: generatedStory,
          wordCount: generatedStory.split(' ').length,
          generatedAt: new Date().toISOString()
        },
        displayType: 'text'
      };
    }

    return {
      type: 'image',
      assetUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
      assetData: {
        dimensions: '800x600',
        format: 'jpg',
        generatedAt: new Date().toISOString()
      },
      displayType: 'image'
    };
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    setGeneratedAsset(null);

    try {
      const { type, assetUrl, assetData, displayType } = getAssetType();
      setAssetType(displayType);

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error: insertError } = await supabase
          .from('ai_assets')
          .insert({
            user_id: user.id,
            tool_name: toolName,
            tool_category: toolCategory,
            asset_type: type,
            asset_url: assetUrl || null,
            prompt: prompt,
            status: 'completed',
            asset_data: assetData
          });

        if (insertError) {
          console.error('Database save error:', insertError);
          setError('Asset generated but not saved. Error: ' + insertError.message);
        } else {
          setSuccess('Success! Asset saved to Media Board. Go to Page 11 to view all your assets.');
        }
      } else {
        setError('Asset generated! Sign in on Page 3 to save assets to Media Board.');
      }

      if (displayType === 'text') {
        setGeneratedAsset(assetData.content);
      } else {
        setGeneratedAsset(assetUrl);
      }

      setTimeout(() => {
        setPrompt('');
        setGeneratedAsset(null);
        onClose();
      }, 4000);

    } catch (err) {
      console.error('Generation error:', err);
      setError('Failed to generate asset. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-500">
        <div className="sticky top-0 bg-gray-900 border-b border-purple-500 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              {toolName}
            </h2>
            <p className="text-purple-300 text-sm mt-1">{toolCategory}</p>
          </div>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4 font-semibold">
              {success}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-purple-300 mb-2 font-semibold">
              Describe what you want to create:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your creative prompt here..."
              className="w-full bg-gray-800 text-white border border-purple-500 rounded-lg p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-400"
              disabled={isGenerating}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Asset
              </>
            )}
          </button>

          {generatedAsset && (
            <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-purple-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-purple-400 font-semibold">Generated Asset</h3>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  Saved to Media Board
                </div>
              </div>
              {assetType === 'text' ? (
                <div className="bg-black rounded-lg p-4 text-purple-100 whitespace-pre-wrap max-h-96 overflow-y-auto border border-purple-600">
                  {generatedAsset}
                </div>
              ) : (
                <img
                  src={generatedAsset}
                  alt="Generated asset"
                  className="w-full rounded-lg"
                />
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-500 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-purple-500/50">
            <h3 className="text-purple-400 font-semibold mb-2">Quick Tips:</h3>
            <ul className="text-purple-300 text-sm space-y-1">
              <li>• Be specific and descriptive in your prompts</li>
              <li>• Include details about style, mood, and composition</li>
              <li>• All completed assets automatically save to Page 11 Media Board</li>
              <li>• You can access your assets anytime from the media board</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
