import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Anime, Manga, Novel } from "../components/Mulcomponents";
import { useValidToken } from '../hooks/useValidToken';

const tabs = ["Anime", "Novel", "Manga"] as const;

function Home() {
    const [select, setSelected] = useState<(typeof tabs)[number]>("Anime");
    const token = useValidToken();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 relative">
            {/* Background gradients */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.03),_transparent_35%)]" />

            <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col">
                {/* Navbar */}
                <nav className="sticky top-0 z-20 border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                                </svg>
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white">
                                Media<span className="text-indigo-500">Fetch</span>
                            </span>
                        </Link>

                        {/* Centered navigation tabs switcher */}
                        <div className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1 md:flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelected(tab)}
                                    className={`rounded-full px-5 py-2 text-sm font-bold transition-all cursor-pointer ${select === tab
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Notifications button */}
                        <Link
                            to="/Notification"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-indigo-400 shadow-sm"
                        >
                            <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                            Notifications
                        </Link>
                    </div>
                </nav>

                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Feed card frame */}
                        <section className="rounded-[28px] border border-slate-900/80 bg-slate-900/40 p-6 shadow-2xl shadow-black/20 md:p-8">
                            <div className="mb-6 flex flex-col gap-4 border-b border-slate-900 pb-5 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Library feed</p>
                                    <h2 className="mt-1 text-2xl font-bold text-white">{select} Collection</h2>
                                </div>

                                {/* Mobile fallback selector */}
                                <div className="flex flex-wrap gap-1.5 md:hidden">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setSelected(tab)}
                                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${select === tab
                                                ? "bg-indigo-600 text-white shadow-sm"
                                                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {token ? (
                                <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4 min-h-[300px]">
                                    {select === "Manga" && <Manga token={token} />}
                                    {select === "Novel" && <Novel token={token} />}
                                    {select === "Anime" && <Anime token={token} />}
                                </div>
                            ) : (
                                <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-500 font-medium">
                                    Loading your collections...
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;