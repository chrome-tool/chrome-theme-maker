import { create } from "zustand";
import type { ThemeConfig, RGB, ThemeColors } from "./types/theme";
import { DEFAULT_COLORS } from "./constants";
import { createFileUrl, revokeFileUrl } from "./utils/validation";

interface ThemeState {
  config: ThemeConfig;
  setColor: (key: keyof ThemeConfig["colors"], value: RGB) => void;
  setColors: (colors: ThemeColors) => void;
  setImage: (key: keyof ThemeConfig["images"], file: File | null) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  config: {
    images: {},
    colors: {
      frame: DEFAULT_COLORS.frame,
      toolbar: DEFAULT_COLORS.toolbar,
      toolbar_text: DEFAULT_COLORS.toolbar_text,
      toolbar_button_icon: DEFAULT_COLORS.toolbar_button_icon,
      ntp_background: DEFAULT_COLORS.ntp_background,
      tab_text: DEFAULT_COLORS.tab_text,
      tab_background_text: DEFAULT_COLORS.tab_background_text,
      omnibox_text: DEFAULT_COLORS.omnibox_text,
      omnibox_background: DEFAULT_COLORS.omnibox_background,
    }
  },

  setColor: (key, value) =>
    set((state) => ({
      config: {
        ...state.config,
        colors: {
          ...state.config.colors,
          [key]: value,
        },
      },
    })),

  setColors: (colors) =>
    set((state) => ({
      config: {
        ...state.config,
        colors,
      },
    })),

  setImage: (key, file) => {
    set((state) => {
      const oldUrl = state.config.images[key]?.url;
      
      // Clean up old URL to prevent memory leak
      if (oldUrl) {
        revokeFileUrl(oldUrl);
      }

      // If file is null, remove the image
      if (!file) {
        const { [key]: _, ...rest } = state.config.images;
        return {
          config: {
            ...state.config,
            images: rest,
          },
        };
      }

      // Create new URL for the file
      const url = createFileUrl(file);
      if (!url) {
        console.error(`Failed to create URL for file: ${file.name}`);
        return state;
      }

      return {
        config: {
          ...state.config,
          images: {
            ...state.config.images,
            [key]: { file, url },
          },
        },
      };
    });
  },
}));
