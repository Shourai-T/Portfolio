import { ProjectForm } from "../../components/admin/ProjectForm";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";

export function AddProject() {
  const { navigate } = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate("admin-projects")}
        className="flex items-center gap-2 text-dark-text-secondary hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Projects
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Project</h1>
        <p className="text-dark-text-secondary">
          Create a new portfolio project showcased on your website.
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
