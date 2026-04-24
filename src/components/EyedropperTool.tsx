import { useEffect, useRef, useState } from "react";
import type { RGB } from "../types/theme";
import { parseRgbColor } from "../hooks/useEyedropper";

interface EyedropperToolProps {
  onColorPicked: (color: RGB) => void;
}

export default function EyedropperTool({ onColorPicked }: EyedropperToolProps) {
  const [isActive, setIsActive] = useState(false);
  const [cursorColor, setCursorColor] = useState<string>("#000000");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const isPickingRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      isPickingRef.current = false;
      return;
    }

    isPickingRef.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPickingRef.current) return;

      setCursorPos({ x: e.clientX, y: e.clientY });

      // 临时禁用overlay的指针事件来获取下面的元素
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.pointerEvents = "none";
      }

      const element = document.elementFromPoint(e.clientX, e.clientY);

      if (overlay) {
        overlay.style.pointerEvents = "auto";
      }

      if (element && element !== overlay) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        setCursorColor(bgColor);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!isPickingRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.pointerEvents = "none";
      }

      const element = document.elementFromPoint(e.clientX, e.clientY);

      if (overlay) {
        overlay.style.pointerEvents = "auto";
      }

      if (element && element !== overlay) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor;
        
        // Try to parse the color
        const rgb = parseRgbColor(bgColor);
        if (rgb) {
          onColorPicked(rgb);
        } else {
          // If we can't parse the color, try using the color string directly
          console.warn("Could not parse color:", bgColor);
        }
      }

      // Always exit picking mode on click
      isPickingRef.current = false;
      setIsActive(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        isPickingRef.current = false;
        setIsActive(false);
      }
    };

    // Use capture phase for better control
    document.addEventListener("mousemove", handleMouseMove, false);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, false);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [isActive, onColorPicked]);

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md flex items-center justify-center gap-2"
        title="Pick a color from anywhere on the screen"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
        Pick Color
      </button>
    );
  }

  return (
    <>
      {/* 全屏覆盖层 */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 cursor-crosshair"
        style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.02) 10px, rgba(0,0,0,.02) 20px)",
        }}
      >
        {/* 光标放大镜 */}
        <div
          className="fixed w-20 h-20 border-2 border-white rounded-full shadow-lg pointer-events-none"
          style={{
            left: cursorPos.x - 40,
            top: cursorPos.y - 40,
            backgroundColor: cursorColor,
            boxShadow: `0 0 0 2px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)`,
          }}
        >
          {/* 中心点 */}
          <div
            className="absolute w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "50%",
              top: "50%",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
            }}
          />
          {/* 十字线 */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40 transform -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40 transform -translate-x-1/2" />
        </div>

        {/* 颜色信息面板 */}
        <div className="fixed bottom-8 left-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-200 dark:border-gray-700 pointer-events-none z-50">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Picked Color
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 shadow-sm"
                  style={{ backgroundColor: cursorColor }}
                />
                <div className="flex flex-col gap-1">
                  <div className="font-mono text-sm text-gray-900 dark:text-white">
                    {cursorColor}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <strong>Click</strong> to confirm • <strong>ESC</strong> to cancel
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
