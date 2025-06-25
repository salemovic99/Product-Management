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
import { Skeleton } from '../../../../../components/ui/skeleton';
import TransferLocation from '../../../../../components/TransferLocation';
import ReassignEmployee from '../../../../../components/ReassignEmployee';
import DownloadPDFButton from '../../../../../components/DownloadPDFButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../../components/ui/tabs';
import { toast } from 'sonner';
import ProductHistory from '../../../../../components/ProductHistory';
import AttachmentTab from '../../../../../components/AttachmentTab';
import ReassignStatus from '../../../../../components/ReassignStatus';

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

     // Attachment state
    const [attachments, setAttachments] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
 
    
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
                } : null,

                status:product.status ? {
                    id: product.status.id,
                    name: product.status.name
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

      // Attachment handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
            return isValidType && isValidSize;
        });

    const newAttachments = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeAttachment = (id) => {
        setAttachments(prev => {
            const attachment = prev.find(att => att.id === id);
            if (attachment && attachment.preview) {
                URL.revokeObjectURL(attachment.preview);
            }
            return prev.filter(att => att.id !== id);
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return Image;
        if (type === 'application/pdf') return FileText;
    }
    
      // Fetch product data 
      useEffect(() => {
    
        if (productId) {
          fetchProduct();
        }
      }, [productId]);


 

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
    <title>QR Code Print - 4" x 6"</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: white;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        
        .page {
            width: 6in;
            height: 4in;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background: white;
        }
        
        .qr-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            padding-left: 1.25in; /* Center the 3.5" QR code on 6" paper: (6-3.5)/2 = 1.25" */
        }
        
        .qr-image {
            /* Maximum size while maintaining aspect ratio and leaving some margin */
            width: 2.5in;
            height: 2.5in;
            object-fit: contain;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: pixelated;
            /* Ensure crisp rendering for QR codes */
        }
        
        @media print {
            body {
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .page {
                margin: 0;
                padding: 5px;
                page-break-after: always;
                box-shadow: none;
                border: none;
            }
            
            .qr-image {
                /* Ensure maximum quality for printing */
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
                image-rendering: pixelated;
            }
            
            /* Hide everything except the page content when printing */
            @page {
                size: 6in 4in;
                margin: 0;
            }
        }
        
        /* Optional: Show page boundaries in browser for preview */
        @media screen {
            body {
                background: #f0f0f0;
                padding: 20px;
            }
            
            .page {
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="qr-container">
            <img src="http://localhost:8000/${product.dynamic_qr_code}" alt="QR Code" class="qr-image" />
        </div>
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


const handleUpload = async () => {

  const input = document.getElementById('file-upload');
  const files = input.files;

  
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file); 
  }

  try {

    const res = await fetch(`http://localhost:8000/products/${productId}/upload`, {
            method: "POST",
            body: formData,
          });

    if (!res.ok) {
        const error = await res.text();
        toast.error('Upload failed',{
              description : error
            });
        
        return;
      }
      toast.success("file uploaded successfully")

      input.value = ""; 
      setAttachments([]);
    
  } catch (error) {
  
    toast.error('Upload failed',{
          description : error
        });
  }

  
};

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
                    <p className="text-slate-900">{formatDate(product.warranty_expire)}</p>
                    
                  </div>
                </div>

                {product.note && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600">Notes</p>
                      <p className="min-h-20  whitespace-pre-wrap break-words text-slate-900 bg-slate-100 p-3 rounded-md ">
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

                <CardTitle className="flex items-center justify-between ">                 
                  <div className='flex items-center space-x-2'>
                     <User className="h-5 w-5 " />
                      <span>Assignment Details</span>  
                  </div>

                 <div >
                  <DownloadPDFButton data={product}  onProductUpdate={setproduct} />
                 </div>
                </CardTitle>


              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900">Assigned Employee</h4>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">

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
                    
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900 mb-1">
                            {product.location?.name}
                          </h5>
                          <p className="text-sm text-slate-500 mb-3">
                            ID: {product.location?.id}
                          </p>
                          <a
                            href={`https://${product.location?.google_map_link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                          >
                            View on Google Maps →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments Section */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Paperclip className="h-5 w-5 text-blue-600" />
                  <span>Attachments</span>
                  <Badge variant="secondary" className="ml-2">
                    {attachments.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Upload images or PDF files related to this product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-900">
                        {isDragging ? 'Drop files here' : 'Drop files here or click to browse'}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Supports JPG, PNG, PDF files up to 4MB
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button 
                      
                      variant="outline" 
                      onClick={() => document.getElementById('file-upload').click()}
                      className="mt-2 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>

                    
                  </div>
                </div>

                <div className='m-2'>
                  <Button disabled={!attachments || attachments.length === 0} onClick={handleUpload} className="w-full cursor-pointer">
                      Upload {attachments.length} file(s)
                    </Button>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Uploaded Files</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {attachments.map((attachment) => {
                        const FileIcon = getFileIcon(attachment.type);
                        return (
                          <div 
                            key={attachment.id}
                            className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            {attachment.preview ? (
                              <img 
                                src={attachment.preview} 
                                alt={attachment.name}
                                className="w-12 h-12 object-cover rounded-md border border-slate-200"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center">
                                <FileIcon className="h-6 w-6 text-slate-600" />
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatFileSize(attachment.size)} • {attachment.type.split('/')[1].toUpperCase()}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                             
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(attachment.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
         

            
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
                {/* <CardDescription>Scan to view asset details</CardDescription> */}
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
                
                <ReassignEmployee product={product} onProductUpdate={setproduct} ></ReassignEmployee>
                <TransferLocation  product={product} onProductUpdate={setproduct} ></TransferLocation>
                <ReassignStatus  product={product} onProductUpdate={setproduct} ></ReassignStatus>
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