import { useState } from "react";
import { useThemeStore } from "../store";
import { rgbToString } from "../utils/color";const TABS = [
    { id: "tab1", label: "Docs" },
  { id: "tab2", label: "Theme" },
  { id: "tab3", label: "New Tab" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ControlButton({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <button
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5"
      style={{ color }}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function Preview() {
  const { config } = useThemeStore();
  const [activeTab, setActiveTab] = useState<TabId>("tab3");

  const frameColor = rgbToString(config.colors.frame);
  const toolbarColor = rgbToString(config.colors.toolbar);
  const toolbarTextColor = rgbToString(config.colors.toolbar_text);
  const toolbarIconColor = rgbToString(config.colors.toolbar_button_icon);
  const tabTextColor = rgbToString(config.colors.tab_text);
  const inactiveTabTextColor = rgbToString(config.colors.tab_background_text);
  const omniboxBgColor = rgbToString(config.colors.omnibox_background);
  const omniboxTextColor = rgbToString(config.colors.omnibox_text);
  const ntpBgColor = rgbToString(config.colors.ntp_background);
  const themeImage = config.images.theme_frame?.url;

  const frameBackground = themeImage
    ? `linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02)), url(${themeImage}), ${frameColor}`
    : `linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02)), ${frameColor}`;

  const pageBackground = themeImage
    ? `linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.18)), url(${themeImage}), ${ntpBgColor}`
    : `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0)), ${ntpBgColor}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Preview</h2>
        <p className="mt-1 text-sm text-slate-500">
          A cleaner browser-inspired preview with the theme colors mapped to the main surfaces.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)]">
        <div
          className="border-b border-black/10 px-4 pt-3"
          style={{
            background: frameBackground,
            backgroundSize: themeImage ? "cover, cover, auto" : "cover, auto",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex items-end gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex min-w-[148px] items-center justify-between rounded-t-[18px] px-4 py-3 text-left transition"
                  style={{
                    background: isActive ? toolbarColor : "rgba(255,255,255,0.1)",
                    color: isActive ? tabTextColor : inactiveTabTextColor,
                  }}
                >
                  <span className="truncate text-sm font-medium">{tab.label}</span>
                  <span className="ml-3 text-xs opacity-60">x</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="border-b border-black/10 px-4 py-3"
          style={{ background: toolbarColor, color: toolbarTextColor }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ControlButton label="<" color={toolbarIconColor} />
              <ControlButton label=">" color={toolbarIconColor} />
              <ControlButton label="R" color={toolbarIconColor} />
            </div>

            <div
              className="flex min-w-0 flex-1 items-center gap-3 rounded-full border px-4 py-2.5"
              style={{
                background: omniboxBgColor,
                color: omniboxTextColor,
                borderColor: "rgba(15,23,42,0.08)",
              }}
            >
              <span className="text-xs opacity-70">lock</span>
              <span className="truncate text-sm">chrome://newtab</span>
            </div>

            <div className="flex items-center gap-1">
              <ControlButton label="*" color={toolbarIconColor} />
              <ControlButton label="..." color={toolbarIconColor} />
            </div>
          </div>
        </div>

        <div
          className="relative min-h-[820px] overflow-hidden"
          style={{
            background: pageBackground,
            backgroundSize: themeImage ? "cover, cover, auto" : "cover, auto",
            backgroundPosition: themeImage ? "center center, center center, center" : "center top, center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {!themeImage && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_32%)]" />
          )}

          <div className="absolute right-6 top-5 flex items-center gap-4 text-sm text-white/90">
            <span>Gmail</span>
            <span>Images</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/25 font-medium">S</span>
          </div>

          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-28 text-center">
            <div className="text-[76px] font-medium tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]">
              Google
            </div>

            <div
              className="mt-10 flex w-full max-w-[760px] items-center gap-3 rounded-full px-6 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
              style={{
                background: omniboxBgColor,
                color: omniboxTextColor,
              }}
            >
              <span className="text-sm opacity-70">search</span>
              <span className="flex-1 text-left text-[15px]">Search Google or type a URL</span>
              <span className="text-sm opacity-70">mic</span>
            </div>

            <div className="mt-12 flex flex-col items-center text-white">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-black/45 text-4xl shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
                +
              </div>
              <span className="mt-3 text-sm text-white/90">Add shortcut</span>
            </div>
          </div>
" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  No Frame Image
                </span>
              </div>
            )}
          </div>
00" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  No Frame Image
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
