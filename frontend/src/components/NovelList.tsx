import { useEffect, useState } from "react";

interface Mediaprops {
  token: string;
}

interface Media {
  id: number;
  title: string;
  image: string;
};

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
      <div className="flex items-center justify-center p-40">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading Please Wait...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0e0e0e] text-white p-6 font-sans rounded-xl">
      <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
        <h2 className="text-xl font-bold">Trending Novels</h2>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
        {novelList.map((novel) => (
            <div key={novel.id} className="flex flex-col items-center text-center w-40 shrink-0 snap-start gap-2">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-200">
                <img
                  src={novel.image}
                  alt={novel.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-medium text-sm line-clamp-2 overflow-hidden text-center">
                  {novel.title}
              </p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default NovelList;