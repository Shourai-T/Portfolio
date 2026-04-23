import React, { useState } from "react";
import {
  Search,
  Download,
  Loader2,
  Youtube,
  Twitter,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface VideoFormat {
  itag: number;
  quality: string;
  container: string;
  type: "video" | "audio";
  hasAudio: boolean;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  formats: VideoFormat[];
}

export function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedItag, setSelectedItag] = useState<number | string>("");

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const fetchVideoInfo = async () => {
    if (!url) return;

    setLoading(true);
    setVideoInfo(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/video/info?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video info");
      }

      setVideoInfo(data);
      if (data.formats && data.formats.length > 0) {
        setSelectedItag(data.formats[0].itag);
      }
      toast.success("Video found!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoInfo || !selectedItag) return;

    // Trigger download by Navigating (backend handles Content-Disposition)
    const downloadUrl = `${BACKEND_URL}/api/video/download?url=${encodeURIComponent(
      url
    )}&itag=${selectedItag}`;
    window.location.href = downloadUrl;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchVideoInfo();
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {url.includes("twitter.com") || url.includes("x.com") ? (
                <Twitter className="h-5 w-5 text-dark-text-secondary" />
              ) : (
                <Youtube className="h-5 w-5 text-dark-text-secondary" />
              )}
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste YouTube or Twitter/X Link here..."
              className="pl-10 w-full bg-dark-bg border border-dark-border rounded-lg text-white p-3 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={fetchVideoInfo}
            disabled={loading || !url}
            className="btn-primary py-3 px-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            Get Info
          </button>
        </div>
      </div>

      {/* Video Info & Download */}
      {videoInfo && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Thumbnail */}
            <div className="w-full md:w-1/3 aspect-video bg-black rounded-lg overflow-hidden border border-dark-border relative group">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {url.includes("twitter.com") || url.includes("x.com") ? (
                  <Twitter className="h-12 w-12 text-white" />
                ) : (
                  <Youtube className="h-12 w-12 text-white" />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-2">
                  {videoInfo.title}
                </h2>
                <p className="text-dark-text-secondary mt-1 flex items-center gap-2">
                  Author:{" "}
                  <span className="text-white font-medium">
                    {videoInfo.author}
                  </span>
                </p>
              </div>

              <div className="border-t border-dark-border py-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Select Quality
                  </label>
                  <select
                    value={selectedItag}
                    onChange={(e) => setSelectedItag(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                  >
                    {videoInfo.formats.map((format) => (
                      <option key={format.itag} value={format.itag}>
                        {format.quality} {format.hasAudio ? "" : "(No Audio)"} -{" "}
                        {format.container.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg font-bold"
                >
                  <Download className="h-5 w-5" />
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information / Supported Platforms */}
      {!videoInfo && !loading && (
        <div className="text-center text-dark-text-secondary mt-12">
          <p className="flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Currently supports: YouTube, Twitter (X)
          </p>
        </div>
      )}
    </div>
  );
}
