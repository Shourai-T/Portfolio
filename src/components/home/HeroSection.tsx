import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Facebook,
  FileText,
} from "lucide-react";
import { useRouter } from "../../contexts/RouterContext";
import { ParticleBackground } from "../ParticleBackground";

export function HeroSection() {
  const { navigate } = useRouter();

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-dark-bg">
      <ParticleBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl">
            <img
              src="https://github.com/shourai-t.png"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-dark-text mb-2 leading-tight">
          Nguyễn Anh Tuấn
        </h1>

        {/* Role */}
        <p className="text-xl md:text-2xl text-dark-text-secondary font-semibold mb-6">
          Fullstack Developer
        </p>

        {/* Introduction */}
        <p className="text-base md:text-lg text-dark-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
          I build beautiful, functional web applications with modern
          technologies. Passionate about creating elegant solutions and
          exceptional user experiences.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => navigate("projects")}
            className="group px-8 py-4 bg-white text-dark-bg rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 shadow-xl flex items-center space-x-2 hover:scale-105 hover:bg-white/90"
          >
            <span>View My Work</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-2 transition-transform"
            />
          </button>
          <button
            onClick={() => navigate("contact")}
            className="px-8 py-4 bg-dark-hover backdrop-blur-md text-dark-text rounded-xl font-semibold hover:bg-dark-hover transition-all duration-300 shadow-lg hover:shadow-xl border border-dark-border"
          >
            Let's Connect
          </button>
        </div>

        {/* Social Icons - No Background */}
        <div className="flex justify-center gap-8">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Github
              size={28}
              className="text-dark-text-secondary group-hover:text-white transition-colors duration-300"
            />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Linkedin
              size={28}
              className="text-dark-text-secondary group-hover:text-white transition-colors duration-300"
            />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Facebook
              size={28}
              className="text-dark-text-secondary group-hover:text-white transition-colors duration-300"
            />
          </a>
          <button onClick={() => navigate("contact")} className="group">
            <Mail
              size={28}
              className="text-dark-text-secondary group-hover:text-white transition-colors duration-300"
            />
          </button>
          <button onClick={() => navigate("resume")} className="group">
            <FileText
              size={28}
              className="text-dark-text-secondary group-hover:text-white transition-colors duration-300"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
