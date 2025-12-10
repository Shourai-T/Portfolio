import { useEffect, useState } from "react";
import {
  ExternalLink,
  Github,
  Search,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRouter } from "../contexts/RouterContext";
import { ParticleBackground } from "../components/ParticleBackground";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { fetchGitHubRepos, TransformedRepo } from "../lib/github";

const PROJECTS_PER_PAGE = 6;

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string;
  demo_url?: string | null;
  github_url?: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
}

export function Projects() {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [openSourceProjects, setOpenSourceProjects] = useState<
    TransformedRepo[]
  >([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [filterTags, setFilterTags] = useState<string[]>(["All"]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Load Featured Projects from Supabase (Published only)
        const { data: projectsData, error } = await supabase
          .from("projects")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(projectsData || []);
        setFilteredProjects(projectsData || []);

        // 2. Load Open Source from GitHub
        const githubData = await fetchGitHubRepos("shourai-t");
        setOpenSourceProjects(githubData);

        // 3. Load Tags
        const { data: tagsData } = await supabase
          .from("tags")
          .select("name")
          .eq("type", "project")
          .order("name");

        if (tagsData) {
          setFilterTags(["All", ...tagsData.map((t) => t.name)]);
        } else {
          // Fallback if no tags table yet or empty
          setFilterTags(["All"]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter projects based on tag and search query
  useEffect(() => {
    let filtered = projects;

    // Filter by tag
    if (selectedTag !== "All") {
      filtered = filtered.filter((project) =>
        project.tags?.some(
          (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        )
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.description &&
            project.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
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
    <div className="min-h-screen bg-dark-bg py-12 relative">
      <ParticleBackground />
      {/* 1️⃣ SECTION TITLE (HEADER) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-sm font-medium text-white uppercase tracking-wider mb-4">
            My Work
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-serif text-white mb-6">
            Projects & Open Source
          </h2>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.7)" }}>
            A collection of my work, side projects, and open source
            contributions.
          </p>
        </div>

        {/* 2️⃣ SEARCH BAR */}
        <div className="mb-12 max-w-2xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search project..."
          />
        </div>

        {/* 3️⃣ FILTER BUTTONS (TAGS) */}
        <div className="mb-16 max-w-3xl mx-auto">
          <FilterBar
            tags={filterTags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        </div>

        {/* 4️⃣ FEATURED PROJECT LIST */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8">
            Featured Projects
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {[1, 2, 3, 4].map((i) => (
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
              <h3 className="text-xl font-semibold text-white mb-2">
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
                  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
                    e.preventDefault();
                    navigate("project-detail", project.slug);
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
                      <div className="aspect-video relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />

                        {/* Hover Overlay with Icons */}
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {project.github_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  project.github_url || undefined,
                                  "_blank"
                                );
                              }}
                              className="backdrop-blur-sm inline-flex items-center justify-center h-10 w-10 rounded-full bg-white text-dark-bg hover:bg-gray-200 transition-colors shadow-lg"
                              title="View Code"
                            >
                              <Github className="h-5 w-5" />
                            </button>
                          )}
                          {project.demo_url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  project.demo_url || undefined,
                                  "_blank"
                                );
                              }}
                              className="backdrop-blur-sm inline-flex items-center justify-center h-10 w-10 rounded-full bg-white text-dark-bg hover:bg-gray-200 transition-colors shadow-lg"
                              title="Live Demo"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-white group-hover:underline decoration-1 underline-offset-4 transition-all leading-tight">
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
                              className={`text-xs px-2.5 py-1 rounded-md font-medium border border-white/10 bg-white/5 text-dark-text-secondary`}
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
                    className="p-2 rounded-lg bg-[#1a1a1a] text-white border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                            : "bg-[#1a1a1a] text-white border border-white/10 hover:border-white/30"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#1a1a1a] text-white border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
          <h2 className="text-4xl font-bold text-white mb-8">
            Open Source Contributions
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-white w-8 h-8" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {openSourceProjects.length > 0 ? (
                openSourceProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group bg-[#1a1a1a] p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[#252525]"
                    onClick={() => window.open(project.github_url, "_blank")}
                    style={{
                      animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Title with GitHub Icon */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <h3 className="text-lg font-bold text-white group-hover:underline decoration-1 underline-offset-4 transition-all flex-1 line-clamp-1">
                        {project.title}
                      </h3>
                      <Github
                        size={20}
                        className="text-dark-text-secondary group-hover:text-white"
                      />
                    </div>

                    {/* Description */}
                    <p className="text-dark-text-secondary text-sm leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
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
                ))
              ) : (
                <div className="col-span-full text-center text-dark-text-secondary">
                  Unable to load GitHub repositories.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
