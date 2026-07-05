import { useEffect, useState } from "react";

interface Mediaprops {
  token: string;
}

interface AnimeList {
  data: {
    releasing: {
      media: Anime[];
    };
  };
}

type Anime = {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
};

interface AddbarProps {
  onClose: () => void;
}

function Addbar({ onClose }: AddbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-medium text-gray-200">Search Anime</h3>
        </div>

        {/* Search Input */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 absolute left-4 top-3.5 text-zinc-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z"
            />
          </svg>
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type anime title..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all text-base"
          />
        </div>

        <div className="flex flex-col gap-3">
          {searchQuery && (
            <div className="text-xs text-zinc-500">
              Searching for: <span className="text-zinc-300 font-mono font-medium">{searchQuery}</span>
            </div>
          )}
          <div className="text-center py-8 text-zinc-400 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/30">
            Results UI will go here...
          </div>
        </div>
      </div>
    </div>
  );
}


const MyList = (props: Mediaprops) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState({ start: 0, end: 12 });
  const [animeList, setAnimeList] = useState<AnimeList | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAnimeList() {
      try {
        const response = await fetch("http://localhost:8080/anime", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${props.token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setAnimeList(data);
      } catch (error) {
        console.error("Error fetching Anime list:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getAnimeList();
  }, [props.token]);

  const mediaItems = animeList?.data?.releasing?.media || [];
  const totalMedia = mediaItems.length;

  const increment = () => {
    if (page.end < totalMedia) {
      setPage((prev) => ({
        start: prev.start + 12,
        end: prev.end + 12,
      }));
    }
  };

  const decrement = () => {
    if (page.start > 0) {
      setPage((prev) => ({
        start: prev.start - 12,
        end: prev.end - 12,
      }));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0e0e0e] text-white p-6 font-sans rounded-xl">
      <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
        <h2 className="text-2xl font-medium tracking-wide">My List</h2>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            className="px-4 py-1.5 border border-gray-800 bg-zinc-900/50 text-gray-300 hover:text-white hover:border-gray-600 hover:bg-zinc-800 active:scale-95 transition-all duration-200 uppercase tracking-wider text-xs"
            onClick={() => setIsOpen(true)}
          >
            + Add
          </button>

          <div className="flex items-center bg-zinc-900/80 border border-gray-800 rounded-lg p-1 shadow-inner">
            <button
              className={`p-1.5 rounded-md transition-all duration-200 ${
                page.start === 0
                  ? "text-zinc-700 cursor-not-allowed opacity-40"
                  : "text-gray-400 hover:text-white hover:bg-zinc-800 active:scale-90"
              }`}
              onClick={decrement}
              disabled={page.start === 0}
              aria-label="Previous Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <span className="w-[1px] h-4 bg-zinc-800 mx-1" />

            <button
              className={`p-1.5 rounded-md transition-all duration-200 ${
                page.end >= totalMedia
                  ? "text-zinc-700 cursor-not-allowed opacity-40"
                  : "text-gray-400 hover:text-white hover:bg-zinc-800 active:scale-90"
              }`}
              onClick={increment}
              disabled={page.end >= totalMedia}
              aria-label="Next Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && <Addbar onClose={() => setIsOpen(false)} />}

      {isLoading ? (
        <p className="text-gray-400 py-10 text-center">Loading list items...</p>
      ) : totalMedia === 0 ? (
        <p className="text-gray-400 py-10 text-center">No anime added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {mediaItems.slice(page.start, page.end).map((anime) => (
            <div key={anime.id} className="flex flex-col gap-2 group cursor-pointer">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded shadow-lg bg-gray-800">
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.english ?? anime.title.romaji}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <p className="font-medium text-sm text-gray-200 line-clamp-2 text-left pr-2">
                  {anime.title.english ?? anime.title.romaji}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;