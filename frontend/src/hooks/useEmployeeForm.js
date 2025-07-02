import { useState } from 'react';

export const useEmployeeForm = (onSubmit) => {

  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    phone_number: '',
    position_id: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = editingId 
      ? await onSubmit.update(editingId, formData)
      : await onSubmit.create(formData);
    
    if (result.success) {
      handleCancel();
    }
    
    setIsSubmitting(false);
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      employee_id: employee.employee_id,
      phone_number : employee.phone_number,
      position_id: employee.position_id ? employee.position_id.toString() : '',
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', employee_id: '',phone_number: '', position_id: '' });
    setShowForm(false);
    setEditingId(null);
    setIsSubmitting(false);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    isSubmitting,
    showForm,
    editingId,
    setShowForm,
    handleSubmit,
    handleEdit,
    handleCancel,
    updateFormData
  };
};
