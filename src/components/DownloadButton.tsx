import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useThemeStore } from "../store";
import {
  MANIFEST_VERSION,
  DEFAULT_THEME_VERSION,
  DEFAULT_THEME_NAME,
  DEFAULT_THEME_DESCRIPTION,
  NTP_BACKGROUND_ALIGNMENT,
  NTP_BACKGROUND_REPEAT,
  NTP_LOGO_ALTERNATE,
} from "../constants";
import { ThemeDownloadError, getErrorMessage } from "../utils/errors";

type DownloadState = "idle" | "loading" | "success" | "error";

export default function DownloadButton() {
  const { config } = useThemeStore();
  const [state, setState] = useState<DownloadState>("idle");
  const [error, setError] = useState<string>("");

  const handleDownload = async () => {
    setState("loading");
    setError("");

    try {
      const zip = new JSZip();

      // Create images folder
      const imgFolder = zip.folder("images");
      if (!imgFolder) {
        throw new ThemeDownloadError(
          "ZIP_ERROR",
          "Failed to create images folder in ZIP",
        );
      }

      const images: Record<string, string> = {};

      // Add images to ZIP
      try {
        for (const key in config.images) {
          const item = config.images[key as keyof typeof config.images];

          if (item?.file) {
            const exetension = item.file.name.split(".").pop() || "jpg";
            const filename = `${key}.${exetension}`;
            imgFolder.file(filename, item.file);
            images[key] = `images/${filename}`;
          }
        }
      } catch (err) {
        throw new ThemeDownloadError(
          "ZIP_ERROR",
          `Failed to add image: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      // Create manifest
      let manifest: Record<string, any>;
      try {
        manifest = {
          manifest_version: MANIFEST_VERSION,
          name: "__MSG_extName__",
          version: DEFAULT_THEME_VERSION,
          default_locale: "en",
          description: "__MSG_extDescription__",

          theme: {
            colors: {
              frame: config.colors.frame,
              toolbar: config.colors.toolbar,
              toolbar_text: config.colors.toolbar_text,
              toolbar_button_icon: config.colors.toolbar_button_icon,
              ntp_background: config.colors.ntp_background,
              tab_text: config.colors.tab_text,
              tab_background_text: config.colors.tab_background_text,
              omnibox_text: config.colors.omnibox_text,
              omnibox_background: config.colors.omnibox_background,
            },
          },

          properties: {
            ntp_background_alignment: NTP_BACKGROUND_ALIGNMENT,
            ntp_background_repeat: NTP_BACKGROUND_REPEAT,
            ntp_logo_alternate: NTP_LOGO_ALTERNATE,
          },
        };
        if (images["theme_frame"]) {
          manifest["theme"]["images"] = {
            theme_ntp_background: images["theme_frame"],
          };
        }
      } catch (err) {
        throw new ThemeDownloadError(
          "MANIFEST_ERROR",
          `Failed to create manifest: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      try {
        zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      } catch (err) {
        throw new ThemeDownloadError(
          "ZIP_ERROR",
          `Failed to add manifest to ZIP: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      // Add localization file
      try {
        zip.file(
          "_locales/en/messages.json",
          JSON.stringify(
            {
              extName: { message: DEFAULT_THEME_NAME },
              extDescription: { message: DEFAULT_THEME_DESCRIPTION },
            },
            null,
            2,
          ),
        );
      } catch (err) {
        throw new ThemeDownloadError(
          "ZIP_ERROR",
          `Failed to add localization file: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      // Generate and download ZIP
      let blob: Blob;
      try {
        blob = await zip.generateAsync({ type: "blob" });
      } catch (err) {
        throw new ThemeDownloadError(
          "ZIP_ERROR",
          `Failed to generate ZIP: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }

      try {
        saveAs(blob, "chrome-theme.zip");
        setState("success");
        // Reset success state after 3 seconds
        setTimeout(() => setState("idle"), 3000);
      } catch (err) {
        throw new ThemeDownloadError(
          "DOWNLOAD_ERROR",
          `Failed to download file: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setState("error");
      console.error("Theme download failed:", err);
    }
  };

  const isLoading = state === "loading";
  const showSuccess = state === "success";
  const showError = state === "error";

  return (
    <div className="flex flex-col items-end gap-3">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform ${
          isLoading
            ? "bg-gray-400 text-white cursor-not-allowed opacity-75"
            : showSuccess
              ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95"
        }`}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
        )}
        {showSuccess && (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {!isLoading && !showSuccess && (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        <span>
          {isLoading
            ? "Creating..."
            : showSuccess
              ? "Downloaded!"
              : "Download Theme"}
        </span>
      </button>

      {showError && (
        <div className="w-80 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
            Download Failed
          </p>
          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
