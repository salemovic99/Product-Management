import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import employeesService from '@/services/employeeService';

export const useEmployees = (pageSize = 5) => {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      
      const [EmployeesData, count] = await Promise.all([
        employeesService.getEmployees(skip, pageSize,{
          search:searchTerm
        }),
        employeesService.getEmployeeCount({
          search:searchTerm
        })
      ]);

      setEmployees(EmployeesData);
      setTotalEmployees(count);
      setTotalPages(Math.ceil(count / pageSize));
      setError('');
    } catch (err) {
      setError('Error fetching employees: ' + err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      const newEmployee = await employeesService.createEmployee(employeeData);
      if(!newEmployee)
      {
        toast.error('Failed to create employee!');
        return;
      }

      setEmployees(prev => [...prev, newEmployee]);
      toast.success('Employee created successfully', {
        description: `Created at ${new Date().toLocaleString()}`
      });
      
      return { success: true };

    } catch (err) {
      toast.error('Failed to create employee: ' + err.message);
      return { success: false, error: err.message };
    }
  };

   const updateEmployee = async (id, employeeData) => {
    try {
      const updatedEmployee = await employeesService.updateEmployee(id, employeeData);

      if(!updateEmployee)
      {
        toast.error('Failed to update employee');
        return;
      }

      setEmployees(prev => 
        prev.map(emp => emp.id === id ? updatedEmployee : emp)
      );
      
      toast.success('Employee updated successfully', {
        description: `Updated at ${new Date().toLocaleString()}`
      });
      
      return { success: true };
    } catch (err) {
      toast.error('Failed to update employee: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  
  const deleteEmployee = async (id) => {
    try {
      const result = await employeesService.deleteEmployee(id);
      if(!result)
      {
        toast.error('Failed to delete employee');
        return;
      }

      setEmployees(prev => prev.filter(emp => emp.id !== id));
      
      toast.success('Employee deleted successfully', {
        description: `Deleted at ${new Date().toLocaleString()}`
      });
      
      return { success: true };
    } catch (err) {
      toast.error('Failed to delete employee!: ', {
        description: err.message
      });
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, pageSize]);

  return {
    searchTerm,
    setSearchTerm,
    employees,
    loading,
    error,
    currentPage,
    totalPages,
    totalEmployees,
    setCurrentPage,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees
  };
};
