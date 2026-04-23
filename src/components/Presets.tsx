import { useThemeStore } from "../store";
import { THEME_PRESETS } from "../utils/presets";

export default function Presets() {
  const { setColors } = useThemeStore();

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    // Apply all colors from preset at once
    setColors(preset.colors);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Presets
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {THEME_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 group"
          >
            <div className="flex gap-1">
              {preset.colors.frame && (
                <div
                  className="w-5 h-5 rounded shadow-sm"
                  style={{
                    background: `rgb(${preset.colors.frame
                      .slice(0, 3)
                      .join(',')})`,
                  }}
                />
              )}
              {preset.colors.toolbar && (
                <div
                  className="w-5 h-5 rounded shadow-sm"
                  style={{
                    background: `rgb(${preset.colors.toolbar
                      .slice(0, 3)
                      .join(',')})`,
                  }}
                />
              )}
              {preset.colors.ntp_background && (
                <div
                  className="w-5 h-5 rounded shadow-sm"
                  style={{
                    background: `rgb(${preset.colors.ntp_background
                      .slice(0, 3)
                      .join(',')})`,
                  }}
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {preset.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {preset.description}
              </p>
            </div>

            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
