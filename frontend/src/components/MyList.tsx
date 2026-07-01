
export default function () {
    return (<>
        <div className="w-full max-w-6xl p-6">
            <h2 className="text-xl font-bold mb-4">My List</h2>
            <div className='flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth'>
                <div
                    className='flex flex-col items-center text-center w-48 shrink-0 snap-start gap-2'
                >
                    <div className='w-full h-72 overflow-hidden shadow-md hover:scale-109 transition-transform duration-200'>
                        <div className="w-full h-72 overflow-hidden shadow-md flex flex-col items-center justify-center bg-gray-100 text-gray-500 gap-2">
                            <span className="text-4xl">📺</span>
                            <p className="text-center text-sm font-medium">
                                No anime added yet
                            </p>
                        </div>
                    </div>
                    <p className='font-medium text-sm h-16 line-clamp-2 overflow-hidden flex items-center justify-center'>
                        Add your favorite anime to get started.
                    </p>
                </div>
            </div>
        </div>
    </>
    )
}