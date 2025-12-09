import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { HeroSection } from "../components/home/HeroSection";
import { RecentBlogSection } from "../components/home/RecentBlogSection";
import { FeaturedProjectsSection } from "../components/home/FeaturedProjectsSection";
import { OpenSourceSection } from "../components/home/OpenSourceSection";
import { LocketGallerySection } from "../components/home/LocketGallerySection";

// Mock data
const MOCK_FEATURED_PROJECTS = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with React, Node.js, and PostgreSQL",
    image_url:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
    tech_stack: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: 2,
    title: "Mobile Banking App",
    description: "Secure mobile banking application",
    image_url:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    tech_stack: ["React Native"],
  },
  {
    id: 3,
    title: "Social Media Dashboard",
    description: "Analytics dashboard for social media",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    tech_stack: ["Vue.js"],
  },
  {
    id: 4,
    title: "Task Management Tool",
    description: "Collaborative task management system",
    image_url:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    tech_stack: ["Angular"],
  },
  {
    id: 5,
    title: "Weather Forecast App",
    description: "Real-time weather tracking application",
    image_url:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
    tech_stack: ["React"],
  },
];

const MOCK_RECENT_POSTS = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    excerpt:
      "Learn how to use React Hooks to build powerful functional components with state and side effects.",
    cover_image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    created_at: "2024-12-01T10:00:00Z",
  },
  {
    id: 2,
    title: "TypeScript Best Practices",
    excerpt:
      "Discover essential TypeScript patterns and practices to write type-safe, maintainable code.",
    cover_image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    created_at: "2024-11-28T10:00:00Z",
  },
  {
    id: 3,
    title: "Building Scalable APIs",
    excerpt:
      "A comprehensive guide to designing and building RESTful APIs that can scale with your application.",
    cover_image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    created_at: "2024-11-25T10:00:00Z",
  },
];

const MOCK_RECENT_PHOTOS = [
  {
    id: 1,
    title: "Mountain Landscape",
    image_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800",
    thumbnail_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600",
  },
  {
    id: 2,
    title: "City Lights",
    image_url:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400",
    thumbnail_url:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300",
  },
  {
    id: 3,
    title: "Ocean Waves",
    image_url:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=900",
    thumbnail_url:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=600",
  },
  {
    id: 4,
    title: "Forest Path",
    image_url:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=600",
    thumbnail_url:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=400",
  },
  {
    id: 5,
    title: "Desert Dunes",
    image_url:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&h=750",
    thumbnail_url:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=500",
  },
  {
    id: 6,
    title: "Northern Lights",
    image_url:
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=600&h=500",
    thumbnail_url:
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=400&h=350",
  },
];

const MOCK_OPEN_SOURCE_PROJECTS = [
  {
    id: 1,
    title: "react-components-lib",
    description:
      "A collection of reusable React components for modern web applications",
    tech_stack: ["TypeScript"],
  },
  {
    id: 2,
    title: "api-gateway",
    description:
      "Lightweight API gateway with rate limiting and authentication",
    tech_stack: ["Node.js"],
  },
  {
    id: 3,
    title: "css-animations",
    description: "Beautiful CSS animations and transitions library",
    tech_stack: ["CSS"],
  },
  {
    id: 4,
    title: "data-visualizer",
    description: "Interactive data visualization toolkit built with D3.js",
    tech_stack: ["JavaScript"],
  },
];

export function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>(
    MOCK_FEATURED_PROJECTS
  );
  const [recentPosts, setRecentPosts] = useState<any[]>(MOCK_RECENT_POSTS);
  const [recentPhotos, setRecentPhotos] = useState<any[]>(MOCK_RECENT_PHOTOS);
  const [openSourceProjects, setOpenSourceProjects] = useState<any[]>(
    MOCK_OPEN_SOURCE_PROJECTS
  );

  useEffect(() => {
    async function loadData() {
      const [projectsRes, postsRes, photosRes, openSourceRes] =
        await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .eq("featured", true)
            .order("order_index")
            .limit(5),
          supabase
            .from("blog_posts")
            .select("*")
            .eq("published", true)
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("photos")
            .select("*")
            .eq("featured", true)
            .order("order_index")
            .limit(6),
          supabase
            .from("projects")
            .select("*")
            .eq("featured", false)
            .order("created_at", { ascending: false })
            .limit(4),
        ]);

      // Only override mock data if real data exists
      if (projectsRes.data && projectsRes.data.length > 0)
        setFeaturedProjects(projectsRes.data);
      if (postsRes.data && postsRes.data.length > 0)
        setRecentPosts(postsRes.data);
      if (photosRes.data && photosRes.data.length > 0)
        setRecentPhotos(photosRes.data);
      if (openSourceRes.data && openSourceRes.data.length > 0)
        setOpenSourceProjects(openSourceRes.data);
    }

    loadData();
  }, []);

  return (
    <div className="bg-dark-bg">
      <HeroSection />
      <RecentBlogSection posts={recentPosts} />
      <FeaturedProjectsSection projects={featuredProjects} />
      <OpenSourceSection projects={openSourceProjects} />
      <LocketGallerySection photos={recentPhotos} />

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32 bg-dark-bg">
        <div className="bg-white rounded-3xl shadow-2xl p-12 md:p-16 text-center text-dark-bg relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to work together?
            </h2>
            <p className="text-lg text-dark-bg/80 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas, or
              opportunities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
