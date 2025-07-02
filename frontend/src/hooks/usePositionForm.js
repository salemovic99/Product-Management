
import { useState } from 'react';

export const usePositionForm = (onSubmit) => {

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });



  const startEdit = (position) => {
    setFormData({
      name: position.name
    });
    setEditingId(position.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setShowForm(false);
    setEditingId(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
  setIsSubmitting(true);

  try {
    let result;

    if (editingId) {
      result = await onSubmit.update(editingId, formData);
    } else {
      result = await onSubmit.create(formData);
    }

    if (result?.success) {
      resetForm(); 
    } else {
      setIsSubmitting(false);
    }
  } catch (error) {
    console.error('Submission failed:', error);
    setIsSubmitting(false);
  }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    isSubmitting,
    showForm,
    editingId,
    setShowForm,
    handleSubmit,
    startEdit,
    resetForm,
    updateFormData
  };
};