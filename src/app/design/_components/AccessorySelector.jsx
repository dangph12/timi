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

  const activeAccessories = selections.accessory || [];

  function handleSelect(accId) {
    setSelections(prev => {
      const currentAccessories = prev.accessory || [];
      if (currentAccessories.includes(accId)) {
        return {
          ...prev,
          accessory: currentAccessories.filter(id => id !== accId)
        };
      } else {
        return {
          ...prev,
          accessory: [...currentAccessories, accId]
        };
      }
    });
  }

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        Choose accessories (Optional)
      </p>
      <div className='grid grid-cols-3 gap-3 mb-4'>
        {ACCESSORIES.map(acc => (
          <OptionCard
            key={acc.id}
            label={acc.label}
            imageSrc={`/accessory/${acc.id}.png`}
            isSelected={activeAccessories.includes(acc.id)}
            onSelect={() => handleSelect(acc.id)}
          />
        ))}
      </div>
      <StepContinue disabled={false} onClick={onContinue} />
    </>
  );
}
