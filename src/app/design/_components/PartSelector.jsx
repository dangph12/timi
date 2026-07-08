import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { designSelectionsAtom, partOptionsAtom } from '@/store/design';
import { usePartOptions } from '@/app/design/_hooks/usePartsData';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';
import { Skeleton } from '@/components/ui/skeleton';
import { Ban } from 'lucide-react';

export default function PartSelector({ part, onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);
  const setPartOptions = useSetAtom(partOptionsAtom);
  const { data: options, isLoading, error } = usePartOptions(part.id);

  useEffect(() => {
    if (options) {
      setPartOptions(prev => {
        if (prev[part.id] === options) return prev;
        return { ...prev, [part.id]: options };
      });
    }
  }, [options, part.id, setPartOptions]);

  const current = selections.selections[part.id];
  const isBody = part.id === 1;
  const isSelected = part.allowMultiSelect
    ? (Array.isArray(current) && current.length > 0)
    : (current != null);

  function handleSelect(option) {
    setSelections(prev => {
      if (isBody) {
        return {
          styleId: option.styleId,
          selections: { [part.id]: option.id }
        };
      }

      if (part.allowMultiSelect) {
        const currentValues = prev.selections[part.id] || [];
        const exists = currentValues.includes(option.id);

        if (exists) {
          return {
            ...prev,
            selections: {
              ...prev.selections,
              [part.id]: currentValues.filter(id => id !== option.id)
            }
          };
        }

        const mutexKey = option.mutexGroupKey;
        let filtered = currentValues;
        if (mutexKey) {
          filtered = currentValues.filter(id => {
            const other = options?.find(o => o.id === id);
            return other?.mutexGroupKey !== mutexKey;
          });
        }

        return {
          ...prev,
          selections: {
            ...prev.selections,
            [part.id]: [...filtered, option.id]
          }
        };
      }

      return {
        ...prev,
        selections: { ...prev.selections, [part.id]: option.id }
      };
    });
  }

  function handleDeselect() {
    setSelections(prev => ({
      ...prev,
      selections: {
        ...prev.selections,
        [part.id]: part.allowMultiSelect ? [] : null
      }
    }));
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-4/3 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 text-sm">
        Failed to load options. Please try again.
      </div>
    );
  }

  const showNotAvailable = !isBody && selections.styleId == null;
  const noOptions = options && options.length === 0;

  return (
    <>
      <p className="text-xs text-muted-foreground font-semibold mb-4 tracking-wide">
        {showNotAvailable
          ? 'Select body first'
          : noOptions
            ? 'No options for this style'
            : part.allowMultiSelect
              ? 'Choose (Optional)'
              : 'Choose one'}
      </p>

      {showNotAvailable ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Please select a body option first.
        </div>
      ) : noOptions ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No options available for this part with the current style.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {!isBody && (
            <button
              type="button"
              onClick={handleDeselect}
              className={`group relative flex-1 bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 outline-none flex flex-col ${
                !isSelected
                  ? 'border-[#0000D0] shadow-md shadow-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="aspect-4/3 w-full relative overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
                <Ban className="w-10 h-10 text-slate-300" />
              </div>
              <div className="p-3 bg-white text-center w-full border-t border-slate-100 mt-auto">
                <p className={`text-[11px] font-black tracking-wider uppercase transition-colors ${
                  !isSelected ? 'text-[#0000D0]' : 'text-slate-600'
                }`}>
                  Không
                </p>
              </div>
            </button>
          )}
          {options?.map(option => {
            const isActive = part.allowMultiSelect
              ? (Array.isArray(current) && current.includes(option.id))
              : (current === option.id);

            return (
              <OptionCard
                key={option.id}
                label={option.name}
                imageSrc={option.imageUrl}
                isSelected={isActive}
                onSelect={() => handleSelect(option)}
              />
            );
          })}
        </div>
      )}

      <StepContinue
        disabled={!noOptions && !isSelected && !part.allowMultiSelect && isBody}
        onClick={onContinue}
        label="CONTINUE →"
      />
    </>
  );
}
