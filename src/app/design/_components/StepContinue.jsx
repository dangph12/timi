import { Button } from "@/components/ui/button";

export default function StepContinue({
  disabled,
  onClick,
  label = "CONTINUE →",
  isPending = false,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200/80 z-50 md:static md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none md:z-auto md:mt-4">
      <Button
        className="w-full py-4 text-xs font-black bg-[#0000D0] hover:bg-[#0000A0] text-white tracking-widest rounded-full h-11 transition-all shadow-md active:scale-[0.98]"
        onClick={onClick}
        disabled={disabled || isPending}
      >
        {label}
      </Button>
    </div>
  );
}
