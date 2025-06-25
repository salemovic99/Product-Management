"use client";
import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import { Plus, Edit, Trash2, X, Check, Search, Building2,LocationEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from '../../../components/ui/card';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,DialogClose } from '../../../components/ui/dialog';
import { toast } from "sonner"

// const API_BASE_URL = 'http://127.0.0.1:8000';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const Positions = () => {

const now = new Date();
const formattedDate = now.toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
}); 
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPosition, setTotalPosition] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPosition = positions.filter(position =>
     position.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchPositions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/?skip=${(currentPage - 1) * pageSize}&limit=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch positions');
      const data = await response.json();
      setPositions(data);

      const positionCount = await fetch(`${API_BASE_URL}/positions/count`);
      const positionCountResult = await positionCount.json();
      
      const count = positionCountResult.count;
      setTotalPosition(count);
      setTotalPages(Math.ceil(count / pageSize));
      

    } catch (err) {
      setError('Error fetching Position: ' + err.message);
    } finally {
      setTimeout(() => {
        setLoading(false); 
      }, 200);
    }
  };

  
  const createPosition = async (LocationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(LocationData),
      });
       if (!response.ok){
        toast.error('Something went wrong : ' + (await response.json()).detail)
            
        }
      const newPosition = await response.json();
      setPositions([...positions, newPosition]);
      toast.success('position created successfully',{
              description : 'create at ' + formattedDate
            });
      setIsSubmitting(false);
      return true;
    } catch (err) {
      setError('Error creating position: ' + err.message);
      return false;
    }
  };

  
  const updatePosition = async (id, locationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });
      if (!response.ok){
        toast.error('Something went wrong : ' + (await response.json()).detail)
            
        }
      const updatedPosition = await response.json();
      console.log(updatePosition)
      setPositions(positions.map(position => 
        position.id === id ? updatedPosition : position
      ));
      
       toast.success('position updated successfully',{
              description : 'updated at ' + formattedDate
            });
      setIsSubmitting(false);
      return true;
    } catch (err) {
      setError('Error updating position: ' + err.message);
      return false;
    }
  };

 
  const deletePosition = async (id) => {    
    try {
      const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
        method: 'DELETE',
      });
        if (!response.ok){
            toast.error('Something went wrong : ' + (await response.json()).detail)
                return;
            }
      setPositions(positions.filter(position => position.id !== id));
      toast.success('position deleted successfully',{
              description : 'deleted at ' + formattedDate
            });
            return true;
    } catch (err) {
      setError('Error deleting position: ' + err.message);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    
    const success = editingId 
      ? await updatePosition(editingId, formData)
      : await createPosition(formData);
    
    if (success) {
      setFormData({ name: ''});
      setShowForm(false);
      setEditingId(null);
    }
  };

  // Handle edit
  const handleEdit = (position) => {
    setFormData({
      name: position.name
    });
    setEditingId(position.id);
    setShowForm(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ name: '' });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  useEffect(() => {
    fetchPositions();
  }, [pageSize,currentPage]);

  if (loading) {
  return (
    <TableLoadingSkeleton></TableLoadingSkeleton>
  );
}

  return (
    <div className="min-h-screen  bg-gray-50 ">
        {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10 ">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        
                          <LocationEdit className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                          <div>
                              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Position</h1>
                              <p className="text-xs sm:text-sm text-gray-600">Manage your Position</p>
                          </div>
                      </div>
                      <Button className="w-full sm:w-auto" onClick={() => {
                          setShowForm(true)}}>
                            
                              <Plus className="h-4 w-4" />
                              <span>Add Position</span>
                          
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
                  {editingId ? 'Edit Position' : 'Add New Position'}
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
                    position Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter position name"
                  />
                </div>

         
                <div className="flex gap-3 pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex-1 bg-slate-900 hover:bg-slate-950 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                      {isSubmitting ? (
                        <span className="animate-pulse">Saving...</span>
                      ) : (
                        <>
                          <Check size={18} className="mr-2" />
                          {editingId ? 'Update' : 'Create'}
                        </>
                      )}
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

        
        <Card className="m-5 ">
          <CardHeader className={`grid grid-cols-2`}>
             {/* Search */}
            <div className="relative ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search position..."
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
              {filteredPosition.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No Position found</div>
                  <p className="text-gray-500">Create your first Position to get started</p>
                </div>
                ) : (
                <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          position name
                        </th>
                                                                     
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPosition.map((position) => (
                        <tr key={position.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{position.name}</div>
                            <div className="text-sm text-gray-500">ID: {position.id}</div>
                          </td>                    
                        
                          <td className="px-6 py-4 ">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleEdit(position)}
                                className=" cursor-pointer"
                                title="Edit position"
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
                                            Are you sure you want to delete this position?
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deletePosition(position.id)}>Continue</AlertDialogAction>
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

export default Positions;