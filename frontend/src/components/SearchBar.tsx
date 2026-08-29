import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import AddMediaModal, { type AddMediaItem } from './AddMediaModal';


interface SearchBarProps {
  onClose: () => void;
  token: string;
  mediaType: "ANIME" | "MANGA";
}

interface Search {
  id: number,
  title: {
    english: string,
    romaji: string
  }
  coverImage: {
    large: string
  },
  description?: string | null,
  episodes?: number | null,
  chapters?: number | null,
  status?: string | null,
  nextAiringEpisode?: {
    episode: number;
    airingAt: number;
  } | null
}

export default function SearchBar({ onClose, token, mediaType }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Search[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<AddMediaItem | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {

    if (searchQuery.trim().length < 3) {
      setResults([]);
      return;
    }

    const searchRequest = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/search`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",

          },
          body: JSON.stringify({
            searchQuery: searchQuery,
            type: mediaType,
          })
        });
        const data = await response.json();
        if (data) {
          setResults(data.data.Page.media);
        }

      } catch (error) {
        console.error("Error Finding the Anime :", error);
      } finally {
        setIsLoading(false);
      }
    }, 600);
    return () => clearTimeout(searchRequest);
  }, [searchQuery, token, mediaType]);


  return (
    <>
      {!selectedMedia && <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/60 backdrop-blur-[2px] animate-fade-in"
      onClick={onClose}
      >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-scale-up text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white">Search {mediaType === "ANIME" ? "Anime" : "Manga"}</h3>
        </div>

        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 absolute left-4 top-3.5 text-slate-500"
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
            placeholder={`Type ${mediaType === "ANIME" ? "anime" : "manga"} title...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-col gap-3">
          {searchQuery && (
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Searching for: <span className="text-indigo-400 font-mono font-bold">{searchQuery}</span>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-10 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm font-medium">Loading results...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-1 max-h-96 overflow-y-auto scrollbar-hide">
              {results.map((media) => (
                <div key={media.id} className="flex items-center gap-4 p-2.5 hover:bg-slate-950/60 rounded-xl transition-colors cursor-pointer border-b border-slate-950/40 last:border-0">
                  <img src={media.coverImage.large} alt={media.title.english} className="w-12 h-16 object-cover rounded-lg border border-slate-800" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-200 truncate">{media.title.english || media.title.romaji}</h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMedia({
                        id: media.id,
                        title: media.title.english || media.title.romaji,
                        image: media.coverImage.large,
                        summary: media.description || undefined,
                        token,
                        mediaType,
                        englishTitle: media.title.english,
                        romajiTitle: media.title.romaji,
                        progressLabel: mediaType === "ANIME" ? "episode" : "chapter",
                        totalProgress: mediaType === "ANIME"
                          ? media.status === "NOT_YET_RELEASED"
                            ? null
                            : media.nextAiringEpisode
                              ? Math.max(0, media.nextAiringEpisode.episode - 1)
                              : media.episodes
                          : media.chapters ?? 0,
                        isUpcoming: mediaType === "ANIME" && media.status === "NOT_YET_RELEASED",
                        isOngoing: mediaType === "MANGA" && media.status === "RELEASING",
                        status: media.status === "NOT_YET_RELEASED" ? "PLANNING" : "ONGOING",
                        favorite: false,
                        nextEpisode: media.nextAiringEpisode?.episode ?? null,
                        nextAiringAt: media.nextAiringEpisode?.airingAt ?? null,
                      });
                    }}
                    className="ml-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-600/10 hover:shadow-md cursor-pointer active:scale-95"
                  >
                    ADD
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/30 font-medium text-sm">
              {searchQuery.trim().length < 2 ? "Type to search..." : "No results found."}
            </div>
          )}
        </div>
      </div>
      </div>}
      {selectedMedia && (
        <AddMediaModal
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
}
