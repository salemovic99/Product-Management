import React from 'react';
import { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { employeeSchema } from '@/schemas/employee';

export const EmployeeForm = ({ 
   open,
  onOpenChange, 
  formData, 
  isSubmitting, 
  editingId, 
  onSubmit, 
  onCancel, 
  onUpdateField,
  loadingPositions,
    positions
}) => {

  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const schema = employeeSchema.pick({ [field]: true });
    const result = schema.safeParse({ [field]: value });
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? null : result.error.issues[0].message,
    }));
  };

  const handleChange = (field, value) => {
    const finalValue = field === 'employee_id' ? Number(value) : value;
    onUpdateField(field, value);
    validateField(field, finalValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validated = employeeSchema.safeParse({
      ...formData,
      employee_id: Number(formData.employee_id),
    });

  
    if (!validated.success) {
      const fieldErrors = {};
      validated.error.errors.forEach(({ path, message }) => {
        fieldErrors[path[0]] = message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      onSubmit(e);
    }
  };

  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);
  
  useEffect(() => {
    setErrors({});
  }, [editingId]);

    return (
        <>
        { (
          <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingId ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                  </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-4" >
                                                                       
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 mb-1`}>
                                Name *
                            </label>
                            <input
                            type="text"                  
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                ${
                                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter Employee name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            employee id  *
                            </label>
                            <input
                            type="number"                    
                            value={formData.employee_id ?? ''}
                            onChange={(e) => handleChange('employee_id', parseInt(e.target.value))}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                ${
                                        errors.employee_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter employee id"
                            />
                            {errors.employee_id && <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            phone number  *
                            </label>
                            <input
                            type="text"                             
                            value={formData.phone_number}
                            onChange={(e) => handleChange('phone_number', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                                ${
                                        errors.phone_number ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Enter phone number"
                            />
                            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                        </div>

                          {/* location Dropdown */}
                          <div className="space-y-2">
                              
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                              Position name  *
                              </label>
                              {loadingPositions ? (
                              <div className="flex items-center space-x-2 p-3 border rounded-md">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="text-sm text-gray-500">Loading Positions...</span>
                              </div>
                              ) : (
                              <Select 
                                  value={formData.position_id} 
                                  onValueChange={(value) => handleChange('position_id', value)}
                              >
                                  <SelectTrigger>
                                  <SelectValue placeholder="Select a position" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {positions.map((position) => (
                                      <SelectItem 
                                      key={position.id} 
                                      value={position.id.toString()}
                                      >
                                      {position.name}
                                      </SelectItem>
                                  ))}
                                  </SelectContent>
                              </Select>
                              )}
                              {errors.position_id && <p className="text-red-500 text-sm mt-1">{errors.position_id}</p>}
                          </div>

                              {/* Buttons */}
                            <DialogFooter className="flex gap-3 pt-4">
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
                                  <DialogClose asChild>
                                    <button
                                      type="button"
                                      onClick={onCancel}
                                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-lg transition-colors"
                                      >
                                      Cancel
                                  </button>
                                  </DialogClose>
                            </DialogFooter>                    
                  </form>
         </DialogContent>
        </Dialog>
        )}
        
    
    </>
    )
  
};
