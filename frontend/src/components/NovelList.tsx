import { useEffect, useState } from "react";

interface Mediaprops {
  token: string;
}

interface Media {
  id: number;
  title: string;
  image: string;
}

const NovelList = ({token}: Mediaprops) => {
  const [novelList, setNovelList] = useState<Media[] | null>(null);

  useEffect(() => {
    async function getNovelList() {
      try {
        const response = await fetch("http://localhost:8080/novels", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Novel request failed: ${response.status}`);
        }
        const data = await response.json();
        setNovelList(data);
      } catch (error) {
        console.error("Error fetching novel list:", error);
      }
    }
    getNovelList();
  }, [token]);

  if (!novelList) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 w-full bg-slate-900 border border-slate-800/80 rounded-2xl mt-6">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">
          Loading novel feeds...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 text-slate-100 p-6 font-sans rounded-2xl border border-slate-800/80 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-50"></span>
        </span>
        <h2 className="text-lg font-bold text-white tracking-tight">Trending Novels</h2>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
        {novelList.map((novel) => (
            <div key={novel.id} className="flex flex-col items-center text-center w-40 shrink-0 snap-start gap-2.5 group cursor-pointer">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-sm border border-slate-800/60 bg-slate-950 hover:scale-[1.03] transition-all duration-300 ease-out">
                <img
                  src={novel.image}
                  alt={novel.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-xs text-slate-300 line-clamp-2 overflow-hidden text-center group-hover:text-indigo-400 transition-colors">
                  {novel.title}
              </p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default NovelList;