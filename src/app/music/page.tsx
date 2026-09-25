import Link from "next/link";

export default function MusicPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#111113] p-6 text-zinc-100">
      <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Music & Audio</h1>
          <Link
            href="/home"
            className="rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
          >
            ← Back to Room
          </Link>
        </div>

        <p className="mb-6 text-sm text-zinc-400">
          Audio setup, vinyl record catalog, and recent listening history.
        </p>

        {/* Content placeholder list */}
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-4 transition hover:border-zinc-700">
            <h2 className="text-sm font-semibold text-zinc-200">Vinyl Collection</h2>
            <p className="mt-1 text-xs text-zinc-500">Catalogued LPs, pressings, and rotation logs.</p>
          </div>
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-4 transition hover:border-zinc-700">
            <h2 className="text-sm font-semibold text-zinc-200">Hi-Fi Setup & Gear</h2>
            <p className="mt-1 text-xs text-zinc-500">Turntable, receivers, equalizers, and signal path specs.</p>
          </div>
        </div>
      </div>
    </main>
  );
}