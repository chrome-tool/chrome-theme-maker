/**
 * Theme presets for quick selection
 */
import type { ThemeColors } from '../types/theme';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Chrome default theme',
    colors: {
      frame: [0, 120, 215],
      toolbar: [255, 255, 255],
      toolbar_text: [0, 0, 0],
      toolbar_button_icon: [0, 0, 0],
      ntp_background: [255, 255, 255],
      tab_text: [0, 0, 0],
      tab_background_text: [255, 255, 255],
      omnibox_text: [0, 0, 0],
      omnibox_background: [255, 255, 255, 0.5],
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Modern dark theme',
    colors: {
      frame: [32, 33, 36],
      toolbar: [32, 33, 36],
      toolbar_text: [218, 220, 224],
      toolbar_button_icon: [218, 220, 224],
      ntp_background: [32, 33, 36],
      tab_text: [218, 220, 224],
      tab_background_text: [128, 134, 139],
      omnibox_text: [218, 220, 224],
      omnibox_background: [85, 89, 92, 0.5],
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool ocean blues and greens',
    colors: {
      frame: [0, 102, 153],
      toolbar: [230, 245, 255],
      toolbar_text: [0, 51, 102],
      toolbar_button_icon: [0, 102, 153],
      ntp_background: [240, 248, 255],
      tab_text: [0, 51, 102],
      tab_background_text: [100, 150, 200],
      omnibox_text: [0, 51, 102],
      omnibox_background: [173, 216, 230, 0.6],
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset colors',
    colors: {
      frame: [255, 107, 53],
      toolbar: [255, 245, 230],
      toolbar_text: [139, 69, 19],
      toolbar_button_icon: [255, 107, 53],
      ntp_background: [255, 248, 240],
      tab_text: [139, 69, 19],
      tab_background_text: [210, 105, 30],
      omnibox_text: [139, 69, 19],
      omnibox_background: [255, 218, 185, 0.7],
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green tones',
    colors: {
      frame: [34, 139, 34],
      toolbar: [245, 255, 250],
      toolbar_text: [25, 100, 25],
      toolbar_button_icon: [34, 139, 34],
      ntp_background: [248, 255, 248],
      tab_text: [25, 100, 25],
      tab_background_text: [144, 238, 144],
      omnibox_text: [25, 100, 25],
      omnibox_background: [144, 238, 144, 0.5],
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft purple and pink',
    colors: {
      frame: [147, 112, 219],
      toolbar: [245, 240, 255],
      toolbar_text: [75, 0, 130],
      toolbar_button_icon: [147, 112, 219],
      ntp_background: [250, 240, 255],
      tab_text: [75, 0, 130],
      tab_background_text: [186, 85, 211],
      omnibox_text: [75, 0, 130],
      omnibox_background: [216, 191, 216, 0.6],
    },
  },
];
