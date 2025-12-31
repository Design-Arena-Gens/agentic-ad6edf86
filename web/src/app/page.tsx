"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { generateDesign } from "@/lib/thumbnailGenerator";

const DEFAULT_DESCRIPTION =
  "Bold AI thumbnail teaching how to grow a YouTube channel fast with automation and storytelling.";

export default function Home() {
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [design, setDesign] = useState(() => generateDesign(DEFAULT_DESCRIPTION));
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const contrastAccent = useMemo(() => {
    const { accentColor } = design;
    const hex = accentColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? "#0f172a" : "#f8fafc";
  }, [design]);

  const handleGenerate = () => {
    setDesign(generateDesign(description));
  };

  const handleQuickIdea = (idea: string) => {
    setDescription(idea);
    setDesign(generateDesign(idea));
  };

  const handleDownload = async () => {
    if (!previewRef.current || isExporting) {
      return;
    }
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        width: 1280,
        height: 720,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          background: "transparent",
        },
      });
      const link = document.createElement("a");
      link.download = `thumbnail-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("thumbnail-export-failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  const quickIdeas = useMemo(
    () => [
      "High-energy gaming thumbnail announcing a Fortnite tournament with prizes.",
      "Clean minimalist finance thumbnail revealing how to invest $1000 wisely.",
      "Vibrant travel vlog thumbnail exploring hidden gems in Kyoto, Japan.",
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#1e293b_0%,_#020617_60%)] text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 sm:px-8 lg:flex-row">
        <section className="w-full rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-[0_30px_80px_rgba(15,_23,_42,_0.35)] backdrop-blur md:p-8 lg:w-[30rem]">
          <header className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              YouTube Thumbnail Architect
            </div>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-slate-50 md:text-4xl">
              Describe the video. Watch a thumbnail concept appear.
            </h1>
            <p className="mt-3 text-sm text-slate-400 md:text-base">
              Feed the agent a short brief. It extracts the hook, mood, and pacing to craft a
              magnetic 16:9 layout that is ready to export.
            </p>
          </header>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Video Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-100 shadow-inner outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/20"
                placeholder="Example: High-energy review of the newest electric car with emphasis on design, range, and futuristic tech."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                className="flex-1 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                Generate Concept
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-slate-100 transition hover:border-white/30 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isExporting}
              >
                {isExporting ? "Preparing..." : "Download PNG"}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Quick Ideas
              </p>
              <div className="grid gap-3">
                {quickIdeas.map((idea) => (
                  <button
                    key={idea}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-left text-xs leading-relaxed text-slate-300 transition hover:border-white/25 hover:bg-slate-900/60"
                    onClick={() => handleQuickIdea(idea)}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Design Notes
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {design.suggestions.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-[6px] inline-flex h-2 w-2 rounded-full bg-slate-100" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative w-full flex-1 rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-[0_40px_90px_rgba(15,_23,_42,_0.35)] backdrop-blur lg:ml-auto lg:p-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Live Preview
              </p>
              <p className="text-sm text-slate-300">Generated for the latest description.</p>
            </div>
            <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              16:9 Canvas
            </div>
          </div>

          <div
            ref={previewRef}
            className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-[0_25px_60px_rgba(15,_23,_42,_0.55)]"
            style={{
              backgroundImage: `linear-gradient(135deg, ${design.gradient.from}, ${design.gradient.to})`,
            }}
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_45%)]" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_2px,transparent_2px,transparent_6px)]" />
            </div>

            {design.shapes.map((shape, index) => (
              <div
                key={`${shape.top}-${shape.left}-${index}`}
                className="pointer-events-none absolute rounded-full mix-blend-screen"
                style={{
                  top: `${shape.top}%`,
                  left: `${shape.left}%`,
                  width: `${shape.size}px`,
                  height: `${shape.size}px`,
                  backgroundColor: design.accentColor,
                  opacity: shape.opacity,
                  filter: `blur(${shape.blur}px)`,
                }}
              />
            ))}

            <div className="absolute inset-0 flex flex-col justify-between px-12 py-10">
              <div className="flex items-center justify-between">
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
                  {design.tagline}
                </div>
                <div
                  className="rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wide shadow-lg"
                  style={{
                    backgroundColor: design.accentColor,
                    color: contrastAccent,
                  }}
                >
                  {design.badgeText}
                </div>
              </div>

              <div className="mt-auto grid gap-6 md:max-w-xl">
                <h2 className="text-5xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
                  {design.title}
                </h2>
                <p className="text-lg font-medium text-white/80 md:text-xl">{design.subtitle}</p>
              </div>

              <div className="mt-10 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                <span>Hook • Mood • Composition</span>
                <span>Designed in seconds</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
