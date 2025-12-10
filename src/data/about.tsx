import {
  Github,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Code2,
  Terminal,
  Cpu,
  Globe,
  Database,
  Server,
  Layout,
  PenTool,
  Video,
  Camera,
  Music,
  GraduationCap,
  Box,
  Image,
} from "lucide-react";

// Helper components for icons mapping
function SnakeIcon(props: any) {
  return <Code2 {...props} />;
}
function ContainerIcon(props: any) {
  return <Box {...props} />;
}

export const ABOUT_DATA = {
  profile: {
    name: "Tuấn Nguyễn",
    title: "Fullstack Developer",
    location: "HO Chi Minh City, Vietnam",
    bio: [
      "Xin chào, tớ là Tuấn Nguyễn (anhtu), sinh viên chuyên ngành Kỹ thuật phần mềm tại Đại học FPT. Tớ đang là freelancer thiết kế đồ hoạ và là một guitarist. Tớ đang hướng tới trở thành một Fullstack Developer và thực hiện thêm nhiều ước mơ phía trước.",
      "Tương lai thuộc về những người tin vào vẻ đẹp trong chính những giấc mơ, hoài bão to lớn của mình...",
      "Giới thiệu nhiều hơn một chút về bản thân, tớ sống và làm việc tại Hà Nội. Tớ thích tìm hiểu về những thứ mới mẻ, thử thách bản thân và không ngừng học hỏi nhiều điều hơn. Tớ có kĩ năng khá tốt với nghệ thuật và cả kĩ thuật/công nghệ, không phải là năng khiếu thiên bẩm, nhưng tớ cảm nhận được tớ đã tự đạt được bằng những nỗ lực của bản thân. Tớ đã chơi đàn được hơn 5 năm rồi, và cũng từng được đi diễn tại một số show. Ngoài ra, tớ cũng siêu thích quay phim và chụp ảnh, kiểu như, tớ đang muốn truyền tải với thế giới này những gì tớ thấy qua góc kính máy ảnh nhiệm màu. Tuy rằng hơi bận rộn với việc học và làm, nhưng tớ vẫn luôn có một khoảng dành cho những sở thích của riêng mình, tập đàn 2 tiếng mỗi ngày, hay là ngồi code cả tối. Hihi, chắc là hết rồi, tạm gác ở đây nha!",
    ],
    avatarUrl: "https://github.com/shourai-t.png",
    socials: [
      { platform: "GitHub", url: "https://github.com/", icon: Github },
      {
        platform: "Facebook",
        url: "https://www.facebook.com",
        icon: Facebook,
      },
      {
        platform: "Instagram",
        url: "https://www.instagram.com/",
        icon: Instagram,
      },
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com",
        icon: Linkedin,
      },
      {
        platform: "Email",
        url: "mailto:anhtuannguyen112004@gmail.com",
        icon: Mail,
      },
    ],
  },
  education: [
    {
      period: "2023 - 2027",
      institution: "FPT University",
      degree: "Software Engineering",
      description: "Studying Software Engineering at FPT University.",
      icon: GraduationCap,
    },
    {
      period: "2020 - 2023",
      institution: "Lê Quý Đôn - Hà Đông High School",
      degree: "High School",
      description:
        "Studying at THPT Lê Quý Đôn - Hà Đông High School, K51 - A3.",
      icon: GraduationCap,
    },
  ],
  experience: [
    {
      period: "2025 - Present",
      company: "Chef Hải",
      role: "Video Editor",
      description: "Edit TikTok short commercial video for Chef Hải.",
      icon: Video,
    },
    {
      period: "2024 - 2025",
      company: "Giấy Trắng",
      role: "Founder/Guitarist",
      description: "Founder/Guitarist and Manager of Giấy Trắng Band.",
      icon: Music,
    },
    {
      period: "2024 - Present",
      company: "Freelance",
      role: "Web Developer",
      description: "Building web applications.",
      icon: Code2,
    },
    {
      period: "2021 - Present",
      company: "Freelance",
      role: "Graphic Designer",
      description: "Designed graphic design and marketing materials.",
      icon: PenTool,
    },
  ],
  skills: [
    {
      category: "Languages",
      items: [
        { name: "JavaScript", icon: Code2 },
        { name: "C/C++", icon: Terminal },
        { name: "Python", icon: SnakeIcon },
        { name: "Java", icon: Code2 },
        { name: "SQL", icon: Database },
        { name: "HTML", icon: Layout },
        { name: "CSS", icon: Layout },
      ],
    },
    {
      category: "Frameworks and Libraries",
      items: [
        { name: "React", icon: Code2 },
        { name: "NodeJS", icon: Server },
        { name: "Next.js", icon: Globe },
        { name: "NestJS", icon: Server },
        { name: "Express", icon: Server },
        { name: "Prisma", icon: Database },
        { name: "TypeORM", icon: Database },
        { name: "Tailwind CSS", icon: Layout },
        { name: "HeroUI", icon: Layout },
        { name: "shadcn/ui", icon: Layout },
      ],
    },
    {
      category: "Tools",
      items: [
        { name: "Git", icon: Code2 },
        { name: "GitHub Actions", icon: Cpu },
        { name: "Docker", icon: ContainerIcon },
        { name: "Docker Compose", icon: ContainerIcon },
        { name: "Caddy", icon: Server },
        { name: "VPS Deployment", icon: Server },
        { name: "Figma", icon: PenTool },
        { name: "VS Code", icon: Terminal },
        { name: "Firebase", icon: Database },
        { name: "Cloudinary", icon: Image },
      ],
    },
    {
      category: "Databases",
      items: [
        { name: "MSSQL", icon: Database },
        { name: "MySQL", icon: Database },
      ],
    },
    {
      category: "Design & Video Editing",
      items: [
        { name: "Adobe Photoshop", icon: Camera },
        { name: "Adobe Illustrator", icon: PenTool },
        { name: "Adobe Premiere Pro", icon: Video },
        { name: "Adobe After Effects", icon: Video },
        { name: "Adobe Lightroom", icon: Camera },
        { name: "CapCut", icon: Video },
        { name: "Blender", icon: Box },
      ],
    },
  ],
};
