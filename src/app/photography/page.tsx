import Link from "next/link";
import FilmGallery, { type GalleryPhoto } from "@/components/FilmGallery";
import { hasSanityConfig } from "@/sanity/lib/env";
import { sanityClient } from "@/sanity/lib/client";
import { photosQuery, siteSettingsQuery } from "@/sanity/lib/queries";

interface SiteSettings {
  photographyBlurb?: string;
}

async function getPhotographyContent() {
  if (!hasSanityConfig) {
    return { photos: [], settings: null };
  }

  return sanityClient.fetch<{ photos: GalleryPhoto[]; settings: SiteSettings | null }>(
    `{
      "photos": ${photosQuery},
      "settings": ${siteSettingsQuery}
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export default async function PhotosPage() {
  const { photos, settings } = await getPhotographyContent();

  return (
    <main className="min-h-screen w-full overflow-y-auto bg-[#111113] px-4 py-6 text-zinc-100 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-16 flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/70">
              Photography
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Frames in motion</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/studio"
              className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100 transition-colors hover:border-amber-200/60 hover:bg-amber-200/20"
            >
              Studio
            </Link>
            <Link
              href="/home"
              className="rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
            >
              ← Home
            </Link>
          </div>
        </header>

        <section className="mx-auto mb-20 max-w-2xl">
          <p className="text-lg leading-8 text-zinc-300">
            {settings?.photographyBlurb ||
              "A collection of photographs, visual studies, and things worth remembering."
            }
          </p>
          {!hasSanityConfig && (
            <p className="mt-4 text-xs text-zinc-600">
              Connect Sanity to begin building this archive.
            </p>
          )}
        </section>

        <FilmGallery photos={photos} />
      </div>
    </main>
  );
}