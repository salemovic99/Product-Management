"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle , CardFooter} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MapPin, Building2, Trash2,  Box, Menu, QrCode, Filter } from 'lucide-react';
import Link from 'next/link';
import TableLoadingSkeleton from '@/components/TableLoadingSkeleton';
import { 
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious 
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProducts } from '@/hooks/useProducts';
import { ProductsTable } from '@/components/ProductsTable';
import  locationsService  from '@/services/locationService';


export default function ProductsPage() {

    const [darkMode, setDarkMode] = useState(false);
    const [location, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [pageSize, setPageSize] = useState(5);
    const [selectedLocation, setSelectedLocation] = useState('all');
    
    const { products,
            loading,
            setLoading,
            error,
            currentPage,
            totalPages,
            totalProducts,
            setCurrentPage,
            createProduct,
            updateProduct,
            deleteProduct}= useProducts(pageSize);
   
    
    const filteredProducts = products.filter(product => {
    
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.id.toString().includes(searchTerm);
        
        const matchesLocation = selectedLocation === 'all' || 
                            product.location.name.toLowerCase() === selectedLocation.toLowerCase();
        
        return matchesSearch && matchesLocation;
    }).sort((a, b) =>  a.id - b.id ); ;

    const filterByLocation = (value) => {
        setSelectedLocation(value);
    }

    const fetchLocations = async () => {
    try {

      const data = await locationsService.getAllLocations()
      setLocations(data);

    } catch (err) {
      setError('Error fetching Locations: ' + err.message);
    } finally {
      setTimeout(() => {
        setLoading(false); 
      }, 300);
    }
  };

    useEffect(() => {
        fetchLocations();
    }, [currentPage]);

    
    if (loading) {
      return (
        <TableLoadingSkeleton></TableLoadingSkeleton>
      );
    }

    return (
        <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50`}>
            
            {/* Header */}
            <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <Box className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                            <div>
                                <h1 className="text-xl sm:text-2xl  font-bold text-gray-900">Products</h1>
                                <p className="text-xs sm:text-sm text-gray-600">Manage your Products</p>
                            </div>
                        </div>
                        <Button className="w-full sm:w-auto">
                            <Link href="/dashboard/products/add" className="flex items-center justify-center space-x-2 w-full"> 
                                <Plus className="h-4 w-4" />
                                <span>Add Product</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>  

            {/* Error Message */}
            {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
            </div>
            )}

            
            <div className="p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    

                    {/* Products List */}
                    <Card className={` flex flex-col justify-between`}>
                        <CardHeader className=" grid grid-clos-1 md:grid-cols-3 gap-4">

                            {/* Search */}
                            <div className="relative ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search products by id, name, serial number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            
                            <Select value={searchTerm} onValueChange={(value) => filterByLocation(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter By Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                            <Filter className='h-4 w-4 mr-2 inline-block' />
                                                Filter By location
                                            </SelectLabel>                                            
                                            <SelectItem value="all" >
                                                <Building2 className='h-4 w-4 mr-2 inline-block' />
                                                All Locations
                                            </SelectItem>
                                            {location.map((loc) => (
                                                <SelectItem key={loc.id} value={String(loc.name).trim()} >
                                                    <MapPin className='h-4 w-4 mr-2 inline-block' />
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                            </Select>

                            
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
                        
                        <CardContent className="p-0 sm:p-6">
                            <ProductsTable products={filteredProducts} onDelete={deleteProduct}>

                            </ProductsTable>
                        </CardContent>

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
        </div>
    );
}