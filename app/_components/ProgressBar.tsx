type Props = {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
};

const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: Props) {
  return (
    <div className="mt-4">
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full cursor-pointer accent-emerald-400"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
