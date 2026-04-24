import { useState } from "react";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import DownloadButton from "./components/DownloadButton";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)]">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">
                Chrome Theme Studio
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Make your Chrome theme
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Tune colors on the left and see them land on the correct browser
                surfaces on the right.
              </p>
            </div>
          </div>
          <DownloadButton />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside
          className={`${
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-[110%] opacity-0 lg:translate-x-0 lg:opacity-100"
          } fixed inset-y-[92px] left-4 z-10 w-[min(92vw,420px)] overflow-y-auto rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl transition duration-300 lg:sticky lg:top-[104px] lg:h-[calc(100vh-128px)] lg:w-[420px] lg:flex-none lg:translate-x-0 lg:opacity-100`}
        >
          <Editor />
        </aside>

        <main className="min-w-0 flex-1 lg:pl-0">
          <div className="rounded-[32px] border border-white/70 bg-white/55 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
            <Preview />
          </div>
        </main>
      </div>
      <div className="mx-auto text-center w-full min-h-[200px]">
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: "1150px", height: "250px" }}
          data-ad-client="ca-pub-4988552421895566"
          data-ad-slot="3046848393"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </div>
  );
}
