import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { positionSchema } from '@/schemas/position';
// const positionSchema = z.object({
//   name: z.coerce.string().min(3, { message: 'Position name is required' }),
// });

export const PositionForm = ({
  open,
  onOpenChange, 
  isEditing,
  isSubmitting,
  editingId,
  formData,
  onSubmit,
  onCancel,
  onFormDataChange,
}) => {
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const fieldSchema = positionSchema.pick({ [field]: true });
    const result = fieldSchema.safeParse({ [field]: value });
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? null : result.error.issues[0].message,
    }));
  };

  const handleChange = (field, value) => {
    onFormDataChange(field, value);
    validateField(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = positionSchema.safeParse(formData);

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

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Position' : 'Add New Position'}</DialogTitle>
            </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter position name"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <DialogFooter className="pt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex-1 bg-slate-900 hover:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">Saving...</span>
                        ) : (
                          <>
                            <Check size={18} />
                            {editingId ? 'Update' : 'Create'}
                          </>
                        )}
                      </button>
                    <DialogClose asChild>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black py-2 px-4 rounded-lg transition-colors"
                          >
                            Cancel
                        </button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              </form>
        </DialogContent>
      </Dialog>
  );
};
