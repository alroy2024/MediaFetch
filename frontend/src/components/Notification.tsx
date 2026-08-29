import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";
import { useValidToken } from "../hooks/useValidToken";

interface NotificationItem {
  id: number;
  message: string;
  createdAt: string;
  dismissed: boolean;
}

export default function Notification() {
  const token = useValidToken();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const handleDismiss = async (id: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n))
        );
      }
    } catch (error) {
      console.error("Error dismissing notification:", error);
    }
  };

  const handleSync = async () => {
    if (!token || isSyncing) return;
    setIsSyncing(true);
    setSyncStatus("Checking for updates (scraping)...");
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/trigger-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setSyncStatus("Sync completed! Reloading notifications...");
        await fetchNotifications();
        setTimeout(() => setSyncStatus(null), 3000);
      } else {
        setSyncStatus("Failed to sync. Please try again.");
        setTimeout(() => setSyncStatus(null), 3000);
      }
    } catch (error) {
      console.error("Error triggering sync:", error);
      setSyncStatus("Failed to sync due to network error.");
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 3600000);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.03),_transparent_35%)]" />

      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col">
        {/* Navbar */}
        <nav className="sticky top-0 z-20 border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
            <Link to="/Home" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Media<span className="text-indigo-500">Fetch</span>
              </span>
            </Link>

            <Link
              to="/Home"
              className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-indigo-400 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </nav>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <section className="rounded-[28px] border border-slate-900/80 bg-slate-900/40 p-6 shadow-2xl shadow-black/20 md:p-8">
              <div className="mb-6 flex flex-col gap-4 border-b border-slate-900 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Notifications</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Updates Feed</h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isSyncing ? (
                      <div className="w-3.5 h-3.5 shrink-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    )}
                    <span>Check Updates</span>
                  </button>
                </div>
              </div>

              {syncStatus && (
                <div className="mb-6 rounded-xl border border-indigo-500/25 bg-indigo-950/20 px-4 py-3 text-xs font-semibold text-indigo-300 flex items-center gap-2.5 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {syncStatus}
                </div>
              )}

              {isLoading ? (
                <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium text-sm">Loading updates...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">You're all caught up!</h3>
                    <p className="text-slate-500 text-xs mt-1">No new novel chapters or notifications at the moment.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={
                        notif.dismissed
                          ? "group relative flex items-start gap-4 rounded-2xl border border-slate-950/80 bg-slate-950/10 p-4 opacity-50 transition-all hover:opacity-75"
                          : "group relative flex items-start gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-slate-800 hover:bg-slate-900/30"
                      }
                    >
                      <div
                        className={
                          notif.dismissed
                            ? "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-500"
                            : "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-400"
                        }
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <p
                          className={
                            notif.dismissed
                              ? "text-sm font-medium text-slate-400 leading-relaxed"
                              : "text-sm font-semibold text-slate-200 leading-relaxed"
                          }
                        >
                          {notif.message}
                        </p>
                        <p
                          className={
                            notif.dismissed
                              ? "mt-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-600"
                              : "mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                          }
                        >
                          {formatTime(notif.createdAt)}
                        </p>
                      </div>

                      {!notif.dismissed ? (
                        <button
                          onClick={() => handleDismiss(notif.id)}
                          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-slate-500 transition-all hover:border-rose-500/40 hover:bg-rose-950/20 hover:text-rose-400 opacity-60 group-hover:opacity-100 cursor-pointer"
                          aria-label="Dismiss Notification"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      ) : (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center text-slate-600" title="Read">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}