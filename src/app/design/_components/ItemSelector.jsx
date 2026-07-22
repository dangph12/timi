import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { designSelectionsAtom } from '@/store/design';
import StepContinue from './StepContinue';

const ITEM_TYPES = [
  {
    id: 'keychain',
    label: 'Keychain',
    imageSrc: '/item/select/I01.png'
  },
  {
    id: 'magnet',
    label: 'Magnet',
    imageSrc: '/item/select/I02.png'
  },
  {
    id: 'badges',
    label: 'Badges',
    imageSrc: '/item/select/I03.png'
  },
  {
    id: 'luggage-tag',
    label: 'Luggage tag',
    imageSrc: '/item/select/I04.png'
  }
];

const ITEM_COLORS = [
  { id: 'red', label: 'RED', bgClass: 'bg-[#ff3030] text-white' },
  { id: 'orange', label: 'ORANGE', bgClass: 'bg-[#ff7b1c] text-white' },
  { id: 'yellow', label: 'YELLOW', bgClass: 'bg-[#ffd324] text-white' },
  { id: 'green', label: 'GREEN', bgClass: 'bg-[#76de4a] text-white' },
  { id: 'blue', label: 'BLUE', bgClass: 'bg-[#3fdce0] text-white' },
  { id: 'purple', label: 'PURPLE', bgClass: 'bg-[#9d3aed] text-white' },
  { id: 'pink', label: 'PINK', bgClass: 'bg-[#ff69c4] text-white' },
  { id: 'white', label: 'WHITE', bgClass: 'bg-white text-black' },
  { id: 'black', label: 'BLACK', bgClass: 'bg-black text-white' }
];

export default function ItemSelector({ onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      setSelections(prev =>
        prev.item?.type
          ? prev
          : { ...prev, item: { type: 'keychain', color: 'pink' } }
      );
    }
  }, [setSelections]);

  const CheckIndicator = () => (
    <div className='absolute -bottom-2 -right-2 bg-[#0000D0] text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white z-10'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20 20'
        fill='currentColor'
        className='w-4 h-4'
      >
        <path
          fillRule='evenodd'
          d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
          clipRule='evenodd'
        />
      </svg>
    </div>
  );

  const selectedType = selections.item?.type;
  const selectedColor = selections.item?.color;

  return (
    <>
      <p className='text-sm text-[#0000D0] font-medium mb-3'>Choose one</p>

      <div className='flex gap-3 mb-6 overflow-x-auto pb-2'>
        {ITEM_TYPES.map(item => {
          const isSelected = selectedType === item.id;
          return (
            <div
              key={item.id}
              onClick={() =>
                setSelections(prev => ({
                  ...prev,
                  item: { type: item.id, color: prev.item?.color }
                }))
              }
              className={`relative cursor-pointer rounded-xl border-2 transition-all p-1.5 w-32 shrink-0 ${
                isSelected
                  ? 'border-[#0000D0]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className='w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center'>
                <img
                  src={item.imageSrc}
                  alt={item.label}
                  className='object-cover w-full h-full'
                />
              </div>
              <p
                className={`text-center font-black mt-2 text-sm drop-shadow-sm ${
                  isSelected && item.id === 'keychain'
                    ? 'text-[#ff69c4]'
                    : isSelected && item.id === 'magnet'
                      ? 'text-[#ff3030]'
                      : isSelected && item.id === 'badges'
                        ? 'text-[#9d3aed]'
                        : isSelected && item.id === 'luggage-tag'
                          ? 'text-[#76de4a]'
                          : 'text-gray-400'
                }`}
              >
                {item.label}
              </p>
              {isSelected && <CheckIndicator />}
            </div>
          );
        })}
      </div>

      <p className='text-sm text-[#0000D0] font-medium mb-3'>Choose one</p>

      <div className='flex flex-wrap gap-2.5 mb-8'>
        {ITEM_COLORS.map(color => {
          const isSelected = selectedColor === color.id;
          return (
            <button
              key={color.id}
              type='button'
              onClick={() =>
                setSelections(prev => ({
                  ...prev,
                  item: { type: prev.item?.type, color: color.id }
                }))
              }
              className={`relative p-1 rounded-xl transition-all border-2 bg-white ${
                isSelected
                  ? 'border-[#0000D0]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 min-w-[80px] flex items-center justify-center text-sm font-black uppercase ${color.bgClass}`}
              >
                {color.label}
              </div>
              {isSelected && <CheckIndicator />}
            </button>
          );
        })}
      </div>

      <StepContinue
        disabled={!selectedType || !selectedColor}
        onClick={onContinue}
      />
    </>
  );
}
