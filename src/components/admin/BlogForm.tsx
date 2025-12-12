import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { X, Plus, Save, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { useRouter } from "../../contexts/RouterContext";
import { Database } from "../../lib/database.types";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string[];
  published: boolean;
}

interface BlogFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

function TagSuggestions() {
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("tags")
      .select("name")
      .eq("type", "blog")
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

export function BlogForm({ initialData, mode }: BlogFormProps) {
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
  } = useForm<BlogFormData>({
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      cover_image: initialData?.cover_image || "",
      tags: initialData?.tags || [],
      published: initialData?.published || false,
    },
  });

  const tags = watch("tags");

  // Auto-generate slug from title if not manually edited
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
      tags.length < 5 &&
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

  const onSubmit = async (data: BlogFormData) => {
    try {
      setSubmitting(true);

      const blogData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      if (mode === "create") {
        const { error } = await supabase.from("blog_posts").insert([blogData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .update(blogData)
          .eq("id", initialData.id);
        if (error) throw error;
      }

      navigate("admin-blog");
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Failed to save blog post");
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
            Post Title <span className="text-white">*</span>
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all"
            placeholder="e.g. My New Blog Post"
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
            placeholder="e.g. my-new-blog-post"
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-text-secondary">
          Cover Image
        </label>
        <Controller
          name="cover_image"
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-text-secondary">
          Excerpt
        </label>
        <textarea
          {...register("excerpt", { maxLength: 300 })}
          rows={3}
          className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-1 focus:ring-white outline-none transition-all resize-none"
          placeholder="Brief summary for the blog list..."
        />
        <p className="text-xs text-dark-text-secondary text-right">
          {watch("excerpt")?.length || 0}/300
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
              disabled={tags.length >= 5}
              list="blog-tags"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={tags.length >= 5}
              className="px-4 py-2 bg-dark-hover border border-dark-border rounded-lg text-white hover:bg-dark-hover/80 disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </div>
          <datalist id="blog-tags">
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

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-6 bg-dark-bg/50 p-6 rounded-xl border border-dark-border">
        <div className="space-y-4">
          <h3 className="text-white font-medium mb-4">Settings</h3>

          <label className="flex items-center justify-between p-3 bg-dark-hover rounded-lg cursor-pointer hover:bg-dark-hover/80 transition-colors">
            <span className="text-sm font-medium text-white">Publish Post</span>
            <input
              type="checkbox"
              {...register("published")}
              className="w-5 h-5 accent-white rounded"
            />
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-border">
        <button
          type="button"
          onClick={() => navigate("admin-blog")}
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
          {mode === "create" ? "Create Post" : "Update Post"}
        </button>
      </div>
    </form>
  );
}
