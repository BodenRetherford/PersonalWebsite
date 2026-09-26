"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Layer order from FRONT to BACK for hit-testing
const INTERACTIVE_ITEMS = [
  {
    id: "speaker",
    src: "/Speakers.png",
    href: "/music",
  },
  {
    id: "computer",
    src: "/Computer.png",
    href: "/desktop",
  },
  {
    id: "bookshelf-front",
    src: "/BookshelfLeft.png",
    href: "/library",
  },
  {
    id: "turntable",
    src: "/Turntable.png",
    href: "/music",
  },
  {
    id: "bookshelf-back",
    src: "/BookshelfRight.png",
    href: "/library",
  },
];

const MENU_ITEMS = [
  { label: "Library", href: "/library", targetId: "library" },
  { label: "Music & Audio", href: "/music", targetId: "turntable" },
  { label: "Workstation", href: "/desktop", targetId: "computer" },
];

export default function Room() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextsRef = useRef<Map<string, CanvasRenderingContext2D>>(new Map());
  const router = useRouter();

  // Highlight both the turntable and speakers when either is active
  const isMusicActive = activeId === "turntable" || activeId === "speaker";

  // 1. Pre-render layers onto offscreen canvas for alpha testing
  useEffect(() => {
    INTERACTIVE_ITEMS.forEach((item) => {
      const img = document.createElement("img");
      img.src = item.src;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 240;
        canvas.height = 264;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0, 240, 264);
          contextsRef.current.set(item.id, ctx);
        }
      };
    });
  }, []);

  // 2. Map cursor to native coordinates & check alpha channel
  const getItemAtCursor = (
    e: React.MouseEvent<HTMLDivElement>
  ): typeof INTERACTIVE_ITEMS[0] | null => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const pixelX = Math.floor((clientX / rect.width) * 240);
    const pixelY = Math.floor((clientY / rect.height) * 264);

    if (pixelX < 0 || pixelX >= 240 || pixelY < 0 || pixelY >= 264) return null;

    for (const item of INTERACTIVE_ITEMS) {
      const ctx = contextsRef.current.get(item.id);
      if (!ctx) continue;

      const alpha = ctx.getImageData(pixelX, pixelY, 1, 1).data[3];
      if (alpha > 20) {
        return item;
      }
    }

    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const hit = getItemAtCursor(e);
    setActiveId(hit ? hit.id : null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const hit = getItemAtCursor(e);
    if (hit) {
      router.push(hit.href);
    }
  };

  return (
    <>
      {/* --- TOP-LEFT HAMBURGER MENU --- */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-lg border border-zinc-700/80 bg-zinc-900/85 p-2 shadow-lg backdrop-blur-md transition hover:border-zinc-500 hover:bg-zinc-800 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <span
            className={`h-0.5 w-5 rounded bg-zinc-200 transition-all duration-200 ${
              isMenuOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-zinc-200 transition-all duration-200 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-zinc-200 transition-all duration-200 ${
              isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>

        {/* Dropdown Panel */}
        {isMenuOpen && (
          <nav className="mt-3 w-52 rounded-xl border border-zinc-800 bg-zinc-900/90 p-2 shadow-2xl backdrop-blur-md">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Navigate
            </div>
            <div className="flex flex-col space-y-1">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setActiveId(item.targetId)}
                  onMouseLeave={() => setActiveId(null)}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* --- ISOMETRIC ROOM VIEWPORT --- */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveId(null)}
        onClick={handleClick}
        className={`relative aspect-[240/264] h-[96dvh] max-w-[96dvw] shrink-0 overflow-hidden select-none ${
          activeId ? "cursor-pointer" : "cursor-default"
        }`}
      >
        {/* Layer 0: Empty Room */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/Room.png"
            alt="Room Background"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="pixel-art object-contain"
          />
        </div>

        {/* Layer 1: Back/Right Bookshelf */}
        <div
          className={`absolute inset-0 z-10 pointer-events-none transition duration-150 ${
            activeId === "bookshelf-back" || activeId === "library"
              ? "brightness-125 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              : ""
          }`}
        >
          <Image
            src="/BookshelfRight.png"
            alt="Back Bookshelf"
            fill
            unoptimized
            sizes="100vw"
            className="pixel-art object-contain"
          />
        </div>

        {/* Layer 2: Turntable Table */}
        <div
          className={`absolute inset-0 z-20 pointer-events-none transition duration-150 ${
            isMusicActive
              ? "brightness-125 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              : ""
          }`}
        >
          <Image
            src="/Turntable.png"
            alt="Turntable"
            fill
            unoptimized
            sizes="100vw"
            className="pixel-art object-contain"
          />
        </div>

        {/* Layer 3: Front/Left Bookshelf */}
        <div
          className={`absolute inset-0 z-30 pointer-events-none transition duration-150 ${
            activeId === "bookshelf-front" || activeId === "library"
              ? "brightness-125 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              : ""
          }`}
        >
          <Image
            src="/BookshelfLeft.png"
            alt="Front Bookshelf"
            fill
            unoptimized
            sizes="100vw"
            className="pixel-art object-contain"
          />
        </div>

        {/* Layer 4: Desk */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <Image
            src="/Desk.png"
            alt="Desk"
            fill
            unoptimized
            sizes="100vw"
            className="pixel-art object-contain"
          />
        </div>

        {/* Layer 5: Computer */}
        <div
          className={`absolute inset-0 z-50 pointer-events-none transition duration-150 ${
            activeId === "computer"
              ? "brightness-125 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              : ""
          }`}
        >
          <Image
            src="/Computer.png"
            alt="Computer"
            fill
            unoptimized
            sizes="100vw"
            className="pixel-art object-contain"
          />
        </div>

        {/* Layer 6: Stereo Speakers (Highest Z-Index Layer) */}
        <div
          className={`absolute inset-0 z-60 pointer-events-none transition duration-150 ${
            isMusicActive
              ? "brightness-125 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              : ""
          }`}
        >
          <Image
            src="/Speakers.png"
            alt="Speakers"
            fill
            unoptimized
            sizes="100vw"
            className="pixel-art object-contain"
          />
        </div>
      </div>
    </>
  );
}