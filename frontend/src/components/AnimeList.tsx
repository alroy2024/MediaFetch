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
};

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
                const data = await response.json();
                setAnimeList(data)
            } catch (error) {
                console.log('Error fetching Anime list:', error);
            }
        }
        getAnimeList();
    }, []);

    if (!animeList) {
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
            <div className="w-full max-w-6xl p-6 h-90">
                <h2 className="text-xl font-bold mb-4">Airing Anime</h2>

                <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                    {animeList.data.releasing.media.map((anime: Anime) => (
                        <div
                            key={anime.id}
                            className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                        >
                            <div className='relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-200'>
                                <img
                                    src={anime.coverImage.large}
                                    alt={anime.title.english ?? anime.title.romaji}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <p className='font-medium text-sm line-clamp-2 overflow-hidden flex items-center justify-center'>
                                {anime.title.english ?? anime.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-6xl p-6 h-90">
                <h2 className="text-xl font-bold mb-4">Upcoming Anime</h2>

                <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth '>
                    {animeList.data.finished.media.map((anime: Anime) => (
                        <div
                            key={anime.id}
                            className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                        >
                            <div className='relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-200 '>
                                <img
                                    src={anime.coverImage.large}
                                    alt={anime.title.english ?? anime.title.romaji}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <p className='font-medium text-sm line-clamp-2 overflow-hidden flex items-center justify-center'>
                                {anime.title.english ?? anime.title.romaji}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}