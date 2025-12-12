import { PhotoForm } from "../../components/admin/PhotoForm";
import { ParticleBackground } from "../../components/ParticleBackground";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";

export function AddPhoto() {
  const { navigate } = useRouter();

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
          <h1 className="text-3xl font-bold text-white mb-2">Add New Photo</h1>
          <p className="text-dark-text-secondary">
            Upload a new memory to your collection.
          </p>
        </div>

        <PhotoForm mode="create" />
      </div>
    </div>
  );
}
