import { useState, useEffect } from 'react';

interface Mediaprops {
    token: string;
}

interface AnimeList {
    data: {
        releasing: {
            media: Anime[]
        }
        finished: {
            media: Anime[]
        }
    }
}

type Anime = {
    id: number
    title: {
        romaji: string
        english: string
    }
    coverImage: {
        large: string
    }
}

export default function AnimeList(props: Mediaprops) {
    const [animeList, setAnimeList] = useState<AnimeList | null>(null);

    useEffect(() => {
        async function getAnimeList() {
            try {
                const response = await fetch('http://localhost:8080/anime', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${props.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`Anime request failed: ${response.status}`);
                }
                const data = await response.json();
                setAnimeList(data);
            } catch (error) {
                console.log('Error fetching Anime list:', error);
            }
        }
        getAnimeList();
    }, [props.token]);

    if (!animeList) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3 w-full bg-slate-900 border border-slate-800/80 rounded-2xl">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-slate-500">
                    Loading anime feeds...
                </p>
            </div>
        );
    }
    return (
        <div className="w-full max-w-6xl space-y-10 p-6 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-md mt-6">
            <div className="w-full">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">Airing Anime</h2>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                    {animeList.data.releasing.media.map((anime: Anime) => (
                        <div
                            key={anime.id}
                            className="flex flex-col items-center text-center w-40 shrink-0 snap-start gap-2.5 group cursor-pointer"
                        >
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-sm border border-slate-800/60 bg-slate-950 hover:scale-[1.03] transition-all duration-300 ease-out">
                                <img
                                    src={anime.coverImage.large}
                                    alt={anime.title.english || anime.title.romaji}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-semibold text-xs text-slate-300 line-clamp-2 overflow-hidden text-center group-hover:text-indigo-400 transition-colors">
                                {anime.title.english || anime.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 className="text-lg font-bold text-white tracking-tight">Upcoming Anime</h2>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                    {animeList.data.finished.media.map((anime: Anime) => (
                        <div
                            key={anime.id}
                            className="flex flex-col items-center text-center w-40 shrink-0 snap-start gap-2.5 group cursor-pointer"
                        >
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-sm border border-slate-800/60 bg-slate-950 hover:scale-[1.03] transition-all duration-300 ease-out">
                                <img
                                    src={anime.coverImage.large}
                                    alt={anime.title.english || anime.title.romaji}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-semibold text-xs text-slate-300 line-clamp-2 overflow-hidden text-center group-hover:text-indigo-400 transition-colors">
                                {anime.title.english || anime.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}