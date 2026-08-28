import { useRef, useState } from "react";
import Login from "./components/Login";

type FeatureCategory = "Tracking" | "Library" | "Sync" | "Security";

export default function App() {
  const loginSectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<FeatureCategory>("Tracking");

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const featureCards = {
    Tracking: [
      {
        title: "200+ Airing Shows",
        desc: "Track active seasonal anime with airing schedules and countdowns.",
        icon: (
          <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ),
        iconBg: "bg-indigo-950/40 border border-indigo-500/20",
      },
      {
        title: "Real-time Releases",
        desc: "Sub-second update notifications when a new manga chapter goes live.",
        icon: (
          <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        iconBg: "bg-amber-950/40 border border-amber-500/20",
      },
      {
        title: "Upcoming Calendar",
        desc: "Visual schedule calendar showing release dates for upcoming content.",
        icon: (
          <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        iconBg: "bg-emerald-950/40 border border-emerald-500/20",
      }
    ],
    Library: [
      {
        title: "Unified Library",
        desc: "Manage manga, novels, and anime all in one centralized web interface.",
        icon: (
          <svg className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        iconBg: "bg-sky-950/40 border border-sky-500/20",
      },
      {
        title: "Visual Search Explorer",
        desc: "Search through thousands of titles with high-definition covers and full summaries.",
        icon: (
          <svg className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        iconBg: "bg-rose-950/40 border border-rose-500/20",
      },
      {
        title: "Novel Aggregator",
        desc: "Direct integration with popular web novel services and chapter details.",
        icon: (
          <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        iconBg: "bg-violet-950/40 border border-violet-500/20",
      }
    ],
    Sync: [
      {
        title: "Multi-Device Sync",
        desc: "Access your lists and progress seamlessly from any phone, tablet, or PC.",
        icon: (
          <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
          </svg>
        ),
        iconBg: "bg-purple-950/40 border border-purple-500/20",
      },
      {
        title: "Progress Backup",
        desc: "Export and import your reading data to ensure you never lose your spot.",
        icon: (
          <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        ),
        iconBg: "bg-teal-950/40 border border-teal-500/20",
      },
      {
        title: "Status Updates",
        desc: "Toggle between Ongoing, Planning, and Completed states instantly.",
        icon: (
          <svg className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
        iconBg: "bg-pink-950/40 border border-pink-500/20",
      }
    ],
    Security: [
      {
        title: "JWT Authentication",
        desc: "State-of-the-art secure sessions keep your database data protected.",
        icon: (
          <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
        iconBg: "bg-blue-950/40 border border-blue-500/20",
      },
      {
        title: "Secure Profile Data",
        desc: "Fully encrypted user credentials and isolated private profile boards.",
        icon: (
          <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        iconBg: "bg-indigo-950/40 border border-indigo-500/20",
      },
      {
        title: "Reliable API Bridge",
        desc: "Safe backend endpoints to aggregate information securely from external APIs.",
        icon: (
          <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        iconBg: "bg-red-950/40 border border-red-500/20",
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Media<span className="text-indigo-500">Fetch</span>
            </span>
          </div>

          <div>
            <button
              onClick={scrollToLogin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-8 animate-fade-in">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            New: Anime Season & Manga tracking active
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            The complete platform for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-500">
              media synchronization
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Connect any anime, manga, or novel source. Track progress in real-time, 
            and sync to your private dashboard. Built for developers, loved by fans.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToLogin}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 cursor-pointer text-base active:scale-95"
            >
              Start Tracking Free
            </button>
            <button
              onClick={() => {
                const feat = document.getElementById("features");
                feat?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-xl border border-slate-800 transition-colors cursor-pointer text-base shadow-sm active:scale-95"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Backdrop Grid lines */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 bg-slate-950 border-y border-slate-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-slate-400 text-lg">
              From automated tracking to visual statistics, MediaFetch handles it all.
            </p>
          </div>

          {/* Filter switch tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-full border border-slate-800/80">
              {(["Tracking", "Library", "Sync", "Security"] as FeatureCategory[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-all cursor-pointer ${
                    activeCategory === tab
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic grid cards based on selected filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in">
            {featureCards[activeCategory].map((card, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 shadow-md hover:shadow-lg hover:border-indigo-500/30 transition-all flex flex-col items-start text-left"
              >
                <div className={`p-3.5 rounded-xl ${card.iconBg} mb-5`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Portal Section */}
      <section ref={loginSectionRef} className="py-24 px-6 bg-slate-950 flex items-center justify-center relative border-b border-slate-900">
        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white">
              Access your library dashboard
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Sign up or log in to sync your progress.
            </p>
          </div>
          <Login />
        </div>

        {/* Small subtle background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 px-6 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} MediaFetch Inc. All rights reserved. Built with Vite, React, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}