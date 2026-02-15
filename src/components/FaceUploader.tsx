import { useRef, useCallback } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface FaceUploaderProps {
  onImageSelected: (image: HTMLImageElement) => void;
  isProcessing: boolean;
}

const FaceUploader = ({ onImageSelected, isProcessing }: FaceUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => onImageSelected(img);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => !isProcessing && inputRef.current?.click()}
      className={`
        relative group cursor-pointer rounded-2xl border-2 border-dashed border-primary/30
        bg-muted/30 p-10 text-center transition-all duration-300
        hover:border-primary/60 hover:bg-primary/5
        ${isProcessing ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-2xl gradient-primary p-4 text-primary-foreground shadow-soft">
          <Upload className="h-8 w-8" />
        </div>
        <div>
          <p className="text-lg font-display font-semibold text-foreground">
            Upload Face Photo
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag & drop or click to select image
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>JPG, PNG, WebP — Max 10MB</span>
        </div>
      </div>
    </div>
  );
};

export default FaceUploader;
