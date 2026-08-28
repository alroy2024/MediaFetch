import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useAddNovel from "../hooks/useAddNovel";
import useAddToList from "../hooks/useAddToList";

export interface AddMediaItem {
  id: number;
  title: string;
  image: string;
  summary?: string;
  token: string;
  mediaType: "ANIME" | "MANGA" | "NOVEL";
  englishTitle?: string;
  romajiTitle?: string;
  progressLabel: "episode" | "chapter";
  totalProgress?: number | null;
}

interface AddMediaModalProps {
  item: AddMediaItem;
  onClose: () => void;
}

export default function AddMediaModal({ item, onClose }: AddMediaModalProps) {
  const [progress, setProgress] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

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
          item.token,
          progress,
          item.totalProgress ?? 0,
        );
      } else {
        await useAddToList(
          item.id,
          item.englishTitle || item.title,
          item.romajiTitle || item.title,
          item.image,
          item.token,
          item.mediaType,
          progress,
          item.totalProgress ?? 0,
        );
      }
      onClose();
    } catch {
      setError("Unable to add this item. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const totalLabel = item.totalProgress == null ? "Unavailable" : item.totalProgress;
  const summary = item.summary?.replace(/<[^>]*>/g, "").trim();

  return createPortal(
    (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-sm sm:py-12"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-white shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-media-title"
      >
        <div className="flex gap-5">
          <img
            src={item.image}
            alt=""
            referrerPolicy="no-referrer"
            className="h-40 w-28 shrink-0 rounded-lg object-cover sm:h-52 sm:w-36"
          />
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
              Add to your list
            </p>
            <h2 id="add-media-title" className="text-xl font-semibold text-white sm:text-2xl">
              {item.title}
            </h2>
            <p className="mt-4 max-h-36 overflow-y-auto pr-2 text-sm leading-6 text-zinc-300">
              {summary || "No summary is available for this title yet."}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {item.progressLabel} reached
            </span>
            <input
              type="number"
              min="0"
              max={item.totalProgress ?? undefined}
              value={progress}
              onChange={(event) => setProgress(Math.max(0, Number(event.target.value)))}
              className="mt-2 w-full border-b border-zinc-600 bg-transparent py-2 text-2xl font-semibold text-white outline-none focus:border-red-400"
            />
          </label>
          <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Current total {item.progressLabel}s
            </span>
            <strong className="mt-3 block text-2xl font-semibold text-white">{totalLabel}</strong>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? "Adding..." : "Add to list"}
          </button>
        </div>
      </section>
    </div>
    ),
    document.body,
  );
}
