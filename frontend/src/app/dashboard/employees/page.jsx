"use client";
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, X, Check, Search, Building2,LocationEdit, BriefcaseBusiness, Loader2, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TableLoadingSkeleton from '@/components/TableLoadingSkeleton';
import { 
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious 
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEmployees } from '@/hooks/useEmployees';
import { useEmployeeSearch } from '@/hooks/useEmployeeSearch';
import { EmployeesTable } from '@/components/EmployeesTable';
import { useEmployeeForm } from '@/hooks/useEmployeeForm';
import { EmployeeForm } from '@/components/EmployeeForm';
import positionsService from '@/services/positionsService';
import { toast } from 'sonner';
import SearchLoading from '@/components/SearchLoading';

const Employees = () => {

  const [loadingPositions, setLoadingPositions] = useState(true);
  const [positions, setPositions] = useState([]);
  const [pageSize, setPageSize] = useState(5); 
  const [isSearching, setIsSearching] = useState(false);

  const { 
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
          refetch}= useEmployees(pageSize);

  
  const formHandlers = {
    create: createEmployee,
    update: updateEmployee
  };
  const {formData,
        isSubmitting,
        showForm,
        editingId,
        setShowForm,
        handleSubmit,
        handleEdit,
        handleCancel,
        updateFormData} = useEmployeeForm(formHandlers);

   const fetchPositions = async () => {
      try {
        const result = await positionsService.fetchAllPositions();

        if (!result) {
          toast.error("Failed to fetch positions");
          return;
        } 

        setPositions(result); 
      } catch (err) {
        toast.error("Error fetching positions...:", {
          description:err.message
        });
      } finally {
        setLoadingPositions(false);
      }
    };

 
  useEffect(() => {
  fetchPositions(); 
    }, []);

    const handleSearch = async (value) => {
    
          setIsSearching(true);
          if(value === '' || value === null || value === undefined){
              refetch()
              setTimeout(() => {
                setIsSearching(false)
              }, 1000);
          }
    
          setSearchTerm(value.toLowerCase().trim());
          refetch()
          setTimeout(() => {
            setIsSearching(false)
          }, 1000);
    }
    
    const handleRestFilter = async ()=>{
        if(searchTerm === '' || searchTerm === null || searchTerm === undefined){
          setSearchTerm('');
          refetch();
      }
      setSearchTerm('');
      setPageSize(5); 
      refetch();
  }
    
  if (isSearching) {
    return (
        <SearchLoading />
    );
}

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
      
        <EmployeeForm 
         open={showForm}
         onOpenChange={setShowForm}
         formData={formData}
         isSubmitting={isSubmitting}
         editingId={editingId}
         onSubmit={handleSubmit}
         onCancel={handleCancel}
         onUpdateField={updateFormData}
         loadingPositions={loadingPositions}
         positions={positions}
         >

        </EmployeeForm>


        <Card className="m-5 ">
          <CardHeader className={`grid grid-cols-2`}>
            {/* Search */}
            <div className="relative ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(e.target.value);
                }}
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

            {/* reset buttone */}
              <div>
              <Button variant="outline"
                        className={'cursor-pointer'}
                        onClick={handleRestFilter}
                        disabled={searchTerm === '' && pageSize === 5}
                        >
                  <Filter className='h-4 w-4 mr-2 inline-block' />
                    Reset
              </Button>
              </div>
          </CardHeader>
          
            <div className="bg-white ">
              
              <CardContent>
                <EmployeesTable 
                employees={employees} 
                onEdit={handleEdit}
                onDelete={deleteEmployee} >
                </EmployeesTable>
              </CardContent>
              
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