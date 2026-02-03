import React, { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, Upload, Download, Save, Share2, Film, Volume2, Zap, Settings, Eye, Plus, Sparkles, MessageCircle, Users, Mail } from 'lucide-react';

const OCEAN_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-ocean-waves-loop-1196-large.mp4";
const AVATAR_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-person-holding-a-camera-3037-small.mp4";

const AI_TOOLS = [
  "Script Generator", "Story Architect", "Plot Weaver", "Character Designer", "Dialogue AI",
  "Scene Planner", "Shot List Pro", "Storyboard Creator", "Script Analyzer", "Genre Consultant",
  "Premise Builder", "Conflict Generator", "Theme Developer", "Arc Constructor", "Beat Sheet AI",
  "Logline Writer", "Synopsis Pro", "Treatment Builder", "Pitch Deck AI", "Budget Calculator",
  "Dialogue Writer", "Plot Generator", "Scene Writer", "Story Outliner", "Character Developer",
  "Dialogue Editor", "Plot Designer", "Story Planner", "Treatment Writer", "Script Formatter",
  "Plot Creator", "Three Act Builder", "Backstory Generator", "Motivation Builder", "Theme Generator",
  "Advanced Story Outliner", "Story Consultant", "Plot Twist Creator", "Scene Analyzer", "Conflict Manager",
  "Character Arc AI", "Narrative Flow", "Subtext Builder", "Metaphor Finder", "Pacing Guide",
  "Dialogue Polisher", "Scene Transition AI", "Story Beat Mapper", "Character Voice AI", "Screenplay Doctor",
  "Schedule Optimizer", "Location Scout AI", "Casting Director", "Costume Designer", "Prop Manager",
  "Set Designer Pro", "Mood Board AI", "Color Palette Pro", "Style Guide", "Reference Library",
  "Production Designer", "Scene Setup AI", "Actor Scheduler", "Crew Manager", "Call Sheet Builder",
  "Day Planner Pro", "Risk Analyzer", "Budget Tracker", "Timeline Planner", "Resource Allocator",
  "Location Manager", "Permit Advisor", "Insurance Guide", "Safety Planner", "Equipment Tracker",
  "Rental Manager", "Travel Coordinator", "Catering Planner", "Makeup Artist AI", "Wardrobe Stylist",
  "Hair Design AI", "Props Coordinator", "Extras Manager", "Sound Design Planner", "VFX Supervisor AI",
  "Post Schedule Builder", "Color Science Guide", "Camera Department AI", "Lighting Planner", "Grip Coordinator",
  "Sound Dept Manager", "Music Supervisor", "Distribution Planner", "Festival Strategist", "PR Manager AI",
  "Social Strategy", "Audience Analyzer", "Market Research AI", "Trailer Editor", "DVD Bonus Planner",
  "Shot Composer", "Camera Angle AI", "Movement Planner", "Lens Advisor", "Focal Length Guide",
  "Depth Calculator", "Focus Puller", "Exposure Meter", "ISO Optimizer", "Aperture Guide",
  "Shutter Speed AI", "White Balance Pro", "ND Filter Guide", "Gimbal Stabilizer", "Dolly Tracker",
  "Crane Planner", "Steadicam AI", "Handheld Smoother", "Drone Pilot", "Aerial Composer",
  "Time-lapse Builder", "Hyper-lapse Pro", "Slow Motion AI", "Speed Ramper", "Frame Blender",
  "Optical Flow Pro", "Motion Interpolation", "Frame Rate Converter", "Aspect Ratio Tool", "Crop Assistant",
  "Anamorphic Lens Guide", "Camera Profiler", "Sensor Advisor", "Zoom Control AI", "Rack Focus Tool",
  "Follow Focus AI", "Lens Metadata Reader", "Camera Calibrator", "Distortion Analyzer", "Lens Selector Pro",
  "Photometry Tool", "Light Meter Pro", "Scene Light Guide", "Camera Movement Pro", "Shot Planning AI",
  "Frame Composition", "Rule Of Thirds AI", "Golden Ratio Tool", "Visual Rhythm Guide", "Cinematic Framing",
  "Lighting Designer", "Three-Point Setup", "Key Light AI", "Fill Light Pro", "Back Light Guide",
  "Practical Lights", "Natural Light AI", "Studio Setup", "Location Light", "Color Temperature",
  "Gel Selector", "Light Intensity", "Shadow Control", "Contrast Manager", "Dynamic Range",
  "HDR Mapper", "Exposure Blend", "Highlight Recovery", "Shadow Lifter", "Midtone Balance",
  "LUT Creator Pro", "Grade Matcher", "Color Harmony", "Cinematic Look", "Film Emulation",
  "Digital Cinema", "Vintage Filter", "Modern Grade", "Commercial Style", "Documentary Look",
  "Tungsten Correction", "LED Panel Guide", "HMI Light Advisor", "Softbox Designer", "Ring Light Setup",
  "Studio Light Map", "Location Lighting AI", "Night Scene Guide", "Day Scene Planner", "Overcast Optimizer",
  "Rain Lighting AI", "Snow Scene Guide", "Fire Scene Light", "Underwater Light AI", "Interior Lighting Pro",
  "Exterior Light Plan", "Neon Light Setup", "Practical FX Light", "Light Painting Guide", "Color Wash Designer",
  "Audio Recorder Pro", "Voice Capture", "ADR Studio", "Foley Creator", "Ambience Generator",
  "Music Composer AI", "Sound Designer", "Audio Editor Pro", "Noise Reducer", "Hum Remover",
  "Click Eliminator", "Pop Filter", "Breath Remover", "De-Esser Pro", "Compressor AI",
  "EQ Wizard", "Reverb Designer", "Delay Creator", "Chorus Effect", "Flanger Pro",
  "Phaser Effect", "Distortion AI", "Saturation Pro", "Limiter Guard", "Gate Controller",
  "Expander Pro", "Multi-band Comp", "Stereo Widener", "Pan Automation", "Volume Mixer",
  "Fade Designer", "Cross-fade Pro", "Audio Ducking", "Side-chain AI", "Sync Master",
  "Soundtrack Builder", "Score Composer AI", "Sound Effects Bank", "Audio Mastering Pro", "Vocal Booth AI",
  "Microphone Advisor", "Room Tone Capture", "Audio Restoration", "Signal Chain AI", "Monitoring Guide",
  "Studio Acoustics", "Audio Format Guide", "Surround Mix AI", "Audio Stem Splitter", "Voice Isolation Pro",
  "Voice Clone AI", "Text-to-Speech Pro", "Speech-to-Text", "Auto Transcribe", "Caption Generator",
  "Subtitle Sync", "Translation AI", "Localization Pro", "Dubbing Studio", "Lip Sync AI",
  "Voice Enhancer", "Clarity Boost", "Vocal Isolation", "Background Remover", "Voice Morph",
  "Pitch Shifter", "Tempo Changer", "Voice Age AI", "Gender Morph", "Accent Trainer",
  "Dialect Generator", "Emotion Mapper", "Tone Analyzer", "Inflection AI", "Pronunciation Guide",
  "Voice Maker", "Voice Cloner", "Voice Creator Tool", "Voice Recorder", "Speech Converter",
  "Voice Builder", "Advanced Voice Generator", "Voice Studio Tool", "Premium Voice Generator", "Voice Audio Tool",
  "Emotional Voice Generator", "Advanced Speech Creator", "Natural Voice Generator", "Voice Reader", "Speech Generator",
  "Narration Creator", "Voice Imitator", "Fast Speech Generator", "Live Voice Tool", "Streaming Voice Generator",
  "Voice Mixing AI", "Vocal Harmony Pro", "Speaker Identification", "Voice Archive Tool", "Speech Enhancement",
  "Timeline Master", "Multi-track Editor", "Ripple Edit Pro", "Roll Edit AI", "Slip Editor",
  "Slide Tool", "Trim Precision", "Extend Editor", "Split Smart", "Join Seamless",
  "Group Manager", "Link Controller", "Nest Creator", "Compound Clip", "Multi-cam Sync",
  "Clip Merger", "Replace Tool", "Insert Smart", "Overwrite Pro", "Three-point Edit",
  "Four-point Edit", "Match Frame", "Find Gap", "Sequence Settings", "Timeline Zoom",
  "Cut Optimizer", "Edit Rhythm AI", "Scene Order AI", "Clip Organizer", "Edit Preview",
  "Proxy Editor", "Timeline Export", "Edit Templates", "Quick AI Cut", "Jump Cut Creator",
  "Montage Builder", "Sequence Planner", "Edit Decision List", "Frame Accurate Cut", "Audio Edit AI",
  "Multicam Editor", "Batch Trimmer", "Edit Assist Pro", "Smart Trim AI", "Clip Browser",
  "Edit History Pro", "Video Assembler", "Rough Cut Builder", "Fine Cut Polish", "Master Edit Tool",
  "Transition Library", "Fade Master", "Dissolve Pro", "Wipe Designer", "Slide Animator",
  "Push Effect", "Zoom Transition", "Spin Creator", "Flip Designer", "3D Rotate",
  "Cube Spin", "Door Swing", "Window Reveal", "Curtain Pull", "Iris Wipe",
  "Clock Wipe", "Heart Shape", "Star Burst", "Organic Wipe", "Light Leak",
  "Lens Flare Pro", "Light Rays", "God Rays", "Sun Burst", "Glow Effect",
  "Bloom Designer", "Chromatic Aberration", "RGB Split", "Glitch Generator", "Data Moshing",
  "Particle Transition", "Morph Effect", "Liquid Wipe", "Pixel Dissolve", "Shatter Glass",
  "Split Screen", "Picture in Picture", "Comparison View", "Side By Side", "Before After",
  "Effect Chain Builder", "Preset Effects", "Custom Effect Studio", "Effect Timing", "Easing Controls",
  "Transition Preview", "Effect Renderer", "Keyframe Effects", "Animation Curves", "Motion Graphics AI",
  "Green Screen Pro", "Chroma Keyer", "Luma Key", "Difference Key", "Color Range",
  "Spill Suppressor", "Edge Refiner", "Matte Cleaner", "Roto Tool Pro", "Mask Designer",
  "Track Mask", "Planar Tracker", "Point Tracker", "Camera Tracker", "Object Tracker",
  "Stabilizer Pro", "Deshake AI", "Rolling Shutter Fix", "Lens Corrector", "Distortion Fixer",
  "Vignette Tool", "CA Remover", "Sharpen Pro", "Blur Master", "Gaussian Blur",
  "Motion Blur Pro", "Radial Blur", "Zoom Blur", "Tilt-shift Effect", "Miniature Mode",
  "Sky Replacement", "Object Removal AI", "Inpainting Tool", "Face Detection AI", "Body Segmentation",
  "Scene Reconstruction", "Depth Map Generator", "3D Conversion", "Stereo 3D Tool", "VFX Compositing",
  "Shot Match AI", "Color Matching VFX", "Atmosphere Effects", "Crowd Simulation", "Vehicle Simulation",
  "Water Simulation", "Fire Simulation AI", "Destruction Sim", "Cloth Simulation", "Hair Simulation",
  "Film Grain AI", "Noise Generator", "Dust Overlay", "Scratch Effect", "Damage Creator",
  "Old Film Look", "8mm Emulator", "16mm Style", "Super 8 Feel", "VHS Aesthetic",
  "Scan Lines", "CRT Effect", "TV Static", "Signal Error", "Pixel Sorter",
  "Weather Generator", "Rain Creator", "Snow Effect", "Fog Machine", "Mist Layer",
  "Smoke Designer", "Fire Simulator", "Explosion FX", "Debris System", "Spark Generator",
  "Lightning Strike", "Thunder Flash", "Wind Effect", "Leaves Particles", "Dust Motes",
  "Light Particles", "Magic Sparkles", "Energy Beam", "Laser Effect", "Plasma Arc",
  "Muzzle Flash", "Blood Splatter", "Bullet Hole", "Glass Shatter", "Wood Splinter",
  "Film Tone AI", "Retro Film Filter", "Analog Warmth", "Cinema Grain Pack", "Film Stock Emulator",
  "Frame Jitter", "Film Flicker", "Light Bounce AI", "Shadow Detail AI", "Atmosphere Depth",
  "Metal Dent", "Concrete Crack", "Dust Cloud", "Dirt Kick", "Water Splash",
  "Sweat Drop", "Tear Effect", "Breath Vapor", "Steam Effect", "Heat Haze",
  "Speed Lines", "Motion Trails", "Action Lines", "Impact Flash", "Screen Shake",
  "Face Swap AI", "Age Progression", "Age Regression", "Beauty Filter Pro", "Skin Smoother",
  "Eye Enhancer", "Teeth Whitener", "Hair Color AI", "Makeup Virtual", "Face Morph",
  "Expression Clone", "Emotion Transfer", "Blink Fixer", "Gaze Corrector", "Head Tracker",
  "Body Tracker", "Pose Estimator", "Motion Capture", "Facial Capture", "Performance Clone",
  "Face Reconstruction", "Skin Texture AI", "Facial Animation", "Expression Mapper", "Micro Expression AI",
  "Face Lift AI", "Facial Symmetry", "Smile Enhancer", "Pupil Adjustment", "Skin Color Match",
  "Face Paint AI", "AR Face Filter", "3D Face Model", "Face Lighting AI", "Portrait Enhancement",
  "Lower Third Pro", "Title Designer", "End Card Maker", "Bug Creator", "Watermark Pro",
  "Logo Animator", "Text Animator", "Typewriter Effect", "Letter Reveal", "Word Slide",
  "Line Draw", "Handwriting AI", "Neon Text", "Fire Text", "Ice Text",
  "Gold Text", "Chrome Text", "Glass Text", "3D Extrude", "Bevel Tool",
  "Title Sequence AI", "Credit Roll Builder", "Chapter Title AI", "Opening Title Pro", "Closing Credits AI",
  "Subtitle Designer", "Caption Styler", "Text Tracking AI", "Dynamic Text", "Animated Logo Pro",
  "Color Grading Pro", "Primary Color Wheels", "Secondary Color Fix", "Creative LUT Maker", "Curves Master Pro", "HSL Adjustment", "Power Window AI", "Gradient Mask Tool", "Color Match Studio", "Shot Color Match", "Auto Color Balance", "Auto Tone Mapper", "Auto Contrast AI", "HDR Tone Mapper", "Gamut Checker", "False Color View", "Zebra Pattern AI", "Waveform Analyzer", "Vectorscope Tool", "Histogram Analyzer"
];

