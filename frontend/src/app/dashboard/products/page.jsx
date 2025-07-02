"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle , CardFooter} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Plus, Search, MapPin, Building2, Edit2, Edit, Trash2, Eye, Box, Menu,BadgeCheckIcon,BadgeX,ReceiptText, QrCode, Filter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog"

import { Skeleton } from "../../../components/ui/skeleton"
import QRCodeScanner from '../../../components/QRCodeScanner';
import TableLoadingSkeleton from '../../../components/TableLoadingSkeleton';
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
import { toast } from "sonner"
import { set } from 'date-fns';


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ProductsPage() {

    const now = new Date();
    const formattedDate = now.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
    }); 

    const [darkMode, setDarkMode] = useState(false);
    const [products, setProducts] = useState([]);
    const [location, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedLocation, setSelectedLocation] = useState('all');
    
    // const totalPages = Math.ceil(total / pageSize);

    // const filteredProducts = products.filter(product =>
    //     product.name.toLowerCase().includes(searchTerm.toLowerCase())||
    //     product.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     product.id.toString().includes(searchTerm) 
    // );

    
    const filteredProducts = products.filter(product => {
    
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.id.toString().includes(searchTerm);
        
    
        const matchesLocation = selectedLocation === 'all' || 
                            product.location.name.toLowerCase() === selectedLocation.toLowerCase();
        
        return matchesSearch && matchesLocation;
    });


    const filterByLocation = (value) => {
        setSelectedLocation(value);
    }



    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/?skip=${(currentPage - 1) * pageSize}&limit=${pageSize}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);

            const productCount = await fetch(`${API_BASE_URL}/products/count`);
            const productCountResult = await productCount.json();

            const count = productCountResult.count;
            setTotalProducts(count);
            setTotalPages(Math.ceil(count / pageSize));
            console.log("Pages:", Math.ceil(count / pageSize));


        } catch (err) {
            setError('Error fetching products: ' + err.message);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 3);
        }
    };

    // Delete Product
    const deleteProduct = async (id) => {
       
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok){
            toast.error('Something went wrong : ' + (await response.json()).detail)
              return;
            }
            // Remove the deleted product from the state
            setProducts(products.filter(product => product.id !== id));
            toast.success('Product deleted successfully',{
                          description : 'deleted at ' + formattedDate
                        });
                        return true;
        } catch (err) {
            setError('Error deleting product: ' + err.message);
        }
    };

    const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      
      setLocations(data);

    } catch (err) {
      setError('Error fetching Locations: ' + err.message);
    } finally {
      setTimeout(() => {
        setLoading(false); 
      }, 3);
    }
  };

    useEffect(() => {
        fetchProducts();
        fetchLocations();
    }, [pageSize,currentPage]);

    const getStatusColor = (status) => {
     switch (status.toLowerCase()) {
    case "in_use":
      return "bg-green-200 text-green-800";
    case "damaged":
      return "bg-red-200 text-red-800";
    case "lost":
      return "bg-yellow-200 text-yellow-800";
    case "under_repair":
      return "bg-blue-200 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
  };

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

            {/* Stats */}
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

                            {/* select page size */}
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
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No Products found</div>
                                <p className="text-gray-500">Create your first Products to get started</p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                        QR Code
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                        Product Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                        Serial Number
                                                    </th>
                                                    
                                                    {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                        With Employee
                                                    </th> */}
                                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                        Location Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                                                        In Warehouse
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredProducts.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={`http://localhost:8000/${product.dynamic_qr_code}`} 
                                                                loading="lazy" 
                                                                decoding="async"
                                                                />
                                                                <AvatarFallback>QR</AvatarFallback>
                                                            </Avatar>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-gray-900">{product.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-700 max-w-xs truncate">{product.serial_number}</div>
                                                        </td>
                                                       
                                                        {/* <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-700 max-w-xs truncate">{product.employee == null ?  
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="bg-blue-500 text-white dark:bg-blue-600"
                                                                            >
                                                                            <BadgeCheckIcon />
                                                                            In warehouse
                                                                        </Badge>
                                                                 : product.employee.name}</div>
                                                        </td> */}
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-700 max-w-xs truncate">{product.location.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-700 max-w-xs truncate">
                                                                <Badge className={`${getStatusColor(product.status?.name)}`} >
                                                                    {product.status?.name}
                                                                </Badge>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-700 max-w-xs truncate">
                                                                {product.in_warehouse ?
                                                                
                                                                 <Badge
                                                                        variant="secondary"
                                                                        className="bg-gray-950 text-white dark:bg-blue-600"
                                                                        >
                                                                        <BadgeCheckIcon className='text-green-500' />
                                                                        Yes
                                                                </Badge>
                                                                
                                                                : <Badge
                                                                        variant="secondary"
                                                                        className="bg-fuchsia-950 text-white dark:bg-blue-600"
                                                                        >
                                                                        <BadgeX className='text-red-700' />                                                                       
                                                                        No
                                                                </Badge>}
                                                            </div>
                                                        </td>
                                                        
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-end space-x-3">
                                                               

                                                                <Link 
                                                                    href={`/dashboard/products/details/${product.id}`}
                                                                    
                                                                    title="details"
                                                                >                        
                                                                    <ReceiptText className="h-4 w-4" /> 
                                                                                                
                                                                </Link>
                                                               
                                                                <Link 
                                                                    href={`/dashboard/products/edit/${product.id}`}
                                                                    
                                                                    title="Edit Product"
                                                                >                        
                                                                    <Edit className="h-4 w-4" />                                
                                                                </Link>

                                                               <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Trash2 className='h-4 w-4 cursor-pointer' />
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete this Product?
                                                                    </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deleteProduct(product.id)}>Continue</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="md:hidden space-y-4 p-4">
                                        {filteredProducts.map((product) => (
                                            <Card key={product.id} className="shadow-sm">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start space-x-4">
                                                        <Avatar className="h-12 w-12 flex-shrink-0">
                                                            <AvatarImage src={`http://localhost:8000/${product.dynamic_qr_code}`} />
                                                            <AvatarFallback>QR</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                                                    <p className="text-sm text-gray-500 mb-2">ID: {product.id}</p>
                                                                    <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-end space-x-3 mt-3 pt-3 border-t border-gray-100">
                                                                <a 
                                                                    href={`http://localhost:8000/${product.qr_code_image}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className=" p-1"
                                                                    title="View QR Code"
                                                                >
                                                                    <Eye className="h-5 w-5" />
                                                                </a>
                                                                <Link 
                                                                    href={`/dashboard/edit/${product.id}`}
                                                                    className=" p-1"
                                                                    title="Edit Product"
                                                                >                        
                                                                    <Edit className="h-4 w-4" />                                
                                                                </Link>

                                                                <Link 
                                                                    href={`/dashboard/products/details/${product.id}`}
                                                                    className=""
                                                                    title="details"
                                                                >                        
                                                                    <ReceiptText className="h-4 w-4" /> 
                                                                                                
                                                                </Link>

                                                                <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Trash2 className='h-4 w-4 cursor-pointer' />
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete this Product?
                                                                    </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deleteProduct(product.id)}>Continue</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>

                                                
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
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