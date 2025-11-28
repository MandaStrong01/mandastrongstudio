import { useState, useEffect } from 'react';
import MoviePlayer from './components/MoviePlayer';
import VideoUploadPage from './components/VideoUploadPage';
import VideoStudio from './components/VideoStudio';
import ToolboardPage from './components/ToolboardPage';
import BuilderPage from './components/BuilderPage';
import ProgressIndicator from './components/ProgressIndicator';
import BeginnerTutorial from './components/BeginnerTutorial';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import Page5 from './components/Page5';
import Page6 from './components/Page6';
import Page7 from './components/Page7';
import Page8 from './components/Page8';
import Page9 from './components/Page9';
import Page10 from './components/Page10';
import Page11 from './components/Page11';
import Page12 from './components/Page12';
import Page13 from './components/Page13';
import Page14 from './components/Page14';
import Page15 from './components/Page15';
import Page16 from './components/Page16';
import Page17 from './components/Page17';
import Page18 from './components/Page18';
import Page19 from './components/Page19';
import Page20 from './components/Page20';
import Page21 from './components/Page21';

function App() {
  const [currentPage, setCurrentPage] = useState<number | string>('demo');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial && currentPage === 1) {
      setShowTutorial(true);
    }
  }, [currentPage]);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const navigateTo = (page: number | string) => {
    setCurrentPage(page);
    window.location.hash = typeof page === 'number' ? `page${page}` : page;
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'video-studio') setCurrentPage('video-studio');
      else if (hash === 'builder') setCurrentPage('builder');
      else if (hash === 'upload') setCurrentPage('upload');
      else if (hash === 'view-projects') setCurrentPage('video-studio');
      else if (hash === 'toolboard') setCurrentPage('toolboard');
      else if (hash === 'demo') setCurrentPage('demo');
      else if (hash.startsWith('page')) {
        const pageNum = parseInt(hash.replace('page', ''));
        if (!isNaN(pageNum)) setCurrentPage(pageNum);
      } else if (!hash) {
        setCurrentPage('demo');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    if (currentPage === 'demo') return (
      <MoviePlayer
        onHome={() => navigateTo(1)}
        onBack={() => navigateTo(1)}
        videoUrl="/video/dtsb_120min.mp4"
        autoTransition={true}
        transitionDelay={15000}
      />
    );
    if (currentPage === 'builder') return <BuilderPage onBack={() => navigateTo(4)} />;
    if (currentPage === 'video-studio') return <VideoStudio />;
    if (currentPage === 'toolboard') return <ToolboardPage onBack={() => navigateTo(4)} />;
    if (currentPage === 'upload') return (
      <VideoUploadPage
        onHome={() => navigateTo(1)}
        onPlayMovie={(url) => {
          setCurrentVideoUrl(url);
          navigateTo('movie');
        }}
      />
    );
    if (currentPage === 'movie') return (
      <MoviePlayer
        onHome={() => navigateTo(1)}
        onBack={() => navigateTo(1)}
        videoUrl={currentVideoUrl || undefined}
      />
    );
    if (currentPage === 1) return <Page1 onNext={() => navigateTo(2)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 2) return <Page2 onNext={() => navigateTo(3)} onBack={() => navigateTo(1)} onNavigate={navigateTo} />;
    if (currentPage === 3) return <Page3 onNext={() => navigateTo(4)} onBack={() => navigateTo(2)} onNavigate={navigateTo} />;
    if (currentPage === 4) return <Page4 onNext={() => navigateTo(5)} onBack={() => navigateTo(3)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 5) return <Page5 onNext={() => navigateTo(6)} onBack={() => navigateTo(4)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 6) return <Page6 onNext={() => navigateTo(7)} onBack={() => navigateTo(5)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 7) return <Page7 onNext={() => navigateTo(8)} onBack={() => navigateTo(6)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 8) return <Page8 onNext={() => navigateTo(9)} onBack={() => navigateTo(7)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 9) return <Page9 onNext={() => navigateTo(10)} onBack={() => navigateTo(8)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 10) return <Page10 onNext={() => navigateTo(11)} onBack={() => navigateTo(9)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 11) return <Page11 onNext={() => navigateTo(12)} onBack={() => navigateTo(10)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 12) return <Page12 onNext={() => navigateTo(13)} onBack={() => navigateTo(11)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 13) return <Page13 onNext={() => navigateTo(14)} onBack={() => navigateTo(12)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 14) return <Page14 onNext={() => navigateTo(15)} onBack={() => navigateTo(13)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 15) return <Page15 onNext={() => navigateTo(16)} onBack={() => navigateTo(14)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 16) return <Page16 onNext={() => navigateTo(17)} onBack={() => navigateTo(15)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 17) return <Page17 onNext={() => navigateTo(18)} onBack={() => navigateTo(16)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 18) return <Page18 onNext={() => navigateTo(19)} onBack={() => navigateTo(17)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 19) return <Page19 onNext={() => navigateTo(20)} onBack={() => navigateTo(18)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 20) return <Page20 onNext={() => navigateTo(21)} onBack={() => navigateTo(19)} onNavigate={navigateTo} currentPage={typeof currentPage === 'number' ? currentPage : 1} />;
    if (currentPage === 21) return <Page21 onBack={() => navigateTo(20)} onHome={() => navigateTo(1)} />;

    return <MoviePlayer />;
  };

  return (
    <div className="app">
      {typeof currentPage === 'number' && currentPage >= 1 && currentPage <= 21 && (
        <ProgressIndicator currentPage={currentPage} />
      )}
      {renderPage()}
      {showTutorial && (
        <BeginnerTutorial onClose={closeTutorial} onNavigate={navigateTo} />
      )}
    </div>
  );
}

export default App;
