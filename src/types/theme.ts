export type RGB = readonly [number, number, number, number?];

interface ThemeImages {
  theme_frame?: {
    file: File;
    url: string;
  };
}
export interface ThemeColors {
  frame: RGB;
  toolbar: RGB;
  toolbar_text: RGB;
  toolbar_button_icon: RGB;
  ntp_background: RGB;
  tab_text: RGB;
  tab_background_text: RGB;
  omnibox_text: RGB;
  omnibox_background: RGB;
}

export interface ThemeConfig {
  images: ThemeImages;
  colors: ThemeColors;
}
