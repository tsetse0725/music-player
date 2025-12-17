type Props = {
  volume: number;          
  isMuted: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
};

export default function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: Props) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <button
        onClick={onToggleMute}
        className={`h-9 w-9 flex items-center justify-center rounded-full border text-xs ${
          isMuted
            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
            : "bg-slate-800 border-slate-600 text-slate-300"
        }`}
        title="Mute"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-emerald-400"
      />

      <span className="w-10 text-right text-xs text-slate-400 tabular-nums">
        {Math.round((isMuted ? 0 : volume) * 100)}%
      </span>
    </div>
  );
}
