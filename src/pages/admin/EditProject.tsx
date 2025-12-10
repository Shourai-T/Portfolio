import { useEffect, useState } from "react";
import { ProjectForm } from "../../components/admin/ProjectForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";
import { supabase } from "../../lib/supabase";

export function EditProject() {
  const { navigate, projectSlug: projectId } = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    } else {
      console.error("No project ID provided via router state");
      navigate("admin-projects");
    }
  }, [projectId]);

  const fetchProject = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setInitialData(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      alert("Project not found");
      navigate("admin-projects");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-white mb-2">Edit Project</h1>
        <p className="text-dark-text-secondary">
          Update project details and content.
        </p>
      </div>

      {initialData && <ProjectForm mode="edit" initialData={initialData} />}
    </div>
  );
}
