import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const locationSchema = z.object({
  name: z.string().min(3, { message: 'Location name is required' }),
  google_map_link: z.string().url({ message: 'Please enter a valid Google Maps URL' }),
});

export const LocationForm = ({
  open,
  onOpenChange,
  formData,
  isSubmitting,
  editingId,
  onSubmit,
  onCancel,
  onUpdateField,
}) => {
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const schema = locationSchema.pick({ [field]: true });
    const result = schema.safeParse({ [field]: value });
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? null : result.error.issues[0].message,
    }));
  };

  const handleChange = (field, value) => {
    onUpdateField(field, value);
    validateField(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = locationSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(({ path, message }) => {
        fieldErrors[path[0]] = message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      onSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Location' : 'Add New Location'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter location name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Google Map Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Map Link *
            </label>
            <input
              type="text"
              value={formData.google_map_link}
              onChange={(e) => handleChange('google_map_link', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.google_map_link
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter Google Maps link"
            />
            {errors.google_map_link && <p className="text-red-500 text-sm mt-1">{errors.google_map_link}</p>}
          </div>

          {/* Buttons */}
          <DialogFooter className="pt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
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
  );
};
