"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';
import { Separator } from '../../../../../components/ui/separator';
import { 
  Laptop, 
  MapPin, 
  User, 
  Calendar, 
  Shield, 
  Building2, 
  Phone, 
  QrCode, 
  Edit,
  Archive,
  AlertTriangle,
  Box,
  ArrowLeft,
  IdCard
} from 'lucide-react';
import { redirect, useParams } from "next/navigation";
import { useEffect } from 'react';
import { Skeleton } from '../../../../../components/ui/skeleton';
import TransferLocation from '../../../../../components/TransferLocation';
import ReassignEmployee from '../../../../../components/ReassignEmployee';


export default function DetailsPage() {

    const params = useParams();
    const productId = params?.productid ? parseInt(params.productid ) : null;

    const[product, setproduct] = useState({
                name: "",
                serial_number: "",
                our_serial_number: "",
                location_id: "",
                employee_id:  "",
                in_warehouse: "",
                purchasing_date: "",
                warranty_expire: "",
                note: "",
                dynamic_qr_code:"",
                id:"",
                location: {
                name: "",
                google_map_link: "",
                id: ""
                },
                employee: {
                name: "",
                employee_id: ""
                }
             });
    const [error, setError] = useState("");
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [loading, setLoading] = useState(true);
    
    const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8000/products/${productId}`);
          if (response.ok) {
            const product = await response.json();
          
            setproduct({
                name: product.name,
                serial_number: product.serial_number,
                our_serial_number: product.our_serial_number,
                location_id: product.location_id,
                employee_id: product.employee_id ? product.employee_id.toString() : "",
                in_warehouse: product.in_warehouse,
                purchasing_date: product.purchasing_date,
                warranty_expire: product.warranty_expire,
                note: product.note,
                dynamic_qr_code: product.dynamic_qr_code,
                id: product.id,

                location: product.location ? {
                name: product.location.name,
                google_map_link: product.location.google_map_link,
                id: product.location.id
                } : null,
                employee: product.employee ?
                {
                  name: product.employee.name,
                  employee_id: product.employee.employee_id,
                  phone_number: product.employee.phone_number,
                  id: product.employee.id
                } : null
            });
          } else {
            setError("Failed to load product data");
          }
        } catch (err) {
          setError("Error loading product: " + err.message);
        } finally {
          setLoadingProduct(false);
          setTimeout(() => {
            setLoading(false)
          }, 2);
        }
      };
    
      // Fetch product data 
      useEffect(() => {
    
        if (productId) {
          fetchProduct();
        }
      }, [productId]);


  const isWarrantyExpiringSoon = () => {
    const today = new Date();
    const warrantyDate = new Date(product.warranty_expire);
    const diffTime = warrantyDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isWarrantyExpired = () => {
    const today = new Date();
    const warrantyDate = new Date(product.warranty_expire);
    return warrantyDate < today;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const printQRCode = () => {
  if (product.dynamic_qr_code) {
    const printWindow = window.open('', '_blank');
    const qrImageUrl = `http://localhost:8000/${product.dynamic_qr_code}`;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code Sticker</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              background: white;
            }
            .sticker {
              width: 2in;
              height: 2in;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0.25in;
            }
            .qr-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .sticker {
                margin: 0;
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <img src="${qrImageUrl}" alt="QR Code" class="qr-image" />
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  } else {
    alert('No QR code available to print');
  }
};
  

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>

        {/* Status Badges */}
        <div className="flex gap-3">
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Section Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-14 w-full rounded-md" />
                  <Skeleton className="h-14 w-full rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-14 w-full rounded-md" />
                  <Skeleton className="h-14 w-full rounded-md" />
                </div>
                <Skeleton className="h-24 w-full rounded-md" />
              </CardContent>
            </Card>

            {/* Assignment Section Skeleton */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-32 w-full rounded-md" />
                  <Skeleton className="h-32 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-32 mx-auto rounded-lg" />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" className={'cursor-pointer'} onClick={() =>{redirect('/dashboard/products')}}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
            <div className="p-3  rounded-xl border-2 border-slate-200">
              <Box className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 capitalize">
                {product.name}
              </h1>
              <p className="text-slate-600">Product ID: {product.id}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
                       
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <Badge variant={product.in_warehouse ? "secondary" : "default"} className="px-3 py-1">
            {product.in_warehouse ? "In Warehouse" : "Assigned"}
          </Badge>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Information */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Box className="h-7 w-7" />
                  <span>Device Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Serial Number</p>
                    <p className="text-slate-900 font-mono bg-slate-100 px-3 py-2 rounded-md">
                      {product.serial_number}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Internal Serial</p>
                    <p className="text-slate-900 font-mono bg-slate-100 px-3 py-2 rounded-md">
                      {product.our_serial_number}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Purchase Date</span>
                    </p>
                    <p className="text-slate-900">{formatDate(product.purchasing_date)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Warranty Expires</span>
                    </p>
                    <p className={`font-medium ${isWarrantyExpired() ? 'text-red-600' : isWarrantyExpiringSoon() ? 'text-amber-600' : 'text-green-600'}`}>
                      {formatDate(product.warranty_expire)}
                      {isWarrantyExpired() && <span className="ml-2 text-red-500">⚠️</span>}
                      {isWarrantyExpiringSoon() && <span className="ml-2 text-amber-500">⚠️</span>}
                    </p>
                  </div>
                </div>

                {product.note && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600">Notes</p>
                      <p className="min-h-20  whitespace-pre-wrap break-words text-slate-900 bg-slate-50 p-3 rounded-md border-l-4 border-blue-500">
                        {product.note}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Assignment Information */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 " />
                  <span>Assignment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Assigned Employee</h4>
                    <div className=" border-2 border-dotted border-purple-700 rounded-lg p-4">

                      {product.employee != null ?
                      
                        <div className="flex items-center space-x-3">                   
                        <div className="p-2  rounded-full text-white">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-900 ">
                            Name: <span className='font-semibold'>{product.employee?.name}</span>                            
                            </p>
                          
                          <p className="text-sm text-slate-600 flex items-center space-x-2">
                            <IdCard className="h-4 w-4"/> 
                            <span>ID: {product.employee?.id}</span>
                          </p>
                          <p className="text-sm text-slate-600 flex items-center space-x-2">
                            <IdCard className="h-4 w-4"/> 
                            <span>Employee ID: {product.employee?.employee_id}</span>
                          </p>
                          <p className="text-sm text-slate-600 flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{product.employee?.phone_number}</span>
                          </p>
                        </div>
                      </div>:
                      <div>
                        Not Assigned
                      </div>
                      
                        
                    }

                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Location</h4>
                    <div className=" border-2 border-dotted border-slate-950 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2  rounded-full text-white">
                          <MapPin className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{product.location?.name}</p>
                          <p className="text-sm text-slate-600">Location ID: {product.location?.id}</p>
                          <a 
                            href={`https://${product.location?.google_map_link}`} 
                            target="_blank" 
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  <span>QR Code</span>
                </CardTitle>
                {/* <CardDescription>Scan to view asset details</CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className=" p-6 rounded-lg ">
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed border-purple-300">
                    {product.dynamic_qr_code == null ?
                    
                    <QrCode className="h-16 w-16 text-purple-400" />
                    :
                    <img src={`http://localhost:8000/${product.dynamic_qr_code}`} ></img>                  
                  }
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* <Button className="w-full justify-start cursor-pointer" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  Transfer Location
                </Button> */}
                {/* <Button className="w-full justify-start cursor-pointer" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Reassign Employee
                </Button> */}
                <ReassignEmployee product={product} onProductUpdate={setproduct} ></ReassignEmployee>
                <TransferLocation  product={product} onProductUpdate={setproduct} ></TransferLocation>
                <Button className="w-full justify-start cursor-pointer" variant="outline" 
                 onClick={printQRCode} disabled={!product.dynamic_qr_code || loadingProduct}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Print QR Code
                </Button>

                
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
    </div>
  );
}