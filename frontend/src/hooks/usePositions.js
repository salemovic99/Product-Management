// hooks/usePositions.js
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import positionsService from '../services/positionsService';

export const usePositions = (pageSize = 5) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosition, setTotalPosition] = useState(0);

  const now = new Date();
  const formattedDate = now.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [positionsData, count] = await Promise.all([
        positionsService.fetchPositions(currentPage, pageSize),
        positionsService.getPositionsCount()
      ]);

      setPositions(positionsData);
      setTotalPosition(count);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch positions');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const createPosition = async (positionData) => {
    try {
      const newPosition = await positionsService.createPosition(positionData);
      setPositions(prev => [...prev, newPosition]);
      
      toast.success('Position created successfully', {
        description: `Created at ${formattedDate}`
      });
      
      return { success: true, data: newPosition };
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      toast.error('Failed to create position', {
        description: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const updatePosition = async (id, positionData) => {
    try {
      const updatedPosition = await positionsService.updatePosition(id, positionData);
      
      setPositions(prev => 
        prev.map(position => 
          position.id === id ? updatedPosition : position
        )
      );
      
      toast.success('Position updated successfully', {
        description: `Updated at ${formattedDate}`
      });
      
      return { success: true, data: updatedPosition };
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      toast.error('Failed to update position', {
        description: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const deletePosition = async (id) => {
    try {
      await positionsService.deletePosition(id);
      setPositions(prev => prev.filter(position => position.id !== id));
      
      toast.success('Position deleted successfully', {
        description: `Deleted at ${formattedDate}`
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message;
      toast.error('Failed to delete position!', {
        description: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [pageSize, currentPage]);

  return {
    positions,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosition,
    setCurrentPage,
    createPosition,
    updatePosition,
    deletePosition,
    refetch: fetchPositions
  };
};