import { useState } from "react";
import { ParticleBackground } from "../components/ParticleBackground";
import { ImageConverter } from "../components/tools/ImageConverter";
import { VideoDownloader } from "../components/tools/VideoDownloader";
import { Image, Wrench, Video } from "lucide-react";

export function Tools() {
  const [activeTool, setActiveTool] = useState("image-converter");

  return (
    <div className="min-h-screen bg-dark-bg py-12 relative overflow-hidden">
      <ParticleBackground />

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-sm font-medium text-primary uppercase tracking-wider mb-4 text-white">
            Tools
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-serif text-dark-text mb-6">
            Developer Tools
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-2xl mx-auto">
            A collection of useful utilities for developers and designers. Free
            to use, client-side only.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Tool Menu */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-dark-text-secondary uppercase tracking-wider mb-4 px-2">
                Utilities
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTool("image-converter")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeTool === "image-converter"
                      ? "bg-primary/20 text-primary border border-primary/20"
                      : "text-dark-text hover:bg-dark-hover"
                  }`}
                >
                  <Image className="h-5 w-5" />
                  <span className="font-medium">Image Converter</span>
                </button>
                <button
                  onClick={() => setActiveTool("video-downloader")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeTool === "video-downloader"
                      ? "bg-primary/20 text-primary border border-primary/20"
                      : "text-dark-text hover:bg-dark-hover"
                  }`}
                >
                  <Video className="h-5 w-5" />
                  <span className="font-medium">Video Downloader</span>
                </button>
                {/* Placeholder for future tools */}
                <button
                  disabled
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-text-secondary/50 cursor-not-allowed text-left"
                >
                  <Wrench className="h-5 w-5" />
                  <span className="font-medium">More coming soon...</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTool === "image-converter" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Image className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Image Converter
                    </h2>
                    <p className="text-dark-text-secondary">
                      Convert, resize, and compress images directly in your
                      browser.
                    </p>
                  </div>
                </div>
                <ImageConverter />
              </div>
            )}
            {activeTool === "video-downloader" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Video className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Video Downloader
                    </h2>
                    <p className="text-dark-text-secondary">
                      Download videos from YouTube and other platforms
                      efficiently.
                    </p>
                  </div>
                </div>
                <VideoDownloader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
