import React, { useState, useEffect } from 'react';
import { Film, Plus, Save, Play, Download, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import VideoTimeline from './VideoTimeline';
import VideoPreview from './VideoPreview';
import AssetLibrary from './AssetLibrary';
import TextEditor from './TextEditor';
import TransitionEditor from './TransitionEditor';

interface VideoProject {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: string;
  created_at: string;
}

interface TimelineClip {
  id: string;
  name: string;
  url: string;
  type: string;
  startTime: number;
  duration: number;
}

export default function VideoStudio() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [currentProject, setCurrentProject] = useState<VideoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'assets' | 'text' | 'transitions'>('timeline');
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('video_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('video_projects')
        .insert({
          user_id: user.id,
          title: `New Project ${projects.length + 1}`,
          description: '',
          duration: 0,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      setProjects([data, ...projects]);
      setCurrentProject(data);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const saveProject = async () => {
    if (!currentProject) return;

    try {
      const { error } = await supabase
        .from('video_projects')
        .update({
          title: currentProject.title,
          description: currentProject.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProject.id);

      if (error) throw error;
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const handleAssetSelect = (asset: any) => {
    const newClip: TimelineClip = {
      id: `clip-${Date.now()}`,
      name: asset.name,
      url: asset.url,
      type: asset.type,
      startTime: timelineClips.reduce((acc, clip) => acc + clip.duration, 0),
      duration: 5
    };
    setTimelineClips([...timelineClips, newClip]);
    setActiveTab('timeline');
    alert(`Added "${asset.name}" to timeline!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-white text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Loading Video Studio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {!currentProject ? (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">MANDASTRONG'S VIDEO STUDIO</h1>
                <p className="text-xl font-bold italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Create and edit movies up to 2.5 hours long</p>
              </div>
              <button
                onClick={createNewProject}
                className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-gray-800 transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setCurrentProject(project)}
                  className="bg-black/80 backdrop-blur-sm border-2 border-white rounded-lg p-6 cursor-pointer hover:bg-gray-900 transition-all hover:scale-105 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Film className="w-8 h-8 text-white" />
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'completed' ? 'bg-green-600' :
                      project.status === 'rendering' ? 'bg-blue-600' :
                      'bg-slate-600'
                    } text-white`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 transition">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{project.description || 'No description'}</p>
                  <div className="text-xs text-gray-400">
                    Duration: {Math.floor(project.duration / 60)}:{(project.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-20">
                <Film className="w-20 h-20 text-white mx-auto mb-4" />
                <h3 className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">No Projects Yet</h3>
                <p className="text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-6">Create your first video project to get started</p>
                <button
                  onClick={createNewProject}
                  className="bg-black text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-gray-800 transition-all hover:scale-105"
                >
                  Create First Project
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-screen">
            <div className="bg-black/90 backdrop-blur-sm border-b-2 border-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentProject(null)}
                  className="text-white hover:text-gray-300 text-lg font-bold transition"
                >
                  ← Back
                </button>
                <input
                  type="text"
                  value={currentProject.title}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                  className="bg-black/50 text-white px-4 py-2 rounded text-xl font-black border-2 border-white outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-all hover:scale-105">
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={saveProject}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-all hover:scale-105"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800 transition-all hover:scale-105">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-64 bg-black/80 backdrop-blur-sm border-r-2 border-white p-4 overflow-y-auto">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                      activeTab === 'timeline' ? 'bg-white text-black' : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                      activeTab === 'assets' ? 'bg-white text-black' : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    Assets
                  </button>
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                      activeTab === 'text' ? 'bg-white text-black' : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    Text & Titles
                  </button>
                  <button
                    onClick={() => setActiveTab('transitions')}
                    className={`w-full text-left px-4 py-2 rounded font-bold transition ${
                      activeTab === 'transitions' ? 'bg-white text-black' : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    Transitions
                  </button>
                </nav>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 bg-black/60 p-6">
                  <VideoPreview projectId={currentProject.id} />
                </div>

                <div className="h-80 bg-black/80 backdrop-blur-sm border-t-2 border-white p-4 overflow-y-auto">
                  {activeTab === 'timeline' && (
                    <div>
                      <VideoTimeline projectId={currentProject.id} />
                      {timelineClips.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-white font-bold mb-2">Timeline Clips ({timelineClips.length})</h3>
                          <div className="flex gap-2 overflow-x-auto">
                            {timelineClips.map((clip) => (
                              <div key={clip.id} className="bg-slate-700 rounded p-2 min-w-[120px]">
                                <p className="text-white text-xs truncate">{clip.name}</p>
                                <p className="text-slate-400 text-xs">{clip.duration}s</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'assets' && <AssetLibrary projectId={currentProject.id} onAssetSelect={handleAssetSelect} />}
                  {activeTab === 'text' && <TextEditor projectId={currentProject.id} />}
                  {activeTab === 'transitions' && <TransitionEditor projectId={currentProject.id} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
