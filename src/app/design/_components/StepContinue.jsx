import { Button } from '@/components/ui/button';

export default function StepContinue({
  disabled,
  onClick,
  label = 'CONTINUE →'
}) {
  return (
    <Button
      className='w-full py-4 text-xs font-black bg-[#0000D0] hover:bg-[#0000A0] text-white tracking-widest rounded-full h-11 transition-all shadow-md active:scale-[0.98]'
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
