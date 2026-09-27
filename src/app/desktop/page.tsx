import Link from "next/link";
import { Briefcase, Code, FileText } from "lucide-react";

export default function DesktopPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#111113] p-6 text-zinc-100">
      <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Professional Links</h1>
          <Link
            href="/home"
            className="rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
          >
            ← Home
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href="https://github.com/BodenRetherford"
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub profile"
            className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-4 text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
          >
            <Code size={28} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm font-medium">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/boden-retherford-465966260/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open LinkedIn profile"
            className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-4 text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
          >
            <Briefcase size={28} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
          <a
            href="/Boden%20Retherford%20Resume.pdf"
            download
            aria-label="Download resume"
            className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-4 text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
          >
            <FileText size={28} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm font-medium">Resume</span>
          </a>
        </div>
      </div>
    </main>
  );
}