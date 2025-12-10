import {
  LogOut,
  LayoutDashboard,
  FileText,
  Image,
  Briefcase,
  MessageSquare,
  Tag,
} from "lucide-react";
import { useRouter } from "../contexts/RouterContext";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { ParticleBackground } from "../components/ParticleBackground";
import { supabase } from "../lib/supabase";

interface DashboardStats {
  projects: number;
  blogs: number;
  photos: number;
  messages: number;
}

export function Admin() {
  const { navigate } = useRouter();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    blogs: 0,
    photos: 0,
    messages: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("login");
    } else if (!authLoading && !isAdmin) {
      navigate("home");
    } else if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      const [
        { count: projectsCount },
        { count: blogsCount },
        { count: photosCount },
        { count: messagesCount },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("photos").select("*", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true }),
      ]);

      setStats({
        projects: projectsCount || 0,
        blogs: blogsCount || 0,
        photos: photosCount || 0,
        messages: messagesCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("login");
  };

  if (authLoading)
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (!isAdmin) return null;

  const cards = [
    {
      title: "Projects",
      count: stats.projects,
      icon: Briefcase,
      color: "text-white",
      bg: "bg-dark-hover",
      desc: "Total Projects",
    },
    {
      title: "Blog Posts",
      count: stats.blogs,
      icon: FileText,
      color: "text-white",
      bg: "bg-dark-hover",
      desc: "Published Articles",
    },
    {
      title: "Photos",
      count: stats.photos,
      icon: Image,
      color: "text-white",
      bg: "bg-dark-hover",
      desc: "Gallery Images",
    },
    {
      title: "Comments",
      count: stats.messages,
      icon: MessageSquare,
      color: "text-white",
      bg: "bg-dark-hover",
      desc: "Contact Messages",
    },
    {
      title: "Tags",
      count: 0, // We could fetch this too but leaving 0 is fine or we can omit count
      icon: Tag,
      color: "text-white",
      bg: "bg-dark-hover",
      desc: "Manage Filters",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white relative">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-dark-border pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <LayoutDashboard className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
              <p className="text-dark-text-secondary text-sm">
                Overview of your portfolio
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-dark-text-secondary hover:text-white bg-dark-hover hover:bg-dark-hover/80 rounded-lg transition-colors border border-dark-border"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => {
                if (index === 0) navigate("admin-projects");
                if (card.title === "Tags") navigate("admin-tags");
              }}
              className={`bg-dark-bg backdrop-blur-md border border-dark-border p-6 rounded-2xl hover:border-white/50 transition-all hover:-translate-y-1 hover:shadow-xl group ${
                index === 0 || card.title === "Tags" ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 ${card.bg} rounded-xl group-hover:scale-110 transition-transform`}
                >
                  <card.icon className={`${card.color} w-6 h-6`} />
                </div>
                {loadingStats ? (
                  <div className="h-8 w-16 bg-dark-hover animate-pulse rounded"></div>
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {card.count}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-dark-text">{card.title}</h3>
              <p className="text-dark-text-secondary text-xs mt-1">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="bg-dark-bg backdrop-blur-md border border-dark-border rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-white rounded-full"></span>
            Recent Activity
          </h2>
          <div className="text-center py-12 text-dark-text-secondary border-2 border-dashed border-dark-border rounded-xl">
            <p>No recent activity logs available yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
