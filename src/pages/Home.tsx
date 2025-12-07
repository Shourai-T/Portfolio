import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, ArrowRight, Code, Briefcase, BookOpen, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useRouter } from '../contexts/RouterContext';
import { ParticleBackground } from '../components/ParticleBackground';

export function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const { navigate } = useRouter();

  useEffect(() => {
    async function loadData() {
      const [projectsRes, postsRes, photosRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .order('order_index')
          .limit(4),
        supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('photos')
          .select('*')
          .eq('featured', true)
          .order('order_index')
          .limit(6),
      ]);

      if (projectsRes.data) setFeaturedProjects(projectsRes.data);
      if (postsRes.data) setRecentPosts(postsRes.data);
      if (photosRes.data) setRecentPhotos(photosRes.data);
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <ParticleBackground />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-40" />

        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animate-blob-delay-1" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animate-blob-delay-2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="space-y-8">
            <div className="inline-block mb-6">
              <div className="relative w-40 h-40 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-full blur-2xl opacity-75 animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                  NAT
                </div>
              </div>
            </div>

            <div className="space-y-4 animate-float">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">
                <span className="gradient-text">Nguyễn Anh Tuấn</span>
              </h1>

              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="text-purple-600" size={24} />
                <p className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Full Stack Developer & Creative Technologist
                </p>
              </div>

              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transforming ideas into elegant digital solutions. Passionate about building scalable
                applications with modern technologies and delivering exceptional user experiences.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:scale-125 transition-all duration-300 border border-white/20"
              >
                <Github size={24} className="text-gray-800" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:scale-125 transition-all duration-300 border border-white/20"
              >
                <Linkedin size={24} className="text-blue-600" />
              </a>
              <button
                onClick={() => navigate('contact')}
                className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:shadow-xl hover:scale-125 transition-all duration-300 border border-white/20"
              >
                <Mail size={24} className="text-pink-600" />
              </button>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('projects')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 shadow-xl flex items-center space-x-2 hover:scale-105"
              >
                <span>View My Work</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => navigate('contact')}
                className="px-8 py-4 bg-white/90 backdrop-blur-md text-gray-800 rounded-xl font-semibold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-white/50"
              >
                Let's Connect
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-blue-200 hover:scale-105">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Code className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Development</h3>
            <p className="text-gray-700 leading-relaxed">
              Building robust and scalable applications with modern frameworks and best practices.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-green-200 hover:scale-105">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Briefcase className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Experience</h3>
            <p className="text-gray-700 leading-relaxed">
              Years of professional experience delivering high-quality solutions for clients worldwide.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-purple-200 hover:scale-105">
            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <BookOpen className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Learning</h3>
            <p className="text-gray-700 leading-relaxed">
              Continuously exploring new technologies and sharing knowledge through blog posts.
            </p>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Featured Projects</h2>
              <p className="text-gray-600 mt-2">Showcase of my best work and creative solutions</p>
            </div>
            <button
              onClick={() => navigate('projects')}
              className="group text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2 px-4 py-2 hover:bg-blue-50 rounded-lg transition-all"
            >
              <span>View All</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 transform"
                onClick={() => navigate('projects')}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-lg font-bold mb-1">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Latest Articles</h2>
              <p className="text-gray-600 mt-2">Thoughts and insights on web development</p>
            </div>
            <button
              onClick={() => navigate('blog')}
              className="group text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2 px-4 py-2 hover:bg-blue-50 rounded-lg transition-all"
            >
              <span>Read More</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => navigate('blog')}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 text-left group hover:scale-105 transform border border-gray-200 hover:border-blue-200"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {new Date(post.created_at).toLocaleDateString('vi-VN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.ceil(post.content.split(/\s+/).length / 200)} min read
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {recentPhotos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Photo Gallery</h2>
              <p className="text-gray-600 mt-2">A visual collection of moments and inspiration</p>
            </div>
            <button
              onClick={() => navigate('photos')}
              className="group text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2 px-4 py-2 hover:bg-blue-50 rounded-lg transition-all"
            >
              <span>View Gallery</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentPhotos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => navigate('photos')}
                className="group relative aspect-square rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-110 transform"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={photo.thumbnail_url || photo.image_url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to work together?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Start a Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
