import { useState } from "react";
import { useThemeStore } from "../store";
import { rgbToString } from "../utils/color";const TABS = [
    { id: "tab1", label: "VSCode", accent: "#79d14b" },
  { id: "tab2", label: "localhost", accent: "#e4d45e" },
  { id: "tab3", label: "chrome-theme-maker", accent: "#9f7aea" },
  { id: "tab4", label: "Extensions", accent: "#1f2937" },
  { id: "tab5", label: "New Tab", accent: "#1f2937" },
] as const;

const BOOKMARKS = [
  "Apps",
  "localhost",
  "bilibili.com",
  "google.com",
  "ChatAI",
  "AI",
  "Tool",
  "Games",
];

type TabId = (typeof TABS)[number]["id"];

function ToolbarButton({
  label,
  color,
  wide = false,
}: {
  label: string;
  color: string;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex h-9 items-center justify-center rounded-full transition hover:bg-black/5 ${
        wide ? "min-w-[42px] px-3" : "w-9"
      }`}
      style={{ color }}
    >
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default function Preview() {
  const { config } = useThemeStore();
  const [activeTab, setActiveTab] = useState<TabId>("tab5");

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
    ? `linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04)), url(${themeImage}), ${frameColor}`
    : `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04)), ${frameColor}`;

  const ntpBackground = themeImage
    ? `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.18)), url(${themeImage}), ${ntpBgColor}`
    : `radial-gradient(circle at top, rgba(255,255,255,0.18), rgba(255,255,255,0) 34%), ${ntpBgColor}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Preview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Updated to follow the real Chrome screenshot much more closely.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
        <div
          className="border-b border-black/10"
          style={{
            background: frameBackground,
            backgroundSize: themeImage ? "cover, cover, auto" : "cover, auto",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex items-center justify-between px-3 pt-2">
            <div className="flex min-w-0 items-end gap-1 overflow-hidden pr-3">
              <button
                type="button"
                className="mb-2 ml-1 flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-semibold text-slate-800 transition hover:bg-black/5"
                style={{ background: toolbarColor }}
              >
                v
              </button>

              {TABS.map((tab) => {
                const isActive = tab.id === activeTab;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="group relative flex h-12 min-w-[156px] items-center gap-3 rounded-t-[18px] px-4 text-left transition"
                    style={{
                      background: isActive ? toolbarColor : "rgba(255,255,255,0.08)",
                      color: isActive ? tabTextColor : inactiveTabTextColor,
                    }}
                  >
                    {!isActive && (
                      <span className="absolute inset-x-6 bottom-0 h-px bg-white/35" />
                    )}
                    <span
                      className="h-4 w-4 rounded-full border border-black/10"
                      style={{ background: tab.accent }}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {tab.label}
                    </span>
                    <span className="text-xs opacity-65">x</span>
                  </button>
                );
              })}

              <button
                type="button"
                className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl text-2xl text-white/90 transition hover:bg-white/10"
              >
                +
              </button>
            </div>

            <div className="hidden items-center lg:flex">
              <button className="flex h-11 w-11 items-center justify-center text-white/90 transition hover:bg-white/10">
                -
              </button>
              <button className="flex h-11 w-11 items-center justify-center text-white/90 transition hover:bg-white/10">
                o
              </button>
              <button className="flex h-11 w-11 items-center justify-center text-white/90 transition hover:bg-[#e81123]">
                x
              </button>
            </div>
          </div>
        </div>

        <div
          className="border-b border-black/10 px-4 py-2"
          style={{ background: toolbarColor, color: toolbarTextColor }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ToolbarButton label="<" color={toolbarIconColor} />
              <ToolbarButton label=">" color={toolbarIconColor} />
              <ToolbarButton label="R" color={toolbarIconColor} />
              <ToolbarButton label="H" color={toolbarIconColor} />
            </div>

            <div
              className="flex min-w-0 flex-1 items-center gap-3 rounded-[22px] border-[3px] px-4 py-2 shadow-inner"
              style={{
                background: omniboxBgColor,
                color: omniboxTextColor,
                borderColor: frameColor,
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl text-[#ea4335]">
                G
              </div>
              <span className="truncate text-sm font-medium">localhost</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="rounded-full bg-black/8 px-4 py-1.5 text-sm font-medium">AI Mode</div>
                <span className="text-base">Q</span>
              </div>
            </div>

            <div className="hidden items-center gap-1 xl:flex">
              <ToolbarButton label="@" color={toolbarIconColor} />
              <ToolbarButton label="AI" color={toolbarIconColor} wide />
              <ToolbarButton label="[]" color={toolbarIconColor} />
              <ToolbarButton label="D" color={toolbarIconColor} />
              <ToolbarButton label="..." color={toolbarIconColor} />
            </div>
          </div>
        </div>

        <div
          className="border-b border-black/10 px-4 py-2"
          style={{ background: toolbarColor, color: toolbarTextColor }}
        >
          <div className="flex items-center gap-3 overflow-hidden text-sm">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-lg">::</span>
              <span className="font-medium">Apps</span>
            </div>

            {BOOKMARKS.map((item) => (
              <div
                key={item}
                className="whitespace-nowrap rounded-xl border border-black/10 bg-white/50 px-3 py-1"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative min-h-[640px] overflow-hidden"
          style={{
            background: ntpBackground,
            backgroundSize: themeImage ? "cover, cover, auto" : "cover, auto",
            backgroundPosition: themeImage ? "center center, center center, center" : "center top, center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {!themeImage && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_40%_70%,rgba(255,255,255,0.07),transparent_20%)]" />
          )}

          <div className="absolute right-5 top-5 flex items-center gap-4 text-sm text-white/90">
            <span>Gmail</span>
            <span>Images</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-black/20 text-xs">::</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/30 font-medium">S</span>
          </div>

          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-28 text-center">
            <div className="text-[80px] font-medium tracking-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
              Google
            </div>

            <div
              className="mt-10 flex w-full max-w-[760px] items-center gap-4 rounded-full px-7 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
              style={{
                background: omniboxBgColor,
                color: omniboxTextColor,
              }}
            >
              <span className="text-lg opacity-70">Q</span>
              <span className="flex-1 text-left text-[15px]">Search Google or type a URL</span>
              <span className="text-base opacity-70">M</span>
              <span className="text-base opacity-70">C</span>
              <div className="rounded-full bg-black/10 px-4 py-1.5 text-sm font-medium">AI Mode</div>
            </div>

            <div className="mt-10 flex flex-col items-center text-white">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-black/50 text-4xl shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
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
