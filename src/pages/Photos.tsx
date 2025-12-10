import { useEffect, useState } from "react";
import { Image as ImageIcon, X, Grid, List } from "lucide-react";
import { supabase } from "../lib/supabase";
import { MOCK_PHOTOS } from "../data/photos";
import { FilterBar } from "../components/FilterBar";
import { ParticleBackground } from "../components/ParticleBackground";

export function Photos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      const { data } = await supabase
        .from("photos")
        .select("*")
        .order("order_index");

      const finalData = data && data.length > 0 ? data : MOCK_PHOTOS;

      setPhotos(finalData);
      setFilteredPhotos(finalData);

      if (data) {
        const cats = Array.from(
          new Set((finalData as any[]).map((p: any) => p.category))
        ).sort();
        setCategories(["All", ...cats]);
      }

      setLoading(false);
    }

    loadPhotos();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(
        photos.filter((photo) => photo.category === selectedCategory)
      );
    }
  }, [selectedCategory, photos]);

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1️⃣ HEADER SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-sm font-medium text-primary uppercase tracking-wider mb-4 text-white">
            Photo Gallery
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-serif text-dark-text mb-6">
            Locket Library
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            A visual journey through moments, places, and creative captures
          </p>
        </div>

        <FilterBar
          tags={categories}
          selectedTag={selectedCategory}
          onSelectTag={setSelectedCategory}
          className="justify-start mb-16"
        />

        {loading ? (
          <div className="columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="w-full bg-white/5 rounded-lg animate-pulse break-inside-avoid mb-3"
                style={{ height: `${Math.random() * 200 + 200}px` }}
              />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-dark-text-secondary mb-4">
              <ImageIcon size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text-secondary mb-2">
              No photos found
            </h3>
            <p className="text-dark-text-secondary">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-3 md:gap-4">
            {filteredPhotos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative w-full rounded-lg overflow-hidden cursor-pointer break-inside-avoid mb-3 md:mb-4 shadow-sm hover:shadow-xl transition-all"
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
                  {(photo.title || photo.description) && (
                    <div className="p-4 text-left w-full">
                      {photo.title && (
                        <p className="text-white font-medium text-sm md:text-base">
                          {photo.title}
                        </p>
                      )}
                      {photo.description && (
                        <p className="text-white/80 text-xs line-clamp-1 mt-0.5">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="max-w-5xl w-full">
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedPhoto.title}
              </h2>
              {selectedPhoto.description && (
                <p className="text-white/80 text-lg">
                  {selectedPhoto.description}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {selectedPhoto.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
