import { useEffect, useState } from "react";
import { Calendar, Clock, Tag, Eye } from "lucide-react";
import { supabase } from "../lib/supabase";

export function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data) {
        setPosts(data);
        setFilteredPosts(data);

        const tags = new Set<string>();
        (data as any[]).forEach((post: any) => {
          post.tags?.forEach((tag: string) => tags.add(tag));
        });
        setAllTags(Array.from(tags).sort());
      }
      setLoading(false);
    }

    loadPosts();
  }, []);

  useEffect(() => {
    if (selectedTag === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.tags.includes(selectedTag)));
    }
  }, [selectedTag, posts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-4">
            Blog
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology,
            and life
          </p>
        </div>

        {allTags.length > 0 && (
          <div className="bg-dark-hover rounded-xl shadow-md p-6 mb-8 border border-dark-border">
            <div className="flex items-center space-x-3 mb-4">
              <Tag size={20} className="text-dark-text-secondary" />
              <h2 className="text-lg font-semibold text-dark-text">
                Filter by Topic
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTag === "all"
                    ? "bg-white text-dark-bg shadow-md"
                    : "bg-dark-hover text-dark-text-secondary hover:text-dark-text border border-dark-border"
                }`}
              >
                All Posts ({posts.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTag === tag
                      ? "bg-white text-dark-bg shadow-md"
                      : "bg-dark-hover text-dark-text-secondary hover:text-dark-text border border-dark-border"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 animate-pulse"
              >
                <div className="flex gap-6">
                  <div className="w-64 h-40 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-dark-text-secondary mb-4">
              <Tag size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-dark-text-secondary mb-2">
              No posts found
            </h3>
            <p className="text-dark-text-secondary">
              Try selecting a different topic
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-dark-hover rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group border border-dark-border"
              >
                <div className="flex flex-col md:flex-row">
                  {post.cover_image && (
                    <div className="md:w-72 aspect-video md:aspect-auto bg-white/20 overflow-hidden flex-shrink-0">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-dark-text-secondary mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{calculateReadTime(post.content)} min read</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye size={16} />
                        <span>{post.views} views</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-dark-text mb-3 group-hover:text-white transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-dark-text-secondary leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/10 text-white text-sm rounded-full font-medium border border-dark-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button className="text-white hover:text-white/80 font-medium flex items-center space-x-2 group/btn">
                      <span>Read More</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
