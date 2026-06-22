import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

const LIPS = [
  { id: 'L01', label: 'Lip L01' },
  { id: 'L02', label: 'Lip L02' },
  { id: 'L03', label: 'Lip L03' },
  { id: 'L04', label: 'Lip L04' },
  { id: 'L05', label: 'Lip L05' },
  { id: 'L06', label: 'Lip L06' },
  { id: 'L07', label: 'Lip L07' }
];

export default function LipSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        Choose one
      </p>
      <div className='grid grid-cols-3 gap-3 mb-4'>
        {LIPS.map((lip) => (
          <OptionCard
            key={lip.id}
            label={lip.label}
            imageSrc={`/lip/${lip.id}.png`}
            isSelected={selections.lip === lip.id}
            onSelect={() =>
              setSelections((prev) => ({ ...prev, lip: lip.id }))
            }
          />
        ))}
      </div>
      <StepContinue
        disabled={!selections.lip}
        onClick={onContinue}
      />
    </>
  );
}
