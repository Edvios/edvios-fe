import { LucideIcon } from 'lucide-react';

export interface UserTypeOption {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

interface UserTypeToggleProps {
  options: UserTypeOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  showDescription?: boolean;
}

export function UserTypeToggle({
  options,
  value,
  onChange,
  disabled = false,
  label,
  showDescription = true,
}: UserTypeToggleProps) {
  const selectedOption = options.find(option => option.id === value);
  const gridCols = options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-4';
  
  // Calculate sliding background position and width
  const getBackgroundPosition = () => {
    const index = options.findIndex(opt => opt.id === value);
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
          className="absolute top-1 bottom-1 rounded-4xl shadow-md transition-all duration-300 ease-in-out"
          style={{
            background: 'linear-gradient(135deg, #e5601b, #f88124)',
            ...getBackgroundPosition(),
          }}
        />
        
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            disabled={disabled}
            className="relative z-10 px-3 py-2.5 rounded-4xl transition-colors duration-300 ease-in-out border-0 text-sm font-medium"
            style={{
              border: 'none',
              background: 'transparent',
              color: value === option.id ? 'white' : '#374151',
            }}
          >
            <div className="flex items-center justify-center gap-1.5">
              <option.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{option.name}</span>
              <span className="sm:hidden">
                {option.name.length > 8 ? option.name.substring(0, 8) : option.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      {showDescription && selectedOption && (
        <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
          <div className="flex items-center space-x-2 mb-1">
            <selectedOption.icon className="w-4 h-4" style={{ color: '#e5601b' }} />
            <span className="font-medium text-sm text-gray-800">{selectedOption.name}</span>
          </div>
          <p className="text-xs text-gray-600">{selectedOption.description}</p>
        </div>
      )}
    </div>
  );
}