import { useState, useMemo } from 'react';

export const useEmployeeSearch = (employees) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEmployees
  };
};
