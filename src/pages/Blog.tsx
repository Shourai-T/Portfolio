import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useRouter } from "../contexts/RouterContext";
import { supabase } from "../lib/supabase";
import { ParticleBackground } from "../components/ParticleBackground";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { BLOG_POSTS } from "../data/blog";

export function Blog() {
  const { navigate } = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if any filter is active
  const isFiltered = selectedTag !== "All" || searchQuery.trim() !== "";

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      // Use mock data if no db data or for dev demonstration
      const initialPosts = data && data.length > 0 ? data : BLOG_POSTS;

      setPosts(initialPosts);
      setFilteredPosts(initialPosts);

      const uniqueTags = new Set<string>();
      initialPosts.forEach((post: any) => {
        post.tags?.forEach((tag: string) => uniqueTags.add(tag));
      });
      const sortedTags = Array.from(uniqueTags).sort();
      setAllTags(["All", ...sortedTags]);

      setLoading(false);
    }

    loadPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedTag !== "All") {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [selectedTag, searchQuery, posts]);

  const formatDate = (dateString: string) => {
    // If it's a mock date (YYYY-MM-DD), simplify formatting
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  // Sections Logic
  // Recent: First 3 posts (Index 0, 1, 2)
  const recentPosts = posts.slice(0, 3);
  // All/Remaining: Index 3+ if not filtered; else all filtered results
  const displayPosts = isFiltered ? filteredPosts : posts.slice(3);

  return (
    <div className="min-h-screen bg-dark-bg py-12 text-dark-text">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1️⃣ HEADER SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-sm font-medium text-primary uppercase tracking-wider mb-4 text-white">
            Blog
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-serif text-dark-text mb-6">
            Writing & Thoughts
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology,
            and life
          </p>
        </div>

        {/* 2️⃣ SEARCH & FILTER */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <div className="w-full max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search articles..."
            />
          </div>
          {allTags.length > 0 && (
            <FilterBar
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-dark-text-secondary">
            Loading...
          </div>
        ) : (
          <>
            {/* 3️⃣ RECENT POSTS SECTION (Only when NOT filtered) */}
            {!isFiltered && recentPosts.length > 0 && (
              <section className="mb-20 animate-fade-in">
                <h3 className="text-3xl font-bold text-dark-text mb-8 border-l-4 border-white pl-4">
                  Recent Posts
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Column 1: Big Card */}
                  <div
                    className="lg:col-span-7 group cursor-pointer"
                    onClick={() => navigate("blog-detail", recentPosts[0].slug)}
                  >
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl mb-6">
                      <img
                        src={recentPosts[0].cover_image}
                        alt={recentPosts[0].title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="font-semibold text-white">
                          {recentPosts[0].author || "Unknown"}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDate(
                            recentPosts[0].date || recentPosts[0].created_at
                          )}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
                        {recentPosts[0].title}
                      </h2>

                      <p className="text-gray-400 line-clamp-2 text-lg">
                        {recentPosts[0].excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {recentPosts[0].tags?.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-white/10 text-xs font-medium text-white rounded-full border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 2: 2 Small Cards */}
                  <div className="lg:col-span-5 flex flex-col gap-8">
                    {recentPosts.slice(1, 3).map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-col sm:flex-row gap-5 group cursor-pointer"
                        onClick={() => navigate("blog-detail", post.slug)}
                      >
                        <div className="sm:w-[180px] relative aspect-[4/3] sm:aspect-square flex-shrink-0 overflow-hidden rounded-xl bg-white/5">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                        </div>

                        <div className="flex flex-col justify-center gap-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-medium text-white">
                              {post.author || "User"}
                            </span>
                            <span>•</span>
                            <span>
                              {formatDate(post.date || post.created_at)}
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-white group-hover:text-primary leading-snug">
                            {post.title}
                          </h4>

                          <p className="text-sm text-gray-400 line-clamp-2">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {post.tags?.slice(0, 2).map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-300 rounded-full border border-white/5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 4️⃣ ALL BLOG POSTS SECTION */}
            <section>
              <h3 className="text-3xl font-bold text-dark-text mb-8 border-l-4 border-white pl-4">
                {isFiltered ? "Search Results" : "All Blog Posts"}
              </h3>

              {displayPosts.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-gray-400">
                    No posts found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {displayPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group cursor-pointer flex flex-col gap-4"
                      onClick={() => navigate("blog-detail", post.slug)}
                    >
                      {/* Image */}
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl mb-4">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      </div>

                      {/* Content */}
                      <div className="space-y-4 max-w-4xl">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="font-semibold text-white">
                            {post.author || "User"}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDate(post.date || post.created_at)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {calculateReadTime(post.content)} min
                          </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h2>

                        <p className="text-lg text-dark-text-secondary leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {post.tags?.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-4 py-1.5 bg-white/5 text-sm font-medium text-gray-300 group-hover:text-white rounded-full border border-white/10 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