/* ─── NAV HELPERS ─── */
interface NavButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
}

const NavButtons: React.FC<NavButtonsProps> = ({ onBack, onNext, backLabel = "← Back", nextLabel = "Next →" }) => (
  <div className="flex gap-4 justify-center mt-8 mb-4">
    {onBack && (
      <button onClick={onBack} className="px-8 py-3 border border-purple-500 text-purple-400 font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2">
        {backLabel}
      </button>
    )}
    {onNext && (
      <button onClick={onNext} className="px-8 py-3 border border-purple-500 text-purple-400 font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2">
        {nextLabel}
      </button>
    )}
  </div>
);

const Footer = () => (
  <footer className="text-center mt-12 text-xs text-gray-600">
    MandaStrong Studio © 2025 • Author of Doxy The School Bully • MandaStrong1.Etsy.com
  </footer>
);

/* ─── PAGE 1: WELCOME ─── */
const Page1: React.FC<{ onNext: () => void, onLogin: () => void, onRegister: () => void }> = ({ onNext, onLogin, onRegister }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatarRef = useRef<HTMLVideoElement>(null);
  const [avatarPlaying, setAvatarPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <video ref={videoRef} autoPlay loop playsInline muted className="absolute inset-0 w-full h-full object-cover">
        <source src={OCEAN_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="absolute bottom-8 right-8 w-48 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-2xl z-10">
        <video ref={avatarRef} loop playsInline muted className="w-full h-full object-cover">
          <source src={AVATAR_VIDEO} type="video/mp4" />
        </video>
        {!avatarPlaying && (
          <button onClick={() => { avatarRef.current && avatarRef.current.play(); setAvatarPlaying(true); }} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-all">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
            </div>
          </button>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl font-black text-white mb-4 text-center px-6" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)', fontFamily: 'Impact, sans-serif', letterSpacing: '0.08em' }}>
          MANDASTRONG'S STUDIO
        </h1>
        <p className="text-xl italic text-white mb-10 text-center px-6 max-w-2xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
          Welcome To The All-In-One Make-A-Movie App!
        </p>
        <div className="flex gap-4">
          <button onClick={onNext} className="px-8 py-3 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-800 transition-all shadow-xl hover:scale-105">Next</button>
          <button onClick={onLogin} className="px-8 py-3 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-800 transition-all shadow-xl hover:scale-105">Login</button>
          <button onClick={onRegister} className="px-8 py-3 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-800 transition-all shadow-xl hover:scale-105">Register</button>
        </div>
      </div>
    </div>
  );
};

/* ─── PAGE 2: INTRODUCTION ─── */
const Page2: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full overflow-y-auto" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #5b21b6 100%)' }}>
    <div className="flex flex-col items-center justify-center min-h-full p-8">
      <div className="text-6xl mb-6">✨</div>
      <h1 className="text-5xl font-black text-white mb-6 text-center" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '0.06em' }}>
        MANDASTRONG'S STUDIO
      </h1>
      <p className="text-xl text-white text-center max-w-2xl mb-10 leading-relaxed font-medium">
        Make Amazing Family Movies & Bring Dreams To Life!
      </p>
      <NavButtons onBack={onBack} onNext={onNext} />
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-500 transition-all hover:scale-110">
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      </div>
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 3: MOVIE UPLOAD CHECK ─── */
const Page3: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto p-8">
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center mt-12 mb-8">
        <Film className="w-16 h-16 text-purple-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-3">No Movie Uploaded</h1>
        <p className="text-gray-400 text-center text-lg">Upload a Christmas movie to watch it here!</p>
      </div>
      <div className="text-center mt-8">
        <button onClick={onNext} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all text-lg">
          Go to Upload Page
        </button>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 4: LOGIN / REGISTER + PRICING ─── */
const Page4: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  return (
    <div className="w-full h-full bg-black text-white overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 mb-6 text-center">
          <h2 className="text-3xl font-black text-purple-400 mb-1">AMANDA STRONG</h2>
          <p className="text-white font-bold">Studio Plan</p>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex gap-3 mb-5">
            <button onClick={() => setTab('signin')} className={"flex-1 py-2 rounded-lg font-bold transition-all " + (tab === 'signin' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>Sign In</button>
            <button onClick={() => setTab('signup')} className={"flex-1 py-2 rounded-lg font-bold transition-all " + (tab === 'signup' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>Create Account</button>
          </div>
          {tab === 'signin' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input type="email" placeholder="Email Address" className="w-full p-3 mb-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:outline-none" />
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" placeholder="Password" className="w-full p-3 mb-4 bg-gray-800 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:outline-none" />
              <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all">Sign In</button>
            </div>
          )}
          {tab === 'signup' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input type="text" placeholder="Full Name" className="w-full p-3 mb-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:outline-none" />
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input type="email" placeholder="Email Address" className="w-full p-3 mb-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:outline-none" />
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" placeholder="Password" className="w-full p-3 mb-4 bg-gray-800 rounded-lg text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:outline-none" />
              <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all">Create Account</button>
            </div>
          )}
          <p className="text-center text-gray-500 mt-4 text-sm">or</p>
          <p className="text-center text-gray-400 text-sm mt-1">Explore features without creating an account</p>
        </div>
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-2">Choose Your Plan</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { name: 'Basic', price: '$20', dur: '30 min', tools: '100', storage: '5GB', export: 'HD', support: 'Email' },
            { name: 'Pro', price: '$30', dur: '60 min', tools: '300', storage: '50GB', export: '4K', support: 'Priority', popular: true },
            { name: 'Studio', price: '$50', dur: '150 min', tools: '600', storage: '500GB', export: '8K', support: '24/7 Live', selected: true }
          ].map((plan, i) => (
            <div key={i} className={"rounded-xl p-5 border-2 transition-all " + (plan.selected ? 'border-purple-500 bg-gray-900 scale-105 shadow-lg shadow-purple-500/20' : plan.popular ? 'border-purple-400 bg-gray-900' : 'border-gray-700 bg-gray-900 hover:border-purple-500')}>
              <h3 className="text-xl font-bold text-white text-center mb-2">{plan.name}</h3>
              <p className="text-3xl font-black text-purple-400 text-center mb-1">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <p className="text-xs text-gray-500 text-center mb-3">{plan.dur} movie duration</p>
              <ul className="space-y-1.5 text-sm text-gray-300 mb-4">
                <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span>{plan.export} Export</li>
                <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span>{plan.tools} AI Tools</li>
              </ul>
              <button className={"w-full py-2 rounded-lg font-bold transition-all " + (plan.selected ? 'bg-purple-600 text-white cursor-default' : 'bg-gray-700 text-white hover:bg-purple-600')}>
                {plan.selected ? 'Selected' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
        <NavButtons onBack={onBack} onNext={onNext} />
        <Footer />
      </div>
    </div>
  );
};

/* ─── PAGES 5-9: TOOL BOARD ─── */
const ToolBoardPage: React.FC<{ pageNum: number, tools: string[], onBack: () => void, onNext: () => void }> = ({ pageNum, tools, onBack, onNext }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = tools.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="w-full h-full bg-black text-white overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 text-center mb-1">TOOL BOARD</h1>
        <p className="text-center text-gray-500 text-sm mb-4">Page {pageNum} of 5 • {tools.length} tools</p>
        <div className="flex gap-3 justify-center mb-6">
          <input
            type="text"
            placeholder="Quick search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
          {filtered.map((tool, i) => (
            <button key={i} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500 text-white text-sm font-bold p-3 rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 min-h-[56px]">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="leading-tight text-left">{tool}</span>
            </button>
          ))}
        </div>
        <NavButtons onBack={onBack} onNext={onNext} />
        <Footer />
      </div>
    </div>
  );
};

/* ─── PAGE 10: UPLOAD ─── */
const Page10: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto p-6">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-400 text-center mb-2">Doxy The School Bully</h1>
      <p className="text-center text-gray-500 mb-8">Upload & manage your movie files</p>
      <div className="bg-gray-900 border-2 border-dashed border-purple-500 rounded-xl p-10 text-center mb-6 hover:bg-gray-800 transition-all cursor-pointer">
        <Upload className="mx-auto mb-3 text-purple-400" size={40} />
        <p className="text-gray-300 font-bold mb-1">Drag & drop your movie file here</p>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 11: MEDIA LIBRARY ─── */
const Page11: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto">
    <div className="flex items-center justify-between p-4 px-6 border-b border-gray-800">
      <h1 className="text-xl font-bold text-purple-400">MEDIA LIBRARY</h1>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
    <div className="p-6 max-w-5xl mx-auto">
      <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg mb-6 hover:bg-purple-500 transition-all flex items-center justify-center gap-2">
        <Upload size={18} /> Upload Media
      </button>
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 12: TIMELINE EDITOR ─── */
const Page12: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto">
    <div className="flex items-center justify-between p-4 px-6 border-b border-gray-800">
      <h1 className="text-xl font-bold text-purple-400">TIMELINE EDITOR</h1>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-gray-900 rounded-xl border border-gray-700 h-48 flex items-center justify-center mb-6 relative overflow-hidden">
        <div className="text-gray-600 text-lg z-10">Video Preview</div>
      </div>
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
        <h3 className="text-lg font-bold text-purple-400 mb-4">Timeline Tracks</h3>
        {[
          { label: "SRT", color: "from-yellow-500 to-yellow-600", w: "75%" },
          { label: "VIDEO", color: "from-purple-500 to-purple-600", w: "90%" },
          { label: "AUDIO", color: "from-blue-500 to-blue-600", w: "60%" }
        ].map((track, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-2.5 flex items-center gap-3 mb-2 border border-gray-700">
            <span className="text-xs font-black w-14">{track.label}</span>
            <div className="flex-1 bg-gray-700 rounded h-8 overflow-hidden">
              <div className={"bg-gradient-to-r " + track.color + " h-full rounded"} style={{ width: track.w }}></div>
            </div>
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 13: AUDIO MIXER ─── */
const Page13: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto">
    <div className="flex items-center justify-between p-4 px-6 border-b border-gray-800">
      <h1 className="text-xl font-bold text-purple-400">AUDIO MIXER</h1>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-4 gap-4 mb-8">
        {["Master", "Music", "Dialogue", "SFX"].map((ch, i) => (
          <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <h4 className="text-sm font-bold text-purple-400 text-center mb-3">{ch}</h4>
            <div className="flex justify-center gap-1 items-end" style={{ height: '100px' }}>
              <div className="w-6 bg-gray-700 rounded-sm relative">
                {/* FIXED THE LINE BELOW: Added missing height value */}
                <div className="absolute bottom-0 left-0 right-0 bg-purple-500 rounded-sm" style={{ height: `${[85,60,75,40][i]}%` }}></div>
              </div>
            </div>
            <input type="range" min="0" max="100" defaultValue={[85,60,75,40][i]} className="w-full accent-purple-500 mt-3" />
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 14: SETTINGS ─── */
const Page14: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto p-6">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-purple-400 mb-6">SETTINGS</h1>
      <div className="bg-gray-900 border border-purple-500 rounded-xl p-5">
        <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2"><Zap size={18} /> Generate</h3>
        <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-all flex items-center justify-center gap-2"><Zap size={18} /> Generate Final Movie</button>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 15: PREVIEW ─── */
const Page15: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center p-6">
    <div className="w-full max-w-4xl bg-gray-900 aspect-video rounded-xl border-2 border-purple-500 flex items-center justify-center">
      <Play className="w-24 h-24 text-purple-400" />
    </div>
    <NavButtons onBack={onBack} onNext={onNext} />
  </div>
);

/* ─── LEGAL PAGES ─── */
const LegalPage: React.FC<{ title: string, content: string[], onBack: () => void, onNext: () => void }> = ({ title, content, onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto p-8">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-400 text-center mb-8">{title}</h1>
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
        {content.map((p, i) => <p key={i} className="text-sm text-gray-300">{p}</p>)}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 19: HELP DESK ─── */
const Page19: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto p-6">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-400 text-center mb-8">Agent Grok 24/7</h1>
      <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 mb-6">
        <p className="text-gray-400 mb-4">Hello! I'm Agent Grok. How can I help you today?</p>
        <div className="flex gap-2">
          <input type="text" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" placeholder="Ask anything..." />
          <button className="px-6 py-2 bg-purple-600 rounded-lg font-bold">Send</button>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 20: COMMUNITY ─── */
const Page20: React.FC<{ onBack: () => void, onNext: () => void }> = ({ onBack, onNext }) => (
  <div className="w-full h-full bg-black text-white overflow-y-auto p-6">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-400 text-center mb-8">Community Hub</h1>
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-gray-900 h-48 rounded-xl border border-gray-700 flex items-center justify-center">
            <Play className="text-purple-400" />
          </div>
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
      <Footer />
    </div>
  </div>
);

/* ─── PAGE 21: FINAL ─── */
const Page21: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center p-8 text-center">
    <h1 className="text-5xl font-black text-purple-400 mb-8">Thank You!</h1>
    <p className="text-xl font-bold text-purple-400 mb-8">— Amanda Strong</p>
    <a href="https://mandastrong1.etsy.com" target="_blank" className="px-6 py-2 border border-purple-500 text-purple-400 rounded-lg font-bold mb-8">Visit Etsy Store</a>
    <button onClick={onBack} className="px-8 py-2 border border-gray-600 text-gray-400 rounded-lg">Back</button>
    <Footer />
  </div>
);

/* ─── MAIN APP ─── */
export default function App() {
  const [page, setPage] = useState<number>(1);
  const go = (n: number) => setPage(n);

  const renderPage = () => {
    switch (page) {
      case 1:  return <Page1   onNext={() => go(2)} onLogin={() => go(4)} onRegister={() => go(4)} />;
      case 2:  return <Page2   onBack={() => go(1)} onNext={() => go(3)} />;
      case 3:  return <Page3   onBack={() => go(2)} onNext={() => go(4)} />;
      case 4:  return <Page4   onBack={() => go(3)} onNext={() => go(5)} />;
      case 5:  return <ToolBoardPage pageNum={1} tools={AI_TOOLS.slice(0,120)}    onBack={() => go(4)}  onNext={() => go(6)} />;
      case 6:  return <ToolBoardPage pageNum={2} tools={AI_TOOLS.slice(120,240)}  onBack={() => go(5)}  onNext={() => go(7)} />;
      case 7:  return <ToolBoardPage pageNum={3} tools={AI_TOOLS.slice(240,360)}  onBack={() => go(6)}  onNext={() => go(8)} />;
      case 8:  return <ToolBoardPage pageNum={4} tools={AI_TOOLS.slice(360,480)}  onBack={() => go(7)}  onNext={() => go(9)} />;
      case 9:  return <ToolBoardPage pageNum={5} tools={AI_TOOLS.slice(480,600)}  onBack={() => go(8)}  onNext={() => go(10)} />;
      case 10: return <Page10  onBack={() => go(9)}  onNext={() => go(11)} />;
      case 11: return <Page11  onBack={() => go(10)} onNext={() => go(12)} />;
      case 12: return <Page12  onBack={() => go(11)} onNext={() => go(13)} />;
      case 13: return <Page13  onBack={() => go(12)} onNext={() => go(14)} />;
      case 14: return <Page14  onBack={() => go(13)} onNext={() => go(15)} />;
      case 15: return <Page15  onBack={() => go(14)} onNext={() => go(16)} />;
      case 16: return <LegalPage title="Terms of Service" onBack={() => go(15)} onNext={() => go(17)} content={["Terms..."]} />;
      case 17: return <LegalPage title="Disclaimer" onBack={() => go(16)} onNext={() => go(18)} content={["Disclaimer..."]} />;
      case 18: return <LegalPage title="Privacy Policy" onBack={() => go(17)} onNext={() => go(19)} content={["Privacy..."]} />;
      case 19: return <Page19  onBack={() => go(18)} onNext={() => go(20)} />;
      case 20: return <Page20  onBack={() => go(19)} onNext={() => go(21)} />;
      case 21: return <Page21  onBack={() => go(20)} />;
      default: return <Page1   onNext={() => go(2)} onLogin={() => go(4)} onRegister={() => go(4)} />;
    }
  };

  return <div className="w-full h-screen overflow-hidden bg-black">{renderPage()}</div>;
}