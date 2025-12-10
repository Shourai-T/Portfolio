import { useEffect, useState } from "react";
import { Plus, Trash2, Tag, Loader2, ArrowLeft, Filter } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "../../contexts/RouterContext";
import { ParticleBackground } from "../../components/ParticleBackground";
import { Database } from "../../lib/database.types";

type TagType = Database["public"]["Tables"]["tags"]["Row"]["type"];

interface TagItem {
  id: string;
  name: string;
  type: TagType;
  created_at: string;
}

export function TagManager() {
  const { navigate } = useRouter();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [selectedType, setSelectedType] = useState<TagType>("project");
  const [filterType, setFilterType] = useState<TagType | "all">("all");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from("tags")
        .insert([{ name: newTag.trim(), type: selectedType }])
        .select()
        .single();

      if (error) throw error;
      if (data)
        setTags([...tags, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewTag("");
    } catch (error) {
      console.error("Error adding tag:", error);
      alert("Failed to add tag. It might already exist in this category.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!window.confirm("Delete this tag?")) return;

    try {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
      setTags(tags.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("Failed to delete tag");
    }
  };

  const filteredTags =
    filterType === "all" ? tags : tags.filter((t) => t.type === filterType);

  return (
    <div className="min-h-screen bg-dark-bg text-white relative">
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("admin")}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Tag Manager</h1>
            <p className="text-dark-text-secondary">
              Manage filter tags for projects, blog posts, and photos
            </p>
          </div>
        </div>

        {/* Add Tag Form */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
          <form onSubmit={handleAddTag} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary"
                  size={20}
                />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter new tag name..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-white focus:outline-none transition-colors"
                />
              </div>
              <div className="w-48">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TagType)}
                  className="w-full h-full bg-black/50 border border-white/10 rounded-xl px-4 text-white focus:border-white focus:outline-none transition-colors appearance-none"
                >
                  <option value="project">Project</option>
                  <option value="blog">Blog</option>
                  <option value="photo">Photo</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={adding || !newTag.trim()}
                className="px-6 bg-white text-dark-bg font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {adding ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Plus size={20} />
                )}
                Add Tag
              </button>
            </div>
            <p className="text-sm text-dark-text-secondary">
              Adding tag to:{" "}
              <span className="text-white font-medium capitalize">
                {selectedType}
              </span>
            </p>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "project", "blog", "photo"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                filterType === type
                  ? "bg-white text-dark-bg border-white"
                  : "bg-white/5 text-dark-text-secondary border-white/10 hover:border-white/30"
              }`}
            >
              <span className="capitalize">{type}</span>
            </button>
          ))}
        </div>

        {/* Tag List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-white" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center justify-between p-4 bg-[#1a1a1a]/60 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-dark-text-secondary border border-white/10 capitalize">
                    {tag.type}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="p-2 text-dark-text-secondary hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {filteredTags.length === 0 && (
              <div className="col-span-full text-center py-12 text-dark-text-secondary">
                No tags found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
