import { useEffect, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive grid columns
  const gridCols = options.length === 4 
    ? 'grid-cols-2 sm:grid-cols-4' 
    : options.length === 3 
    ? 'grid-cols-1 sm:grid-cols-3' 
    : 'grid-cols-1 sm:grid-cols-2';
  
  // Calculate sliding background position and width
  const getBackgroundPosition = () => {
    const index = options.findIndex(opt => opt === value);
    
    // Mobile: Stack vertically (1 column)
    if (isMobile && options.length <= 3) {
      const itemHeight = 100 / options.length;
      
      return {
        width: 'calc(100% - 8px)',
        height: `calc(${itemHeight}% - ${8 / options.length}px)`,
        left: '4px',
        top: index === 0 ? '4px' : `calc(${itemHeight * index}% + ${(8 * index) / options.length}px)`,
      };
    }
    
    // Mobile with 4 options: 2x2 grid
    if (isMobile && options.length === 4) {
      const col = index % 2;
      const row = Math.floor(index / 2);
      
      return {
        width: 'calc(50% - 6px)',
        height: 'calc(50% - 6px)',
        left: col === 0 ? '4px' : 'calc(50% + 2px)',
        top: row === 0 ? '4px' : 'calc(50% + 2px)',
      };
    }
    
    // Desktop: Horizontal layout
    const percentage = 100 / options.length;
    const gapAdjustment = options.length === 2 ? 4 : options.length === 3 ? 5.33 : 6;
    
    return {
      width: `calc(${percentage}% - ${gapAdjustment}px)`,
      height: 'calc(100% - 8px)',
      left: index === 0 ? '4px' : `calc(${percentage * index}% + ${(8 * index) / options.length - gapAdjustment}px)`,
      top: '4px',
    };
  };

  const backgroundStyle = getBackgroundPosition();

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-gray-700 font-medium text-sm">
          {label}
        </label>
      )}
      
      <div 
        className={`grid ${gridCols} gap-2 p-1 rounded-4xl bg-gray-100 relative`}
        style={{
          minHeight: isMobile && options.length <= 3 ? `${options.length * 44}px` : 'auto',
        }}
      >
        {/* Sliding background indicator */}
        <div 
          className="absolute rounded-4xl shadow-md transition-all duration-300 ease-out bg-edvios-green"
          style={backgroundStyle}
        />
        
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => !disabled && onChange(option)}
            disabled={disabled}
            className={`
              relative z-10 px-2 py-1.5 sm:py-2 rounded-4xl 
              transition-colors duration-300 ease-out
              text-xs sm:text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none
            `}
            style={{
              border: 'none',
              background: 'transparent',
              color: value === option ? 'white' : '#374151',
            }}
          >
            <span className="block">
              {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}