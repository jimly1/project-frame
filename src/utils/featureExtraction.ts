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

  // Face width: distance between jaw points (cheek to cheek) - points 1 and 15
  const faceWidth = distance(points[1], points[15]);

  // Face height: from chin (point 8) to top of forehead (estimated from eyebrows)
  const foreheadTop = {
    x: (points[19].x + points[24].x) / 2,
    y: Math.min(points[19].y, points[24].y) - (points[27].y - Math.min(points[19].y, points[24].y)),
  };
  const faceHeight = distance(points[8], foreheadTop);

  // Jaw width: distance between jaw points 4 and 12
  const jawWidth = distance(points[4], points[12]);

  // Forehead width: distance between outer eyebrow points 17 and 26
  const foreheadWidth = distance(points[17], points[26]);

  // Cheekbone width: widest part of face (points 2 and 14)
  const cheekboneWidth = distance(points[2], points[14]);

  // Chin length: from chin tip (8) to mouth bottom (57)
  const chinLength = distance(points[8], points[57]);

  // Calculate ratios
  const heightWidthRatio = faceHeight / faceWidth;
  const jawForeheadRatio = jawWidth / foreheadWidth;
  const cheekboneWidthRatio = cheekboneWidth / faceWidth;
  const chinHeightRatio = chinLength / faceHeight;

  return {
    faceWidth,
    faceHeight,
    jawWidth,
    foreheadWidth,
    cheekboneWidth,
    chinLength,
    heightWidthRatio,
    jawForeheadRatio,
    cheekboneWidthRatio,
    chinHeightRatio,
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
