/**
 * Utility functions for color handling
 */
import type { RGB } from '../types/theme';

/**
 * Converts RGB array to CSS rgb() string
 * @param arr RGB tuple with optional alpha channel
 * @returns CSS rgb or rgba string
 * @example
 * rgbToString([255, 0, 0]) => "rgb(255,0,0)"
 * rgbToString([255, 0, 0, 0.5]) => "rgba(255,0,0,0.5)"
 */
export function rgbToString(arr: RGB): string {
  if (arr.length === 4 && arr[3] !== undefined) {
    return `rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`;
  }
  return `rgb(${arr.slice(0, 3).join(',')})`;
}

/**
 * Converts RGB array to hexadecimal color string
 * @param arr RGB tuple
 * @returns Hex color string (e.g., "#FF0000")
 * @example
 * rgbToHex([255, 0, 0]) => "#FF0000"
 */
export function rgbToHex(arr: RGB): string {
  const [r, g, b] = arr;
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`.toUpperCase();
}

/**
 * Converts hexadecimal color string to RGB array
 * @param hex Hex color string (e.g., "#FF0000" or "FF0000")
 * @returns RGB tuple or null if invalid
 * @example
 * hexToRgb("#FF0000") => [255, 0, 0]
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : null;
}

/**
 * Validates RGB color values
 * @param arr RGB tuple to validate
 * @returns true if valid RGB color
 */
export function isValidRGB(arr: unknown): arr is RGB {
  if (!Array.isArray(arr)) return false;
  if (arr.length < 3 || arr.length > 4) return false;
  
  return arr.slice(0, 3).every(val => 
    typeof val === 'number' && val >= 0 && val <= 255
  ) && (arr.length === 3 || (typeof arr[3] === 'number' && arr[3] >= 0 && arr[3] <= 1));
}
