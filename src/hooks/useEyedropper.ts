import { useEffect, useState } from 'react';
import type { RGB } from '../types/theme';

/**
 * Hook for eyedropper functionality
 * Allows picking colors from anywhere on the page
 */
export function useEyedropper() {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        // Store position for cursor display
        (document as any).eyedropperX = e.clientX;
        (document as any).eyedropperY = e.clientY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        // Parse the color
        const rgb = parseRgbColor(bgColor);
        if (rgb) {
          setIsActive(false);
          return rgb;
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsActive(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isActive]);

  // Check if EyeDropper API is available
  const hasNativeEyedropper = () => {
    return 'EyeDropper' in window;
  };

  const startEyedropper = async () => {
    if (hasNativeEyedropper()) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        const rgb = parseHexColor(result.sRGBHex);
        return rgb;
      } catch (err) {
        // User cancelled, that's okay
        return null;
      }
    } else {
      // Fallback to custom implementation
      setIsActive(true);
      return null;
    }
  };

  return {
    isActive,
    setIsActive,
    error,
    startEyedropper,
    hasNativeEyedropper: hasNativeEyedropper(),
  };
}

/**
 * Parse rgb/rgba color string to RGB tuple
 */
export function parseRgbColor(colorString: string): RGB | null {
  const match = colorString.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;

  const parts = match[1].split(',').map((p) => {
    const num = parseFloat(p.trim());
    return isNaN(num) ? 0 : num;
  });

  if (parts.length >= 3) {
    return [
      Math.round(parts[0]),
      Math.round(parts[1]),
      Math.round(parts[2]),
      parts[3] ?? 1,
    ];
  }

  return null;
}

/**
 * Parse hex color string to RGB tuple
 */
export function parseHexColor(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1]
    : null;
}

/**
 * Get pixel color from canvas using image data
 */
export function getPixelColor(
  imageData: ImageData,
  x: number,
  y: number
): RGB | null {
  const { data, width } = imageData;
  const idx = (Math.round(y) * width + Math.round(x)) * 4;

  if (idx < 0 || idx >= data.length - 3) {
    return null;
  }

  return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3] / 255];
}
