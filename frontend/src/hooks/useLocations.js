import { useState, useEffect } from 'react';
import { LocationService } from '../services/locationService';
import { toast } from 'sonner';

const locationService = new LocationService();

export const useLocations = (pageSize = 5) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLocations, setTotalLocations] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      
      const [locationsData, count] = await Promise.all([
        locationService.getLocations(skip, pageSize,{
          search:searchTerm
        }),
        locationService.getLocationCount({
          search:searchTerm
        })
      ]);

      setLocations(locationsData);
      setTotalLocations(count);
      setTotalPages(Math.ceil(count / pageSize));
      setError('');
    } catch (err) {
      setError('Error fetching locations: ' + err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const createLocation = async (locationData) => {
    try {
      const newLocation = await locationService.createLocation(locationData);
      setLocations(prev => [...prev, newLocation]);
      toast.success('Location created successfully');
      return { success: true };
    } catch (err) {
      toast.error('Error creating location: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const updateLocation = async (id, locationData) => {
    try {
      const updatedLocation = await locationService.updateLocation(id, locationData);
      setLocations(prev => prev.map(loc => loc.id === id ? updatedLocation : loc));
      toast.success('Location updated successfully');
      return { success: true };
    } catch (err) {
      toast.error('Error updating location: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteLocation = async (id) => {
    try {
      await locationService.deleteLocation(id);
      setLocations(prev => prev.filter(loc => loc.id !== id));
      toast.success('Location deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error('Error deleting location: ', {
        description: err.message
      });
      return { success: false, error: err.message };
    }
  };

  const resetFilters = async () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchLocations();
  }, [searchTerm ,currentPage, pageSize]);

  return {
    searchTerm,
    setSearchTerm,
    locations,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    totalLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations,
    resetFilters
  };
};
