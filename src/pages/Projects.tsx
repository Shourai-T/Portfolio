import { useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  Search,
  ChevronLeft,
  ChevronRight,
  GitBranch,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "../contexts/RouterContext";
import { ParticleBackground } from "../components/ParticleBackground";

const PROJECTS_PER_PAGE = 6;

export function Projects() {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [openSourceProjects, setOpenSourceProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // All available tags/categories
  const allTags = [
    "All",
    "Next.js",
    "React",
    "Vue.js",
    "Angular",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express",
    "Django",
    "FastAPI",
    "Python",
    "Java",
    "C#",
    "Golang",
    "Rust",
    "Frontend",
    "Backend",
    "Full Stack",
    "Mobile",
    "DevOps",
    "Cloud",
    "Database",
    "API",
    "Tools",
    "Open Source",
    "Guestbook",
  ];

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);

      // Load featured projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .order("order_index");

      // Load open source projects
      const { data: openSourceData } = await supabase
        .from("projects")
        .select("*")
        .eq("is_open_source", true)
        .order("created_at", { ascending: false });

      // Use mock data for featured projects (always)
      const mockProjects = [
        {
          id: 1,
          title: "Portfolio Website",
          description:
            "A modern portfolio website built with React, TypeScript, and Tailwind CSS featuring dark theme and smooth animations.",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=533&fit=crop",
          tags: ["Next.js", "Frontend", "Tools"],
          demo_url: "https://example.com",
          github_url: "https://github.com/example/portfolio",
          featured: true,
        },
        {
          id: 2,
          title: "Task Management App",
          description:
            "Full-stack task management application with real-time updates and collaborative features.",
          image_url:
            "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=533&fit=crop",
          tags: ["Next.js", "Frontend"],
          demo_url: "https://example.com",
          github_url: "https://github.com/example/tasks",
        },
        {
          id: 3,
          title: "E-Commerce Platform",
          description:
            "Modern e-commerce solution with payment integration and inventory management.",
          image_url:
            "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=533&fit=crop",
          tags: ["Java", "Frontend"],
          demo_url: "https://example.com",
          github_url: "https://github.com/example/ecommerce",
        },
        {
          id: 4,
          title: "Weather Dashboard",
          description:
            "Real-time weather dashboard with forecasts and interactive maps.",
          image_url:
            "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=533&fit=crop",
          tags: ["Frontend", "Tools"],
          demo_url: "https://example.com",
          github_url: "https://github.com/example/weather",
        },
        {
          id: 5,
          title: "Chat Application",
          description:
            "Real-time chat application with WebSocket support and message encryption.",
          image_url:
            "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=533&fit=crop",
          tags: ["Next.js", "Frontend"],
          demo_url: "https://example.com",
          github_url: "https://github.com/example/chat",
        },
        {
          id: 6,
          title: "Blog Platform",
          description:
            "Content management system with markdown support and SEO optimization.",
          image_url:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=533&fit=crop",
          tags: ["Next.js", "Tools"],
          demo_url: "https://example.com",
          github_url: "https://github.com/example/blog",
        },
        {
          id: 7,
          title: "Fitness Tracker",
          description:
            "Track your workouts, nutrition, and progress with detailed analytics.",
          image_url:
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=533&fit=crop",
          tags: ["Frontend", "Tools"],
          demo_url: "https://example.com",
          github_url: "https://github.com/example/fitness",
        },
      ];
      // Always use mock data for now
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);

      // Use mock data for open source (always)
      const mockOpenSource = [
        {
          id: 1,
          title: "react-ui-components",
          description:
            "A collection of reusable React components with TypeScript support",
          tech_stack: ["React", "TypeScript"],
          github_url: "https://github.com/example/react-ui",
          branches: 5,
        },
        {
          id: 2,
          title: "tailwind-utilities",
          description:
            "Custom Tailwind CSS utilities and plugins for rapid development",
          tech_stack: ["CSS", "Tailwind"],
          github_url: "https://github.com/example/tailwind-utils",
          branches: 3,
        },
        {
          id: 3,
          title: "node-api-boilerplate",
          description:
            "Production-ready Node.js API boilerplate with authentication",
          tech_stack: ["Node.js", "Express"],
          github_url: "https://github.com/example/node-api",
          branches: 8,
        },
        {
          id: 4,
          title: "python-data-tools",
          description:
            "Data analysis and visualization tools built with Python",
          tech_stack: ["Python", "Pandas"],
          github_url: "https://github.com/example/python-tools",
          branches: 4,
        },
        {
          id: 5,
          title: "java-spring-starter",
          description: "Spring Boot starter template with best practices",
          tech_stack: ["Java", "Spring"],
          github_url: "https://github.com/example/spring-starter",
          branches: 6,
        },
        {
          id: 6,
          title: "cli-dev-tools",
          description:
            "Command-line tools for developers to boost productivity",
          tech_stack: ["Go", "CLI"],
          github_url: "https://github.com/example/cli-tools",
          branches: 2,
        },
        {
          id: 7,
          title: "docker-templates",
          description: "Docker and docker-compose templates for various stacks",
          tech_stack: ["Docker", "DevOps"],
          github_url: "https://github.com/example/docker-templates",
          branches: 7,
        },
        {
          id: 8,
          title: "vscode-theme-pack",
          description:
            "Beautiful VS Code themes with consistent color palettes",
          tech_stack: ["JSON", "VSCode"],
          github_url: "https://github.com/example/vscode-themes",
          branches: 3,
        },
      ];
      // Always use mock data for now
      setOpenSourceProjects(mockOpenSource);

      setLoading(false);
    }

    loadProjects();
  }, []);

  // Filter projects based on tag and search query
  useEffect(() => {
    let filtered = projects;

    // Filter by tag
    if (selectedTag !== "All") {
      filtered = filtered.filter((project) =>
        project.tags?.includes(selectedTag)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedTag, searchQuery, projects]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <ParticleBackground />
      {/* 1️⃣ SECTION TITLE (HEADER) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-text mb-4">
            My Work
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-dark-text-secondary mb-6">
            Projects & Open Source
          </h2>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
            A collection of my work, side projects, and open source
            contributions.
          </p>
        </div>

        {/* 2️⃣ SEARCH BAR */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-text-secondary"
            />
            <input
              type="text"
              placeholder="Search project and repo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#1e1e1e] text-dark-text rounded-xl border border-white/10 focus:border-white/30 focus:outline-none transition-colors placeholder:text-dark-text-secondary"
            />
          </div>
        </div>

        {/* 3️⃣ FILTER BUTTONS (TAGS) */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-3xl mx-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`backdrop-blur-sm inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive px-4 py-2 has-[>svg]:px-3 rounded-full text-sm h-8 ${
                selectedTag === tag
                  ? "bg-white text-dark-bg hover:bg-white/90"
                  : "bg-white/10 text-dark-text hover:bg-white/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 4️⃣ FEATURED PROJECT LIST */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-dark-text mb-8">
            Featured Projects
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 animate-pulse"
                >
                  <div className="aspect-video bg-white/10 rounded-2xl" />
                  <div className="space-y-4">
                    <div className="h-8 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded" />
                    <div className="h-4 bg-white/10 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-dark-text-secondary mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text-secondary mb-2">
                No projects found
              </h3>
              <p className="text-dark-text-secondary">
                Try a different search term or filter
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {paginatedProjects.map((project, index) => {
                  const slug = project.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "");
                  
                  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    navigate("project-detail", slug);
                  };

                  return (
                    <div
                      key={project.id}
                      onClick={handleClick}
                      className="group flex flex-col gap-4 cursor-pointer"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                      }}
                    >
                      {/* Image with Hover Icons */}
                    <div className="aspect-video relative overflow-hidden rounded-2xl border border-white/10">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Hover Overlay with Icons */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {project.github_url && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(project.github_url, "_blank");
                            }}
                            className="backdrop-blur-sm inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-dark-bg hover:bg-white transition-colors shadow-sm"
                          >
                            <Github className="h-4 w-4" />
                          </button>
                        )}
                        {project.demo_url && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(project.demo_url, "_blank");
                            }}
                            className="backdrop-blur-sm inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-dark-bg hover:bg-white transition-colors shadow-sm"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-dark-text group-hover:text-white transition-colors leading-tight">
                        {project.title}
                      </h2>

                      <p
                        className="line-clamp-2 text-base leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {project.description}
                      </p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-md font-medium ${
                              idx < 5
                                ? "bg-white/10 text-white"
                                : "border border-white/20 text-dark-text-secondary"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#1a1a1a] text-dark-text border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? "bg-white text-dark-bg shadow-lg"
                            : "bg-[#1a1a1a] text-dark-text border border-white/10 hover:border-white/30"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#1a1a1a] text-dark-text border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* 5️⃣ OPEN SOURCE CONTRIBUTIONS SECTION */}
        <section className="relative z-10 pt-20 pb-12">
          <h2 className="text-4xl font-bold text-dark-text mb-8">
            Open Source Contributions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {openSourceProjects.map((project, index) => (
              <div
                key={project.id}
                className="group bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[#252525]"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                {/* Title with GitHub Icon */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="text-lg font-bold text-dark-text group-hover:text-white transition-colors flex-1">
                    {project.title}
                  </h3>
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-dark-text-secondary hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={20} />
                    </a>
                  )}
                </div>

                {/* Description */}
                <p className="text-dark-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags (optional) */}
                {project.tech_stack && project.tech_stack[0] && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 2).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs bg-white/10 text-white rounded-full border border-white/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Branch Count */}
                <div className="flex items-center text-dark-text-secondary text-sm">
                  <GitBranch size={16} className="mr-1" />
                  <span>{project.branches || 1} branches</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
