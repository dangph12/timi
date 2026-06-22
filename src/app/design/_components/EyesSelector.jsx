import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

const EYES = [
  { id: 'E01', label: 'Eyes E01' },
  { id: 'E02', label: 'Eyes E02' },
  { id: 'E03', label: 'Eyes E03' },
  { id: 'E04', label: 'Eyes E04' },
  { id: 'E05', label: 'Eyes E05' },
  { id: 'E06', label: 'Eyes E06' }
];

export default function EyesSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        Choose one
      </p>
      <div className='grid grid-cols-3 gap-3 mb-4'>
        {EYES.map((eye) => (
          <OptionCard
            key={eye.id}
            label={eye.label}
            imageSrc={`/eyes/${eye.id}.png`}
            isSelected={selections.eyes === eye.id}
            onSelect={() =>
              setSelections((prev) => ({ ...prev, eyes: eye.id }))
            }
          />
        ))}
      </div>
      <StepContinue
        disabled={!selections.eyes}
        onClick={onContinue}
      />
    </>
  );
}
