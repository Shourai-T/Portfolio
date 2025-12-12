import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUploading?: (isUploading: boolean) => void;
}

export function ImageUpload({
  value,
  onChange,
  onUploading,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      onUploading?.(true);
      setError(null);

      // Validate file
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }

      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        throw new Error("Image size must be less than 2MB");
      }

      // Upload to Supabase
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      onUploading?.(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
          error
            ? "border-red-500/50 bg-red-500/5"
            : "border-dark-border hover:border-primary/50 bg-dark-hover/30"
        } relative min-h-[200px] flex items-center justify-center`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />

        {value ? (
          <div className="relative w-full h-full min-h-[200px] flex items-center justify-center group">
            <img
              src={value}
              alt="Preview"
              className="max-h-[300px] rounded-lg shadow-lg object-contain"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              {uploading ? (
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <div
                  className="p-3 bg-dark-hover rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-dark-text-secondary" />
                </div>
              )}
            </div>
            <div className="text-sm text-dark-text-secondary">
              <span
                className="text-primary font-medium cursor-pointer hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                Click to upload
              </span>{" "}
              or drag and drop
            </div>
            <p className="text-xs text-dark-text-secondary/60">
              JPG, PNG, WEBP (Max 2MB)
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
