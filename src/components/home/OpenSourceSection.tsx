import { useEffect, useState } from "react";
import { ArrowRight, GitBranch, Star, Loader2 } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";
import { fetchGitHubRepos, TransformedRepo } from "../../lib/github";

export function OpenSourceSection() {
  const { navigate } = useRouter();
  const [projects, setProjects] = useState<TransformedRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepos = async () => {
      const repos = await fetchGitHubRepos("shourai-t");
      setProjects(repos.slice(0, 4)); // Only show top 4
      setLoading(false);
    };
    loadRepos();
  }, []);

  if (loading) {
    return (
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-white" size={32} />
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-4xl font-bold text-dark-text mb-8">
        Open Source Contributions
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1a1a1a] p-6 rounded-xl border border-dark-border hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[#252525] flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <h3 className="text-lg font-bold text-dark-text group-hover:text-white transition-colors flex-1 line-clamp-1">
                {project.title}
              </h3>
              {project.tech_stack && project.tech_stack[0] && (
                <span className="px-3 py-1 text-xs bg-white/10 text-white rounded-full border border-white/20 flex-shrink-0">
                  {project.tech_stack[0]}
                </span>
              )}
            </div>

            <p className="text-dark-text-secondary text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
              {project.description}
            </p>

            <div className="flex items-center justify-between text-dark-text-secondary text-sm mt-auto">
              <div className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-500" />
                <span>{project.stars}</span>
              </div>
              <div className="flex items-center">
                <GitBranch size={16} className="mr-1" />
                <span>main</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate("projects")}
          className="group inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
        >
          <span>View All Repositories</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </section>
  );
}
