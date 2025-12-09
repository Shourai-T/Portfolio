import { ArrowRight } from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";

interface RecentBlogProps {
  posts: any[];
}

export function RecentBlogSection({ posts }: RecentBlogProps) {
  const { navigate } = useRouter();

  if (posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-dark-text">Recent Blog</h2>
        <button
          onClick={() => navigate("blog")}
          className="group text-white hover:text-white/80 font-semibold flex items-center space-x-2"
        >
          <span>View all</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => navigate("blog")}
            className="group text-left transition-all duration-300"
          >
            {post.cover_image && (
              <div className="aspect-video bg-white/10 rounded-xl overflow-hidden mb-4">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="text-sm text-dark-text-secondary">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                —{" "}
                {Math.ceil(
                  (Date.now() - new Date(post.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days ago
              </div>

              <h3 className="text-xl font-bold text-dark-text group-hover:text-white transition-colors">
                {post.title}
              </h3>

              <p className="text-dark-text-secondary line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
