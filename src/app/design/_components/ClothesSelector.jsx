import { useAtom } from 'jotai';
import { designSelectionsAtom, canChooseClothesAtom } from '@/store/design';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

const CLOTHES = [
  { id: 'C01', label: 'Clothes C01' },
  { id: 'C02', label: 'Clothes C02' },
  { id: 'C03', label: 'Clothes C03' },
  { id: 'C04', label: 'Clothes C04' },
  { id: 'C05', label: 'Clothes C05' },
  { id: 'C06', label: 'Clothes C06' },
  { id: 'C07', label: 'Clothes C07' },
  { id: 'C08', label: 'Clothes C08' },
  { id: 'C09', label: 'Clothes C09' }
];

export default function ClothesSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);
  const canChoose = useAtom(canChooseClothesAtom)[0];

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        {canChoose ? 'Choose one' : 'Not available for Classic Version'}
      </p>
      <div
        className={`grid grid-cols-3 gap-3 mb-4 ${
          canChoose ? '' : 'opacity-50 blur-[2px] pointer-events-none'
        }`}
      >
        {CLOTHES.map((item) => (
          <OptionCard
            key={item.id}
            label={item.label}
            imageSrc={`/clothes/${item.id}.png`}
            isSelected={selections.clothes === item.id}
            onSelect={() =>
              setSelections((prev) => ({ ...prev, clothes: item.id }))
            }
          />
        ))}
      </div>
      <StepContinue
        disabled={canChoose && !selections.clothes}
        onClick={onContinue}
      />
    </>
  );
}
