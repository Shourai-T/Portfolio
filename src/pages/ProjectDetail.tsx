import { useState } from "react";
import { ArrowLeft, Github, ExternalLink, MessageCircle } from "lucide-react";
import { useRouter } from "../contexts/RouterContext";

interface Comment {
  id: number;
  name: string;
  content: string;
  timestamp: string;
}

export function ProjectDetail({
  projectId: _projectId,
}: {
  projectId: string;
}) {
  const { navigate } = useRouter();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Nguyen Van A",
      content: "This project is amazing! Love the design and functionality.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      name: "Tran Thi B",
      content: "Great work! Can you share more about the tech stack?",
      timestamp: "1 day ago",
    },
  ]);

  const [commentForm, setCommentForm] = useState({
    name: "",
    content: "",
  });

  // Mock project data
  const project = {
    id: 1,
    title: "Portfolio Website",
    description:
      "A modern portfolio website built with React, TypeScript, and Tailwind CSS featuring dark theme and smooth animations.",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
    tags: ["Next.js", "Frontend", "Tools", "React", "TypeScript"],
    demo_url: "https://example.com",
    github_url: "https://github.com/example/portfolio",
    featured: true,
    content: `
## Project Overview

This portfolio website is built with modern web technologies to showcase my work and skills. The design focuses on simplicity, elegance, and user experience.

### Key Features

- **Dark Theme**: Beautiful dark mode with custom color palette
- **Responsive Design**: Fully responsive on all devices (mobile, tablet, desktop)
- **Smooth Animations**: Subtle animations for better user experience
- **Performance**: Optimized for fast loading and smooth interactions
- **SEO Friendly**: Proper meta tags and structured data

### Technology Stack

The project uses the following technologies:

1. **Frontend**: React 18, TypeScript, Tailwind CSS
2. **Build Tool**: Vite
3. **Deployment**: Vercel
4. **Backend**: Supabase for database and auth
5. **APIs**: RESTful API integration

### Design Approach

The design philosophy emphasizes:

- **Minimalism**: Clean, uncluttered interface
- **Dark Mode**: Easy on the eyes, modern aesthetic
- **Accessibility**: WCAG compliant color contrasts
- **Performance**: Fast page loads and smooth interactions

### Challenges & Solutions

**Challenge 1**: Implementing dark theme across entire app
- **Solution**: Custom Tailwind CSS color configuration with CSS variables

**Challenge 2**: Smooth page transitions
- **Solution**: React Context for routing with scroll-to-top animation

**Challenge 3**: Mobile responsiveness
- **Solution**: Mobile-first approach with Tailwind breakpoints

### Future Improvements

- Add blog section with markdown support
- Implement dark/light theme toggle
- Add more interactive components
- Performance optimization with code splitting
- Add analytics tracking

### Conclusion

This portfolio project demonstrates my ability to create modern, responsive web applications with clean code and great user experience. Feel free to explore the code on GitHub and visit the live demo!
    `,
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentForm.name.trim() && commentForm.content.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        name: commentForm.name,
        content: commentForm.content,
        timestamp: "just now",
      };
      setComments([newComment, ...comments]);
      setCommentForm({ name: "", content: "" });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("projects")}
          className="inline-flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>

        {/* 1️⃣ HERO SECTION — IMAGE + BASIC INFO */}
        <div className="mb-12">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-2xl border border-white/10 mb-8"
          />

          {/* 2️⃣ TITLE + DESCRIPTION */}
          <div className="mb-8 flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-bold text-dark-text mb-4">
              {project.title}
            </h1>
            <p
              className="text-lg leading-relaxed max-w-2xl text-center"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {project.description}
            </p>
          </div>

          {/* 3️⃣ ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-dark-bg font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-102 shadow-lg"
              >
                <ExternalLink size={20} />
                Live Demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all hover:scale-102 border border-white/20"
              >
                <Github size={20} />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* 4️⃣ DIVIDER 1 */}
        <div
          className="mb-12"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        />

        {/* 5️⃣ TAGS SECTION */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-dark-text mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {project.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 hover:border-white/40 transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 6️⃣ DIVIDER 2 */}
        <div
          className="mb-12"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        />

        {/* 7️⃣ PROJECT CONTENT */}
        <div className="mb-12 prose prose-invert max-w-none">
          <div
            className="max-w-2xl"
            style={{
              lineHeight: "1.7",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {project.content.split("\n\n").map((paragraph, idx) => {
              // Handle headings
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="text-3xl font-bold text-dark-text mt-8 mb-4"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-2xl font-bold text-dark-text mt-6 mb-3"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }

              // Handle bullet lists
              if (paragraph.startsWith("- ")) {
                const items = paragraph
                  .split("\n")
                  .filter((line) => line.startsWith("- "));
                return (
                  <ul
                    key={idx}
                    className="list-disc list-inside space-y-2 mb-4"
                  >
                    {items.map((item, i) => (
                      <li key={i}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }

              // Handle numbered lists
              if (paragraph.match(/^\d+\./)) {
                const items = paragraph
                  .split("\n")
                  .filter((line) => line.match(/^\d+\./));
                return (
                  <ol
                    key={idx}
                    className="list-decimal list-inside space-y-2 mb-4"
                  >
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                  </ol>
                );
              }

              // Regular paragraph
              return (
                <p key={idx} className="mb-5">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* 8️⃣ DIVIDER 3 */}
        <div
          className="mb-12"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        />

        {/* 9️⃣ COMMENT SECTION */}
        <section className=" w-full">
          {/* 9.1 Section title */}
          <div className="flex items-center gap-2 mb-8">
            <MessageCircle size={28} className="text-dark-text" />
            <h2 className="text-3xl font-bold text-dark-text">
              Comments ({comments.length})
            </h2>
          </div>

          {/* 9.2 Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={commentForm.name}
                  onChange={(e) =>
                    setCommentForm({ ...commentForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 text-dark-text rounded-xl border border-white/10 focus:border-white/30 focus:outline-none transition-colors placeholder:text-dark-text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Write your comment
                </label>
                <textarea
                  placeholder="Share your thoughts..."
                  value={commentForm.content}
                  onChange={(e) =>
                    setCommentForm({ ...commentForm, content: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 text-dark-text rounded-xl border border-white/10 focus:border-white/30 focus:outline-none transition-colors placeholder:text-dark-text-secondary resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-white text-dark-bg font-semibold rounded-full hover:bg-white/90 transition-all hover:scale-102 shadow-lg"
            >
              Post Comment
            </button>
          </form>

          {/* 9.3 Comment List */}
          {comments.length > 0 && (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <div className="mb-2">
                    <h4 className="text-lg font-bold text-dark-text">
                      {comment.name}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {comment.timestamp}
                    </p>
                  </div>
                  <p
                    className="leading-relaxed mb-4"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {comment.content}
                  </p>
                  <div
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
