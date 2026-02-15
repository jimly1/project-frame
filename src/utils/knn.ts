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

// Training dataset for face shapes
// Features: [height/width ratio, jaw/forehead ratio, cheekbone/width ratio, chin/height ratio]
export const faceShapeDataset: DataPoint[] = [
  // Oval
  { features: [1.35, 0.82, 0.95, 0.22], label: "Oval" },
  { features: [1.40, 0.80, 0.93, 0.20], label: "Oval" },
  { features: [1.38, 0.78, 0.96, 0.21], label: "Oval" },
  { features: [1.42, 0.81, 0.94, 0.19], label: "Oval" },
  { features: [1.36, 0.79, 0.92, 0.23], label: "Oval" },
  { features: [1.33, 0.83, 0.97, 0.20], label: "Oval" },
  { features: [1.37, 0.77, 0.91, 0.22], label: "Oval" },
  { features: [1.41, 0.84, 0.95, 0.18], label: "Oval" },

  // Round
  { features: [1.05, 0.95, 0.98, 0.18], label: "Round" },
  { features: [1.02, 0.97, 0.99, 0.16], label: "Round" },
  { features: [1.08, 0.93, 0.97, 0.17], label: "Round" },
  { features: [1.00, 0.96, 1.00, 0.15], label: "Round" },
  { features: [1.04, 0.94, 0.96, 0.19], label: "Round" },
  { features: [1.06, 0.98, 0.99, 0.16], label: "Round" },
  { features: [1.03, 0.92, 0.98, 0.18], label: "Round" },
  { features: [1.07, 0.96, 0.97, 0.17], label: "Round" },

  // Square
  { features: [1.05, 1.00, 0.95, 0.15], label: "Square" },
  { features: [1.02, 1.02, 0.93, 0.14], label: "Square" },
  { features: [1.08, 0.98, 0.94, 0.13], label: "Square" },
  { features: [1.03, 1.01, 0.96, 0.16], label: "Square" },
  { features: [1.06, 0.99, 0.92, 0.12], label: "Square" },
  { features: [1.01, 1.03, 0.95, 0.14], label: "Square" },
  { features: [1.04, 0.97, 0.93, 0.15], label: "Square" },
  { features: [1.07, 1.00, 0.94, 0.13], label: "Square" },

  // Heart
  { features: [1.25, 0.70, 0.90, 0.28], label: "Heart" },
  { features: [1.28, 0.68, 0.88, 0.30], label: "Heart" },
  { features: [1.22, 0.72, 0.92, 0.26], label: "Heart" },
  { features: [1.30, 0.65, 0.87, 0.32], label: "Heart" },
  { features: [1.26, 0.71, 0.89, 0.27], label: "Heart" },
  { features: [1.24, 0.69, 0.91, 0.29], label: "Heart" },
  { features: [1.27, 0.73, 0.86, 0.31], label: "Heart" },
  { features: [1.23, 0.67, 0.90, 0.25], label: "Heart" },

  // Oblong
  { features: [1.55, 0.85, 0.88, 0.20], label: "Oblong" },
  { features: [1.58, 0.83, 0.86, 0.19], label: "Oblong" },
  { features: [1.52, 0.87, 0.90, 0.21], label: "Oblong" },
  { features: [1.60, 0.82, 0.85, 0.18], label: "Oblong" },
  { features: [1.53, 0.86, 0.89, 0.22], label: "Oblong" },
  { features: [1.57, 0.84, 0.87, 0.20], label: "Oblong" },
  { features: [1.50, 0.88, 0.91, 0.23], label: "Oblong" },
  { features: [1.56, 0.81, 0.88, 0.19], label: "Oblong" },
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
