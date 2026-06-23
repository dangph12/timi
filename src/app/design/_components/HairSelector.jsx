import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import { HAIR_OPTIONS } from '@/constants/hair';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

export default function HairSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        Choose one
      </p>
      <div className='grid grid-cols-3 gap-3 mb-4'>
        {HAIR_OPTIONS.map((hair) => (
          <OptionCard
            key={hair.id}
            label={hair.label}
            imageSrc={`/hair-top/${hair.id}.png`}
            isSelected={selections.hair === hair.id}
            onSelect={() =>
              setSelections((prev) => ({ ...prev, hair: hair.id }))
            }
          />
        ))}
      </div>
      <StepContinue
        disabled={!selections.hair}
        onClick={onContinue}
      />
    </>
  );
}
