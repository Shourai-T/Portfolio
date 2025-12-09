import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Github,
  ArrowUp,
} from "lucide-react";
import { useRouter } from "../contexts/RouterContext";

export function Footer() {
  const { navigate } = useRouter();

  const exploreLinks = [
    { label: "Projects", page: "projects" as const },
    { label: "Blog", page: "blog" as const },
    { label: "Photos", page: "photos" as const },
    { label: "About Me", page: "about" as const },
    { label: "Showcase", page: "home" as const },
  ];

  const connectLinks = [
    { label: "Contact", page: "contact" as const },
    { label: "Resume", page: "resume" as const },
    { label: "Email Me", page: "contact" as const },
  ];

  const socialIcons = [
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:contact@shourai.dev",
      label: "Email",
    },
    {
      icon: Github,
      href: "https://github.com",
      label: "GitHub",
    },
  ];

  return (
    <footer className="bg-dark-bg backdrop-blur-md shadow-sm border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 mb-12">
          {/* Left Column - Branding + Socials */}
          <div className="space-y-8">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              _Shourai.dev
            </h2>

            {/* Description */}
            <p
              className="text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Full Stack Developer building beautiful web experiences. Sharing
              knowledge and journey through code.
            </p>

            {/* Social Icons */}
            <div className="flex gap-6">
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <Icon
                      size={24}
                      className="text-white group-hover:opacity-70 transition-opacity"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column - Navigation Groups */}
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {/* Explore Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Explore</h3>
              <nav className="space-y-3">
                {exploreLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.page)}
                    className="block text-sm transition-colors duration-300 hover:text-white"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Connect Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Connect</h3>
              <nav className="space-y-3">
                {connectLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.page)}
                    className="block text-sm transition-colors duration-300 hover:text-white"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-dark-border"></div>

        {/* Copyright */}
        <div
          className="pt-8 text-center text-sm"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <p>© {new Date().getFullYear()} Shourai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
