import React from 'react';
import { Edit, Trash2, BadgeCheckIcon,ReceiptText, Eye, BadgeX ,MoreHorizontal  } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle , CardFooter} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
export const ProductsTable = ({ products, onDelete }) => {

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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className='flex justify-center items-center'>
            <Image src="/No-data-pana.svg" alt='no data'  width={200} height={200}></Image>
        </div>
        <div className="text-gray-400 text-lg mb-2">No Products found</div>
        
      </div>
    );
  }

  return (
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
                    
                    
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        Location Name
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
                {products.map((product) => (
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
                        
    
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-700 max-w-xs truncate">
                                <Badge className={`${getStatusColor(product.status?.name)}`} >
                                    {product.status?.name}
                                </Badge>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-700 max-w-xs truncate">{product.location.name}</div>
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
                                <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <button
                                        aria-label="Open actions menu"
                                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <MoreHorizontal className="h-5 w-5 text-gray-500  " />
                                    </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/products/details/${product.id}`}>
                                        <ReceiptText className="mr-2 h-4 w-4" />
                                        Details
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/products/edit/${product.id}`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Product
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                        <button
                                            className=" px-3 py-1 text-red-600 hover:text-red-800 flex items-center  cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                            >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                           <span>Delete</span>
                                        </button>   
                                        </AlertDialogTrigger>

                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                            Are you sure you want to delete this product? This action
                                            cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDelete(product.id)}>
                                            Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </div>
                            </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-4 p-4">
        {products.map((product) => (
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
                                    <AlertDialogAction onClick={() => onDelete(product.id)}>Continue</AlertDialogAction>
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
  );
};