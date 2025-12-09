import { Search } from "lucide-react";
import { useRouter } from "../contexts/RouterContext";

interface NavigationProps {
  onOpenSearch: () => void;
}

export function Navigation({ onOpenSearch }: NavigationProps) {
  const { currentPage, navigate } = useRouter();

  const navItems = [
    { id: "home" as const, label: "Home" },
    { id: "projects" as const, label: "Projects" },
    { id: "blog" as const, label: "Blog" },
    { id: "photos" as const, label: "Photos" },
    { id: "about" as const, label: "About" },
    { id: "contact" as const, label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("home")}
              className="text-xl font-bold text-dark-text hover:text-white transition-colors"
            >
              Nguyễn Anh Tuấn
            </button>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-dark-hover text-white"
                      : "text-dark-text-secondary hover:text-dark-text hover:bg-dark-hover"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-dark-text-secondary bg-dark-hover rounded-lg hover:bg-dark-hover transition-colors border border-dark-border"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-2 py-0.5 text-xs font-semibold text-dark-text bg-dark-hover border border-dark-border rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="md:hidden pb-3 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.id
                  ? "bg-dark-hover text-white"
                  : "text-dark-text-secondary hover:text-dark-text hover:bg-dark-hover"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
