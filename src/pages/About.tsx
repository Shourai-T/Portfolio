import { Code2, Palette, Zap, Award, Heart, Target, Users, BookOpen } from 'lucide-react';

export function About() {
  const skills = [
    { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vue.js'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'] },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma', 'VS Code'] },
    { category: 'Soft Skills', items: ['Problem Solving', 'Team Work', 'Communication', 'Leadership'] },
  ];

  const experiences = [
    {
      role: 'Senior Full Stack Developer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Leading development of scalable web applications and mentoring junior developers.',
    },
    {
      role: 'Full Stack Developer',
      company: 'Software Agency',
      period: '2020 - 2022',
      description: 'Built multiple client projects using modern web technologies.',
    },
    {
      role: 'Frontend Developer',
      company: 'Startup Inc',
      period: '2018 - 2020',
      description: 'Developed responsive user interfaces and improved application performance.',
    },
  ];

  const values = [
    {
      icon: <Code2 size={24} />,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and well-documented code.',
    },
    {
      icon: <Palette size={24} />,
      title: 'Design First',
      description: 'Creating beautiful, intuitive user experiences.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Performance',
      description: 'Optimizing for speed and efficiency.',
    },
    {
      icon: <Heart size={24} />,
      title: 'Passion',
      description: 'Loving what I do and continuous learning.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get to know me better, my journey, skills, and what drives me
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 flex items-center justify-center text-white text-6xl font-bold">
              NAT
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nguyễn Anh Tuấn
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              I'm a passionate Full Stack Developer with expertise in building modern web applications.
              With years of experience, I've worked on various projects ranging from small startups
              to large enterprise applications.
            </p>
            <p className="text-gray-600 leading-relaxed">
              My journey in tech started with a curiosity about how things work on the web.
              Today, I combine technical expertise with creative problem-solving to deliver
              exceptional digital experiences.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="text-blue-600" size={28} />
                <h3 className="text-2xl font-bold text-gray-900">My Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To create impactful digital solutions that solve real problems and improve
                people's lives. I believe in writing code that is not only functional but
                also elegant and maintainable.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="text-green-600" size={28} />
                <h3 className="text-2xl font-bold text-gray-900">Collaboration</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                I thrive in collaborative environments where ideas are shared freely.
                Working with talented teams motivates me to push boundaries and deliver
                exceptional results.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="text-purple-600" size={28} />
                <h3 className="text-2xl font-bold text-gray-900">Continuous Learning</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                The tech industry evolves rapidly, and I'm committed to staying current
                with the latest technologies, frameworks, and best practices.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Skills & Expertise
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup) => (
              <div
                key={skillGroup.category}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {skillGroup.category}
                </h3>
                <div className="space-y-2">
                  {skillGroup.items.map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Experience
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-8 relative"
              >
                <div className="absolute left-0 top-8 w-1 h-full bg-blue-600 rounded-full" />
                <div className="ml-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {exp.role}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="px-4 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-xl p-12 text-center text-white">
          <Award size={48} className="mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
}
