import { ArrowRight, Camera } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";

interface LocketGallerySectionProps {
  photos: any[];
}

export function LocketGallerySection({ photos }: LocketGallerySectionProps) {
  const { navigate } = useRouter();

  if (photos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-dark-text">Locket Gallery</h2>
        <button
          onClick={() => navigate("photos")}
          className="group text-white hover:text-white/80 font-semibold flex items-center space-x-2"
        >
          <Camera size={20} />
          <span>View all photos</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="columns-2 md:columns-3 gap-3 md:gap-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => navigate("photos")}
            className="group relative w-full rounded-lg overflow-hidden cursor-pointer break-inside-avoid mb-3 md:mb-4"
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <img
              src={photo.thumbnail_url || photo.image_url}
              alt={photo.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              {photo.title && (
                <p className="text-white p-4 font-medium text-sm md:text-base">
                  {photo.title}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
