type Props = {
  bass: number;   
  mid: number;    
  treble: number; 
  onChange: (next: { bass: number; mid: number; treble: number }) => void;
  onReset: () => void;
};

function Knob({
  label,
  value,
  onValue,
}: {
  label: string;
  value: number;
  onValue: (v: number) => void;
}) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs tracking-wide text-slate-400">{label}</span>
        <span className="text-xs text-slate-300 tabular-nums">{value} dB</span>
      </div>
      <input
        type="range"
        min={-12}
        max={12}
        step={1}
        value={value}
        onChange={(e) => onValue(Number(e.target.value))}
        className="w-full cursor-pointer accent-emerald-400"
      />
    </div>
  );
}

export default function Equalizer({
  bass,
  mid,
  treble,
  onChange,
  onReset,
}: Props) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-800/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-[0.25em] text-slate-500">EQUALIZER</p>
        <button
          onClick={onReset}
          className="text-xs text-slate-300 hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="flex gap-4">
        <Knob
          label="Bass"
          value={bass}
          onValue={(v) => onChange({ bass: v, mid, treble })}
        />
        <Knob
          label="Mid"
          value={mid}
          onValue={(v) => onChange({ bass, mid: v, treble })}
        />
        <Knob
          label="Treble"
          value={treble}
          onValue={(v) => onChange({ bass, mid, treble: v })}
        />
      </div>
    </div>
  );
}
