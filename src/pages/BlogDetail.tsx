import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "../contexts/RouterContext";
import { supabase } from "../lib/supabase";
import { CommentSection } from "../components/CommentSection";

export function BlogDetail({ slug }: { slug?: string }) {
  const { navigate } = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        // navigate("blog"); // Optional: redirect on error
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  /* Share Handlers */
  const [showToast, setShowToast] = useState(false);

  const handleShare = (platform: "facebook" | "twitter" | "linkedin") => {
    // Construct the canonical URL (excluding query params which might confuse trackers)
    const currentUrl = window.location.origin + window.location.pathname;
    const url = encodeURIComponent(currentUrl);
    const text = encodeURIComponent(
      post?.title || "Check out this amazing post!"
    );

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        // Using the feed share URL which is often more reliable
        shareUrl = `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${url}`;
        break;
    }

    // Open in a new window/popup
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.origin + window.location.pathname;
      await navigator.clipboard.writeText(currentUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <button
          onClick={() => navigate("blog")}
          className="px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text pb-20 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-white text-black px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-medium">
            <LinkIcon size={18} />
            Link copied to clipboard
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative">
        <div className="w-full h-64 md:h-96 relative bg-white/5 overflow-hidden">
          {post.cover_image && (
            <img
              alt={post.title}
              className="object-cover w-full h-full absolute inset-0"
              src={post.cover_image}
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 relative overflow-x-hidden ">
          {/* Back Button */}
          <div className="max-w-6xl mx-auto mb-8">
            <button
              onClick={() => navigate("blog")}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto pt-12">
            {/* Sidebar Share Buttons (Desktop) */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit w-12 items-center pt-8">
              <div
                className="text-xs font-medium text-gray-400 mb-2"
                style={{ writingMode: "vertical-rl" }}
              >
                SHARE
              </div>
              <button
                onClick={() => handleShare("facebook")}
                className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
              >
                <Facebook className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
              >
                <Linkedin className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto bg-dark-bg/80 backdrop-blur-md p-6 md:p-12">
              <header className="text-center mb-16 pt-4">
                <div className="text-sm text-primary uppercase tracking-widest mb-6">
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white font-serif">
                  {post.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center justify-center border text-xs font-medium rounded-full px-4 py-1 bg-white/10 text-white border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/10">
                    <img
                      alt="Author"
                      className="object-cover w-full h-full"
                      src="https://github.com/shourai-t.png"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-white">
                      Shourai
                    </div>
                    <div className="text-xs text-gray-400">
                      Author & Developer
                    </div>
                  </div>
                </div>
              </header>

              {/* Blog Post Content */}
              <article className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-p:leading-relaxed prose-a:text-primary">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Author Footer */}
              <div className="mt-16 pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/10 border-2 border-white/10 shadow-sm">
                      <img
                        alt="Author"
                        className="object-cover w-full h-full"
                        src="https://github.com/shourai-t.png"
                      />
                    </div>
                    <div>
                      <div className="font-serif text-lg font-bold text-white">
                        Shourai
                      </div>
                      <div className="text-sm text-gray-400">
                        Author & Developer
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-16">
                <CommentSection projectId={post.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
