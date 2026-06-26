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

interface Mediaprops{
    token: string;
}

export default function AnimeList(props:Mediaprops) {

    const [list, setList] = useState("");
    useEffect(() => {
        async function getTopAnimeList() {
            try{
            const response = await fetch('http://localhost:8080/fetch',{
                method: 'GET',
                headers:{
                'Authorization': `Bearer ${props.token}`,
                'Content-Type': 'application/json'
            }
            });
            const data = await response.text();
            setList(data);
            
        }
        catch (error) {
            console.log("Error",error);
        }
    }
        getTopAnimeList();
    }, []);
    

    return (
        <div className="w-full max-w-6xl p-6">
            <h2 className="text-xl font-bold mb-4">Top Anime</h2>
            
            <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                <p>{list}</p>
                {/* {list.map((anime) => (
                    
                    <div 
                        key={anime.mal_id} 
                        className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                    >
                        <div className='w-full h-72 overflow-hidden rounded-lg shadow-md hover:scale-109 transition-transform duration-200'>
                            <img 
                                src={anime.images.jpg.image_url} 
                                alt={anime.title} 
                                className='w-full h-full object-cover'
                            />
                        </div>
                        <p className='font-medium text-sm h-16 line-clamp-2 overflow-hidden flex items-center justify-center'>
                            {anime.title}
                        </p>
                    </div>
                ))} */}
            </div>
        </div>
    );
}