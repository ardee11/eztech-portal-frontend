// src/contexts/FilterContext.jsx
import { createContext, useContext, useState } from 'react';

// Define the type for the month-year object
type MonthYear = { month: number | null; year: number };

// Define the shape of the global filter state
type FilterState = {
  selectedMonthYear: MonthYear | null;
  statusFilter: 'All' | 'Delivered' | 'Pending';
  searchQuery: string;
  debouncedSearchQuery: string;
};

// Define the shape of the context value
type FilterContextType = {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
};

// Create the context
const FilterContext = createContext<FilterContextType | null>(null);

// Create the provider component
export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterState, setFilterState] = useState<FilterState>({
    selectedMonthYear: null,
    statusFilter: 'All',
    searchQuery: '',
    debouncedSearchQuery: '',
  });

  return (
    <FilterContext.Provider value={{ filterState, setFilterState }}>
      {children}
    </FilterContext.Provider>
  );
};

// Create a custom hook to use the context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};