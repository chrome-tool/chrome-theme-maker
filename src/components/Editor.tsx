import { useState } from "react";

import { useThemeStore } from "../store";
import { validateImageFile } from "../utils/validation";
import Presets from "./Presets";
import ColorPickerInput from "./ColorPickerInput";
import ColorExtractor from "./ColorExtractor";

const COLOR_CATEGORIES = [
  {
    id: 'frame',
    label: 'Frame',
    description: 'The main window frame color',
    key: 'frame' as const,
  },
  {
    id: 'toolbar',
    label: 'Toolbar',
    description: 'The toolbar background color',
    key: 'toolbar' as const,
  },
  {
    id: 'toolbar_text',
    label: 'Toolbar Text',
    description: 'Text color in toolbar',
    key: 'toolbar_text' as const,
  },
  {
    id: 'toolbar_button_icon',
    label: 'Toolbar Button Icons',
    description: 'Color of toolbar button icons',
    key: 'toolbar_button_icon' as const,
  },
  {
    id: 'ntp_background',
    label: 'New Tab Page Background',
    description: 'New tab page background color',
    key: 'ntp_background' as const,
  },
  {
    id: 'tab_text',
    label: 'Tab Text',
    description: 'Text color on tabs',
    key: 'tab_text' as const,
  },
  {
    id: 'tab_background_text',
    label: 'Tab Background Text',
    description: 'Background tab text color',
    key: 'tab_background_text' as const,
  },
  {
    id: 'omnibox_text',
    label: 'Omnibox Text',
    description: 'Address bar text color',
    key: 'omnibox_text' as const,
  },
  {
    id: 'omnibox_background',
    label: 'Omnibox Background',
    description: 'Address bar background color',
    key: 'omnibox_background' as const,
  },
];

export default function Editor() {
  const { config, setColor, setImage } = useThemeStore();
  const [imageError, setImageError] = useState<string>("");
  const [expandedColor, setExpandedColor] = useState<string | null>('frame');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    const file = e.target.files?.[0];
    
    if (!file) return;

    const result = validateImageFile(file);
    if (!result.isValid) {
      setImageError(result.message);
      return;
    }

    setImage("theme_frame", file);
  };

  const handleImageRemove = () => {
    setImageError("");
    setImage("theme_frame", null);
  };

  return (
    <div className="space-y-6">
      {/* 编辑器标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Theme Editor
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize your Chrome theme colors and images
        </p>
      </div>

      {/* 预设面板 */}
      <Presets />

      {/* 图片上传部分 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Theme Image
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload a background image for your theme
            </p>
          </div>
          {config.images.theme_frame && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
              <span>✓</span> Image added
            </span>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-6-8l-3-3m0 0l-3 3m3-3v13" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                Upload image
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPEG, WebP, or GIF (Max 5MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {imageError && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{imageError}</p>
            </div>
          )}

          {config.images.theme_frame && (
            <div className="space-y-3">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={config.images.theme_frame.url}
                  alt="Theme preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleImageRemove}
                className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg font-medium transition-colors text-sm"
              >
                Remove Image
              </button>
              
              {/* 颜色提取器 */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <ColorExtractor 
                  imageUrl={config.images.theme_frame.url}
                  onColorSelect={(color) => setColor('frame', color)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 颜色编辑部分 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Colors
        </h3>

        <div className="space-y-3">
          {COLOR_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all"
            >
              {/* 颜色项标题 */}
              <button
                onClick={() =>
                  setExpandedColor(
                    expandedColor === category.id ? null : category.id
                  )
                }
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{
                      background: `rgb(${config.colors[category.key]
                        .slice(0, 3)
                        .join(',')})`,
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {category.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedColor === category.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* 颜色选择器 */}
              {expandedColor === category.id && (
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <ColorPickerInput
                    color={config.colors[category.key]}
                    onChange={(color) => setColor(category.key, color)}
                    label={category.label}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
