import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { designSelectionsAtom, partOptionsAtom } from '@/store/design';
import { usePartOptions } from '@/app/thiet-ke/_hooks/usePartsData';
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
      <div className="text-center py-8 text-destructive text-sm">
        Không thể tải tùy chọn. Vui lòng thử lại.
      </div>
    );
  }

  const showNotAvailable = !isBody && selections.styleId == null;
  const noOptions = options && options.length === 0;

  return (
    <>
      <p className="text-xs text-muted-foreground font-semibold mb-4 tracking-wide">
        {showNotAvailable
          ? 'Chọn body trước'
          : noOptions
            ? 'Không có tùy chọn cho kiểu này'
            : part.allowMultiSelect
              ? 'Chọn (Không bắt buộc)'
              : 'Chọn một'}
      </p>

      {showNotAvailable ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Vui lòng chọn body trước.
        </div>
      ) : noOptions ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Không có tùy chọn cho phần này với kiểu hiện tại.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {!isBody && (
            <button
              type="button"
              onClick={handleDeselect}
              className={`group relative flex-1 bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 outline-none flex flex-col ${
                !isSelected
                  ? 'border-primary shadow-md shadow-primary/10'
                  : 'border-border hover:border-foreground/20'
              }`}
            >
              <div className="aspect-4/3 w-full relative overflow-hidden shrink-0 flex items-center justify-center bg-muted">
                <Ban className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <div className="p-3 bg-white text-center w-full border-t border-border mt-auto">
                <p className={`text-[11px] font-black tracking-wider uppercase transition-colors ${
                  !isSelected ? 'text-primary' : 'text-muted-foreground'
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
        label="TIẾP →"
      />
    </>
  );
}
