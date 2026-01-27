import React from 'react';
import { Button } from '@/components/ui/button';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';

interface ApplicationFiltersProps {
  currentFilter: 'all' | ApplicationStatus;
  onFilterChange: (filter: 'all' | ApplicationStatus) => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const filters: Array<{ value: 'all' | ApplicationStatus; label: string }> = [
    { value: 'all', label: 'All' },
    { value: ApplicationStatus.SUBMITTED, label: 'Submitted' },
    { value: ApplicationStatus.ACCEPTED, label: 'Accepted' },
    { value: ApplicationStatus.REJECTED, label: 'Rejected' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? 'default' : 'outline'}
          onClick={() => onFilterChange(filter.value)}
          size="sm"
          className={
            currentFilter === filter.value
              ? 'bg-gradient hover:opacity-90'
              : 'border-gray-200 hover:bg-gray-50'
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};