import { useState, useMemo } from 'react';

export const useLocationSearch = (locations) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations;
    return locations.filter(location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredLocations
  };
};
