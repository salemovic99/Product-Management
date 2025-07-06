import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import productsService from '@/services/productService';


export const useProducts = (pageSize = 5) => {

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchTerm, setSearchTerm] = useState(''); 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      
      const [ProductsData, count] = await Promise.all([
        productsService.getProducts(skip, pageSize, {
        status: selectedStatus,
        location: selectedLocation,
        search:searchTerm
      }),
        productsService.getProductsCount({
                          status: selectedStatus,
                          location: selectedLocation,
                          search:searchTerm
                      })
      ]);

      setProducts(ProductsData);
      setTotalProducts(count);
      setTotalPages(Math.ceil(count / pageSize));
      setError('');
    } catch (err) {
      setError('Error fetching Products: ' + err.message);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  const createProduct = async (ProductData) => {
    try {
      const result = await productsService.createProduct(ProductData);
      if(!result)
      {
        toast.error('Failed to create product!');
        return;
      }

      setProducts(prev => [...prev, result]);
      toast.success('Product created successfully', {
        description: `Created at ${new Date().toLocaleString()}`
      });
      
      return { success: true };

    } catch (err) {
      toast.error('Failed to create products: ' + err.message);
      return { success: false, error: err.message };
    }
  };

   const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productsService.updateProduct(id, productData);

      if(!updatedProduct)
      {
        toast.error('Failed to update product');
        return;
      }

      setEmployees(prev => 
        prev.map(product => product.id === id ? updatedProduct : product)
      );
      
      toast.success('Product updated successfully', {
        description: `Updated at ${new Date().toLocaleString()}`
      });
      
      return { success: true };
    } catch (err) {
      toast.error('Failed to update Product: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  
  const deleteProduct = async (id) => {
    try {
      const result = await productsService.deleteProduct(id);
      if(!result)
      {
        toast.error('Failed to delete Product');
        return;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      
      toast.success('Product deleted successfully', {
        description: `Deleted at ${new Date().toLocaleString()}`
      });
      
      return { success: true };
    } catch (err) {
      toast.error('Failed to delete product: ' + err.message);
      return { success: false, error: err.message };
    }
  };

  const resetFilters = async () => {
    setSelectedLocation('all');
    setSelectedStatus('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, currentPage, pageSize, selectedLocation,selectedStatus]);

  return {
    searchTerm,
    setSearchTerm,
    selectedLocation,
    selectedStatus,
    setSelectedLocation,
    setSelectedStatus,
    products,
    loading,
    setLoading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    setCurrentPage,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
    resetFilters
  };
};
