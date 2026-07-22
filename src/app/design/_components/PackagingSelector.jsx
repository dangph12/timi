import { useAtom } from 'jotai';
import { designSelectionsAtom } from '@/store/design';
import { PACKAGING_OPTIONS, VERSION_OPTIONS } from '@/constants/pricing';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';

export default function PackagingSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);

  const basePrice = VERSION_OPTIONS[selections.version]?.price ?? 120000;
  const selectedPackaging = PACKAGING_OPTIONS.find(p => p.id === selections.packaging);
  const packagingPrice = selectedPackaging?.price ?? 0;
  const subtotal = basePrice + packagingPrice;

  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        Choose one
      </p>
      <div className='flex gap-3 mb-4'>
        {PACKAGING_OPTIONS.map(option => (
          <OptionCard
            key={option.id}
            label={option.label}
            subtitle={option.price === 0 ? '0đ' : option.price.toLocaleString('vi-VN') + 'đ'}
            imageSrc={option.imageSrc}
            imageScale={90}
            isSelected={selections.packaging === option.id}
            onSelect={() =>
              setSelections(prev => ({ ...prev, packaging: option.id }))
            }
          />
        ))}
      </div>
      <div className='flex items-baseline gap-3 mb-2 px-1'>
        <span className='text-sm font-black tracking-widest uppercase text-[#0000D0]'>SUBTOTAL</span>
        <span className='text-xl font-black text-[#FF3E8A]'>
          {subtotal.toLocaleString('vi-VN')}đ
        </span>
      </div>
      <StepContinue
        disabled={!selections.packaging}
        onClick={onContinue}
        label='FINALIZE AND CHECKOUT →'
      />
    </>
  );
}
