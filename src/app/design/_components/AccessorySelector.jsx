import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

const ACCESSORIES = [
  { id: 'A01', label: 'Accessory A01' },
  { id: 'A02', label: 'Accessory A02' },
  { id: 'A03', label: 'Accessory A03' },
  { id: 'A04', label: 'Accessory A04' },
  { id: 'A05', label: 'Accessory A05' },
  { id: 'A06', label: 'Accessory A06' },
  { id: 'A07', label: 'Accessory A07' },
  { id: 'A08', label: 'Accessory A08' }
];

export default function AccessorySelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        Choose one
      </p>
      <div className='grid grid-cols-3 gap-3 mb-4'>
        {ACCESSORIES.map((acc) => (
          <OptionCard
            key={acc.id}
            label={acc.label}
            imageSrc={`/accessory/${acc.id}.png`}
            isSelected={selections.accessory === acc.id}
            onSelect={() =>
              setSelections((prev) => ({ ...prev, accessory: acc.id }))
            }
          />
        ))}
      </div>
      <StepContinue
        disabled={!selections.accessory}
        onClick={onContinue}
      />
    </>
  );
}
