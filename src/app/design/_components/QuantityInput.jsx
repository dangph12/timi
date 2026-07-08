import { Minus, Plus } from 'lucide-react';

export default function QuantityInput({ value, max, onChange }) {
  const atMin = value <= 1;
  const atMax = value >= max;

  function handleInputChange(e) {
    const raw = e.target.value;
    if (raw === '') {
      onChange(1);
      return;
    }
    const num = parseInt(raw, 10);
    if (isNaN(num)) return;
    onChange(Math.max(1, Math.min(max, num)));
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={atMin}
        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-colors hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus className="size-3.5 stroke-2" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInputChange}
        className="w-12 text-center text-sm font-bold tabular-nums border-2 border-slate-300 rounded-lg py-1 outline-none focus:border-[#0000D0] focus:ring-1 focus:ring-[#0000D0]/20 transition-colors"
      />
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
