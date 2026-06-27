import { useAtom } from 'jotai';
import { designSelectionsAtom, canChooseClothesAtom } from '@/store/design';
import { CLOTHES } from '@/constants/clothes';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

export default function ClothesSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);
  const canChoose = useAtom(canChooseClothesAtom)[0];

  const activeClothes = selections.clothes || [];

  function handleSelect(item) {
    setSelections(prev => {
      const currentClothes = prev.clothes || [];
      const isSelected = currentClothes.includes(item.id);

      if (isSelected) {
        return {
          ...prev,
          clothes: currentClothes.filter(id => id !== item.id)
        };
      }

      const newClothes = [
        ...currentClothes.filter(id => {
          const config = CLOTHES.find(c => c.id === id);
          return config && config.category !== item.category;
        }),
        item.id
      ];

      return {
        ...prev,
        clothes: newClothes
      };
    });
  }

  const hasAnySelection = activeClothes.length > 0;

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        {canChoose ? 'Choose clothes' : 'Not available for Economy Version'}
      </p>

      <div
        className={`grid grid-cols-3 gap-3 mb-4 ${
          canChoose ? '' : 'opacity-50 blur-[2px] pointer-events-none'
        }`}
      >
        {CLOTHES.map(item => (
          <OptionCard
            key={item.id}
            label={item.label}
            imageSrc={`/clothes/${item.id}.png`}
            isSelected={activeClothes.includes(item.id)}
            onSelect={() => handleSelect(item)}
          />
        ))}
      </div>

      <StepContinue
        disabled={canChoose && !hasAnySelection}
        onClick={onContinue}
      />
    </>
  );
}
