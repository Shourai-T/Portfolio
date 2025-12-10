import { Download } from "lucide-react";
import { ParticleBackground } from "../components/ParticleBackground";

export function Resume() {
  const cvUrl = "/file/CV_Nguyen_Anh_Tuan.pdf#toolbar=0";

  return (
    <div className="min-h-screen bg-dark-bg py-12 relative flex flex-col items-center justify-center">
      <ParticleBackground />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center gap-6">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif text-center mb-4">
          My Resume
        </h1>

        {/* Download Button */}
        <a
          href={cvUrl}
          download="CV_TuanNguyen.pdf"
          className="group flex items-center gap-2 px-6 py-2.5 bg-white text-dark-bg hover:bg-gray-100 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <Download size={18} className="group-hover:animate-bounce" />
          Download CV
        </a>

        {/* CV Display Container */}
        <div className="relative w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden aspect-[1/1.414] border-[8px] md:border-[16px] border-white bg-white">
          <iframe
            src={cvUrl}
            title="CV"
            className="absolute inset-0 w-full h-full object-cover bg-white"
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
