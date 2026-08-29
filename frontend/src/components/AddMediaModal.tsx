import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useAddNovel from "../hooks/useAddNovel";
import useAddToList from "../hooks/useAddToList";

export interface AddMediaItem {
  id: number;
  title: string;
  image: string;
  url?: string;
  summary?: string;
  token: string;
  mediaType: "ANIME" | "MANGA" | "NOVEL";
  englishTitle?: string;
  romajiTitle?: string;
  progressLabel: "episode" | "chapter";
  totalProgress?: number | null;
  isUpcoming?: boolean;
  isOngoing?: boolean;
  status?: "WATCHED" | "READ" | "ONGOING" | "PLANNING";
  favorite?: boolean;
  currentProgress?: number;
  nextEpisode?: number | null;
  nextAiringAt?: number | null;
}

interface AddMediaModalProps {
  item: AddMediaItem;
  onClose: () => void;
  isDelete?: boolean;
  onDelete?: () => Promise<void>;
}

export default function AddMediaModal({ item, onClose, isDelete = false, onDelete }: AddMediaModalProps) {
  const [progress, setProgress] = useState<number | "">(item.currentProgress ?? 0);
  const [status, setStatus] = useState<"WATCHED" | "READ" | "ONGOING" | "PLANNING">(item.status ?? "ONGOING");
  const [favorite, setFavorite] = useState(item.favorite ?? false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsAdding(true);
    setError("");
    try {
      await onDelete();
      onClose();
    } catch {
      setError("Unable to delete this item. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleAdd = async () => {
    setIsAdding(true);
    setError("");
    try {
      const finalProgress = progress === "" ? 0 : progress;
      if (item.mediaType === "NOVEL") {
        await useAddNovel(
          item.id,
          item.title,
          item.image,
          item.url || "",
          item.summary || "",
          item.token,
          finalProgress,
          item.isUpcoming ? 0 : item.totalProgress ?? 0,
          status,
          favorite,
        );
      } else {
        await useAddToList(
          item.id,
          item.englishTitle || item.title,
          item.romajiTitle || item.title,
          item.image,
          item.token,
          item.mediaType,
          item.isUpcoming ? 0 : finalProgress,
          item.totalProgress ?? 0,
          status,
          favorite,
          item.summary || "",
          item.nextEpisode ?? null,
          item.nextAiringAt ?? null,
        );
      }
      onClose();
    } catch (error) {
      setError("Unable to add this item. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const summary = item.summary?.replace(/<[^>]*>/g, "").trim();

  return createPortal(
    (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 pt-48 pb-8 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="max-h-full w-full max-w-[32rem] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100 shadow-2xl sm:p-5 animate-scale-up [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-media-title"
      >
        <div className="flex gap-4.5 flex-col sm:flex-row">
          <img
            src={item.image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-[9.5rem] w-[6.5rem] shrink-0 rounded-2xl object-cover border border-slate-800 shadow-sm mx-auto sm:mx-0"
          />
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              {isDelete ? "Update Collection" : "Add to Library"}
            </p>
            <h2 id="add-media-title" className="text-lg sm:text-xl font-extrabold text-white leading-snug">
              {item.title}
            </h2>
            <p className="mt-2.5 max-h-24 overflow-y-auto pr-2 text-xs leading-relaxed text-slate-400 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {summary || "No summary is available for this title yet."}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {item.progressLabel} reached
            </span>
            <input
              type="number"
              min="0"
              max={item.totalProgress ?? undefined}
              value={item.isUpcoming ? 0 : progress}
              disabled={item.isUpcoming}
              onChange={(event) => {
                const val = event.target.value;
                if (val === "") {
                  setProgress("");
                } else {
                  let num = Math.max(0, parseInt(val, 10) || 0);
                  if (item.totalProgress != null && item.totalProgress > 0) {
                    num = Math.min(num, item.totalProgress);
                  }
                  setProgress(num);
                }
              }}
              className="mt-1 w-full border-b border-slate-800 bg-transparent py-0.5 text-xl font-bold text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </label>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex flex-col justify-center">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {item.mediaType === "ANIME"
                ? "Current total episodes"
                : item.mediaType === "MANGA"
                ? "Chapter status"
                : "Total Chapters"}
            </span>
            <strong className="mt-1 block text-xl font-extrabold text-white">
              {item.mediaType === "NOVEL"
                ? (item.totalProgress == null || item.totalProgress === 0 ? "Unavailable" : item.totalProgress)
                : (item.isOngoing || item.totalProgress === 0)
                ? "Ongoing"
                : item.totalProgress == null ? "Unavailable" : item.totalProgress}
            </strong>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Status
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              className="mt-1 w-full bg-transparent py-0.5 text-slate-200 text-xs font-semibold outline-none border-b border-slate-800 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value={item.mediaType === "ANIME" ? "WATCHED" : "READ"} className="bg-slate-900 text-white">
                {item.mediaType === "ANIME" ? "Watched" : "Read"}
              </option>
              <option value="ONGOING" className="bg-slate-900 text-white">Ongoing</option>
              <option value="PLANNING" className="bg-slate-900 text-white">Planning</option>
            </select>
          </label>
          <label className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs font-semibold text-slate-300 cursor-pointer hover:bg-slate-900/60 transition-colors">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(event) => setFavorite(event.target.checked)}
              className="h-4 w-4 accent-indigo-500 rounded cursor-pointer"
            />
            Add to Favourites
          </label>
        </div>

        {error && <p className="mt-3 text-xs font-semibold text-rose-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2.5 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-800 hover:bg-slate-850 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={isDelete ? handleDelete : handleAdd}
            disabled={isAdding}
            className={`rounded-lg px-5 py-2 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-sm ${
              isDelete 
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/10" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10"
            }`}
          >
            {isAdding ? (isDelete ? "Deleting..." : "Adding...") : isDelete ? "Delete Title" : "Add to list"}
          </button>
        </div>
      </section>
    </div>
    ),
    document.body,
  );
}
