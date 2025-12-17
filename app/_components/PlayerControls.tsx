import { RepeatMode } from "./types";

type Props = {
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
};

export default function PlayerControls({
  isPlaying,
  shuffle,
  repeatMode,
  onPlayPause,
  onPrev,
  onNext,
  onShuffle,
  onRepeat,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        onClick={onShuffle}
        className={`h-9 w-9 rounded-full border ${
          shuffle
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
            : "bg-slate-800 border-slate-600 text-slate-300"
        }`}
      >
        🔀
      </button>

      <button onClick={onPrev} className="h-10 w-10 rounded-full bg-slate-800">
        ⏮
      </button>

      <button
        onClick={onPlayPause}
        className="h-14 w-14 rounded-full bg-emerald-500 text-lg"
      >
        {isPlaying ? "❚❚" : "►"}
      </button>

      <button onClick={onNext} className="h-10 w-10 rounded-full bg-slate-800">
        ⏭
      </button>

      <button
        onClick={onRepeat}
        className={`h-9 w-9 rounded-full border ${
          repeatMode === "off"
            ? "bg-slate-800 border-slate-600 text-slate-300"
            : "bg-emerald-500/20 border-emerald-400 text-emerald-300"
        }`}
      >
        {repeatMode === "one" ? "🔁1" : "🔁"}
      </button>
    </div>
  );
}
