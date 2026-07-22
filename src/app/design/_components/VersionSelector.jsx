import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import { VERSION_OPTIONS } from '@/constants/pricing';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

const VERSIONS = [
  {
    id: 'economy',
    label: 'Economy Version',
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
            subtitle={VERSION_OPTIONS[v.id]?.price.toLocaleString('vi-VN') + 'đ'}
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
            imageBgClass='bg-linear-to-b from-[#0000FF] to-[#4A4AFF]'
          />
        ))}
      </div>
      <StepContinue disabled={!selections.version} onClick={onContinue} />
    </>
  );
}
