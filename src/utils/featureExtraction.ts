import type { FaceLandmarks68 } from 'face-api.js';

export interface FaceFeatures {
  faceWidth: number;
  faceHeight: number;
  jawWidth: number;
  foreheadWidth: number;
  cheekboneWidth: number;
  chinLength: number;
  // Ratios
  heightWidthRatio: number;
  jawForeheadRatio: number;
  cheekboneWidthRatio: number;
  chinHeightRatio: number;
}

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function extractFeatures(landmarks: FaceLandmarks68): FaceFeatures {
  const points = landmarks.positions;

  // Jaw outline: points 0-16
  // Left eyebrow: 17-21, Right eyebrow: 22-26
  // Nose: 27-35
  // Left eye: 36-41, Right eye: 42-47
  // Mouth: 48-67

  // Calculate more stable widths
  // Face width: distance between cheekbones (0 and 16 - zygomatic arch proxy)
  const faceWidth = distance(points[0], points[16]);

  // Jaw width: distance between gonions (4 and 12)
  const jawWidth = distance(points[4], points[12]);

  // Chin width: local curve at bottom (6 and 10)
  const chinWidth = distance(points[6], points[10]);

  // Face height: distance between chin (8) and mid-point of eyes (stable proxy for face midline)
  const leftEyeCenter = {
    x: (points[36].x + points[39].x) / 2,
    y: (points[36].y + points[39].y) / 2,
  };
  const rightEyeCenter = {
    x: (points[42].x + points[45].x) / 2,
    y: (points[42].y + points[45].y) / 2,
  };
  const eyeMidPoint = {
    x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
    y: (leftEyeCenter.y + rightEyeCenter.y) / 2,
  };

  // Estimate full face height (eyes are roughly at 45-50% from top of head, but we use eye-to-chin as stable metric)
  // Eye-to-chin is approx 60% of total face height for adult humans
  const eyeToChin = distance(points[8], eyeMidPoint);
  const faceHeight = eyeToChin * 1.618; // Using golden ratio approx for full height

  // Calculate robust ratios
  // 1. Jaw-to-Cheek Ratio: Determines if face is narrowing (Heart/Oval) or wide at bottom (Square)
  const jawCheekRatio = jawWidth / faceWidth;

  // 2. Height-to-Width Ratio: Determines measurement aspect ratio (Long vs Wide)
  const heightWidthRatio = faceHeight / faceWidth;

  // 3. Chin-to-Jaw Ratio: Determines chin angularity (Pointy vs Flat/Wide)
  const chinJawRatio = chinWidth / jawWidth;

  // 4. Vertical Split: Ratio of lower face (nose-to-chin) to middle face (eye-to-nose)
  // Nose bottom is 33
  const noseBottom = points[33];
  const noseToChin = distance(points[8], noseBottom);
  const eyeToNose = distance(eyeMidPoint, noseBottom);
  const verticalRatio = noseToChin / (eyeToNose || 1); // Avoid div by 0

  return {
    faceWidth,
    faceHeight,
    jawWidth,
    foreheadWidth: 0, // Deprecated/Unused
    cheekboneWidth: faceWidth, // Alias
    chinLength: chinWidth, // Alias for back-compat
    heightWidthRatio,
    jawForeheadRatio: jawCheekRatio, // Remapped to reliable jaw/cheek ratio
    cheekboneWidthRatio: chinJawRatio, // Remapped to chin/jaw ratio
    chinHeightRatio: verticalRatio, // Remapped to vertical definition
  };
}

export function getFeatureVector(features: FaceFeatures): number[] {
  return [
    features.heightWidthRatio,
    features.jawForeheadRatio,
    features.cheekboneWidthRatio,
    features.chinHeightRatio,
  ];
}
