"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityImageUrl } from "@/sanity/lib/image";

export interface GalleryPhoto {
  _id: string;
  title: string;
  caption?: string;
  tags?: string[];
  image: SanityImageSource;
}

interface FilmGalleryProps {
  photos: GalleryPhoto[];
}

export default function FilmGallery({ photos }: FilmGalleryProps) {
  const [query, setQuery] = useState("");
  const [visibleStrips, setVisibleStrips] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleStrips((current) => {
          const next = new Set(current);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = (entry.target as HTMLElement).dataset.photoId;
              if (id) next.add(id);
            }
          });
          return next;
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll<HTMLElement>("[data-photo-id]").forEach((strip) => observer.observe(strip));
    return () => observer.disconnect();
  }, [photos.length]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredPhotos = photos.filter((photo) => {
    if (!normalizedQuery) return true;
    return [photo.title, photo.caption, ...(photo.tags || [])]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(normalizedQuery));
  });

  return (
    <section className="w-full">
      <div className="mx-auto mb-12 flex w-full max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/70">
            Contact sheets
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">The archive</h2>
        </div>
        <label className="w-full sm:max-w-xs">
          <span className="sr-only">Search photos by title, caption, or tag</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the archive"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-amber-300/70"
          />
        </label>
      </div>

      {filteredPhotos.length ? (
        <div className="space-y-16">
          {filteredPhotos.map((photo) => (
            <article
              key={photo._id}
              data-photo-id={photo._id}
              className={`film-strip ${visibleStrips.has(photo._id) ? "film-strip-visible" : ""}`}
            >
              <div className="film-perforations film-perforations-top" aria-hidden="true" />
              <div className="mx-auto grid w-full max-w-5xl gap-6 px-6 py-8 md:grid-cols-[minmax(0,1fr)_18rem] md:items-center md:px-12">
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <Image
                    src={sanityImageUrl(photo.image).width(1600).quality(82).auto("format").url()}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-zinc-100">{photo.title}</h3>
                  {photo.caption && <p className="mt-2 text-sm leading-6 text-zinc-400">{photo.caption}</p>}
                  {photo.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {photo.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setQuery(tag)}
                          className="text-xs text-amber-200/70 transition hover:text-amber-100"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="film-perforations film-perforations-bottom" aria-hidden="true" />
            </article>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-sm text-zinc-500">No photographs match that search.</p>
      )}
    </section>
  );
}