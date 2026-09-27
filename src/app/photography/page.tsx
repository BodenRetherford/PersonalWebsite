import Link from "next/link";

export default function PhotosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#111113] p-6 text-zinc-100">
      <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Photography</h1>
          <Link
            href="/home"
            className="rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
          >
            ← Home
          </Link>
        </div>

        <p className="text-sm text-zinc-400">
          A collection of photographs, visual studies, and things worth remembering.
        </p>
      </div>
    </main>
  );
}