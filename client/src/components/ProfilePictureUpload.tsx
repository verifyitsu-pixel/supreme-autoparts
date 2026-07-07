import { useState, useRef } from "react";
import { Upload, X, Loader2, Check } from "lucide-react";

interface ProfilePictureUploadProps {
  currentImage?: string;
  onUpload: (file: File) => Promise<void>;
}

export function ProfilePictureUpload({ currentImage, onUpload }: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadSuccess(false);

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      await onUpload(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Current/Preview Image */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#E42933] to-[#a81f24] flex items-center justify-center text-white text-2xl font-black">
              ?
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <Check size={18} className="text-green-600" />
                Uploaded
              </>
            ) : (
              <>
                <Upload size={18} />
                Change Picture
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG or WebP. Max 5MB.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <X className="text-red-600" size={18} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
