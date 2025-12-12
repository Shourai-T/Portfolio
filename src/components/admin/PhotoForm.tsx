import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../lib/supabase";
import { Loader2, Save, X, Camera } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { useRouter } from "../../contexts/RouterContext";

interface PhotoFormProps {
  initialData?: any;
  mode?: "create" | "edit";
}

export function PhotoForm({ initialData, mode = "create" }: PhotoFormProps) {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Tag state
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      category: "Life", // Default category
      image_url: "",
      featured: false,
      order_index: 0,
    },
  });

  // Watch image_url to show preview or required state
  const imageUrl = watch("image_url");

  // Fetch tag suggestions
  useEffect(() => {
    fetchTagSuggestions();
  }, []);

  const fetchTagSuggestions = async () => {
    try {
      const { data } = await supabase
        .from("tags")
        .select("name")
        .eq("type", "photo")
        .order("name");
      if (data) {
        setSuggestions(data.map((t) => t.name));
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const photoData = {
        ...data,
        tags,
        updated_at: new Date().toISOString(),
      };

      if (mode === "create") {
        const { error } = await supabase.from("photos").insert([photoData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("photos")
          .update(photoData)
          .eq("id", initialData.id);
        if (error) throw error;
      }

      // Save new tags to tags table
      for (const tag of tags) {
        if (!suggestions.includes(tag)) {
          await supabase.from("tags").insert({ name: tag, type: "photo" });
        }
      }

      navigate("admin-photos");
    } catch (error) {
      console.error("Error saving photo:", error);
      alert("Failed to save photo");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image Upload */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Camera size={20} />
              Photo
            </h3>

            <ImageUpload
              value={imageUrl}
              onChange={(url: string) => setValue("image_url", url)}
              onUploading={setUploading}
            />
            {errors.image_url && (
              <p className="text-red-400 text-sm mt-2">Image is required</p>
            )}
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("featured")}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
              />
              <div>
                <span className="text-white font-medium">Featured Photo</span>
                <p className="text-dark-text-secondary text-sm">
                  Display this photo prominently in galleries
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                Title
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                placeholder="e.g. Sunset in Tokyo"
              />
              {errors.title && (
                <span className="text-red-400 text-sm">Title is required</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
              >
                <option value="Life">Life</option>
                <option value="Travel">Travel</option>
                <option value="Code">Code</option>
                <option value="Setup">Setup</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                placeholder="Story behind the photo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                list="tag-suggestions"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                placeholder="Type tag and press Enter"
              />
              <datalist id="tag-suggestions">
                {suggestions.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate("admin-photos")}
              className="px-6 py-2 text-dark-text-secondary hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center gap-2 px-6 py-2 bg-white text-dark-bg font-bold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
