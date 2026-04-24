import { useState } from "react";
import { ChromePicker } from "react-color";
import type { ColorResult } from "react-color";
import type { RGB } from "../types/theme";
import { rgbToHex, hexToRgb } from "../utils/color";

interface ColorPickerInputProps {
  color: RGB;
  onChange: (color: RGB) => void;
  label?: string;
}

export default function ColorPickerInput({
  color,
  onChange,
}: ColorPickerInputProps) {
  const [copied, setCopied] = useState(false);
  const [hexInput, setHexInput] = useState(rgbToHex(color));

  const handleColorChange = (c: ColorResult) => {
    const newColor: RGB = [c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a];
    onChange(newColor);
    setHexInput(rgbToHex(newColor));
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value.toUpperCase());

    if (value.length === 7 && value.startsWith("#")) {
      const rgb = hexToRgb(value);
      if (rgb) {
        onChange([rgb[0], rgb[1], rgb[2], color[3] ?? 1]);
      }
    }
  };

  const handleCopyHex = async () => {
    try {
      await navigator.clipboard.writeText(hexInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyRgb = async () => {
    const rgbString = `rgb(${color.slice(0, 3).join(", ")})`;
    try {
      await navigator.clipboard.writeText(rgbString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Color Picker */}
      <div className="flex justify-center">
        <ChromePicker
          color={{
            r: color[0],
            g: color[1],
            b: color[2],
            a: color[3] ?? 1,
          }}
          onChange={handleColorChange}
          disableAlpha={false}
        />
      </div>

      {/* Color Value Display and Input */}
      <div className="space-y-3">
        {/* Hex Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Hex Color
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#000000"
              maxLength={7}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
            />
            <button
              onClick={handleCopyHex}
              className="px-3 py-2 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors text-sm font-medium"
              title="Copy hex value"
            >
              {copied ? "✓" : "📋"}
            </button>
          </div>
        </div>

        {/* RGB Display */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            RGB Color
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-300 break-all">
              rgb({color[0]}, {color[1]}, {color[2]}
              {color[3] !== undefined && `, ${color[3]}`})
            </div>
            <button
              onClick={handleCopyRgb}
              className="px-3 py-2 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors text-sm font-medium"
              title="Copy RGB value"
            >
              {copied ? "✓" : "📋"}
            </button>
          </div>
        </div>

        {/* Color Preview */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className="col-span-3 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden"
            style={{
              background: `rgb(${color[0]}, ${color[1]}, ${color[2]}`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
