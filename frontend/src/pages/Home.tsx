import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Anime, Manga, Novel, Series } from "../components/Mulcomponents";

function Home() {
    const navigate = useNavigate()
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const usertoken = localStorage.getItem('token');
        if (!usertoken) {
            console.error("No token found, redirecting to login...");
            navigate('/');
            return;
        }
        setToken(usertoken)
    }, [navigate])

    const [select, setSelected] = useState("Novel")

    return (
        <>
            <div className="min-h-screen bg-slate-950 text-white md:w-full w-max">
                <nav className="flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-800 shadow-lg">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-red-400 hover:text-red-600 transition-colors"
                    >
                        MediaFetch
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelected("Novel")}
                            className={`px-4 py-2 rounded-lg transition-all ${select === "Novel"
                                ? "bg-red-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700"
                                }`}
                        >
                            Novel
                        </button>
                        <button
                            onClick={() => setSelected("Anime")}
                            className={`px-4 py-2 rounded-lg transition-all ${select === "Anime"
                                ? "bg-red-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700"
                                }`}
                        >
                            Anime
                        </button>

                        <button
                            onClick={() => setSelected("Manga")}
                            className={`px-4 py-2 rounded-lg transition-all ${select === "Manga"
                                ? "bg-red-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700"
                                }`}
                        >
                            Manga
                        </button>

                        <button
                            onClick={() => setSelected("Series")}
                            className={`px-4 py-2 rounded-lg transition-all ${select === "Series"
                                ? "bg-red-500 text-white"
                                : "bg-slate-800 hover:bg-slate-700"
                                }`}
                        >
                            Series
                        </button>
                    </div>

                    <Link
                        to="/Notification"
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all"
                    >
                        Notifications
                    </Link>
                </nav>

                <main className="max-w-7xl mx-auto p-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                        {token ? (
                            <>
                                {select === "Anime" && <Anime token={token} />}
                                {select === "Manga" && <Manga />}
                                {select === "Novel" && <Novel />}
                                {select === "Series" && <Series token={token} />}
                            </>
                        ) : (
                            <div className="text-center text-slate-400">Loading...</div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}

export default Home