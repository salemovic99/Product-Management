"use client";
import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, X, Check, Search, Building2,LocationEdit, BriefcaseBusiness } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog"
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import TableLoadingSkeleton from '../../../components/TableLoadingSkeleton';
import { 
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious 
} from '../../../components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"

import { toast } from "sonner"


// const API_BASE_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const Employees = () => {

const now = new Date();
const formattedDate = now.toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
}); // e.g., "Jun 15, 2025, 4:45 PM"


  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    phone_number: '',
    
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalEmployees, setTotalEmployees] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredEmployees = employees.filter(employee =>
     employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch departments
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/?skip=${(currentPage - 1) * pageSize}&limit=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch Employees');
      const data = await response.json();
      
      setEmployees(data);

      const employeeCount = await fetch(`${API_BASE_URL}/employees/count`);
      const employeeCountResult = await employeeCount.json();

      const count = employeeCountResult.count;
      setTotalEmployees(count);
      setTotalPages(Math.ceil(count / pageSize));
      console.log("Pages:", Math.ceil(count / pageSize));


    } catch (err) {
      setError('Error fetching Employees: ' + err.message);
    } finally {
       setTimeout(() => {
        setLoading(false); 
      }, 3);
    }
  };

  // Create 
  const createEmployee = async (EmployeeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(EmployeeData),
      });
      if (!response.ok){
                  toast.error('Something went wrong : ' + (await response.json()).detail)                    
                  }
      const newEmployee = await response.json();
      setEmployees([...employees, newEmployee]);
      toast.success('Employee created successfully',{
        description : 'create at ' + formattedDate
      });
      
      return true;
    } catch (err) {
      setError('Error creating Employee: ' + err.message);
      return false;
    }
  };

  // Update 
  const updateEmployee = async (id, employeeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok){
       toast.error('Something went wrong! : ' + (await response.json()).detail)
      }
      const updatedEmployee = await response.json();
      toast.success('Employee updated successfully',{
        description : 'updated at ' + formattedDate
      });
    
      setEmployees(employees.map(employee => 
        employee.id === id ? updatedEmployee : employee
      ));
      return true;
    } catch (err) {
      setError('Error updating employee: ' + err.message);
      toast.error('Error updating employee: ' + err.message)
      return false;
    }
  };

  // Delete 
  const deleteEmployee = async (id) => {
     
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok){
       toast.error('Something went wrong! : ' + (await response.json()).detail)
        return;
      }
      setEmployees(employees.filter(employee => employee.id !== id));
      toast.success('Employee deleted successfully',{
        description : 'deleted at ' + formattedDate
      });
    } catch (err) {
      setError('Error deleting Employee: ' + err.message);
      toast.error('Error deleting employee: ' + err.message)
    } finally{
      // revalidatePath('/dashboard/employees');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = editingId 
      ? await updateEmployee(editingId, formData)
      : await createEmployee(formData);
    
    if (success) {
      setFormData({ name: '', employee_id: '',phone_number: '' });
      setShowForm(false);
      setEditingId(null);
    }
  };

  // Handle edit
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      employee_id: employee.employee_id,
      phone_number : employee.phone_number
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ name: '', employee_id: '',phone_number: '' });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  useEffect(() => {
    fetchEmployees();
  }, [pageSize, currentPage]);

 if (loading) {
  return (

    <TableLoadingSkeleton></TableLoadingSkeleton>
  );
}

  return (
    <div className="min-h-screen  bg-gray-50 ">
        {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        
                          <BriefcaseBusiness className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                          <div>
                              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Employees</h1>
                              <p className="text-xs sm:text-sm text-gray-600">Manage your Employees</p>
                          </div>
                      </div>
                      
                      <Button className="w-full sm:w-auto" onClick={() => {
                          setShowForm(true)}}>
                            
                              <Plus className="h-4 w-4" />
                              <span>Add Employees</span>
                          
                      </Button>
                      
                  </div>
              </div>
          </div> 

      <div className="">
       
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form Modal */}
        <form onSubmit={handleSubmit} className="relative">

        
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Employee name"
                  />
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    employee id  *
                  </label>
                  <input
                    type="number"
                    min={'1'}
                    required                    
                    value={formData.employee_id}
                    onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter employee id"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    phone number  *
                  </label>
                  <input
                    type="text"
                    minLength={'9'}
                    required                    
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                
                
            
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 hover:bg-slate-950 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check size={18} />
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </form>

      

        

        {/* Departments List */}
        <Card className="m-5">
          <CardHeader className={`grid grid-cols-2`}>
             {/* Search */}
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* select page size */}
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                  <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a page size" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectGroup>
                          <SelectLabel>Page Size</SelectLabel>                  
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                      </SelectGroup>
                  </SelectContent>
          </Select>

          

          </CardHeader>
          
            <div className="bg-white ">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No Employees found</div>
                  <p className="text-gray-500">Create your first Employee to get started</p>
                </div>
                ) : (
                <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Phone Number
                        </th>

                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Employee id
                        </th>
                        
                        
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">ID: {employee.id}</div>
                          </td>
                          <td>
                            {employee.phone_number}
                          </td>
                          <td>
                            {employee.employee_id}
                          </td>
                        
                          <td className="px-6 py-4 ">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEdit(employee)}
                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit employee"
                              >
                                <Edit size={16} />
                              </button>
                             
                              <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Trash2 className='h-4 w-4 cursor-pointer' />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this employee?
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteEmployee(employee.id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              )
              }


            </div>

            <CardFooter>
              <Pagination>
                  <PaginationContent>                        
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    className={`cursor-pointer`}
                                    as="button"
                                    isActive={currentPage === i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}                        
                </PaginationContent>
              </Pagination>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};

export default Employees;