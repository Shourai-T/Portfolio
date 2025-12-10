import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { useRouter } from "../contexts/RouterContext";
import { BLOG_POSTS } from "../data/blog";
import { CommentSection } from "../components/CommentSection";

export function BlogDetail({ slug }: { slug?: string }) {
  const { navigate } = useRouter();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = BLOG_POSTS.find((p) => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
      } else {
        // Handle 404 - for now just stay or redirect
        // navigate("blog");
      }
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text pb-20">
      {/* Hero Image */}
      <div className="relative">
        <div className="w-full h-64 md:h-96 relative bg-white/5 overflow-hidden">
          <img
            alt={post.title}
            className="object-cover w-full h-full absolute inset-0 text-transparent"
            src={post.cover_image}
          />
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
              <button className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5">
                <Linkedin className="h-4 w-4" />
              </button>
              <button className="backdrop-blur-sm inline-flex items-center justify-center size-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/5">
                <LinkIcon className="h-4 w-4" />
              </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto bg-dark-bg/80 backdrop-blur-md p-6 md:p-12">
              <header className="text-center mb-16 pt-4">
                <div className="text-sm text-primary uppercase tracking-widest mb-6">
                  {new Date(post.date).toLocaleDateString()}
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
                      alt={post.author}
                      className="object-cover w-full h-full"
                      src="https://github.com/shourai-t.png"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-white">
                      {post.author}
                    </div>
                    <div className="text-xs text-gray-400">
                      Author & Developer
                    </div>
                  </div>
                </div>
              </header>

              {/* Blog Post Content */}
              <article className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-p:leading-relaxed prose-a:text-primary">
                {/* 
                    Ideally we render {post.content} here as HTML. 
                    For now, creating a mock display matching the user's "Xanh" style but dynamic 
                 */}
                <div className="p-4 rounded-xl">
                  {/* Render HTML content safely if possible, or plain text */}
                  <p className="whitespace-pre-wrap">{post.excerpt}</p>
                  <br />
                  <p>{post.content}</p>
                  <hr className="border-white/10 my-8" />
                  <p className="italic text-gray-400">
                    Note: This is a demo layout. The actual content would be
                    rendered from Markdown or HTML stored in the database.
                  </p>
                </div>
              </article>

              {/* Author Footer */}
              <div className="mt-16 pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white/10 border-2 border-white/10 shadow-sm">
                      <img
                        alt={post.author}
                        className="object-cover w-full h-full"
                        src="https://github.com/shourai-t.png"
                      />
                    </div>
                    <div>
                      <div className="font-serif text-lg font-bold text-white">
                        {post.author}
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
                {/* Replaced complex comments with the shared component */}
                <CommentSection
                  initialComments={[
                    {
                      id: 1,
                      name: "Khoa Nguyen",
                      content: "Mơ một giấc mơ màu xanh",
                      timestamp: "5 days ago",
                    },
                    {
                      id: 2,
                      name: "Khoa Nguyen",
                      content: "Ng*t trở thành từ bị filter trên web của t nhé",
                      timestamp: "5 days ago",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
