import { ArrowRight } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";

interface FeaturedProjectsProps {
  projects: any[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsProps) {
  const { navigate } = useRouter();

  if (projects.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-dark-text">Featured Projects</h2>
        <button
          onClick={() => navigate("projects")}
          className="group text-white hover:text-white/80 font-semibold flex items-center space-x-2"
        >
          <span>View All</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[200px] md:auto-rows-[250px]">
        {/* First Project - Large 2x2 */}
        <div
          key={projects[0].id}
          className="group relative rounded-2xl overflow-hidden md:col-span-2 md:row-span-2 cursor-pointer"
          onClick={() => navigate("projects")}
        >
          <img
            src={projects[0].image_url}
            alt={projects[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 w-full">
            <h3 className="font-bold text-white mb-1 md:mb-2 text-xl md:text-2xl lg:text-3xl">
              {projects[0].title}
            </h3>
            <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-2 md:mb-3 max-w-md">
              {projects[0].description}
            </p>
          </div>
        </div>

        {/* Remaining Projects - 1x1 */}
        {projects.slice(1, 5).map((project) => (
          <div
            key={project.id}
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => navigate("projects")}
          >
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 w-full">
              <h3 className="font-bold text-white mb-1 md:mb-2 text-base md:text-lg">
                {project.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
