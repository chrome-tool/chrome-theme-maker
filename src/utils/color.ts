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
