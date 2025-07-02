import { useState, useMemo } from 'react';

export const usePositionSearch = (positions) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPositions = useMemo(() => {
    if (!searchTerm) return positions;
    return positions.filter(position =>
      position.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [positions, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredPositions
  };
};
