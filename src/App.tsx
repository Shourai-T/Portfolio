import { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { Navigation } from './components/Navigation';
import { CommandPalette } from './components/CommandPalette';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Blog } from './pages/Blog';
import { Photos } from './pages/Photos';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

function AppContent() {
  const { currentPage } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'projects':
        return <Projects />;
      case 'blog':
        return <Blog />;
      case 'photos':
        return <Photos />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />
      {renderPage()}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
