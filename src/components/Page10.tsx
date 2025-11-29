import { useState } from 'react';
import { Film, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Page10Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page10({ onNext, onBack }: Page10Props) {
  const [expandedAct, setExpandedAct] = useState<string | null>('act1');

  const toggleAct = (act: string) => {
    setExpandedAct(expandedAct === act ? null : act);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-4">
      <div className="text-center max-w-6xl w-full mx-auto pt-8">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-orange-400 mb-4">
          🎬 Doxy: The School Bully
        </h1>
        <p className="text-orange-300 text-xl mb-6">Complete 120-Minute Script - Four-Act Structure</p>

        <div className="bg-neutral-900 border-2 border-orange-500 rounded-2xl p-8 mb-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <BookOpen className="w-16 h-16 text-orange-400" />
            <Film className="w-16 h-16 text-orange-400" />
          </div>

          <div className="bg-black/50 border border-orange-500 rounded-lg p-6 mb-6">
            <p className="text-orange-200 text-lg mb-4">
              Read the complete screenplay for "Doxy: The School Bully" - a powerful 120-minute story about transformation, courage, and standing up against bullying.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Runtime</div>
                <div className="text-white">120 Minutes</div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Structure</div>
                <div className="text-white">Four Acts</div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Characters</div>
                <div className="text-white">Doxy, Ethan, Lily</div>
              </div>
              <div className="bg-black/50 p-3 rounded">
                <div className="text-orange-400 font-bold">Setting</div>
                <div className="text-white">Westview High</div>
              </div>
            </div>
          </div>

          <div className="text-left space-y-4 max-h-[600px] overflow-y-auto pr-4">
            {/* Act I */}
            <div className="bg-black/30 border border-orange-500 rounded-lg">
              <button
                onClick={() => toggleAct('act1')}
                className="w-full flex items-center justify-between p-4 hover:bg-orange-900/20 transition-colors"
              >
                <h3 className="text-2xl font-bold text-orange-400">ACT I: THE SETUP (0-30 min)</h3>
                {expandedAct === 'act1' ? <ChevronUp className="w-6 h-6 text-orange-400" /> : <ChevronDown className="w-6 h-6 text-orange-400" />}
              </button>
              {expandedAct === 'act1' && (
                <div className="p-4 space-y-4 text-orange-200">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 1: Dramatic Opening (8 min)</h4>
                    <p className="text-sm mb-2">Aerial drone shot of Westview High School. First bullying incident between Doxy and Ethan at the lockers. Lily observes and approaches Ethan after.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 2: Character Backstories (10 min)</h4>
                    <p className="text-sm mb-2">Morning routines: Ethan's troubled home, Doxy avoiding his drunk father, Lily's warm family. Classroom scenes showing each character's personality.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 3: Building Tension (7 min)</h4>
                    <p className="text-sm mb-2">Library confrontation. Doxy escalates bullying. Lily intervenes. Ethan questions his self-worth.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 4: The Pivoting Moment (5 min)</h4>
                    <p className="text-sm mb-2">Anti-bullying assembly announcement. Principal and counselor discuss approach. Ethan is asked to speak.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Act II-A */}
            <div className="bg-black/30 border border-orange-500 rounded-lg">
              <button
                onClick={() => toggleAct('act2a')}
                className="w-full flex items-center justify-between p-4 hover:bg-orange-900/20 transition-colors"
              >
                <h3 className="text-2xl font-bold text-orange-400">ACT II-A: THE AWAKENING (30-55 min)</h3>
                {expandedAct === 'act2a' ? <ChevronUp className="w-6 h-6 text-orange-400" /> : <ChevronDown className="w-6 h-6 text-orange-400" />}
              </button>
              {expandedAct === 'act2a' && (
                <div className="p-4 space-y-4 text-orange-200">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 5: The Assembly - Ethan's Speech (20 min)</h4>
                    <p className="text-sm mb-2">Full school assembly. Ethan courageously shares his story of being bullied. Powerful moment of vulnerability. Doxy realizes the impact of his actions.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 6: Immediate Aftermath (15 min)</h4>
                    <p className="text-sm mb-2">Lily confronts Doxy in hallway. First honest conversation about change. Ethan talks with counselor about next steps.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Act II-B */}
            <div className="bg-black/30 border border-orange-500 rounded-lg">
              <button
                onClick={() => toggleAct('act2b')}
                className="w-full flex items-center justify-between p-4 hover:bg-orange-900/20 transition-colors"
              >
                <h3 className="text-2xl font-bold text-orange-400">ACT II-B: THE STRUGGLE (55-80 min)</h3>
                {expandedAct === 'act2b' ? <ChevronUp className="w-6 h-6 text-orange-400" /> : <ChevronDown className="w-6 h-6 text-orange-400" />}
              </button>
              {expandedAct === 'act2b' && (
                <div className="p-4 space-y-4 text-orange-200">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 7: Doxy's Internal Struggle (10 min)</h4>
                    <p className="text-sm mb-2">Doxy alone in his room, confronting his actions. Deletes mean messages. Questions his identity.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 8: The Canteen Confrontation (25 min)</h4>
                    <p className="text-sm mb-2">Extended scene where Ethan approaches Doxy. Lily joins. Deep conversation about impact, change, and forgiveness. Public commitment to transformation.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 9: The Learning Process (10 min)</h4>
                    <p className="text-sm mb-2">Montage of Doxy's small acts of kindness. Helping students. Catching himself before being mean. Building new friendships.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Act III */}
            <div className="bg-black/30 border border-orange-500 rounded-lg">
              <button
                onClick={() => toggleAct('act3')}
                className="w-full flex items-center justify-between p-4 hover:bg-orange-900/20 transition-colors"
              >
                <h3 className="text-2xl font-bold text-orange-400">ACT III: THE TRANSFORMATION (80-120 min)</h3>
                {expandedAct === 'act3' ? <ChevronUp className="w-6 h-6 text-orange-400" /> : <ChevronDown className="w-6 h-6 text-orange-400" />}
              </button>
              {expandedAct === 'act3' && (
                <div className="p-4 space-y-4 text-orange-200">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 10: Setbacks and Growth (15 min)</h4>
                    <p className="text-sm mb-2">Old friends mock Doxy's changes. He stays committed. Helps new student Maria get caught up.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 11: Full Circle - Doxy's Own Speech (20 min)</h4>
                    <p className="text-sm mb-2">Principal asks Doxy to speak at next assembly. Preparation and nervousness with friends' support.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 12: The Speech (20 min)</h4>
                    <p className="text-sm mb-2">Doxy's powerful assembly speech about transformation. Public apology and commitment to change. Standing ovation.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 13: Extended Resolution (25 min)</h4>
                    <p className="text-sm mb-2">One year later time jump. School culture transformed. Integrated friendships. Awards ceremony recognizing growth.</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-bold text-orange-300 mb-2">Scene 14: Finale - "Thank You, Westview!" (5 min)</h4>
                    <p className="text-sm mb-2">Last day of school year. Doxy, Ethan, and Lily reflect on their journey. Plans for summer helping others. Closing voiceover about real strength.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-orange-900/20 border border-orange-500 rounded-lg p-4">
            <h3 className="text-lg font-bold text-orange-400 mb-2">Key Themes</h3>
            <ul className="text-orange-200 text-sm space-y-1">
              <li>• The power of vulnerability and courage</li>
              <li>• Communities can change together</li>
              <li>• Real strength builds people up, doesn't tear them down</li>
              <li>• Forgiveness and second chances</li>
              <li>• Believing in people's capacity for growth</li>
            </ul>
          </div>
        </div>

        <div className="bg-neutral-900 border-2 border-orange-500 rounded-2xl p-8 mb-8 max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-orange-400 mb-4">Movie Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Duration</div>
              <div className="text-white">120 Minutes</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Quality</div>
              <div className="text-white">768P HD</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Characters</div>
              <div className="text-white">Doxy, Ethan, Lily</div>
            </div>
            <div className="bg-black/50 p-4 rounded-lg">
              <div className="text-orange-400 font-bold mb-1">Genre</div>
              <div className="text-white">Drama</div>
            </div>
          </div>
          <p className="text-orange-200 text-lg leading-relaxed mb-4">
            Experience the compelling 120-minute story of Doxy, a powerful narrative about courage, friendship, and standing up against bullying. Watch as a school bully transforms through meaningful connections and discovers the power of empathy and change.
          </p>
          <p className="text-orange-300">
            Written and directed by MandaStrong1
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-orange-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-orange-500 transition-all hover:scale-105"
          >
            Continue to Editor
          </button>
        </div>

        <footer className="border-t-2 border-orange-500 pt-6 mt-12">
          <p className="text-white text-sm">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>
    </div>
  );
}
