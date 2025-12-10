import { useEffect, useState } from "react";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface Comment {
  id: string;
  project_id: string;
  name: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  projectId: string;
}

export function CommentSection({ projectId }: CommentSectionProps) {
  const { isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: "",
    content: "",
  });

  /* Fetch Comments */
  useEffect(() => {
    fetchComments();

    // Realtime subscription
    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [payload.new as Comment, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setComments((prev) =>
              prev.filter((comment) => comment.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      // Done
    }
  };

  /* Handle Submit */
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.content.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert([
        {
          project_id: projectId,
          name: commentForm.name,
          content: commentForm.content,
        },
      ]);

      if (error) throw error;
      setCommentForm({ name: "", content: "" });
      fetchComments(); // Reload comments after submit
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Handle Delete (Admin only) */
  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <section className="w-full">
      {/* Section title */}
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle size={28} className="text-dark-text" />
        <h2 className="text-3xl font-bold text-dark-text">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Input Form */}
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
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Posting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Post Comment <Send size={18} />
            </span>
          )}
        </button>
      </form>

      {/* Comment List */}
      {comments.length > 0 && (
        <div className="space-y-6">
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
                  {formatDate(comment.created_at)}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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
  );
}
