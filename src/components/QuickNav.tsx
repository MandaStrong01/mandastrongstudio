import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface QuickNavProps {
  onNavigate: (page: number) => void;
  currentPage: number;
}

export default function QuickNav({ onNavigate, currentPage }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const pages = [
    { num: 1, name: 'Welcome' },
    { num: 2, name: 'Overview' },
    { num: 3, name: 'Login' },
    { num: 4, name: 'AI Toolboard 1' },
    { num: 5, name: 'AI Toolboard 2' },
    { num: 6, name: 'AI Toolboard 3' },
    { num: 7, name: 'AI Toolboard 4' },
    { num: 8, name: 'AI Toolboard 5' },
    { num: 9, name: 'AI Toolboard 6' },
    { num: 10, name: 'Doxy Movie' },
    { num: 11, name: 'Media Board' },
    { num: 12, name: 'Trim & Cut' },
    { num: 13, name: 'Transitions' },
    { num: 14, name: 'Text & Titles' },
    { num: 15, name: 'Audio Mix' },
    { num: 16, name: 'Export' },
    { num: 17, name: 'Movie Viewer' },
    { num: 18, name: 'Color Grade' },
    { num: 19, name: 'Collaboration' },
    { num: 20, name: 'My Projects' },
    { num: 21, name: 'Credits' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-40 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-500 transition-all shadow-lg"
        title="Quick Navigation"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-30 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border-2 border-purple-500 p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Quick Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pages.map((page) => (
                <button
                  key={page.num}
                  onClick={() => {
                    onNavigate(page.num);
                    setIsOpen(false);
                  }}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    currentPage === page.num
                      ? 'bg-purple-600 text-white'
                      : 'bg-black border border-purple-500 text-purple-300 hover:bg-purple-900'
                  }`}
                >
                  <div className="text-sm">{page.num}</div>
                  <div className="text-xs mt-1">{page.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
