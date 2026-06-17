import { useState, useEffect } from 'react';

type Anime = {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            image_url: string;
        }
    }
};

export default function AnimeList() {
    const [list, setList] = useState<Anime[]>([]);

    useEffect(() => {
        async function getTopAnimeList() {
            const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=25');
            const data = await response.json();
            setList(data.data);
        }
        getTopAnimeList();
    }, []);

    return (
        <div className="w-full max-w-6xl p-6">
            <h2 className="text-xl font-bold mb-4">Top Anime</h2>
            
            <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                {list.map((anime) => (
                    
                    <div 
                        key={anime.mal_id} 
                        className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                    >
                        <p className='font-medium text-sm h-12 line-clamp-2 overflow-hidden flex items-center justify-center'>
                            {anime.title}
                        </p>
                        <div className='w-full h-72 overflow-hidden rounded-lg shadow-md hover:scale-109 transition-transform duration-200'>
                            <img 
                                src={anime.images.jpg.image_url} 
                                alt={anime.title} 
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}