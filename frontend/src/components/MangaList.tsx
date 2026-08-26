import { useState, useEffect } from 'react';

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
};

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
                const response = await fetch('http://localhost:8080/manga', {
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
            <div className="flex items-center justify-center p-40">
                <p className="text-lg font-medium text-gray-600 animate-pulse">
                    Loading Please Wait...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl space-y-8 p-6">
            <div className="w-full max-w-6xl h-90">
            <h2 className="text-xl font-bold mb-4">Ongoing Manga</h2>

            <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                    {mangaList.data.releasing.media.map((manga: Manga) => (
                        <div
                            key={manga.id}
                            className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                        >
                            <div className='relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-200'>
                                <img
                                    src={manga.coverImage.large}
                                    alt={manga.title.english || manga.title.romaji}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <p className='font-medium text-sm line-clamp-2 overflow-hidden text-center'>
                                {manga.title.english || manga.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-6xl h-90">
                <h2 className="text-xl font-bold mb-4">Finished Manga</h2>

                <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                    {mangaList.data.finished.media.map((manga: Manga) => (
                        <div
                            key={manga.id}
                            className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                        >
                            <div className='relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-200'>
                                <img
                                    src={manga.coverImage.large}
                                    alt={manga.title.english || manga.title.romaji}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                                <p className='font-medium text-sm line-clamp-2 overflow-hidden text-center'>
                                    {manga.title.english || manga.title.romaji}
                                </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}