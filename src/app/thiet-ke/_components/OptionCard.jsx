import { memo } from "react";
import { Check } from "lucide-react";

const OptionCard = memo(function OptionCard({
  label,
  imageSrc,
  isSelected,
  onSelect,
  imageScale = 105,
  disabled = false,
  imageBgClass = "bg-muted",
}) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`group relative flex-1 bg-white border rounded-lg overflow-hidden transition-all duration-200 outline-none flex flex-col ${
        isSelected
          ? "border-primary shadow-sm shadow-primary/10"
          : "border-border hover:border-foreground/20"
      } ${disabled ? "opacity-50 blur-[2px] pointer-events-none" : ""}`}
    >
      <div
        className={`aspect-4/3 w-full relative overflow-hidden shrink-0 ${imageBgClass}`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <img
            src={imageSrc}
            className="object-contain filter drop-shadow-sm"
            style={{
              maxWidth: `${imageScale}%`,
              maxHeight: `${imageScale}%`,
            }}
            alt={label}
          />
        </div>
        {isSelected && (
          <span className="absolute bottom-1 right-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white border-2 border-white shadow-sm z-10">
            <Check className="size-3 stroke-3" />
          </span>
        )}
      </div>
      <div className="p-2 bg-white text-center w-full border-t border-border mt-auto">
        <p
          className={`text-[11px] font-black tracking-wider uppercase transition-colors ${
            isSelected ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
      </div>
    </button>
  );
});

export default OptionCard;
