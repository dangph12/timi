import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { designSelectionsAtom, partOptionsAtom } from '@/store/design';
import { usePartOptions } from '@/app/design/_hooks/usePartsData';
import OptionCard from './OptionCard';
import StepContinue from './StepContinue';
import { Skeleton } from '@/components/ui/skeleton';

export default function PartSelector({ part, onContinue }) {
  const [selections, setSelections] = useAtom(designSelectionsAtom);
  const setPartOptions = useSetAtom(partOptionsAtom);
  const { data: options, isLoading, error } = usePartOptions(part.id);

  useEffect(() => {
    if (options) {
      setPartOptions(prev => ({ ...prev, [part.id]: options }));
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
          selections: { ...prev.selections, [part.id]: option.id }
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

  return (
    <>
      <p className="text-xs text-muted-foreground font-semibold mb-4 tracking-wide">
        {showNotAvailable
          ? 'Select body first'
          : part.allowMultiSelect
            ? 'Choose (Optional)'
            : 'Choose one'}
      </p>

      {showNotAvailable ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Please select a body option first.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-4">
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
        disabled={!isSelected && !part.allowMultiSelect}
        onClick={onContinue}
        label="CONTINUE →"
      />
    </>
  );
}
