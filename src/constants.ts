/**
 * Configuration constants for Chrome Theme Maker
 */

// File upload constraints
export const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

// Chrome Theme manifest defaults
export const MANIFEST_VERSION = 3;
export const DEFAULT_THEME_VERSION = '1.0.0';
export const DEFAULT_THEME_NAME = 'My Theme';
export const DEFAULT_THEME_DESCRIPTION = 'Generated theme';

// Default theme colors (RGB)
export const DEFAULT_COLORS = {
  frame: [0, 120, 215] as const,
  toolbar: [255, 255, 255] as const,
  toolbar_text: [0, 0, 0] as const,
  toolbar_button_icon: [0, 0, 0] as const,
  ntp_background: [255, 255, 255] as const,
  tab_text: [0, 0, 0] as const,
  tab_background_text: [255, 255, 255] as const,
  omnibox_text: [0, 0, 0] as const,
  omnibox_background: [255, 255, 255, 0.5] as const,
} as const;

// NTP background properties
export const NTP_BACKGROUND_ALIGNMENT = 'center';
export const NTP_BACKGROUND_REPEAT = 'no-repeat';
export const NTP_LOGO_ALTERNATE = 0;
