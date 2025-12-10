import React from "react";
import { ParticleBackground } from "../components/ParticleBackground";
import { ABOUT_DATA } from "../data/about";

export function About() {
  const { profile, education, experience, skills } = ABOUT_DATA;

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
              src={profile.avatarUrl}
            />
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              {profile.name}
            </h1>
            <p className="text-xl text-dark-text-secondary">{profile.title}</p>

            <div className="flex items-center justify-center gap-4 mt-4">
              {profile.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-dark-text-secondary hover:text-white"
                  aria-label={social.platform}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-8 text-lg leading-relaxed text-dark-text-secondary font-medium mb-16">
          <div className="whitespace-pre-wrap">{profile.bio[0]}</div>
          <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-xl text-white font-serif">
            {profile.bio[1]}
          </blockquote>
          <div className="whitespace-pre-wrap">{profile.bio[2]}</div>

          <div className="pt-8 space-y-2 text-center border-t border-dark-border mt-8">
            <p className="italic text-sm">Author of this website.</p>
            <p className="font-serif text-xl text-white font-bold pt-2">
              {profile.name}
            </p>
          </div>
        </div>

        {/* Timeline Grid (Education & Experience) */}
        <div className="grid md:grid-cols-2 gap-12 pt-12 mb-16">
          {/* Education */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
              <span className="p-2 bg-primary/10 rounded-lg text-primary">
                {education.length > 0 &&
                  (() => {
                    const Icon = education[0].icon;
                    return <Icon className="h-6 w-6" />;
                  })()}
              </span>
              Education
            </h3>
            <div className="relative border-l-2 border-dark-border pl-8 space-y-10">
              {education.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[41px] w-4 h-4 bg-dark-bg border-2 border-primary rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm text-primary font-mono bg-primary/5 px-2 py-1 rounded inline-block mb-2">
                    {item.period}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    {item.institution}
                  </h4>
                  <p className="text-dark-text-secondary font-medium">
                    {item.degree}
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
                {experience.length > 0 &&
                  (() => {
                    const Icon = experience[0].icon;
                    return <Icon className="h-6 w-6" />;
                  })()}
              </span>
              Experience
            </h3>
            <div className="relative border-l-2 border-dark-border pl-8 space-y-10">
              {experience.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[41px] w-4 h-4 bg-dark-bg border-2 border-primary rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-sm text-primary font-mono bg-primary/5 px-2 py-1 rounded inline-block mb-2">
                    {item.period}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    {item.company}
                  </h4>
                  <p className="text-dark-text-secondary font-medium">
                    {item.role}
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
            {skills.map((category) => (
              <div
                key={category.category}
                className="group bg-[#1a1a1a] p-6 rounded-xl border border-dark-border hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-[#252525]"
              >
                <h4 className="text-lg font-bold mb-6 text-white border-dark-border pb-2">
                  {category.category}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {category.items.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 text-dark-text-secondary rounded-lg text-sm font-medium transition-all hover:bg-white/10 hover:text-white hover:scale-105 cursor-default"
                    >
                      <skill.icon className="h-4 w-4 text-primary" />
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
