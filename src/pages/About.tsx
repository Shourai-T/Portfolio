import { useEffect, useState } from "react";
import { ParticleBackground } from "../components/ParticleBackground";
import { supabase } from "../lib/supabase";
import {
  Github,
  Linkedin,
  Facebook,
  Mail,
  Instagram,
  GraduationCap,
  Briefcase,
  Code2,
} from "lucide-react";
import { Loader2 } from "lucide-react";

export function About() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [educations, setEducations] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: profileData } = await supabase
        .from("profile")
        .select("*")
        .single();
      const { data: educationsData } = await supabase
        .from("educations")
        .select("*")
        .order("start_date", { ascending: false });
      const { data: experiencesData } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });
      const { data: skillsData } = await supabase
        .from("technical_skills")
        .select("*")
        .order("order_index")
        .order("proficiency", { ascending: false });

      if (profileData) setProfile(profileData);
      if (educationsData) setEducations(educationsData);
      if (experiencesData) setExperiences(experiencesData);
      if (skillsData) setSkills(skillsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  const social = profile?.social_links || {};

  // Group skills by category
  const groupedSkills = skills.reduce((acc: any, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-bg py-12 relative overflow-hidden">
      <ParticleBackground />

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <div className="relative w-48 h-48 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <img
              alt="Profile"
              className="object-cover rounded-full border-4 border-dark-border shadow-xl w-full h-full"
              src={profile?.avatar_url || "https://github.com/shourai-t.png"}
            />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              {profile?.full_name}
            </h1>
            <p className="text-xl text-dark-text-secondary">{profile?.role}</p>

            <div className="flex items-center justify-center gap-4 mt-4">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-dark-text-secondary hover:text-white"
                >
                  <Github size={24} />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-dark-text-secondary hover:text-white"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-dark-text-secondary hover:text-white"
                >
                  <Facebook size={24} />
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-dark-text-secondary hover:text-white"
                >
                  <Mail size={24} />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-dark-text-secondary hover:text-white"
                >
                  <Instagram size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section - Rich Text */}
        <div className="mb-16">
          <div
            className="prose prose-invert max-w-none text-lg leading-relaxed text-dark-text-secondary font-medium"
            dangerouslySetInnerHTML={{ __html: profile?.about_content || "" }}
          />
        </div>

        {/* Timeline Grid (Education & Experience) */}
        <div className="grid md:grid-cols-2 gap-12 pt-12 mb-16">
          {/* Education */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                <GraduationCap className="h-6 w-6" />
              </span>
              Education
            </h3>
            <div className="relative border-l-2 border-dark-border pl-8 space-y-10">
              {educations.map((item, index) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[41px] w-4 h-4 bg-dark-bg border-2 border-primary rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm text-primary font-mono bg-primary/5 px-2 py-1 rounded inline-block mb-2">
                    {item.start_date} - {item.end_date}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    {item.school}
                  </h4>
                  <p className="text-dark-text-secondary font-medium">
                    {item.major} {item.degree ? ` - ${item.degree}` : ""}
                  </p>
                  <p className="text-sm mt-2 text-dark-text-secondary/80">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                <Briefcase className="h-6 w-6" />
              </span>
              Experience
            </h3>
            <div className="relative border-l-2 border-dark-border pl-8 space-y-10">
              {experiences.map((item, index) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-[41px] w-4 h-4 bg-dark-bg border-2 border-primary rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm text-primary font-mono bg-primary/5 px-2 py-1 rounded inline-block mb-2">
                    {item.start_date} - {item.end_date}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    {item.company}
                  </h4>
                  <p className="text-dark-text-secondary font-medium">
                    {item.position}
                  </p>
                  <p className="text-sm mt-2 text-dark-text-secondary/80">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="pt-8 space-y-12">
          <h3 className="text-3xl font-bold text-center text-white">
            Tech Stack &amp; Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(groupedSkills).map((category) => (
              <div
                key={category}
                className="group bg-[#1a1a1a] p-6 rounded-xl border border-dark-border hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[#252525]"
              >
                <h4 className="text-lg font-bold mb-6 text-white border-dark-border pb-2">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {groupedSkills[category].map((skill: any) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 text-dark-text-secondary rounded-lg text-sm font-medium transition-all hover:bg-white/10 hover:text-white hover:scale-105 cursor-default"
                    >
                      <Code2 className="h-4 w-4 text-primary" />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
