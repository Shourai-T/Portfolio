import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { X, Plus, Save, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { useRouter } from "../../contexts/RouterContext";

interface ProjectFormData {
  title: string;
  description: string;
  slug: string;
  content: string;
  image_url: string;
  demo_url?: string;
  github_url?: string;
  tags: string[];
  featured: boolean;
  published: boolean; // Add publish toggle
}

interface ProjectFormProps {
  initialData?: any; // Could be typed strictly if we have the type exported
  mode: "create" | "edit";
}

function TagSuggestions() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("tags")
      .select("name")
      .eq("type", "project")
      .then(({ data }) => {
        if (data) setAvailableTags(data.map((t) => t.name));
      });
  }, []);

  return (
    <>
      {availableTags.map((tag) => (
        <option key={tag} value={tag} />
      ))}
    </>
  );
}

export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const { navigate } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "", // In edit mode, usually disabled or careful editing
      content: initialData?.content || "",
      image_url: initialData?.image_url || "",
      demo_url: initialData?.demo_url || "",
      github_url: initialData?.github_url || "",
      tags: initialData?.tags || [],
      featured: initialData?.featured || false,
      published: initialData?.published || false, // User requested OFF by default for new
    },
  });

  const tags = watch("tags");

  // Auto-generate slug from title if not manually edited (simple logic)
  useEffect(() => {
    if (mode === "create") {
      const subscription = watch((value, { name }) => {
        if (name === "title" && value.title) {
          setValue(
            "slug",
            value.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          );
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, setValue, mode]);

  const handleAddTag = () => {
    if (
      tagInput.trim() &&
      tags.length < 7 &&
      !tags.includes(tagInput.trim().toLowerCase())
    ) {
      setValue("tags", [...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setSubmitting(true);

      const projectData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      if (mode === "create") {
        const { error } = await supabase.from("projects").insert([projectData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", initialData.id);
        if (error) throw error;
      }

      navigate("admin-projects"); // Redirect to list page (need to ensure this route key exists)
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-4xl mx-auto pb-20"
    >
      {/* Title & Slug */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-text-secondary">
            Project Title <span className="text-white">*</span>
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all"
            placeholder="e.g. Portfolio Website"
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-text-secondary">
            Slug (URL) <span className="text-white">*</span>
          </label>
          <input
            {...register("slug", { required: "Slug is required" })}
            className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono text-sm"
            placeholder="e.g. portfolio-website"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-text-secondary">
          Cover Image <span className="text-white">*</span>
        </label>
        <Controller
          name="image_url"
          control={control}
          rules={{ required: "Cover image is required" }}
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.image_url && (
          <span className="text-red-500 text-xs">
            {errors.image_url.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-text-secondary">
          Short Description
        </label>
        <textarea
          {...register("description", { maxLength: 300 })}
          rows={3}
          className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all resize-none"
          placeholder="Brief summary of the project..."
        />
        <p className="text-xs text-dark-text-secondary text-right">
          {watch("description")?.length || 0}/300
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-text-secondary">
          Tags (Max 5)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-white"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="relative">
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-dark-hover border border-dark-border rounded-lg px-4 py-2 text-white focus:border-white outline-none"
              placeholder="Type tag and press Enter"
              disabled={tags.length >= 7}
              list="available-tags"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={tags.length >= 7}
              className="px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white hover:bg-dark-hover/80 disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </div>
          {/* Datalist for suggestions */}
          <datalist id="available-tags">
            <TagSuggestions />
          </datalist>
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-text-secondary">
          Content
        </label>
        <Controller
          name="content"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.content && (
          <span className="text-red-500 text-xs">{errors.content.message}</span>
        )}
      </div>

      {/* Links & Toggles */}
      <div className="grid md:grid-cols-2 gap-6 bg-dark-bg/50 p-6 rounded-xl border border-dark-border">
        <div className="space-y-4">
          <h3 className="text-white font-medium mb-4">External Links</h3>
          <div className="space-y-2">
            <label className="text-xs font-medium text-dark-text-secondary">
              Demo URL
            </label>
            <input
              {...register("demo_url")}
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-dark-text-secondary">
              GitHub URL
            </label>
            <input
              {...register("github_url")}
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-medium mb-4">Settings</h3>

          <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg cursor-pointer hover:bg-dark-hover/80 transition-colors">
            <span className="text-sm font-medium text-white">
              Publish Project
            </span>
            <input
              type="checkbox"
              {...register("published")}
              className="w-5 h-5 accent-white rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg cursor-pointer hover:bg-dark-hover/80 transition-colors">
            <span className="text-sm font-medium text-white">
              Feature on Home
            </span>
            <input
              type="checkbox"
              {...register("featured")}
              className="w-5 h-5 accent-white rounded"
            />
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-border">
        <button
          type="button"
          onClick={() => navigate("admin-projects")}
          className="px-6 py-2.5 rounded-lg font-medium text-dark-text-secondary hover:text-white hover:bg-dark-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-2.5 bg-white hover:bg-white/90 text-dark-bg rounded-lg font-bold shadow-lg shadow-white/10 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {mode === "create" ? "Add Project" : "Update Project"}
        </button>
      </div>
    </form>
  );
}
