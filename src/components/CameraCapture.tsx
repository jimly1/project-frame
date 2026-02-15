import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onImageCaptured: (image: HTMLImageElement) => void;
  isProcessing: boolean;
}

const CameraCapture = ({ onImageCaptured, isProcessing }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setStream(mediaStream);
      setIsOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setIsOpen(false);
  }, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    const img = new Image();
    img.onload = () => {
      onImageCaptured(img);
      stopCamera();
    };
    img.src = canvas.toDataURL("image/jpeg");
  }, [onImageCaptured, stopCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => () => { stream?.getTracks().forEach((t) => t.stop()); }, [stream]);

  if (!isOpen) {
    return (
      <div className="space-y-2">
        <Button
          onClick={startCamera}
          disabled={isProcessing}
          className="w-full gradient-primary text-primary-foreground h-12 rounded-xl font-display font-medium text-base shadow-soft hover:opacity-90 transition-opacity"
        >
          <Camera className="mr-2 h-5 w-5" />
          Buka Kamera
        </Button>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-[4/3] object-cover scale-x-[-1]"
        />
        <div className="absolute inset-0 border-2 border-primary/30 rounded-2xl pointer-events-none" />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={capture}
          className="flex-1 gradient-primary text-primary-foreground h-11 rounded-xl font-display shadow-soft hover:opacity-90 transition-opacity"
        >
          <Camera className="mr-2 h-4 w-4" />
          Ambil Foto
        </Button>
        <Button
          onClick={stopCamera}
          variant="outline"
          className="h-11 rounded-xl px-4"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;
