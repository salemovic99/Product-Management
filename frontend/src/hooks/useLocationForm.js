import { useState } from 'react';

export const useLocationForm = (onSubmit) => {
  const [formData, setFormData] = useState({
    name: '',
    google_map_link: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const validateGoogleMapLink = (link) => {
    const googleMapRegex = /^https:\/\/www\.google\.com\/maps\/.+$/;
    return googleMapRegex.test(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateGoogleMapLink(formData.google_map_link)) {
      toast.error("Please enter a valid Google Maps link.");
      return;
    }

    setIsSubmitting(true);
    
    const result = editingId 
      ? await onSubmit.update(editingId, formData)
      : await onSubmit.create(formData);
    
    if (result.success) {
      resetForm();
    }
    
    setIsSubmitting(false);
  };

  const startEdit = (location) => {
    setFormData({
      name: location.name,
      google_map_link: location.google_map_link
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', google_map_link: '' });
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
    startEdit,
    resetForm,
    updateFormData
  };
};
