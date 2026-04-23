import React, { useState, useRef, useCallback } from "react";
import { Upload, Download, Settings, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type ImageFormat = "image/png" | "image/jpeg" | "image/webp";

interface ProcessedImage {
  id: string;
  originalFile: File;
  previewUrl: string;
  convertedBlob: Blob | null;
  status: "idle" | "processing" | "done" | "error";
  convertedUrl: string | null;
  originalSize: number;
  convertedSize: number;
}

export function ImageConverter() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [format, setFormat] = useState<ImageFormat>("image/webp");
  const [quality, setQuality] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      toast.error("Please select valid image files");
      return;
    }

    const newImages: ProcessedImage[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      previewUrl: URL.createObjectURL(file), // Helper logic
      convertedBlob: null,
      status: "idle",
      convertedUrl: null,
      originalSize: file.size,
      convertedSize: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const convertImage = async (img: ProcessedImage) => {
    return new Promise<ProcessedImage>((resolve) => {
      const image = new Image();
      image.src = img.previewUrl;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const convertedUrl = URL.createObjectURL(blob);
                resolve({
                  ...img,
                  convertedBlob: blob,
                  convertedUrl,
                  convertedSize: blob.size,
                  status: "done",
                });
              } else {
                resolve({ ...img, status: "error" });
              }
            },
            format,
            quality
          );
        } else {
          resolve({ ...img, status: "error" });
        }
      };
      image.onerror = () => resolve({ ...img, status: "error" });
    });
  };

  const handleConvertAll = async () => {
    const processingImages = images.filter((img) => img.status === "idle");
    if (processingImages.length === 0) return;

    setImages((prev) =>
      prev.map((img) =>
        img.status === "idle" ? { ...img, status: "processing" } : img
      )
    );

    const promises = processingImages.map((img) => convertImage(img));
    const results = await Promise.all(promises);

    setImages((prev) => {
      const updated = [...prev];
      results.forEach((res) => {
        const index = updated.findIndex((p) => p.id === res.id);
        if (index !== -1) updated[index] = res;
      });
      return updated;
    });
    toast.success("Conversion complete!");
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper for download extension
  const getExt = () => {
    if (format === "image/png") return "png";
    if (format === "image/jpeg") return "jpg";
    return "webp";
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-dark-bg border border-dark-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Target Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ImageFormat)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-2 text-white focus:outline-none focus:border-primary"
            >
              <option value="image/webp">WebP (Best for Web)</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">
              Quality ({Math.round(quality * 100)}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleConvertAll}
              disabled={
                images.length === 0 || images.every((i) => i.status === "done")
              }
              className="w-full btn-primary border border-dark-border rounded-xl py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings className="h-4 w-4" />
              Convert All
            </button>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-dark-border hover:border-white/20 hover:bg-dark-hover/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-dark-bg rounded-full border border-dark-border">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Upload Images</h3>
            <p className="text-dark-text-secondary mt-1">
              Drag and drop or click to select
            </p>
            <p className="text-xs text-dark-text-secondary mt-2">
              JPG, PNG, WEBP supported
            </p>
          </div>
        </div>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-4"
            >
              <div className="h-20 w-20 shrink-0 bg-dark-bg rounded-lg overflow-hidden border border-dark-border">
                <img
                  src={img.previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white truncate max-w-[200px]">
                    {img.originalFile.name}
                  </h4>
                  {img.status === "done" && (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-500 font-medium">
                      Done
                    </span>
                  )}
                  {img.status === "processing" && (
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-medium flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Processing
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-dark-text-secondary">
                  <span>Orig: {formatBytes(img.originalSize)}</span>
                  <span className="text-dark-border">→</span>
                  <span>
                    {img.status === "done" ? (
                      <span
                        className={
                          img.convertedSize < img.originalSize
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {formatBytes(img.convertedSize)}
                        {img.convertedSize < img.originalSize && (
                          <span className="ml-1 text-xs">
                            (-
                            {Math.round(
                              (1 - img.convertedSize / img.originalSize) * 100
                            )}
                            %)
                          </span>
                        )}
                      </span>
                    ) : (
                      "..."
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {img.status === "done" && img.convertedUrl && (
                  <a
                    href={img.convertedUrl}
                    download={`converted_${
                      img.originalFile.name.split(".")[0]
                    }.${getExt()}`}
                    className="p-2 hover:bg-dark-hover rounded-lg text-primary transition-colors"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                )}
                <button
                  onClick={() => removeImage(img.id)}
                  className="p-2 hover:bg-dark-hover rounded-lg text-red-500 transition-colors"
                  title="Remove"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
