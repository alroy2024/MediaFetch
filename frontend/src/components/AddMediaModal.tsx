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
}

interface AddMediaModalProps {
  item: AddMediaItem;
  onClose: () => void;
  isDelete?: boolean;
  onDelete?: () => Promise<void>;
}

export default function AddMediaModal({ item, onClose, isDelete = false, onDelete }: AddMediaModalProps) {
  const [progress, setProgress] = useState(item.currentProgress ?? 0);
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
      if (item.mediaType === "NOVEL") {
        await useAddNovel(
          item.id,
          item.title,
          item.image,
          item.url || "",
          item.summary || "",
          item.token,
          progress,
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
          item.isUpcoming ? 0 : progress,
          item.totalProgress ?? 0,
          status,
          favorite,
        );
      }
      onClose();
    } catch {
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
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl sm:p-8 animate-scale-up"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-media-title"
      >
        <div className="flex gap-6 flex-col sm:flex-row">
          <img
            src={item.image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-52 w-36 shrink-0 rounded-2xl object-cover border border-slate-800 shadow-sm mx-auto sm:mx-0"
          />
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400">
              {isDelete ? "Update Collection" : "Add to Library"}
            </p>
            <h2 id="add-media-title" className="text-xl sm:text-2xl font-extrabold text-white">
              {item.title}
            </h2>
            <p className="mt-4 max-h-36 overflow-y-auto pr-2 text-sm leading-relaxed text-slate-400">
              {summary || "No summary is available for this title yet."}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {item.progressLabel} reached
            </span>
            <input
              type="number"
              min="0"
              max={item.totalProgress ?? undefined}
              value={item.isUpcoming ? 0 : progress}
              disabled={item.isUpcoming}
              onChange={(event) => setProgress(Math.max(0, Number(event.target.value)))}
              className="mt-2 w-full border-b border-slate-800 bg-transparent py-1.5 text-2xl font-bold text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </label>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 flex flex-col justify-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {item.mediaType === "ANIME"
                ? "Current total episodes"
                : item.mediaType === "MANGA"
                ? "Chapter status"
                : "Total Chapters"}
            </span>
            <strong className="mt-2 block text-2xl font-extrabold text-white">
              {item.mediaType === "NOVEL"
                ? (item.totalProgress == null || item.totalProgress === 0 ? "Unavailable" : item.totalProgress)
                : item.isOngoing
                ? "Ongoing"
                : item.totalProgress == null ? "Unavailable" : item.totalProgress}
            </strong>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Status
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              className="mt-2 w-full bg-transparent py-1 text-slate-200 font-semibold outline-none border-b border-slate-800 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value={item.mediaType === "ANIME" ? "WATCHED" : "READ"} className="bg-slate-900 text-white">
                {item.mediaType === "ANIME" ? "Watched" : "Read"}
              </option>
              <option value="ONGOING" className="bg-slate-900 text-white">Ongoing</option>
              <option value="PLANNING" className="bg-slate-900 text-white">Planning</option>
            </select>
          </label>
          <label className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm font-semibold text-slate-300 cursor-pointer hover:bg-slate-900/60 transition-colors">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(event) => setFavorite(event.target.checked)}
              className="h-4.5 w-4.5 accent-indigo-500 rounded cursor-pointer"
            />
            Add to Favourites
          </label>
        </div>

        {error && <p className="mt-4 text-sm font-semibold text-rose-455 text-rose-400">{error}</p>}

        <div className="mt-8 flex justify-end gap-3.5 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 hover:bg-slate-850 px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={isDelete ? handleDelete : handleAdd}
            disabled={isAdding}
            className={`rounded-xl px-6 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-sm ${
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
