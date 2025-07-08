"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  IdCard,
  Paperclip,
  Upload,
  Download,
  X,
  FileText, 
  Award
} from 'lucide-react';
import { redirect, useParams } from "next/navigation";
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import TransferLocation from '@/components/TransferLocation';
import ReassignEmployee from '@/components/ReassignEmployee';
import DownloadPDFButton from '@/components/DownloadPDFButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ProductHistory from '@/components/ProductHistory';
import AttachmentTab from '@/components/AttachmentTab';
import ReassignStatus from '@/components/ReassignStatus';
import productsService from '@/services/productService';
import productsFilesService from '@/services/productFilesService';
import PrintHandoverPdf from '@/components/PrintHandoverPdf';
import ProductInfo from '@/components/ProductInfo';
import FileUpload from '@/components/FileUpload';
import PrintQRCode from '@/components/PrintQRCode';

export default function DetailsPage() {

    const params = useParams();
    const productId = params?.productid ? parseInt(params.productid ) : null;

    const[product, setProduct] = useState(null);

    const [error, setError] = useState("");
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchProduct = async () => {
        try {

          const result = await productsService.getProductById(productId);
          if (!result) {
            setError("Failed to load product data");
            return;
          } 
          setProduct(result);

        } catch (err) {
          setError("Error loading product: " + err.message);
        } finally {
          setLoadingProduct(false);
          setTimeout(() => {
            setLoading(false)
          }, 200);
        }
      };

  
    useEffect(() => {
          if (productId) {
            fetchProduct();
          }
        }, [productId]);


 const getStatusColor = (status) => {
     switch (status?.toLowerCase()) {
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
            
            <Button variant="outline" onClick={() =>{redirect(`/dashboard/products/edit/${product.id}`)}} className="flex items-center space-x-2 cursor-pointer">
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

          
          <Badge className={`${getStatusColor(product.status?.name)}`} >
              {product.status?.name}
          </Badge>
          
        </div>

        <Tabs defaultValue="info" className="w-full mt-6">
          <TabsList>
            <TabsTrigger value="info" className={`cursor-pointer`}>Info</TabsTrigger>
            <TabsTrigger value="history" className={`cursor-pointer`}>History</TabsTrigger>
            <TabsTrigger value="attachment" className={`cursor-pointer`}>Attachments</TabsTrigger>
          </TabsList>
          <TabsContent value="info">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main Information */}
              <div className="lg:col-span-2 space-y-6">
                
                <ProductInfo product={product}></ProductInfo>

                {/* Attachments Section */}
                <FileUpload productId={product.id}></FileUpload>        
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* QR Code */}
                <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center space-x-2">
                      <QrCode className="h-5 w-5 text-purple-600" />
                      <span>QR Code</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className=" p-2 rounded-lg ">
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
                    
                    <ReassignEmployee product={product} onProductUpdate={setProduct} ></ReassignEmployee>
                    <TransferLocation  product={product} onProductUpdate={setProduct} ></TransferLocation>
                    <ReassignStatus  product={product} onProductUpdate={setProduct} ></ReassignStatus>
                    <DownloadPDFButton data={product}  />
                    <PrintHandoverPdf data={product}  onProductUpdate={setProduct} />
                    <PrintQRCode product={product} ></PrintQRCode>

                  </CardContent>
                </Card>
        
              </div>
            </div>

          </TabsContent>
          
          <TabsContent value="history">            
            <ProductHistory productId={product.id}></ProductHistory>
          </TabsContent>

          <TabsContent value="attachment">
            <AttachmentTab productId={product.id}></AttachmentTab>
          </TabsContent>

        </Tabs>

        
      </div>
    </div>
  );
}