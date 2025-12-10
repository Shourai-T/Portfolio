import { useEffect, useState } from "react";
import { ArrowLeft, Github, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "../contexts/RouterContext";
import { supabase } from "../lib/supabase";
import { CommentSection } from "../components/CommentSection";

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
}

export function ProjectDetail({ projectId }: { projectId: string }) {
  const { navigate } = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // 'projectId' prop in RouterContext is actually used as the slug.
  const slug = projectId;

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <button
          onClick={() => navigate("projects")}
          className="px-6 py-2 bg-white text-dark-bg rounded-lg font-bold"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("projects")}
          className="inline-flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>

        {/* 1️⃣ HERO SECTION — IMAGE + BASIC INFO */}
        <div className="mb-12">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-2xl border border-white/10 mb-8 bg-[#1a1a1a]"
          />

          {/* 2️⃣ TITLE + DESCRIPTION */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-4 text-center">
              {project.title}
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl text-center text-dark-text-secondary">
              {project.description}
            </p>
          </div>

          {/* 3️⃣ ACTION BUTTONS */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-dark-bg font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
              >
                <ExternalLink size={20} />
                Live Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all hover:scale-105 border border-white/20"
              >
                <Github size={20} />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* 4️⃣ DIVIDER 1 */}
        <div className="mb-12 border-t border-white/10" />

        {/* 5️⃣ TAGS SECTION */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {project.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 bg-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 6️⃣ DIVIDER 2 */}
        <div className="mb-12 border-t border-white/10" />

        {/* 7️⃣ PROJECT CONTENT */}
        <div className="mb-12 prose prose-invert max-w-none text-dark-text-secondary">
          <div
            className="max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </div>

        {/* 8️⃣ DIVIDER 3 */}
        <div className="mb-12 border-t border-white/10" />

        {/* 9️⃣ COMMENT SECTION */}
        <CommentSection projectId={project.id} />
      </div>
    </div>
  );
}
