import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
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
  | "admin-blog"
  | "admin-blog-new"
  | "admin-blog-edit"
  | "admin-photos"
  | "admin-photos-new"
  | "admin-photos-edit"
  | "admin-about"
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

  // Helper to get URL path from Page and Slug
  const getPath = (page: Page, slug?: string): string => {
    switch (page) {
      case "home":
        return "/";
      case "projects":
        return "/projects";
      case "project-detail":
        return `/projects/${slug}`;
      case "blog":
        return "/blog";
      case "blog-detail":
        return `/blog/${slug}`;
      case "photos":
        return "/photos";
      case "about":
        return "/about";
      case "contact":
        return "/contact";
      case "resume":
        return "/resume";
      case "login":
        return "/login";
      case "admin":
        return "/admin";
      case "admin-projects":
        return "/admin/projects";
      case "admin-projects-new":
        return "/admin/projects/new";
      case "admin-projects-edit":
        return `/admin/projects/edit/${slug}`;
      case "admin-tags":
        return "/admin/tags";
      case "admin-blog":
        return "/admin/blog";
      case "admin-blog-new":
        return "/admin/blog/new";
      case "admin-blog-edit":
        return `/admin/blog/edit/${slug}`;
      case "admin-photos":
        return "/admin/photos";
      case "admin-photos-new":
        return "/admin/photos/new";
      case "admin-photos-edit":
        return `/admin/photos/edit/${slug}`;
      case "admin-about":
        return "/admin/about";
      default:
        return "/";
    }
  };

  // Helper to parse URL path to Page and Slug
  const parsePath = (path: string): { page: Page; slug?: string } => {
    if (path === "/" || path === "") return { page: "home" };
    if (path === "/projects") return { page: "projects" };
    if (path.startsWith("/projects/"))
      return { page: "project-detail", slug: path.split("/")[2] };
    if (path === "/blog") return { page: "blog" };
    if (path.startsWith("/blog/"))
      return { page: "blog-detail", slug: path.split("/")[2] };
    if (path === "/photos") return { page: "photos" };
    if (path === "/about") return { page: "about" };
    if (path === "/contact") return { page: "contact" };
    if (path === "/resume") return { page: "resume" };
    if (path === "/login") return { page: "login" };
    if (path === "/admin") return { page: "admin" };

    // Admin sub-routes
    if (path === "/admin/projects") return { page: "admin-projects" };
    if (path === "/admin/projects/new") return { page: "admin-projects-new" };
    if (path.startsWith("/admin/projects/edit/"))
      return { page: "admin-projects-edit", slug: path.split("/")[4] };
    if (path === "/admin/tags") return { page: "admin-tags" };
    if (path === "/admin/blog") return { page: "admin-blog" };
    if (path === "/admin/blog/new") return { page: "admin-blog-new" };
    if (path.startsWith("/admin/blog/edit/"))
      return { page: "admin-blog-edit", slug: path.split("/")[4] };
    if (path === "/admin/photos") return { page: "admin-photos" };
    if (path === "/admin/photos/new") return { page: "admin-photos-new" };
    if (path.startsWith("/admin/photos/edit/"))
      return { page: "admin-photos-edit", slug: path.split("/")[4] };
    if (path === "/admin/about") return { page: "admin-about" };

    return { page: "home" };
  };

  const navigate = useCallback((page: Page, slug?: string) => {
    setCurrentPage(page);
    setProjectSlug(slug);

    const path = getPath(page, slug);
    window.history.pushState({ page, slug }, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle initial load and popstate
  useEffect(() => {
    const handlePopState = () => {
      const { page, slug } = parsePath(window.location.pathname);
      setCurrentPage(page);
      setProjectSlug(slug);
    };

    // Initial load
    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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
