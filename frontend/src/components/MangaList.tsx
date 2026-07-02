import { useState, useEffect } from 'react';

interface Mediaprops {
    token: string;
}

interface Manga {
    data: {
        releasingManga: {
            media: MangaList[]
        }
        finishedManga: { 
            media: MangaList[] 
        }
    }
};

type MangaList = {
        id: number
        title: {
            romaji: string
            english: string
        }
        coverImage: {
            large: string
    }
}


export default function Manga(props: Mediaprops) {
    const [mangaList, setMangaList] = useState<Manga | null>(null);
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
                const data = await response.json();
                setMangaList(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching manga list:', error);
            }
        }
        getMangaList();
    }, [])

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
        <>
            <div className="w-full max-w-6xl p-6">
                <h2 className="text-xl font-bold mb-4">Ongoing Manga</h2>

                <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                    {mangaList.data.releasingManga.media.map((manga: MangaList) => (
                        <div
                            key={manga.id}
                            className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                        >
                            <div className='w-full h-72 overflow-hidden rounded-lg shadow-md hover:scale-109 transition-transform duration-200'>
                                <img
                                    src={manga.coverImage.large}
                                    alt={manga.title.english ?? manga.title.romaji}
                                    className='w-full h-full object-content'
                                />
                            </div>
                            <p className='font-medium text-sm h-16 line-clamp-2 overflow-hidden flex items-center justify-center'>
                                {manga.title.english ?? manga.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-6xl p-6">
                <h2 className="text-xl font-bold mb-4">Finished Manga</h2>

                <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                    {mangaList.data.finishedManga.media.map((manga: MangaList) => (
                        <div
                            key={manga.id}
                            className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                        >
                            <div className='w-full h-72 overflow-hidden rounded-lg shadow-md hover:scale-109 transition-transform duration-200'>
                                <img
                                    src={manga.coverImage.large}
                                    alt={manga.title.english ?? manga.title.romaji}
                                    className='w-full h-full object-content'
                                />
                            </div>
                            <p className='font-medium text-sm h-16 line-clamp-2 overflow-hidden flex items-center justify-center'>
                                {manga.title.english ?? manga.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
}