import { useState } from "react";
import type { RGB } from "../types/theme";
import { extractColorsFromImage } from "../utils/colorExtractor";
import { rgbToHex } from "../utils/color";

interface ColorExtractorProps {
  imageUrl: string;
  colorCategories: Array<{
    id: string;
    label: string;
    key: string;
  }>;
  onColorSelect: (colorKey: string, color: RGB) => void;
}

interface ExtractedColor {
  color: RGB;
  percentage: number;
}

export default function ColorExtractor({
  imageUrl,
  colorCategories,
  onColorSelect,
}: ColorExtractorProps) {
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(colorCategories[0]?.key || "frame");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleExtractColors = async () => {
    setLoading(true);
    setError("");

    try {
      const extractedColors = await extractColorsFromImage(imageUrl, 6);
      setColors(extractedColors);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract colors"
      );
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleColorClick = (color: RGB) => {
    onColorSelect(selectedCategory, color);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleExtractColors}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-md"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Extracting colors...
          </span>
        ) : (
          "🎨 Extract Colors from Image"
        )}
      </button>

      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {colors.length > 0 && (
        <div className="space-y-3">
          {/* 颜色应用到选择器 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Apply to
            </label>
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-between"
              >
                <span className="text-sm">
                  {colorCategories.find(c => c.key === selectedCategory)?.label || 'Select color'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {colorCategories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => {
                        setSelectedCategory(category.key);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        selectedCategory === category.key
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 提取的颜色网格 */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Extracted Colors
            </p>
            <div className="grid grid-cols-2 gap-3">
              {colors.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorClick(item.color)}
                  className="group relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-all hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-lg"
                >
                  <div
                    className="h-16 w-full transition-transform group-hover:scale-110"
                    style={{
                      background: `rgb(${item.color[0]}, ${item.color[1]}, ${item.color[2]})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-4 h-4 text-gray-900 dark:text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                  </div>
                  <div className="px-2 py-1 text-xs font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 truncate">
                    {rgbToHex(item.color)}
                  </div>
                  <div className="px-2 py-px text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                    {item.percentage.toFixed(1)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}