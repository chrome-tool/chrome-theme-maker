/**
 * Color extraction utility for extracting dominant colors from images
 */
import type { RGB } from "../types/theme";

interface ExtractedColor {
  color: RGB;
  percentage: number;
}

/**
 * Extracts dominant colors from an image using canvas
 * @param imageUrl - URL of the image to extract colors from
 * @param count - Number of colors to extract (default: 5)
 * @returns Array of extracted colors with their percentages
 */
export async function extractColorsFromImage(
  imageUrl: string,
  count: number = 5,
): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Set canvas size - smaller for faster processing
        canvas.width = 100;
        canvas.height = 100;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Extract colors using k-means clustering
        const colors = extractDominantColors(data, count);
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}

/**
 * Simple k-means clustering to find dominant colors
 */
function extractDominantColors(
  pixelData: Uint8ClampedArray,
  k: number,
): ExtractedColor[] {
  // Sample pixels (every 4th pixel for performance)
  const pixels: number[][] = [];
  for (let i = 0; i < pixelData.length; i += 16) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    const a = pixelData[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Skip grayscale-like pixels and near-white/black
    const isGrayscale = Math.abs(r - g) < 30 && Math.abs(g - b) < 30;
    const isNearWhite = r > 240 && g > 240 && b > 240;
    const isNearBlack = r < 15 && g < 15 && b < 15;

    if (!isGrayscale && !isNearWhite && !isNearBlack) {
      pixels.push([r, g, b]);
    }
  }

  if (pixels.length === 0) {
    return [
      {
        color: [100, 120, 215, 1],
        percentage: 100,
      },
    ];
  }

  // Initialize centroids randomly from pixels
  const centroids = initializeCentroids(pixels, k);

  // K-means iterations
  let oldCentroids = JSON.stringify(centroids);
  for (let iter = 0; iter < 10; iter++) {
    // Assign pixels to nearest centroid
    const clusters: number[][][] = Array(k)
      .fill(null)
      .map(() => []);

    for (const pixel of pixels) {
      let minDist = Infinity;
      let nearestCentroid = 0;

      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(pixel, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          nearestCentroid = i;
        }
      }

      clusters[nearestCentroid].push(pixel);
    }

    // Update centroids
    for (let i = 0; i < centroids.length; i++) {
      if (clusters[i].length > 0) {
        const sum = clusters[i].reduce(
          (acc, pixel) => [
            acc[0] + pixel[0],
            acc[1] + pixel[1],
            acc[2] + pixel[2],
          ],
          [0, 0, 0],
        );

        centroids[i] = [
          Math.round(sum[0] / clusters[i].length),
          Math.round(sum[1] / clusters[i].length),
          Math.round(sum[2] / clusters[i].length),
        ];
      }
    }

    const newCentroids = JSON.stringify(centroids);
    if (newCentroids === oldCentroids) break;
    oldCentroids = newCentroids;
  }

  // Assign final clusters and calculate percentages
  const finalClusters: number[][][] = Array(k)
    .fill(null)
    .map(() => []);

  for (const pixel of pixels) {
    let minDist = Infinity;
    let nearestCentroid = 0;

    for (let i = 0; i < centroids.length; i++) {
      const dist = colorDistance(pixel, centroids[i]);
      if (dist < minDist) {
        minDist = dist;
        nearestCentroid = i;
      }
    }

    finalClusters[nearestCentroid].push(pixel);
  }

  // Convert to result format with percentages
  const result: ExtractedColor[] = finalClusters
    .map((cluster, idx) => ({
      color: [
        centroids[idx][0],
        centroids[idx][1],
        centroids[idx][2],
        1,
      ] as RGB,
      percentage: (cluster.length / pixels.length) * 100,
    }))
    .filter((item) => item.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  return result.slice(0, k);
}

/**
 * Calculate Euclidean distance between two colors
 */
function colorDistance(color1: number[], color2: number[]): number {
  const dr = color1[0] - color2[0];
  const dg = color1[1] - color2[1];
  const db = color1[2] - color2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Initialize centroids by randomly selecting from pixels
 */
function initializeCentroids(pixels: number[][], k: number): number[][] {
  const centroids = [];
  // const step = Math.floor(pixels.length / k);

  for (let i = 0; i < k; i++) {
    const idx = Math.floor(Math.random() * pixels.length);
    centroids.push([...pixels[idx]]);
  }

  return centroids;
}

/**
 * Get contrast ratio between two colors (for readability)
 */
export function getContrastRatio(color1: RGB, color2: RGB): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance for WCAG contrast
 */
function getRelativeLuminance(color: RGB): number {
  const [r, g, b] = color.slice(0, 3).map((c: any) => {
    const normalized = c / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
