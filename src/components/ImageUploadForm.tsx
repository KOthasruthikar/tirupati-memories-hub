import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useUploadImage } from "@/hooks/useGallery";
import { toast } from "sonner";

interface ImageUploadFormProps {
  defaultUid?: string;
}

const ImageUploadForm = ({ defaultUid = "" }: ImageUploadFormProps) => {
  const [uid, setUid] = useState(defaultUid);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadImage();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }
    
    if (!uid || uid.length !== 4 || !/^\d{4}$/.test(uid)) {
      toast.error("Please enter a valid 4-digit member UID");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        caption,
        ownerUid: uid,
      });
      toast.success("Image uploaded successfully!");
      clearFile();
      setCaption("");
      if (!defaultUid) setUid("");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-border/50 shadow-card">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
        Upload New Image
      </h3>
      
      <div className="space-y-4">
        {/* UID Input */}
        <div>
          <label htmlFor="uid" className="block text-sm font-medium text-muted-foreground mb-1">
            Member UID (4 digits) *
          </label>
          <input
            id="uid"
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="e.g., 1001"
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={4}
            required
            disabled={!!defaultUid}
          />
        </div>

        {/* Caption Input */}
        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-muted-foreground mb-1">
            Caption (optional)
          </label>
          <input
            id="caption"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Describe this image..."
            className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={200}
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Image *
          </label>
          {preview ? (
            <div className="relative rounded-lg overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to select image</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploadMutation.isPending || !selectedFile || !uid}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Image
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ImageUploadForm;
