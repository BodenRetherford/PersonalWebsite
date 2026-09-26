"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import SpectrumAnalyzer from "@/components/SpectrumAnalyzer";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export default function MusicPage() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData>({ isPlaying: false });

  // References for measuring actual overflow
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Poll Spotify API every 5 seconds
  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) {
          const data = await res.json();
          setSpotifyData(data);
        }
      } catch (err) {
        console.error("Failed to fetch Spotify status", err);
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  // Measure if track details exceed the available header space
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(textRef.current.scrollWidth > containerRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [spotifyData.title, spotifyData.artist, spotifyData.isPlaying]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#0e0e11] p-4 text-zinc-100 sm:p-8">
      {/* ========================================================= */}
      {/* 1. TOP BAR: Spotify Now Playing + Fluid Marquee           */}
      {/* ========================================================= */}
      <header className="relative flex w-full max-w-2xl items-center justify-between gap-3 rounded-xl border border-zinc-800/90 bg-zinc-900/70 p-3 shadow-2xl backdrop-blur-md">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Album Cover Art */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
            {spotifyData.albumImageUrl ? (
              <img
                src={spotifyData.albumImageUrl}
                alt="Album Artwork"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-700">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 2-1.79 2-4V7h4V3h-4z" />
                </svg>
              </div>
            )}
            {spotifyData.isPlaying && (
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
          </div>

          {/* Marquee Viewport */}
          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {spotifyData.isPlaying ? "Listening Now" : "Spotify Offline"}
            </span>

            {spotifyData.isPlaying ? (
              <div ref={containerRef} className="relative w-full overflow-hidden py-0.5">
                {/* Edge fade overlays using GPU gradients rather than mask-image */}
                {isOverflowing && (
                  <>
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-4 bg-gradient-to-r from-zinc-900/90 to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-l from-zinc-900/90 to-transparent" />
                  </>
                )}

                {isOverflowing ? (
                  <div className="animate-marquee-smooth">
                    {/* Primary Block */}
                    <div className="flex shrink-0 items-center pr-12">
                      <span className="text-sm font-medium text-zinc-100">{spotifyData.title}</span>
                      <span className="mx-2 text-zinc-500">—</span>
                      <span className="text-sm text-zinc-400">{spotifyData.artist}</span>
                    </div>
                    {/* Exact Duplicate Block for Seamless Wrapping */}
                    <div className="flex shrink-0 items-center pr-12" aria-hidden="true">
                      <span className="text-sm font-medium text-zinc-100">{spotifyData.title}</span>
                      <span className="mx-2 text-zinc-500">—</span>
                      <span className="text-sm text-zinc-400">{spotifyData.artist}</span>
                    </div>
                  </div>
                ) : (
                  /* Static rendering when the song title fits */
                  <div className="truncate text-sm font-medium text-zinc-100">
                    <span ref={textRef}>
                      {spotifyData.title}{" "}
                      <span className="text-zinc-400">— {spotifyData.artist}</span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="truncate text-sm font-medium text-zinc-400">
                Not currently playing
              </p>
            )}
          </div>
        </div>

        {/* Back to Room Link */}
        <Link
          href="/home"
          className="shrink-0 rounded-md border border-zinc-700/80 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
        >
          ← Room
        </Link>
      </header>

      {/* ========================================================= */}
      {/* 2. MIDDLE TILES: Spotify Profile & Vinyl Media Collection */}
      {/* ========================================================= */}
      <div className="my-auto grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Square 1: Spotify Profile */}
        <a
          href={process.env.NEXT_PUBLIC_SPOTIFY_PROFILE_URL || "https://open.spotify.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex aspect-square flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#1DB954]/60 hover:bg-zinc-900/80 hover:shadow-[#1DB954]/10"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#121212] p-5 shadow-inner transition duration-200 group-hover:scale-105 group-hover:bg-[#181818]">
            <svg
              className="h-16 w-16 fill-[#1DB954] transition-transform duration-200"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.218.358-.684.47-1.042.252-2.855-1.745-6.449-2.14-10.682-1.173-.41.093-.815-.164-.908-.573-.094-.41.164-.816.574-.909 4.636-1.06 8.599-.613 11.806 1.348.358.218.47.684.252 1.042zm1.468-3.26c-.276.449-.864.593-1.312.317-3.268-2.008-8.25-2.592-12.116-1.417-.506.154-1.04-.135-1.194-.641-.153-.507.135-1.04.641-1.194 4.414-1.34 9.907-.692 13.664 1.623.449.276.593.864.317 1.312zm.126-3.41c-3.918-2.327-10.375-2.541-14.116-1.405-.6.182-1.237-.156-1.42-.756-.182-.6.157-1.237.757-1.42 4.298-1.305 11.421-1.055 15.938 1.626.54.32.716 1.018.397 1.558-.32.54-1.018.717-1.556.397z" />
            </svg>
          </div>
          <h2 className="mt-5 text-base font-semibold tracking-wide text-zinc-100 group-hover:text-[#1DB954]">
            Spotify Profile
          </h2>
          <span className="mt-1 text-xs text-zinc-500">Open in new tab ↗</span>
        </a>

        {/* Square 2: Vinyl Collection */}
        <Link
          href="/music/media"
          className="group relative flex aspect-square flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900/80 hover:shadow-zinc-700/10"
        >
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-950 p-2 shadow-inner transition-transform duration-500 group-hover:rotate-45 group-hover:scale-105">
            <div className="absolute inset-1 rounded-full border border-zinc-800" />
            <div className="absolute inset-3 rounded-full border border-zinc-800/60" />
            <div className="absolute inset-5 rounded-full border border-zinc-800/40" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/90 shadow">
              <div className="h-2 w-2 rounded-full bg-[#0e0e11]" />
            </div>
          </div>
          <h2 className="mt-5 text-base font-semibold tracking-wide text-zinc-100 group-hover:text-white">
            Vinyl Catalog
          </h2>
          <span className="mt-1 text-xs text-zinc-500">Physical Discogs Collection →</span>
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM BAR: Inverted 16-Band LED Equalizer             */}
      {/* ========================================================= */}
      <SpectrumAnalyzer isPlaying={spotifyData.isPlaying} />
    </main>
  );
}