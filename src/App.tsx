import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { supabase } from "./lib/supabase";
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
import { Tools } from "./pages/Tools";
import { Footer } from "./components/Footer";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Login } from "./pages/Login";
import { Admin } from "./pages/Admin";
import { ProjectList } from "./pages/admin/ProjectList";
import { AddProject } from "./pages/admin/AddProject";
import { EditProject } from "./pages/admin/EditProject";
import { TagManager } from "./pages/admin/TagManager";
import { BlogList } from "./pages/admin/BlogList";
import { AddBlog } from "./pages/admin/AddBlog";
import { EditBlog } from "./pages/admin/EditBlog";
import { PhotoList } from "./pages/admin/PhotoList";
import { AddPhoto } from "./pages/admin/AddPhoto";
import { EditPhoto } from "./pages/admin/EditPhoto";
import { AboutSettings } from "./pages/admin/AboutSettings";

import { BlogDetail } from "./pages/BlogDetail";

function AppContent() {
  const { currentPage, projectSlug } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profile").select("*").single();
    if (data) {
      setProfile(data);
      if (data.favicon_url) {
        let link = document.querySelector(
          "link[rel~='icon']"
        ) as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = data.favicon_url;
      }
    }
  };

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
      case "tools":
        return <Tools />;
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
      case "admin-blog":
        return <BlogList />;
      case "admin-blog-new":
        return <AddBlog />;
      case "admin-blog-edit":
        return <EditBlog id={projectSlug || ""} />;
      case "admin-photos":
        return <PhotoList />;
      case "admin-photos-new":
        return <AddPhoto />;
      case "admin-photos-edit":
        return <EditPhoto id={projectSlug || ""} />;
      case "admin-about":
        return <AboutSettings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Navigation
        onOpenSearch={() => setIsSearchOpen(true)}
        logoUrl={profile?.logo_url}
      />
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
