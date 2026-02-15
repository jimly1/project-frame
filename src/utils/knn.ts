export interface DataPoint {
  features: number[];
  label: string;
}

export interface KNNResult {
  label: string;
  confidence: number;
  distances: { label: string; distance: number }[];
}

// Euclidean distance
export function calculateDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// Normalize features to 0-1 range
export function normalizeFeatures(features: number[], mins: number[], maxs: number[]): number[] {
  return features.map((val, i) => {
    const range = maxs[i] - mins[i];
    return range === 0 ? 0 : (val - mins[i]) / range;
  });
}

// Get min/max from dataset for normalization
export function getDatasetBounds(dataset: DataPoint[]): { mins: number[]; maxs: number[] } {
  const featureCount = dataset[0].features.length;
  const mins = Array(featureCount).fill(Infinity);
  const maxs = Array(featureCount).fill(-Infinity);

  dataset.forEach((point) => {
    point.features.forEach((val, i) => {
      if (val < mins[i]) mins[i] = val;
      if (val > maxs[i]) maxs[i] = val;
    });
  });

  return { mins, maxs };
}

// KNN prediction
export function predictKNN(
  input: number[],
  dataset: DataPoint[],
  k: number = 3
): KNNResult {
  const { mins, maxs } = getDatasetBounds(dataset);
  const normalizedInput = normalizeFeatures(input, mins, maxs);

  const distances = dataset.map((point) => ({
    label: point.label,
    distance: calculateDistance(
      normalizedInput,
      normalizeFeatures(point.features, mins, maxs)
    ),
  }));

  distances.sort((a, b) => a.distance - b.distance);

  const kNearest = distances.slice(0, k);

  // Majority voting
  const votes: Record<string, number> = {};
  kNearest.forEach((n) => {
    votes[n.label] = (votes[n.label] || 0) + 1;
  });

  const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];

  return {
    label: winner[0],
    confidence: winner[1] / k,
    distances: kNearest,
  };
}

// Refined dataset with robust features
// Features: [heightWidthRatio, jawToCheekRatio, chinToJawRatio, verticalRatio]
export const faceShapeDataset: DataPoint[] = [
  // OVAL: Balanced ratios, slightly longer than wide, soft chin
  { features: [1.45, 0.75, 0.45, 1.0], label: "Oval" },
  { features: [1.48, 0.73, 0.42, 1.02], label: "Oval" },
  { features: [1.42, 0.77, 0.48, 0.98], label: "Oval" },
  { features: [1.50, 0.72, 0.44, 1.05], label: "Oval" },
  { features: [1.46, 0.76, 0.46, 0.99], label: "Oval" },
  { features: [1.44, 0.74, 0.43, 1.01], label: "Oval" }, // Center: 1.45, 0.75, 0.45

  // ROUND: Short face (ratio ~1.1-1.2), wide jaw but soft chin
  { features: [1.15, 0.82, 0.50, 0.95], label: "Round" },
  { features: [1.10, 0.85, 0.52, 0.92], label: "Round" },
  { features: [1.20, 0.80, 0.48, 0.98], label: "Round" },
  { features: [1.12, 0.83, 0.51, 0.94], label: "Round" },
  { features: [1.18, 0.81, 0.49, 0.96], label: "Round" },
  { features: [1.16, 0.84, 0.53, 0.93], label: "Round" }, // Center: 1.15, 0.82, 0.50

  // SQUARE: Short/Medium face, wide jaw (nearly as wide as cheek), flat chin
  { features: [1.25, 0.92, 0.65, 1.05], label: "Square" },
  { features: [1.22, 0.95, 0.68, 1.02], label: "Square" },
  { features: [1.30, 0.90, 0.62, 1.08], label: "Square" },
  { features: [1.28, 0.93, 0.66, 1.04], label: "Square" },
  { features: [1.24, 0.91, 0.64, 1.06], label: "Square" },
  { features: [1.26, 0.94, 0.67, 1.03], label: "Square" }, // Center: 1.25, 0.92, 0.65

  // HEART: Medium height, narrow jaw (drastic taper), pointy chin
  { features: [1.35, 0.65, 0.35, 1.10], label: "Heart" },
  { features: [1.32, 0.62, 0.32, 1.08], label: "Heart" },
  { features: [1.40, 0.68, 0.38, 1.12], label: "Heart" },
  { features: [1.38, 0.64, 0.34, 1.09], label: "Heart" },
  { features: [1.34, 0.66, 0.36, 1.11], label: "Heart" },
  { features: [1.36, 0.63, 0.33, 1.07], label: "Heart" }, // Center: 1.35, 0.65, 0.35

  // OBLONG: Very long face (>1.55), balanced jaw/chin
  { features: [1.60, 0.78, 0.50, 1.15], label: "Oblong" },
  { features: [1.65, 0.75, 0.48, 1.18], label: "Oblong" },
  { features: [1.58, 0.80, 0.52, 1.12], label: "Oblong" },
  { features: [1.62, 0.77, 0.49, 1.16], label: "Oblong" },
  { features: [1.56, 0.79, 0.51, 1.14], label: "Oblong" },
  { features: [1.68, 0.76, 0.47, 1.20], label: "Oblong" }, // Center: 1.62, 0.78, 0.50
];

// Frame recommendations
export const frameRecommendations: Record<string, { frames: string; description: string; emoji: string; imageKey: string }> = {
  Oval: {
    frames: "Hampir semua jenis frame cocok",
    description: "Wajah oval adalah bentuk paling serbaguna. Anda bisa menggunakan frame aviator, wayfarer, cat-eye, atau rectangular.",
    emoji: "✨",
    imageKey: "aviator",
  },
  Round: {
    frames: "Rectangular / Angular frames",
    description: "Frame angular dan rectangular akan menambah definisi dan membuat wajah terlihat lebih tirus dan proporsional.",
    emoji: "📐",
    imageKey: "rectangular",
  },
  Square: {
    frames: "Round / Oval frames",
    description: "Frame bulat atau oval akan melunakkan sudut-sudut wajah dan memberikan kesan lebih halus dan seimbang.",
    emoji: "⭕",
    imageKey: "round",
  },
  Heart: {
    frames: "Bottom-heavy frames",
    description: "Frame yang lebih lebar di bagian bawah akan menyeimbangkan dahi yang lebar dan dagu yang lebih sempit.",
    emoji: "💜",
    imageKey: "bottom-heavy",
  },
  Oblong: {
    frames: "Oversized / Wide frames",
    description: "Frame oversized atau lebar akan membuat wajah terlihat lebih pendek dan proporsional.",
    emoji: "🔲",
    imageKey: "oversized",
  },
};
