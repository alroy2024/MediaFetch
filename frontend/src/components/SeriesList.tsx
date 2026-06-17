import { useState, useEffect } from 'react';

type Series = {
    show: {
        id: number;
        name: string;
        image: {
            medium: string;
        } 
    };
};

export default function SeriesList() {
    const [list, setList] = useState<Series[]>([]);

    useEffect(() => {
        async function fetchSeries() {
            try {
                const response = await fetch('https://api.tvmaze.com/search/shows?q=breaking%20bad');
                const data = await response.json();

                setList(data);
                console.log(data)
            } catch (error) {
                console.error("Failed to load web novels:", error);
            }
        }
        fetchSeries();
    }, []);

    return (
        <div className="w-full max-w-6xl p-6">
            <h2 className="text-xl font-bold mb-4">Trending Web Novels</h2>
            <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                {list.map((Series) => (
                    <div key={Series.show.id} className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'>
                        <p className='font-medium text-sm h-12 line-clamp-2 overflow-hidden flex items-center justify-center'>
                            {Series.show.name}
                        </p>
                        <div className='w-full h-72 overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-200'>
                            <img src={Series.show.image.medium} alt={Series.show.name} className='w-full h-full object-cover' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}