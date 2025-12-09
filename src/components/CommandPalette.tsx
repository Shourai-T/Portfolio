import { useEffect, useState, useCallback } from "react";
import { Search, FileText, FolderOpen, Image, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "../contexts/RouterContext";

interface SearchResult {
  id: string;
  title: string;
  type: "project" | "blog" | "photo" | "page";
  description?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { navigate } = useRouter();

  const pages: SearchResult[] = [
    { id: "home", title: "Home", type: "page", description: "Go to home page" },
    {
      id: "projects",
      title: "Projects",
      type: "page",
      description: "View all projects",
    },
    { id: "blog", title: "Blog", type: "page", description: "Read blog posts" },
    {
      id: "photos",
      title: "Photos",
      type: "page",
      description: "Browse photo gallery",
    },
    {
      id: "about",
      title: "About",
      type: "page",
      description: "Learn more about me",
    },
    {
      id: "contact",
      title: "Contact",
      type: "page",
      description: "Get in touch",
    },
  ];

  const searchContent = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(pages);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    const allResults: SearchResult[] = [
      ...pages.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm)
      ),
    ];

    const [projectsData, blogData, photosData] = await Promise.all([
      supabase
        .from("projects")
        .select("id, title, description")
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5),
      supabase
        .from("blog_posts")
        .select("id, title, excerpt")
        .eq("published", true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .limit(5),
      supabase
        .from("photos")
        .select("id, title, description")
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5),
    ]);

    if (projectsData.data) {
      allResults.push(
        ...(projectsData.data as any[]).map((p: any) => ({
          id: p.id,
          title: p.title,
          type: "project" as const,
          description: p.description,
        }))
      );
    }

    if (blogData.data) {
      allResults.push(
        ...(blogData.data as any[]).map((b: any) => ({
          id: b.id,
          title: b.title,
          type: "blog" as const,
          description: b.excerpt,
        }))
      );
    }

    if (photosData.data) {
      allResults.push(
        ...(photosData.data as any[]).map((p: any) => ({
          id: p.id,
          title: p.title,
          type: "photo" as const,
          description: p.description || undefined,
        }))
      );
    }

    setResults(allResults);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchContent(query);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [query, isOpen, searchContent]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    } else {
      searchContent("");
    }
  }, [isOpen, searchContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + results.length) % results.length
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = (result: SearchResult) => {
    if (result.type === "page") {
      navigate(result.id as any);
    } else {
      navigate(
        result.type === "blog"
          ? "blog"
          : result.type === "project"
          ? "projects"
          : "photos"
      );
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderOpen size={18} className="text-white" />;
      case "blog":
        return <FileText size={18} className="text-white" />;
      case "photo":
        return <Image size={18} className="text-white" />;
      default:
        return <Search size={18} className="text-dark-text-secondary" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-dark-bg backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-dark-border">
        <div className="flex items-center px-4 border-b border-dark-border">
          <Search size={20} className="text-dark-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, blog posts, photos, or pages..."
            className="flex-1 px-4 py-4 text-lg outline-none bg-dark-hover text-dark-text placeholder-dark-text-secondary"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X size={20} className="text-dark-text-secondary" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-dark-text-secondary">
              No results found
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className={`w-full flex items-start px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-white/10 border-l-2 border-l-white"
                      : "hover:bg-dark-hover"
                  }`}
                >
                  <div className="mt-1">{getIcon(result.type)}</div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="font-medium text-dark-text">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-sm text-dark-text-secondary truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 text-xs text-dark-text-secondary uppercase">
                    {result.type}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-dark-hover border-t border-dark-border text-xs text-dark-text-secondary flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <kbd className="px-2 py-0.5 bg-dark-hover border border-dark-border rounded mr-1">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-0.5 bg-dark-hover border border-dark-border rounded mr-1">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center">
              <kbd className="px-2 py-0.5 bg-dark-hover border border-dark-border rounded mr-1">
                Esc
              </kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
