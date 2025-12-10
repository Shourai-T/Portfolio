import { useState, useEffect } from "react";
import { RouterProvider, useRouter } from "./contexts/RouterContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { CommandPalette } from "./components/CommandPalette";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { Home } from "./pages/Home";
import { Projects } from "./pages/Projects";
import { Blog } from "./pages/Blog";
import { Photos } from "./pages/Photos";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Resume } from "./pages/Resume";
import { Footer } from "./components/Footer";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Login } from "./pages/Login";
import { Admin } from "./pages/Admin";
import { ProjectList } from "./pages/admin/ProjectList";
import { AddProject } from "./pages/admin/AddProject";
import { EditProject } from "./pages/admin/EditProject";
import { TagManager } from "./pages/admin/TagManager";

import { BlogDetail } from "./pages/BlogDetail";

function AppContent() {
  const { currentPage, projectSlug } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "projects":
        return <Projects />;
      case "project-detail":
        return <ProjectDetail projectId={projectSlug || ""} />;
      case "blog":
        return <Blog />;
      case "blog-detail":
        return <BlogDetail slug={projectSlug} />;
      case "photos":
        return <Photos />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "resume":
        return <Resume />;
      case "login":
        return <Login />;
      case "admin":
        return <Admin />;
      case "admin-projects":
        return <ProjectList />;
      case "admin-projects-new":
        return <AddProject />;
      case "admin-projects-edit":
        return <EditProject />;
      case "admin-tags":
        return <TagManager />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />
      {renderPage()}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
