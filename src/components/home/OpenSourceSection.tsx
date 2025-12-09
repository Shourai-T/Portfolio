import { ArrowRight, GitBranch } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";

interface OpenSourceSectionProps {
  projects: any[];
}

export function OpenSourceSection({ projects }: OpenSourceSectionProps) {
  const { navigate } = useRouter();

  if (projects.length === 0) return null;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-4xl font-bold text-dark-text mb-8">Open Source</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-[#1a1a1a] p-6 rounded-xl border border-dark-border hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[#252525]"
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <h3 className="text-lg font-bold text-dark-text group-hover:text-white transition-colors flex-1 line-clamp-1">
                {project.title}
              </h3>
              {project.tech_stack && (project.tech_stack as string[])[0] && (
                <span className="px-3 py-1 text-xs bg-white/10 text-white rounded-full border border-white/20 flex-shrink-0">
                  {(project.tech_stack as string[])[0]}
                </span>
              )}
            </div>

            <p className="text-dark-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">
              {project.description}
            </p>

            <div className="flex items-center text-dark-text-secondary text-sm">
              <GitBranch size={16} className="mr-1" />
              <span>main</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate("projects")}
          className="group inline-flex items-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300"
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
