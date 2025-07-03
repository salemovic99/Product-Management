"use client"
import { useState } from 'react';
import { Plus, Search, LocationEdit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import TableLoadingSkeleton from '@/components/TableLoadingSkeleton';

import { useLocations } from '@/hooks/useLocations';
import { useLocationForm } from '@/hooks/useLocationForm';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { LocationForm } from '@/components/LocationForm';
import { LocationTable } from '@/components/LocationTable';

const Locations = () => {
  const [pageSize, setPageSize] = useState(5);
  
  const {
    locations,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    createLocation,
    updateLocation,
    deleteLocation
  } = useLocations(pageSize);

  const formHandlers = {
    create: createLocation,
    update: updateLocation
  };

  const {
    formData,
    isSubmitting,
    showForm,
    editingId,
    setShowForm,
    handleSubmit,
    startEdit,
    resetForm,
    updateFormData
  } = useLocationForm(formHandlers);

  const { searchTerm, setSearchTerm, filteredLocations } = useLocationSearch(locations);

  if (loading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <LocationEdit className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Locations</h1>
                <p className="text-xs sm:text-sm text-gray-600">Manage your Locations</p>
              </div>
            </div>
            <Button className="w-full sm:w-auto" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" />
              <span>Add Location</span>
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
        {(
          <LocationForm
            open={showForm}
            onOpenChange={setShowForm}
            formData={formData}
            isSubmitting={isSubmitting}
            editingId={editingId}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onUpdateField={updateFormData}
          />
        )}
        

        {/* Locations List */}
        <Card className="m-5 ">
          <CardHeader className="grid grid-cols-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Page Size Selector */}
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

          <CardContent>
            <LocationTable
              locations={filteredLocations}
              onEdit={startEdit}
              onDelete={deleteLocation}
            />
          </CardContent>

          <CardFooter>
            <Pagination>
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className="cursor-pointer"
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

export default Locations;