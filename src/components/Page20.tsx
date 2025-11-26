import { Users, Heart, MessageSquare, Upload, Play } from 'lucide-react';
import { useState } from 'react';

interface Page20Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page20({ onNext, onBack }: Page20Props) {
  const [userMovies, setUserMovies] = useState([
    {
      id: 1,
      title: 'My First Movie',
      creator: 'User123',
      thumbnail: '/video/packageDTSBext.mp4',
      likes: 247,
      loved: 89,
      comments: 42,
      uploaded: '2 hours ago'
    },
    {
      id: 2,
      title: 'Epic Adventure',
      creator: 'FilmMaker99',
      thumbnail: '/video/packageDTSBext.mp4',
      likes: 892,
      loved: 234,
      comments: 156,
      uploaded: '1 day ago'
    },
    {
      id: 3,
      title: 'Comedy Gold',
      creator: 'LaughTrack',
      thumbnail: '/video/packageDTSBext.mp4',
      likes: 1456,
      loved: 567,
      comments: 289,
      uploaded: '3 days ago'
    },
  ]);

  const handleUpload = () => {
    alert('Upload your movie here! Select your rendered video file.');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-purple-400 flex items-center gap-3">
          <Users className="w-10 h-10" />
          Community Hub - Share Your Movies
        </h1>

        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-500 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Upload Your Movie</h2>
          <p className="text-purple-200 mb-6">
            Share your MandaStrong Studio creation with the community! Get likes, loves, and feedback from other creators.
          </p>
          <button
            onClick={handleUpload}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center gap-3"
          >
            <Upload className="w-6 h-6" />
            Upload Your Movie
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">Community Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-purple-900/30 border-2 border-purple-500 rounded-xl overflow-hidden hover:border-purple-400 transition-all cursor-pointer group"
              >
                <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎬</div>
                    <p className="text-purple-400 text-sm">User Movie</p>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-purple-300">{movie.title}</h3>
                  <p className="text-sm text-purple-400 mb-3">by {movie.creator}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                        👍 {movie.likes}
                      </button>
                      <button className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors">
                        ❤️ {movie.loved}
                      </button>
                      <button className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        {movie.comments}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-purple-500">{movie.uploaded}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-purple-300">
            <MessageSquare className="w-6 h-6" />
            Recent Comments
          </h2>
          <div className="space-y-4">
            <div className="bg-black/50 border border-purple-500 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  U
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">User123</span>
                    <span className="text-xs text-purple-400">on "Epic Adventure"</span>
                    <span className="text-xs text-purple-500">2 hours ago</span>
                  </div>
                  <p className="text-purple-200">
                    Amazing work! The timeline editing is so smooth. How did you get that transition effect?
                  </p>
                  <div className="flex gap-4 mt-2">
                    <button className="text-sm text-purple-400 hover:text-purple-300">👍 Like (12)</button>
                    <button className="text-sm text-purple-400 hover:text-purple-300">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-500 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                  F
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">FilmMaker99</span>
                    <span className="text-xs text-purple-400">on "Comedy Gold"</span>
                    <span className="text-xs text-purple-500">5 hours ago</span>
                  </div>
                  <p className="text-purple-200">
                    This made me laugh so hard! ❤️ The comedic timing is perfect!
                  </p>
                  <div className="flex gap-4 mt-2">
                    <button className="text-sm text-purple-400 hover:text-purple-300">👍 Like (24)</button>
                    <button className="text-sm text-purple-400 hover:text-purple-300">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Next
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8 text-center text-white text-sm">
          <p>MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com</p>
        </footer>
      </div>
    </div>
  );
}
