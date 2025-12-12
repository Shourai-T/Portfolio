import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  EyeOff,
  Loader2,
  Search,
  BookOpen,
  Calendar,
  Eye,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "../../contexts/RouterContext";
import { ParticleBackground } from "../../components/ParticleBackground";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  views: number;
  created_at: string;
}

export function BlogList() {
  const { navigate } = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const filteredPosts = posts.filter((p) =>
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
              Manage Blog
            </h2>
            <p className="text-lg text-dark-text-secondary">
              Write, edit, and publish your thoughts and tutorials.
            </p>
          </div>

          <button
            onClick={() => navigate("admin-blog-new")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-dark-bg hover:bg-white/90 rounded-full font-bold shadow-lg transition-all hover:scale-105"
          >
            <Plus size={20} />
            Write Post
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
            placeholder="Search posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-2xl text-white outline-none focus:border-white/30 transition-colors backdrop-blur-sm shadow-xl"
          />
        </div>

        {/* Blog Post Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-4">
              <BookOpen size={32} className="text-dark-text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No posts found
            </h3>
            <p className="text-dark-text-secondary">
              Get started by writing your first blog post.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => navigate("admin-blog-edit", post.id)}
                className="group flex flex-col h-full bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Image */}
                <div className="aspect-[3/2] relative overflow-hidden bg-white/5">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-text-secondary">
                      <BookOpen size={48} opacity={0.2} />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg border ${
                        post.published
                          ? "bg-white text-dark-bg border-white"
                          : "bg-black/50 text-white border-white/20"
                      }`}
                    >
                      {post.published ? (
                        <>
                          <Globe size={12} /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> Draft
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-dark-text-secondary mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.views || 0}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-dark-text-secondary text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt || "No excerpt..."}
                  </p>

                  {/* Tags & Actions */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div className="flex gap-2 overflow-hidden items-center">
                      <span className="text-xs font-medium text-dark-text-secondary bg-white/5 px-2 py-1 rounded">
                        {post.tags?.[0] || "No Tag"}
                      </span>
                      {post.tags && post.tags.length > 1 && (
                        <span className="text-xs text-dark-text-secondary">
                          +{post.tags.length - 1}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("admin-blog-edit", post.id);
                        }}
                        className="p-2 text-dark-text-secondary hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(post.id, e)}
                        className="p-2 text-dark-text-secondary hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
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
