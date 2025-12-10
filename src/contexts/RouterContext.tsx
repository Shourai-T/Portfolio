import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type Page =
  | "home"
  | "projects"
  | "project-detail"
  | "blog"
  | "photos"
  | "about"
  | "contact"
  | "resume"
  | "admin"
  | "admin-projects"
  | "admin-projects-new"
  | "admin-projects-edit"
  | "admin-tags"
  | "blog-detail"
  | "login";

interface RouterContextType {
  currentPage: Page;
  projectSlug?: string;
  navigate: (page: Page, slug?: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [projectSlug, setProjectSlug] = useState<string>();

  const navigate = useCallback((page: Page, slug?: string) => {
    setCurrentPage(page);
    setProjectSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <RouterContext.Provider value={{ currentPage, projectSlug, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
}
