import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, Calendar, Shield, User, IdCard,Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProductInfo = ({ product }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
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
                <p className="min-h-20 whitespace-pre-wrap break-words text-slate-900 bg-slate-100 p-3 rounded-md">
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
            <CardTitle className="">                 
                <div className='flex items-center space-x-2'>
                    <User className="h-5 w-5 " />
                    <span>Assignment Details</span>  
                </div>

            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Assigned Employee</h4>

                <div className="bg-slate-100  border-slate-200 rounded-lg p-4 ">

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
                
                <div className="bg-slate-100  border-slate-200 rounded-lg p-4 ">
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
                        href={`${product.location?.google_map_link}`}
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
    </>
  );
};

export default ProductInfo;
