import { X, Home } from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
}

export default function UserGuide({ onClose }: UserGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900/90 to-black border-2 border-purple-500 rounded-2xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                MandaStrong1 Studio User Guide
              </h1>
              <p className="text-purple-300 text-lg">Complete Video Creation Platform</p>
            </div>
            <button
              onClick={onClose}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="space-y-8 text-white">
            <section className="bg-black/50 border border-purple-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Welcome to MandaStrong1 Studio</h2>
              <p className="text-purple-200 leading-relaxed mb-4">
                MandaStrong1 Studio is a comprehensive video creation platform featuring 600+ AI-powered tools,
                professional editing capabilities, and seamless workflow management. Whether you're creating short
                clips or feature-length films, this studio has everything you need.
              </p>
            </section>

            <section className="bg-black/50 border border-purple-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Getting Started</h2>

              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-bold text-purple-300 mb-2">Step 1: Create Your Account</h3>
                  <p className="text-purple-200">
                    Navigate to <strong>Page 3</strong> to register or login. Choose from three plans:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-purple-200 ml-4">
                    <li><strong>Basic:</strong> HD Export, 100 AI Tools, 10GB Storage</li>
                    <li><strong>Pro:</strong> 4K Export, 300 AI Tools, 100GB Storage, Commercial License</li>
                    <li><strong>Studio:</strong> 8K Export, All 600 AI Tools, 1TB Storage, Team Collaboration</li>
                  </ul>
                  <p className="text-purple-300 mt-2 font-semibold">
                    Note: All plans are currently FREE during beta testing!
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-xl font-bold text-purple-300 mb-2">Step 2: Quick Navigation from Page 4</h3>
                  <p className="text-purple-200 mb-2">
                    On Page 4, you'll find quick navigation buttons to jump directly to key features:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-purple-200 ml-4">
                    <li><strong>Create Movie:</strong> Start a new video project</li>
                    <li><strong>Upload Videos:</strong> Add your video files to work with</li>
                    <li><strong>View My Movies:</strong> See all your saved projects</li>
                    <li><strong>All Tools:</strong> Access all 600 AI tools at once</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-black/50 border border-purple-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Page-by-Page Guide</h2>

              <div className="space-y-4">
                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 1: Welcome</h3>
                  <p className="text-purple-200">
                    Introduction to MandaStrong1 Studio and overview of features.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 2: Platform Overview</h3>
                  <p className="text-purple-200">
                    Learn about the studio's capabilities and what makes it unique.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 3: Login & Registration</h3>
                  <p className="text-purple-200">
                    Create your account or sign in. <strong>Required for saving AI assets and projects!</strong>
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 4: Pre-Production AI Tools</h3>
                  <p className="text-purple-200 mb-2">
                    120 AI tools for story development and planning. Quick action buttons:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-purple-200 ml-4">
                    <li><strong>Create Movie:</strong> Opens the Video Studio to start a new project</li>
                    <li><strong>Upload Videos:</strong> Upload your video files to use in projects</li>
                    <li><strong>View My Movies:</strong> See all your saved video projects</li>
                    <li><strong>All Tools:</strong> Access all 600 AI tools in one place</li>
                  </ul>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Pages 5-9: More AI Tools</h3>
                  <p className="text-purple-200 mb-2">
                    Additional tool categories:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-purple-200 ml-4">
                    <li><strong>Production:</strong> Camera, Lighting, Cinematography</li>
                    <li><strong>Post-Production:</strong> Editing, Transitions, Effects</li>
                    <li><strong>VFX:</strong> Visual Effects, CGI, Motion Graphics</li>
                    <li><strong>Color Grading:</strong> LUTs, Color Wheels, Cinematic Looks</li>
                    <li><strong>Audio:</strong> Sound Design, Music, Mixing</li>
                  </ul>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 10: Doxy Movie Theater</h3>
                  <p className="text-purple-200">
                    Watch the full 120-minute film "Doxy: The School Bully" by MandaStrong1.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 11: Timeline Editor & Media Board</h3>
                  <p className="text-purple-200 mb-2">
                    Your central editing workspace featuring:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-purple-200 ml-4">
                    <li><strong>Preview Window:</strong> View your project in real-time</li>
                    <li><strong>Media Board:</strong> Access all your AI-generated assets (requires login)</li>
                    <li><strong>Timeline Tracks:</strong> VIDEO, AUDIO, SRT, VIDEO 2 layers</li>
                    <li><strong>Duration Control:</strong> Set project length up to 180 minutes</li>
                    <li><strong>Quick Actions:</strong> Cut, Trim, Split, Merge, Effects, Color, Audio, Transitions</li>
                  </ul>
                  <p className="text-purple-300 mt-2 font-semibold">
                    Pro Tip: Use the category filter to find specific types of assets quickly!
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 12: Trim & Cut</h3>
                  <p className="text-purple-200">
                    Precision trimming tools for fine-tuning your clips. Set in/out points and remove unwanted sections.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 13: Effects & Filters</h3>
                  <p className="text-purple-200">
                    Apply visual effects and filters to enhance your footage. Includes presets and custom adjustments.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 14: Text & Titles</h3>
                  <p className="text-purple-200">
                    Add professional text overlays, titles, and captions. Customize fonts, colors, and animations.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 15: Audio Mixer</h3>
                  <p className="text-purple-200">
                    Balance audio levels, add music, apply effects, and create professional soundscapes.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 16: Export & Share</h3>
                  <p className="text-purple-200">
                    Export your finished project in multiple formats and resolutions. Share directly to social platforms.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Pages 17-20: Advanced Features</h3>
                  <p className="text-purple-200">
                    Advanced editing tools, collaboration features, and workflow optimization.
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Page 21: Final Page</h3>
                  <p className="text-purple-200">
                    Project summary, additional resources, and support information.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-black/50 border border-purple-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Simple Movie Making Workflow</h2>

              <div className="space-y-3 text-purple-200">
                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</span>
                  <p><strong>Create Movie:</strong> Click "Create Movie" button on Page 4 to start a new project</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</span>
                  <p><strong>Set Duration:</strong> Give your project a name and set how long you want it to be (up to 180 minutes)</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</span>
                  <p><strong>Add Assets:</strong> Use AI tools to generate content OR upload your own videos using "Upload Videos" button</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</span>
                  <p><strong>Arrange Timeline:</strong> Drag assets onto the timeline and arrange them in order</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">5</span>
                  <p><strong>Save:</strong> Click "Save" button to save your project (you must be logged in)</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">6</span>
                  <p><strong>Preview:</strong> Click "Preview" button to watch your movie</p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">7</span>
                  <p><strong>Download:</strong> Click "Export" button to download your finished movie</p>
                </div>
              </div>
            </section>

            <section className="bg-black/50 border border-purple-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Pro Tips & Best Practices</h2>

              <div className="space-y-3 text-purple-200">
                <div className="border-l-4 border-green-500 pl-4">
                  <p><strong className="text-green-400">Be Specific:</strong> When using AI tools, detailed prompts yield better results. Include style, mood, colors, and composition details.</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <p><strong className="text-blue-400">Organize Early:</strong> Use the category system to keep your Media Board organized as your asset library grows.</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <p><strong className="text-purple-400">Timeline Duration:</strong> Set your timeline duration at the start of your project to match your target length (up to 180 minutes).</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <p><strong className="text-red-400">Save Often:</strong> Make sure you're signed in so all your generated assets are automatically saved to your Media Board.</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <p><strong className="text-purple-400">Layer Your Tracks:</strong> Use multiple video tracks for overlays, picture-in-picture effects, and complex compositions.</p>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <p><strong className="text-pink-400">Audio Balance:</strong> Use separate audio tracks for dialogue, music, and sound effects for better mixing control.</p>
                </div>
              </div>
            </section>

            <section className="bg-black/50 border border-purple-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Troubleshooting</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Assets Not Saving?</h3>
                  <p className="text-purple-200">
                    Make sure you're signed in on Page 3. Assets can only be saved to the Media Board when authenticated.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Media Board Empty?</h3>
                  <p className="text-purple-200">
                    Check your category filter - you might be filtering out your assets. Select "All Assets" to see everything.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Video Playback Issues?</h3>
                  <p className="text-purple-200">
                    Ensure your video files are in supported formats (MP4, WebM). Clear browser cache and reload if needed.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">AI Tool Not Working?</h3>
                  <p className="text-purple-200">
                    Check your internet connection. Refresh the page and try again. Make sure your prompt isn't empty.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-black/50 border border-purple-500 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">About MandaStrong1</h2>
              <p className="text-purple-200 leading-relaxed mb-4">
                MandaStrong1 is a filmmaker, author, and creator of "Doxy: The School Bully" and other compelling
                stories. This studio platform is designed to empower creators of all skill levels to bring their
                visions to life using cutting-edge AI technology combined with professional video editing tools.
              </p>
              <p className="text-purple-300 font-semibold">
                Find more at: <a href="https://mandastrong1.etsy.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">MandaStrong1.Etsy.com</a>
              </p>
            </section>

            <section className="bg-gradient-to-r from-purple-900/50 to-purple-600/50 border border-purple-400 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
              <p className="text-purple-100 mb-4">
                Have questions or need support? We're here to help you create amazing content!
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-purple-100 transition-all">
                  Contact Support
                </button>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-500 transition-all border-2 border-white">
                  Video Tutorials
                </button>
              </div>
            </section>

            <div className="text-center pt-8">
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:bg-purple-500 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <Home className="w-6 h-6" />
                Close Guide
              </button>
            </div>
          </div>

          <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center">
            <p className="text-white text-sm">
              MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
