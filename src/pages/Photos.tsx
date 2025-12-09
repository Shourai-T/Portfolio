import { useEffect, useState } from "react";
import { Image as ImageIcon, X, Grid, List } from "lucide-react";
import { supabase } from "../lib/supabase";

export function Photos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      const { data } = await supabase
        .from("photos")
        .select("*")
        .order("order_index");

      if (data) {
        setPhotos(data);
        setFilteredPhotos(data);

        const cats = Array.from(
          new Set((data as any[]).map((p: any) => p.category))
        ).sort();
        setCategories(cats);
      }
      setLoading(false);
    }

    loadPhotos();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(
        photos.filter((photo) => photo.category === selectedCategory)
      );
    }
  }, [selectedCategory, photos]);

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-4">
            Photo Gallery
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            A visual journey through moments, places, and creative captures
          </p>
        </div>

        <div className="bg-dark-hover rounded-xl shadow-md p-6 mb-8 border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <ImageIcon size={20} className="text-dark-text-secondary" />
              <h2 className="text-lg font-semibold text-dark-text">
                Filter by Category
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white/20 text-white"
                    : "text-dark-text-secondary hover:bg-dark-hover"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "masonry"
                    ? "bg-white/20 text-white"
                    : "text-dark-text-secondary hover:bg-dark-hover"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-white text-dark-bg shadow-md"
                  : "bg-dark-hover text-dark-text-secondary hover:text-dark-text border border-dark-border"
              }`}
            >
              All Photos ({photos.length})
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-white text-dark-bg shadow-md"
                    : "bg-dark-hover text-dark-text-secondary hover:text-dark-text border border-dark-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div
            className={`grid ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2"
            } gap-6`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-xl animate-pulse"
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
          <div
            className={`grid ${
              viewMode === "grid"
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2"
            } gap-6`}
          >
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all bg-white/20 border border-dark-border"
              >
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {photo.featured && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white text-dark-bg text-xs font-bold rounded-full shadow-lg">
                    Featured
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-white/80 text-sm line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                  </div>
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
