import { type FaceFeatures } from "@/utils/featureExtraction";
import { type KNNResult, frameRecommendations } from "@/utils/knn";
import { Glasses, BarChart3, Scan, Sparkles } from "lucide-react";

import rectangularImg from "@/assets/frames/rectangular.png";
import roundImg from "@/assets/frames/round.png";
import aviatorImg from "@/assets/frames/aviator.png";
import bottomHeavyImg from "@/assets/frames/bottom-heavy.png";
import oversizedImg from "@/assets/frames/oversized.png";

const frameImages: Record<string, string> = {
  rectangular: rectangularImg,
  round: roundImg,
  aviator: aviatorImg,
  "bottom-heavy": bottomHeavyImg,
  oversized: oversizedImg,
};

interface ResultCardProps {
  faceShape: KNNResult;
  features: FaceFeatures;
}

const ResultCard = ({ faceShape, features }: ResultCardProps) => {
  const rec = frameRecommendations[faceShape.label];
  const confidencePercent = Math.round(faceShape.confidence * 100);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Main result */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl gradient-primary p-2.5 text-primary-foreground">
            <Scan className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Bentuk Wajah Terdeteksi</p>
            <h3 className="text-2xl font-display font-bold text-foreground">
              {faceShape.label}
            </h3>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Confidence
            </span>
            <span className="font-display font-semibold text-foreground">
              {confidencePercent}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full gradient-primary transition-all duration-700"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Frame recommendation */}
      {rec && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-accent p-2.5 text-accent-foreground">
              <Glasses className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Rekomendasi Frame</p>
              <h4 className="text-lg font-display font-semibold text-foreground">
                {rec.emoji} {rec.frames}
              </h4>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
          {frameImages[rec.imageKey] && (
            <div className="mt-4 rounded-xl bg-muted/30 p-3 flex items-center justify-center">
              <img
                src={frameImages[rec.imageKey]}
                alt={`Contoh ${rec.frames}`}
                className="h-28 object-contain"
              />
            </div>
          )}
        </div>
      )}

      {/* Feature details */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="font-display font-semibold text-foreground">Detail Fitur</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Rasio Tinggi/Lebar", value: features.heightWidthRatio.toFixed(3) },
            { label: "Rasio Rahang/Dahi", value: features.jawForeheadRatio.toFixed(3) },
            { label: "Rasio Tulang Pipi", value: features.cheekboneWidthRatio.toFixed(3) },
            { label: "Rasio Dagu/Tinggi", value: features.chinHeightRatio.toFixed(3) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-display font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {/* KNN neighbors */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 font-medium">K-Nearest Neighbors (K=3)</p>
          <div className="space-y-1.5">
            {faceShape.distances.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  #{i + 1} — {d.label}
                </span>
                <span className="font-mono text-xs text-foreground">
                  d = {d.distance.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
