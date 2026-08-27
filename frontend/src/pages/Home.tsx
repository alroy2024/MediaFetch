import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Anime, Manga, Novel } from "../components/Mulcomponents";
import { useValidToken } from '../hooks/useValidToken';

const tabs = ["Manga", "Novel", "Anime"] as const;

function Home() {
    const [select, setSelected] = useState<(typeof tabs)[number]>("Manga");
    const token = useValidToken();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_25%)]" />

            <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col">
                <nav className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <Link
                            to="/"
                            className="text-2xl font-black tracking-tight text-red-400 transition-colors hover:text-red-300"
                        >
                            MediaFetch
                        </Link>

                        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 p-1 md:flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelected(tab)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${select === tab
                                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-900/30"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <Link
                            to="/Notification"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-all hover:border-red-400/70 hover:bg-slate-800"
                        >
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
                            Notifications
                        </Link>
                    </div>
                </nav>

                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <section className="rounded-[28px] border border-white/10 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-sm md:p-5">
                            <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">Library</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-white">{select} feed</h2>
                                </div>

                                <div className="flex flex-wrap gap-2 md:hidden">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setSelected(tab)}
                                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${select === tab
                                                ? "bg-red-500 text-white"
                                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {token ? (
                                <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3">
                                    {select === "Manga" && <Manga token={token} />}
                                    {select === "Novel" && <Novel token={token} />}
                                    {select === "Anime" && <Anime token={token} />}
                                </div>
                            ) : (
                                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 text-slate-400">
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