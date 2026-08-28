import { useEffect, useState } from "react";
import SearchBar from "./SearchBar"
import NovelSearchBar from "./NovelSearchBar"
import AddMediaModal, { type AddMediaItem } from "./AddMediaModal";
import useRemoveFromList from '../hooks/useRemoveFromList';
import useRemoveNovel from '../hooks/useRemoveNovel';

interface Mediaprops {
  token: string;
  listType: "media" | "novel";
  mediaType?: "ANIME" | "MANGA";
}

interface Media {
  id: number;
  title: string;
  image: string;
  status?: "WATCHED" | "READ" | "ONGOING" | "PLANNING" | "WATCHED_READ" | null;
  favorite?: boolean | null;
  currentChapter?: number | null;
  totalChapter?: number | null;
};

type Filter = "ALL" | "ONGOING" | "PLANNING" | "COMPLETED" | "FAVORITE";

const MyList = ({token, listType, mediaType}: Mediaprops) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState({ start: 0, end: 12 });
  const [myList, setmyList] = useState<Media[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filter[]>(["ALL"]);
  const [selectedMedia, setSelectedMedia] = useState<AddMediaItem | null>(null);

  const handleRemove = useRemoveFromList(); 
  const handleRemoveNovel = useRemoveNovel();
  const isNovelList = listType === "novel";

  useEffect(() => {
    async function getMediaList() {
      try {
        const response = await fetch(
          isNovelList
            ? "http://localhost:8080/novels/mylist"
            : `http://localhost:8080/mylist?type=${mediaType}`,
          {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          },
        );
        if (!response.ok) {
          throw new Error(`List request failed: ${response.status}`);
        }
        const data = await response.json();
        setmyList(data);
      } catch (error) {
        console.error("Error fetching Media list:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getMediaList();
  }, [token, isOpen, isNovelList, mediaType]);

  const mediaItems = myList || [];
  const completedStatus = isNovelList ? "READ" : "WATCHED";
  const selectableStatusFilters: Filter[] = ["ONGOING", "PLANNING", "COMPLETED"];
  const filteredItems = mediaItems.filter((media) => {
    const matchesFavorite = !filters.includes("FAVORITE") || media.favorite === true;
    const selectedStatusFilters = filters.filter((filter) => filter !== "ALL" && filter !== "FAVORITE");
    const matchesStatus = selectedStatusFilters.length === 0 || selectedStatusFilters.some((filter) => {
      if (filter === "COMPLETED") {
        return media.status === completedStatus || media.status === "WATCHED_READ";
      }
      return media.status === filter;
    });
    return matchesFavorite && matchesStatus;
  });
  const totalMedia = filteredItems.length;

  const toggleFilter = (selectedFilter: Filter) => {
    setFilters((currentFilters) => {
      if (selectedFilter === "ALL") {
        return currentFilters.includes("FAVORITE") ? ["ALL", "FAVORITE"] : ["ALL"];
      }

      const nextFilters = currentFilters.includes(selectedFilter)
        ? currentFilters.filter((filter) => filter !== selectedFilter && filter !== "ALL")
        : [...currentFilters.filter((filter) => filter !== "ALL"), selectedFilter];

      return selectableStatusFilters.every((filter) => nextFilters.includes(filter))
        ? nextFilters.includes("FAVORITE") ? ["ALL", "FAVORITE"] : ["ALL"]
        : nextFilters;
    });
  };

  useEffect(() => {
    setPage({ start: 0, end: 12 });
  }, [filters]);

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

  const openDeleteModal = (media: Media) => {
    setSelectedMedia({
      id: media.id,
      title: media.title,
      image: media.image,
      token,
      mediaType: isNovelList ? "NOVEL" : mediaType!,
      progressLabel: isNovelList ? "chapter" : "episode",
      currentProgress: media.currentChapter ?? 0,
      totalProgress: media.totalChapter ?? null,
      status: media.status === "WATCHED_READ"
        ? isNovelList ? "READ" : "WATCHED"
        : media.status ?? "ONGOING",
      favorite: media.favorite ?? false,
    });
  };

  return (
    <div className="w-full bg-[#0e0e0e] text-white p-6 font-sans rounded-xl">
      <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
        <h2 className="text-2xl font-medium tracking-wide">My List</h2>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            className="px-4 py-1.5 border border-gray-800 bg-zinc-900/50 text-gray-300 hover:text-white hover:border-gray-600 hover:bg-zinc-800 active:scale-95 transition-all duration-200 uppercase tracking-wider text-xs"
            onClick={() => setIsOpen(true)}
          >
            + Add
          </button>

          <details className="relative">
            <summary className="cursor-pointer list-none border border-gray-800 bg-zinc-900/50 px-3 py-1.5 text-xs uppercase tracking-wider text-gray-300 hover:bg-zinc-800">
              Filter
            </summary>
            <div className="absolute right-0 top-full z-10 mt-2 w-44 rounded-lg border border-gray-800 bg-zinc-900 p-3 shadow-xl">
              {[
                ["ALL", "All"],
                ["ONGOING", "Ongoing"],
                ["PLANNING", "Planning"],
                ["COMPLETED", isNovelList ? "Read" : "Watched"],
                ["FAVORITE", "Favourite"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 py-1.5 text-xs text-gray-300">
                  <input
                    type={value === "ALL" ? "radio" : "checkbox"}
                    checked={filters.includes(value as Filter)}
                    onChange={() => toggleFilter(value as Filter)}
                    className="accent-red-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </details>

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

      {isOpen && (isNovelList ? (
        <NovelSearchBar onClose={() => setIsOpen(false)} token={token} />
      ) : (
        <SearchBar onClose={() => setIsOpen(false)} token={token} mediaType={mediaType!} />
      ))}

      {isLoading ? (
        <p className="text-gray-400 py-10 text-center">Loading list items...</p>
      ) : totalMedia === 0 ? (
        <p className="text-gray-400 py-10 text-center">No media added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {filteredItems.slice(page.start, page.end).map((media) => (
            <div key={media.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => openDeleteModal(media)}>
              <div
                className="relative w-full aspect-[3/4] overflow-hidden rounded shadow-lg bg-gray-800"
              >
                <img
                  src={media.image}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <p className="font-medium text-sm text-gray-200 line-clamp-2 text-left pr-2">
                  {media.title}
              </p>
            </div>
          ))}
        </div>
      )}
      {selectedMedia && (
        <AddMediaModal
          item={selectedMedia}
          isDelete
          onClose={() => setSelectedMedia(null)}
          onDelete={async () => {
            if (selectedMedia.mediaType === "NOVEL") {
              await handleRemoveNovel(selectedMedia.id, token);
            } else {
              await handleRemove(selectedMedia.id, token);
            }
            setmyList((currentItems) => currentItems?.filter((item) => item.id !== selectedMedia.id) ?? null);
          }}
        />
      )}
    </div>
  );
};

export default MyList;