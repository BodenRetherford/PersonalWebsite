import Link from "next/link";

interface DiscogsRelease {
  id: number;
  basic_information: {
    id: number;
    title: string;
    year: number;
    cover_image: string;
    artists: { name: string }[];
  };
}

async function getDiscogsCollection(): Promise<DiscogsRelease[]> {
  const username = process.env.DISCOGS_USERNAME;
  const token = process.env.DISCOGS_TOKEN;

  if (!username) {
    return [];
  }

  try {
    const res = await fetch(
      `https://api.discogs.com/users/${username}/collection/folders/0/releases?per_page=100&sort=artist&sort_order=asc`,
      {
        headers: {
          "User-Agent": "PersonalWebsite/1.0",
          ...(token ? { Authorization: `Discogs token=${token}` } : {}),
        },
        next: { revalidate: 3600 }, // Cache collection data for 1 hour
      }
    );

    if (!res.ok) {
      console.error(`Discogs API returned status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.releases || [];
  } catch (error) {
    console.error("Error fetching Discogs collection:", error);
    return [];
  }
}

export default async function MediaPage() {
  const releases = await getDiscogsCollection();

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#111113] text-zinc-100">
      {/* Sticky Compact Top Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-6 py-3 backdrop-blur-md">
        <div className="flex items-baseline gap-3">
          <h1 className="text-base font-semibold tracking-tight text-zinc-100">
            Record Collection
          </h1>
          <span className="text-xs text-zinc-500">
            {releases.length} {releases.length === 1 ? "release" : "releases"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/music"
            className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            ← Music
          </Link>
          <Link
            href="/home"
            className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Scrollable Cover Art Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {releases.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No records found. Check your DISCOGS_USERNAME and DISCOGS_TOKEN in .env.local.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {releases.map((release) => {
              const artistName = release.basic_information.artists
                ?.map((a) => a.name.replace(/\s\(\d+\)$/, ""))
                .join(", ");
              const coverSrc = release.basic_information.cover_image;
              const discogsUrl = `https://www.discogs.com/release/${release.id}`;

              return (
                <a
                  key={release.id}
                  href={discogsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 transition-transform duration-200 hover:-translate-y-1 hover:border-zinc-500 hover:shadow-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
                >
                  {coverSrc ? (
                    <img
                      src={coverSrc}
                      alt={`${release.basic_information.title} by ${artistName}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-85"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-2 text-center text-xs text-zinc-600">
                      No Artwork
                    </div>
                  )}

                  {/* Album Info Hover Overlay */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <p className="truncate text-xs font-semibold text-zinc-100">
                      {release.basic_information.title}
                    </p>
                    <p className="truncate text-[11px] text-zinc-400">
                      {artistName} {release.basic_information.year ? `(${release.basic_information.year})` : ""}
                    </p>
                    <span className="mt-1 flex items-center gap-1 text-[10px] text-zinc-500">
                      Discogs ↗
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}