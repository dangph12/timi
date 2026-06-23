import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import { ACCESSORY_MUTEX_GROUPS } from '@/constants/positions';
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
  const isEconomy = selections.version === 'economy';

  function handleSelect(accId) {
    // Prevent selection of A01-A04 in economy version
    if (isEconomy && ['A01', 'A02', 'A03', 'A04'].includes(accId)) {
      return;
    }

    setSelections(prev => {
      const currentAccessories = prev.accessory || [];
      const isSelected = currentAccessories.includes(accId);

      if (isSelected) {
        // Toggle off if currently selected
        return {
          ...prev,
          accessory: currentAccessories.filter(id => id !== accId)
        };
      } else {
        // Find if this accessory belongs to any exclusive couple/group
        const mutexGroup =
          ACCESSORY_MUTEX_GROUPS.find(group => group.includes(accId)) || [];

        // Filter out other members from the same mutex group/couple
        const filteredAccessories = currentAccessories.filter(
          id => !mutexGroup.includes(id)
        );

        return {
          ...prev,
          accessory: [...filteredAccessories, accId]
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
        {ACCESSORIES.map(acc => {
          const isDisabled = isEconomy && ['A01', 'A02', 'A03', 'A04'].includes(acc.id);
          return (
            <OptionCard
              key={acc.id}
              label={acc.label}
              imageSrc={`/accessory/${acc.id}.png`}
              isSelected={activeAccessories.includes(acc.id)}
              disabled={isDisabled}
              onSelect={() => handleSelect(acc.id)}
            />
          );
        })}
      </div>
      <StepContinue disabled={false} onClick={onContinue} />
    </>
  );
}
