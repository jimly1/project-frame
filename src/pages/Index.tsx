import { useState, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";
import FaceUploader from "@/components/FaceUploader";
import CameraCapture from "@/components/CameraCapture";
import LandmarkCanvas from "@/components/LandmarkCanvas";
import ResultCard from "@/components/ResultCard";
import { extractFeatures, getFeatureVector, type FaceFeatures } from "@/utils/featureExtraction";
import { predictKNN, faceShapeDataset, type KNNResult } from "@/utils/knn";
import { Scan, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

type Status = "idle" | "loading-models" | "processing" | "done" | "error";

const Index = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{
    knn: KNNResult;
    features: FaceFeatures;
    landmarks: faceapi.FaceLandmarks68;
    detection: { x: number; y: number; width: number; height: number };
    image: HTMLImageElement;
  } | null>(null);

  // Load models on mount
  useEffect(() => {
    const load = async () => {
      setStatus("loading-models");
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        setStatus("idle");
      } catch {
        setStatus("error");
        setErrorMsg("Gagal memuat model AI. Coba refresh halaman.");
      }
    };
    load();
  }, []);

  const processImage = useCallback(
    async (image: HTMLImageElement) => {
      if (!modelsLoaded) return;
      setStatus("processing");
      setResult(null);
      setErrorMsg("");

      try {
        const detections = await faceapi
          .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (detections.length === 0) {
          setStatus("error");
          setErrorMsg("Wajah tidak terdeteksi. Pastikan foto menampilkan wajah dengan jelas.");
          return;
        }

        if (detections.length > 1) {
          setStatus("error");
          setErrorMsg("Terdeteksi lebih dari satu wajah. Gunakan foto dengan satu wajah saja.");
          return;
        }

        const det = detections[0];
        const features = extractFeatures(det.landmarks);
        const featureVector = getFeatureVector(features);
        const knnResult = predictKNN(featureVector, faceShapeDataset, 3);
        const box = det.detection.box;

        setResult({
          knn: knnResult,
          features,
          landmarks: det.landmarks,
          detection: { x: box.x, y: box.y, width: box.width, height: box.height },
          image,
        });
        setStatus("done");
      } catch {
        setStatus("error");
        setErrorMsg("Terjadi kesalahan saat memproses gambar.");
      }
    },
    [modelsLoaded]
  );

  const reset = () => {
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl gradient-primary p-2 text-primary-foreground shadow-soft">
              <Scan className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground leading-tight">
                FaceShape AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Klasifikasi Bentuk Wajah & Rekomendasi Kacamata
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        {status !== "done" && !result && (
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              <Sparkles className="h-3 w-3" /> Powered by KNN & face-api.js
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Temukan Bentuk Wajah Anda
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload foto atau gunakan kamera untuk menganalisis bentuk wajah dan mendapatkan rekomendasi frame kacamata terbaik.
            </p>
          </div>
        )}

        {/* Loading models */}
        {status === "loading-models" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium">Memuat model AI...</p>
          </div>
        )}

        {/* Input area */}
        {modelsLoaded && status !== "done" && (
          <div className="max-w-md mx-auto space-y-4 animate-fade-in">
            <FaceUploader onImageSelected={processImage} isProcessing={status === "processing"} />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">atau</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <CameraCapture onImageCaptured={processImage} isProcessing={status === "processing"} />

            {/* Processing state */}
            {status === "processing" && (
              <div className="glass-card rounded-2xl p-6 text-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
                <p className="font-display font-semibold text-foreground">Menganalisis wajah...</p>
                <p className="text-sm text-muted-foreground mt-1">Mendeteksi landmark & mengklasifikasi</p>
              </div>
            )}

            {/* Error */}
            {status === "error" && errorMsg && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Deteksi Gagal</p>
                  <p className="text-sm text-muted-foreground mt-1">{errorMsg}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {status === "done" && result && (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <LandmarkCanvas
                  image={result.image}
                  landmarks={result.landmarks}
                  detection={result.detection}
                />
                <button
                  onClick={reset}
                  className="w-full rounded-xl border border-border bg-card py-3 text-sm font-display font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Analisis Foto Lain
                </button>
              </div>
              <ResultCard faceShape={result.knn} features={result.features} />
            </div>
          </div>
        )}

        {/* Tech info */}
        {status !== "done" && modelsLoaded && (
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            {[
              { label: "Face Detection", desc: "TinyFaceDetector" },
              { label: "Landmarks", desc: "68 Titik Wajah" },
              { label: "Classifier", desc: "KNN (K=3)" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-card/60 border border-border/50 p-3">
                <p className="text-xs font-display font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
