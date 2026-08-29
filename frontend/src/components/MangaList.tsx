import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface Mediaprops {
    token: string;
}

interface MangaList {
    data: {
        releasing: {
            media: Manga[]
        }
        finished: {
            media: Manga[]
        }
    }
}

type Manga = {
    id: number
    title: {
        romaji: string
        english: string
    }
    coverImage: {
        large: string
    }
}

export default function MangaList(props: Mediaprops) {
    const [mangaList, setMangaList] = useState<MangaList | null>(null);

    useEffect(() => {
        async function getMangaList() {
            try {
                const response = await fetch(`${API_BASE_URL}/manga`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${props.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`Manga request failed: ${response.status}`);
                }
                const data = await response.json();
                setMangaList(data);
            } catch (error) {
                console.error('Error fetching manga list:', error);
            }
        }
        getMangaList();
    }, [props.token]);

    if (!mangaList) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3 w-full bg-slate-900 border border-slate-800/80 rounded-2xl">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-slate-500">
                    Loading manga feeds...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl space-y-2 p-4 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-md mt-6">
            <div className="w-full">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight">Current Manga</h2>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                    {mangaList.data.releasing.media.map((manga: Manga) => (
                        <div
                            key={manga.id}
                            className="flex flex-col items-center text-center w-40 shrink-0 snap-start gap-2.5 group cursor-pointer"
                        >
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-sm border border-slate-800/60 bg-slate-950 hover:scale-[1.03] transition-all duration-300 ease-out">
                                <img
                                    src={manga.coverImage.large}
                                    alt={manga.title.english || manga.title.romaji}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-semibold text-xs text-slate-300 line-clamp-2 overflow-hidden text-center group-hover:text-indigo-400 transition-colors">
                                {manga.title.english || manga.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.176-.436.745-.436.92 0l1.986 4.908 5.251.706c.477.064.668.653.327.97l-3.921 3.737 1.053 5.176c.096.471-.409.839-.817.587l-4.588-2.836-4.587 2.836c-.408.252-.913-.116-.818-.587l1.053-5.176-3.921-3.737c-.341-.317-.15-.906.327-.97l5.251-.706 1.986-4.908z" />
                    </svg>
                    <h2 className="text-lg font-bold text-white tracking-tight">Top Manga</h2>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                    {mangaList.data.finished.media.map((manga: Manga) => (
                        <div
                            key={manga.id}
                            className="flex flex-col items-center text-center w-40 shrink-0 snap-start gap-2.5 group cursor-pointer"
                        >
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-sm border border-slate-800/60 bg-slate-950 hover:scale-[1.03] transition-all duration-300 ease-out">
                                <img
                                    src={manga.coverImage.large}
                                    alt={manga.title.english || manga.title.romaji}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-semibold text-xs text-slate-300 line-clamp-2 overflow-hidden text-center group-hover:text-indigo-400 transition-colors">
                                {manga.title.english || manga.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}