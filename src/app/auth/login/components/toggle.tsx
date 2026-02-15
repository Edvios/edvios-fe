import React from 'react';

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
  // Calculate sliding background position and width
  const getBackgroundPosition = () => {
    const index = options.findIndex(opt => opt === value);
    const percentage = 100 / options.length;

    // Consistent horizontal calculation for all screens
    return {
      width: `calc(${percentage}% - 8px)`,
      height: 'calc(100% - 8px)',
      left: `calc(${percentage * index}% + 4px)`,
      top: '4px',
    };
  };

  const backgroundStyle = getBackgroundPosition();

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-gray-700 font-medium text-sm">
          {label}
        </label>
      )}

      <div
        className="grid gap-1 p-1 rounded-4xl bg-gray-100 relative"
        style={{
          gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        }}
      >
        {/* Sliding background indicator */}
        <div
          className="absolute rounded-4xl shadow-sm border-[1px] border-edvios-green "
          style={{
            ...backgroundStyle,
            transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => !disabled && onChange(option)}
            disabled={disabled}
            className={`
              relative z-10 px-1 py-2.5 sm:px-2 sm:py-2 rounded-4xl 
              transition-all duration-500 ease-in-out
              text-[12px] sm:text-sm font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none
              ${value === option ? 'text-primary font-semibold' : 'text-primary font-medium'}
            `}
            style={{
              border: 'none',
              background: 'transparent',
            }}
          >
            <span className="block truncate">
              {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}