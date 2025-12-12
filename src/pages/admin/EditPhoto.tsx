import { useEffect, useState } from "react";
import { PhotoForm } from "../../components/admin/PhotoForm";
import { ParticleBackground } from "../../components/ParticleBackground";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";
import { supabase } from "../../lib/supabase";

export function EditPhoto({ id }: { id: string }) {
  const { navigate } = useRouter();
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const { data, error } = await supabase
          .from("photos")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPhoto(data);
      } catch (error) {
        console.error("Error fetching photo:", error);
        alert("Failed to load photo");
        navigate("admin-photos");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPhoto();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

  if (!photo) return null;

  return (
    <div className="min-h-screen bg-dark-bg text-white relative py-12">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <button
          onClick={() => navigate("admin-photos")}
          className="flex items-center gap-2 text-dark-text-secondary hover:text-white mb-8 transition-colors group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Photos
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Photo</h1>
          <p className="text-dark-text-secondary">Update photo details.</p>
        </div>

        <PhotoForm mode="edit" initialData={photo} />
      </div>
    </div>
  );
}
