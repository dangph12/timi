import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

const VERSIONS = [
  {
    id: 'economy',
    label: 'Classic Version',
    imageSrc: '/version/economy.png',
    imageScale: 105
  },
  {
    id: 'standard',
    label: 'Standard Version',
    imageSrc: '/version/standard.png',
    imageScale: 115
  }
];

export default function VersionSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        Choose one
      </p>
      <div className='flex gap-4 mb-4'>
        {VERSIONS.map(v => (
          <OptionCard
            key={v.id}
            label={v.label}
            imageSrc={v.imageSrc}
            imageScale={v.imageScale}
            isSelected={selections.version === v.id}
            onSelect={() =>
              setSelections({
                version: v.id,
                hair: null,
                eyes: null,
                lip: null,
                clothes: [],
                accessory: [],
                item: null,
                packaging: null
              })
            }
          />
        ))}
      </div>
      <StepContinue disabled={!selections.version} onClick={onContinue} />
    </>
  );
}
