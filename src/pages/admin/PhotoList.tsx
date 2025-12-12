import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Search,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "../../contexts/RouterContext";
import { ParticleBackground } from "../../components/ParticleBackground";

export function PhotoList() {
  const { navigate } = useRouter();
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;
      setPhotos(photos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo");
    }
  };

  const filteredPhotos = photos.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white relative py-12">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <h1 className="text-sm font-medium text-white uppercase tracking-wider mb-2">
              Admin Panel
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Manage Photos
            </h2>
            <p className="text-lg text-dark-text-secondary">
              Curate your visual gallery.
            </p>
          </div>

          <button
            onClick={() => navigate("admin-photos-new")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-dark-bg hover:bg-white/90 rounded-full font-bold shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            Add Photo
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-16 max-w-2xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text-secondary"
            size={20}
          />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl text-white outline-none focus:border-white/30 transition-colors backdrop-blur-sm shadow-xl"
          />
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-4">
              <ImageIcon size={32} className="text-dark-text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No photos found
            </h3>
            <p className="text-dark-text-secondary">
              Upload your first photo to the gallery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => navigate("admin-photos-edit", photo.id)}
                className="group relative aspect-square bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold truncate">
                    {photo.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded">
                      {photo.category}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("admin-photos-edit", photo.id);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white text-white hover:text-dark-bg rounded-full transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(photo.id, e)}
                        className="p-1.5 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
