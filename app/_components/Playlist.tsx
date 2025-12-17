import { Track } from "./types";

type Props = {
  tracks: Track[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export default function Playlist({
  tracks,
  currentIndex,
  onSelect,
}: Props) {
  return (
    <div className="mt-8 border-t border-slate-700/70 pt-4">
      <p className="text-xs tracking-[0.25em] text-slate-500 mb-3">
        PLAYLIST
      </p>

      {tracks.map((track, index) => (
        <button
          key={track.id}
          onClick={() => onSelect(index)}
          className={`w-full px-4 py-3 rounded-xl mb-2 text-sm ${
            index === currentIndex
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-slate-800/80"
          }`}
        >
          <div className="flex justify-between">
            <span>{track.title}</span>
            <span className="text-xs">{track.artist}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
