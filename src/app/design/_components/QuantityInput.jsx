import { Minus, Plus } from 'lucide-react';

export default function QuantityInput({ value, max, onChange }) {
  const atMin = value <= 1;
  const atMax = value >= max;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={atMin}
        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-colors hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus className="size-3.5 stroke-2" />
      </button>
      <span className="text-sm font-bold w-8 text-center tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={atMax}
        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-colors hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus className="size-3.5 stroke-2" />
      </button>
    </div>
  );
}
