import { useState, FormEvent, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { ParticleBackground } from "../components/ParticleBackground";
import { toast } from "react-hot-toast";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from("profile").select("*").single();
      if (data) setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        read: false,
      });

      if (error) throw error;

      setStatus("success");
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error: any) {
      setStatus("error");
      toast.error(error.message || "Failed to send message. Please try again.");
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const social = profile?.social_links || {};

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1️⃣ HEADER SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-sm font-medium text-primary uppercase tracking-wider mb-4 text-white">
            Get In Touch
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-serif text-dark-text mb-6">
            Contact Me
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Have a project in mind? Let's discuss how we can work together
          </p>
        </div>

        {/* 2️⃣ CONTACT INFO SECTION */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-dark-hover rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow border border-dark-border">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-2">Email</h3>
            <a
              href={`mailto:${social.email || "anhtuannguyen112004@gmail.com"}`}
              className="text-white hover:text-white/80 break-all"
            >
              {social.email || "anhtuannguyen112004@gmail.com"}
            </a>
          </div>

          <div className="bg-dark-hover rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow border border-dark-border">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-2">Phone</h3>
            <p className="text-white">
              {/* Phone is not stored in DB currently, keep static or generic if not available */}
              +84 788713056
            </p>
          </div>

          <div className="bg-dark-hover rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-shadow border border-dark-border">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-2">Location</h3>
            <p className="text-dark-text-secondary">
              Ho Chi Minh City, Vietnam
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-hover rounded-xl shadow-md p-8 md:p-12 border border-dark-border">
            <h2 className="text-2xl font-bold text-dark-text mb-6">
              Send Me a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-dark-text mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-dark-text mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-dark-text mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Project Inquiry"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-dark-text mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-bg text-dark-text focus:ring-2 focus:ring-white focus:border-transparent transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full px-8 py-4 bg-white text-dark-bg rounded-lg font-semibold hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-dark-text-secondary">
            <p className="mb-4">Or connect with me on social media</p>
            <div className="flex items-center justify-center space-x-4">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-dark-hover rounded-full shadow-md hover:shadow-lg transition-all text-dark-text hover:text-white border border-dark-border hover:bg-dark-hover/80 hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-dark-hover rounded-full shadow-md hover:shadow-lg transition-all text-dark-text hover:text-white border border-dark-border hover:bg-dark-hover/80 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-dark-hover rounded-full shadow-md hover:shadow-lg transition-all text-dark-text hover:text-white border border-dark-border hover:bg-dark-hover/80 hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-dark-hover rounded-full shadow-md hover:shadow-lg transition-all text-dark-text hover:text-white border border-dark-border hover:bg-dark-hover/80 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-dark-hover rounded-full shadow-md hover:shadow-lg transition-all text-dark-text hover:text-white border border-dark-border hover:bg-dark-hover/80 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
