import { useEffect, useState } from "react";
// import  useAddToList  from '../hooks/useAddToList';


interface SearchBarProps {
  onClose: () => void;
  token: string;
}

interface Search {
  Title: string,
  Id: number,
  Image: string
}

export default function SearchBar({ onClose, token }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Search[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        const response = await fetch("http://localhost:8080/searchNovel", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",

          },
          body: JSON.stringify({
            searchQuery: searchQuery
          })
        });
        const data = await response.json();
        console.log(data)
        if (data) {
          setResults(data);
        }

      } catch (error) {
        console.error("Error Finding the Anime :", error);
      } finally {
        setIsLoading(false);
      }
    }, 600);
    return () => clearTimeout(searchRequest);
  }, [searchQuery, token]);


  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-lg font-medium text-gray-200">Search Anime</h3>
        </div>

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
          
          {isLoading ? (
            <div className="text-center py-8 text-zinc-400">Loading results...</div>
          ) 
          : results.length > 0 ? (
            <div className="flex flex-col gap-2 h-96 overflow-y-auto scrollbar-hide ">
              {results.map((novel) => (
                <div key={novel.Id} className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer">
                  <img src={novel.Image} alt={novel.Title} referrerPolicy="no-referrer"  className="w-12 h-16 object-cover rounded" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">{novel.Title}</h4>
                  </div> 
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                    //   useAddToList(anime.id,anime.title.english,anime.title.romaji,anime.coverImage.large,token);
                    }}
                    className="ml-auto px-3 py-1.5 text-xs font-medium text-zinc-900 bg-gray-200 hover:bg-green-500 rounded-md transition-colors shadow-sm"
                  >
                    ADD
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/30">
              {searchQuery.trim().length < 2 ? "Type to search..." : "No results found."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
