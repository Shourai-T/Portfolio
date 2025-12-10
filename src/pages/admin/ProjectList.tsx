import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  EyeOff,
  Loader2,
  Search,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "../../contexts/RouterContext";
import { ParticleBackground } from "../../components/ParticleBackground";

interface Project {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  image_url: string;
  description?: string;
  tags?: string[]; // Supabase returns string[] for tags now
  demo_url?: string | null;
  github_url?: string | null;
}

export function ProjectList() {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white relative py-12">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <h1 className="text-sm font-medium text-white uppercase tracking-wider mb-2">
              Admin Panel
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Manage Projects
            </h2>
            <p className="text-lg text-dark-text-secondary">
              Create, edit, and manage your portfolio showcase.
            </p>
          </div>

          <button
            onClick={() => navigate("admin-projects-new")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-dark-bg hover:bg-white/90 rounded-full font-bold shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            Add Project
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-16 max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary"
            size={20}
          />
          <input
            type="text"
            placeholder="Search projects by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl text-white outline-none focus:border-white/30 transition-colors backdrop-blur-sm shadow-xl"
          />
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-4">
              <Search size={32} className="text-dark-text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No projects found
            </h3>
            <p className="text-dark-text-secondary">
              Try creating a new project or adjust your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => navigate("admin-projects-edit", project.id)}
                className="group flex flex-col gap-4 cursor-pointer"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Image Container */}
                <div className="aspect-video relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Status Badges (Top Left) */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg border ${
                        project.published
                          ? "bg-white text-dark-bg border-white"
                          : "bg-black/50 text-white border-white/20"
                      }`}
                    >
                      {project.published ? (
                        <>
                          <Globe size={12} /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> Draft
                        </>
                      )}
                    </span>
                    {project.featured && (
                      <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-white text-dark-bg border border-white backdrop-blur-md shadow-lg">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Actions (Hover Overlay - Center/Bottom Right) */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("admin-projects-edit", project.id);
                      }}
                      className="px-4 py-2 bg-white text-dark-bg rounded-full font-bold hover:bg-gray-100 shadow-lg transition-colors flex items-center gap-2"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-2.5 bg-black text-white border border-white/20 rounded-full hover:bg-white hover:text-black shadow-lg transition-colors backdrop-blur-sm"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white group-hover:underline decoration-1 underline-offset-4 transition-all leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-dark-text-secondary text-base leading-relaxed line-clamp-2">
                    {project.description || "No description available."}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.slice(0, 5).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-md font-medium bg-white/5 text-dark-text-secondary border border-white/10 group-hover:border-white/20 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                    {(project.tags?.length || 0) > 5 && (
                      <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-white/5 text-dark-text-secondary border border-white/10">
                        +{(project.tags?.length || 0) - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
