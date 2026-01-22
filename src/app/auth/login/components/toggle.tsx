interface UserTypeToggleProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

export function UserTypeToggle({
  options,
  value,
  onChange,
  disabled = false,
  label,
}: UserTypeToggleProps) {
  const gridCols = options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-4';
  
  // Calculate sliding background position and width
  const getBackgroundPosition = () => {
    const index = options.findIndex(opt => opt === value);
    const percentage = 100 / options.length;
    const gapAdjustment = options.length === 2 ? 4 : options.length === 3 ? 5.33 : 4;
    
    return {
      width: `calc(${percentage}% - ${gapAdjustment}px)`,
      left: index === 0 ? '4px' : `calc(${percentage * index}% + ${(8 * index) / options.length - gapAdjustment}px)`,
    };
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-gray-700 font-medium text-sm">{label}</label>}
      
      <div className={`grid ${gridCols} gap-2 p-1 rounded-4xl bg-gray-100 relative`}>
        {/* Sliding background indicator */}
        <div 
          className="absolute top-1 bottom-1 rounded-4xl shadow-md transition-all duration-300 ease-in-out bg-orange-gradient"
          style={{
            ...getBackgroundPosition(),
          }}
        />
        
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            disabled={disabled}
            className="relative z-10 px-2 py-2 rounded-4xl transition-colors duration-300 ease-in-out border-0 text-sm font-medium"
            style={{
              border: 'none',
              background: 'transparent',
              color: value === option ? 'white' : '#374151',
            }}
          >
            <span>{option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}