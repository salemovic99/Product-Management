"use client";
import React from 'react';
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Loader2, Plus, CheckCircle, AlertCircle, ChevronDown,ArrowLeft,CalendarIcon, Shuffle } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox"
import { Calendar } from "../../../../components/ui/calendar"
import { cn } from "../../../../lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/popover"
import { format } from "date-fns"
import { Skeleton } from '../../../../components/ui/skeleton';
import { toast } from "sonner"
import locationsService from '@/services/locationService';
import employeesService from '@/services/employeeService';
import statusesService from '@/services/statusService';
import productsService from '@/services/productService';
import { z } from "zod";
import {productSchema} from '@/schemas/product' 

// const productSchema = z.object({
//   name: z.coerce.string().regex(/[A-Za-z]/, { message: "Name must contain at least one letter",  }).min(3, { message: "Product name is required" }),
//   serial_number: z.string().min(8, { message: "Serial number is required" }).max(20, {message :"Serial number must not exceed 20 characters"}),
//   our_serial_number: z.string().min(15, { message: "Our serial is required" }),
//   location_id: z.coerce.number().min(1, { message: "Location is required" }),
//   status_id: z.coerce.number().min(1, { message: "Status is required" }),
//   in_warehouse: z.boolean(),
//   note: z.string().regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters and spaces",}).min(10, { message: "Note is required" }),
//   purchasing_date: z.coerce.date({
//     required_error: "Purchasing date is required",
//     invalid_type_error: "Invalid date"
//   }),
//   warranty_expire: z.date().optional(),
// });


export default function AddProductPage() {

  const now = new Date();
  const formattedDate = now.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  });
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});//for validation

  const [inWarehouse, setInWarehouse] = useState(true);
  const [purchasingDate, setPurchasingDate] = useState();
  const [warrantyExpire, setWarrantyExpire] = useState(new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())); // Default to 1 year from today
  
  const [formData, setFormData] = useState({
    name: "",
    serial_number: "",
    our_serial_number: "",
    location_id: "",
    employee_id: "",
    status_id: "",
    in_warehouse: true,
    purchasing_date: purchasingDate,
    warranty_expire: warrantyExpire,
    note: ""
  });

  const fetchLocations = async () => {
    try {
      const data = await locationsService.getAllLocations()

      if (!data) {
        console.error("Failed to fetch locations");
        return;
      }   
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    } finally {
      setLoadingLocations(false);
    }
  };


  const fetchEmployees = async () => {
    try {
      const data = await employeesService.getAllEmployees();

      if (!data) {
        console.error("Failed to fetch employees");
      } 
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

 
  const fetchStatuses = async () => {
    try {
      const data = await statusesService.getAllStatuses();

      if (!data) {
        console.error("Failed to fetch statuses");
      } 
      setStatuses(data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    } finally {
      setLoadingStatuses(false);
    }
  };

 
  useEffect(() => {
    fetchLocations();
    fetchEmployees();
    fetchStatuses();
    setTimeout(() => {
    setLoading(false)
    }, 200);
  }, []);

   const validateField = (field, value) => {
    const partialSchema = z.object({ [field]: productSchema.shape[field] });

    const result = partialSchema.safeParse({ [field]: value });

    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? null : result.error.issues[0].message,
    }));
  };

  const handleInputChange = (name, value) => {
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if(name === `employee_id`) return ;

    validateField(name, value);
  };

  
  const handleSubmit = async () => {

    if (!inWarehouse && !formData.employee_id) {
      toast.error("Employee is required when you choose not in warehouse")
      return;
    }

    const validated = productSchema.safeParse({
      ...formData,
      in_warehouse: inWarehouse,
      purchasing_date: purchasingDate,
      warranty_expire: warrantyExpire,
    });

    if (!validated.success) {
      const fieldErrors = {};
      validated.error.errors.forEach(({ path, message }) => {
        fieldErrors[path[0]] = message;
      });
      setErrors(fieldErrors);
      return;
    } else {
      setErrors({});
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const data = {
      name: formData.name,
      serial_number: formData.serial_number,
      our_serial_number: formData.our_serial_number,
      location_id: parseInt(formData.location_id), 
      employee_id: inWarehouse ? null : formData.employee_id ? parseInt(formData.employee_id) : null,
      in_warehouse: inWarehouse,
      purchasing_date: purchasingDate ? purchasingDate.toISOString().split("T")[0] : null,
      warranty_expire: warrantyExpire ? warrantyExpire.toISOString().split("T")[0] : null,
      note: formData.note || null,
      status_id: formData.status_id ? formData.status_id  : 1
    };


    try {
      const response = await productsService.createProduct(data);

      if (!response){
        toast.error('Something went wrong ')  ;
        return;               
        }

      setSuccess(true);
      toast.success('Product created successfully',{
                    description : 'create at ' + formattedDate
                  });
    
      resetForm();
    
      goBack()

    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error('Failed to create product', {
      description: err.message || 'Unexpected error occurred',
      duration: 5000,
    });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const resetForm = () => {
    setWarrantyExpire(new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())); // Reset to 1 year from today
    setFormData({
        name: "",
        serial_number: "",
        our_serial_number: "",
        warranty_expire:warrantyExpire,
        location_id: "",
        employee_id: "",
        status_id: "",
        in_warehouse: true,
        note: "",
    });
    setPurchasingDate(null),
    setError("");
    setSuccess(false);
  };

  const GenerateRandomSerialNumber = (length) => {
   
    const id = crypto.randomUUID();
    let serialNumber = id.slice(0, length); 
   
    document.getElementById('ourSerialNumber').value = serialNumber;
    formData.our_serial_number = serialNumber;
    setFormData(prev => ({
      ...prev,
      our_serial_number: serialNumber
    }));
    validateField('our_serial_number', serialNumber)
  }


  if(loading)
  {
    return(
            <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-xl mx-auto space-y-6">
              {/* Header Skeleton */}
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-64" />

              {/* Card Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Inputs Skeleton */}
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Checkbox */}
                  <Skeleton className="h-5 w-40" />

                  {/* Dropdowns */}
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Textarea */}
                  <Skeleton className="h-24 w-full" />

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={goBack} className={"cursor-pointer"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product with basic information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Product Information
            </CardTitle>
            <CardDescription>
              Fill in the basic details to add a new product
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Product created successfully!
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {handleInputChange('name', e.target.value)}}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Product serial number */}
              <div className="space-y-2">
                <Label htmlFor="name">serial number *</Label>
                <Input
                  id="serialNumber"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => {handleInputChange('serial_number', e.target.value)}}
                  placeholder="Enter product serial number"
                />
                {errors.serial_number && <p className="text-red-500 text-sm mt-1">{errors.serial_number}</p>}
              </div>

              {/* Product our serial number */}
              <div className="space-y-2">
                <Label htmlFor="name">our serial number *</Label>
                <Input
                  id="ourSerialNumber"
                  name="our_serial_number"
                  value={formData.our_serial_number}
                  onChange={(e) => {handleInputChange('our_serial_number', e.target.value)}}
                  placeholder="Enter product our serial number"
                />
                {errors.our_serial_number && <p className="text-red-500 text-sm mt-1">{errors.our_serial_number}</p>}
                <Button
                  variant="outline"
                  className="mt-2 cursor-pointer"
                  onClick={() => GenerateRandomSerialNumber(23)}
                >
                  <Shuffle className="ml-2 w-4 h-4" />
                  Generate Random Serial Number
                  
                </Button>
              </div>

               
              <div className={'grid grid-cols-1 space-y-5 md:grid-cols-2 md:space-y-0'}>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="date-picker-one" >
                    Purchasing Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild >
                      <Button
                        id="date-picker-one" 
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !purchasingDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {purchasingDate ? format(purchasingDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={purchasingDate}
                        onSelect={setPurchasingDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.purchasingDate && <p className="text-red-500 text-sm mt-1">{errors.purchasingDate}</p>}
                </div>


                <div className="flex flex-col space-y-2">
                  <Label htmlFor="date-picker" >
                    Warranty Expire Date (optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker" // important to link with the label
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !warrantyExpire && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {warrantyExpire ? format(warrantyExpire, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={warrantyExpire}
                        onSelect={setWarrantyExpire}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>



              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold uppercase">
                  Is it in the warehouse?
                </Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inWarehouse"
                    checked={inWarehouse}
                    onCheckedChange={setInWarehouse}
                  />
                  <Label htmlFor="inWarehouse" className=" font-medium">Yes</Label>
                </div>
              </div>
              
              <div className={'grid grid-cols-1 space-y-4   md:grid-cols-3 md:space-y-0 gap-3'}>

              {/* location Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="department">Location name *</Label>
                {loadingLocations ? (
                  <div className="flex items-center space-x-2 p-3 border rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">Loading departments...</span>
                  </div>
                ) : (
                  <Select 
                    value={formData.location_id} 
                    onValueChange={(value) => {handleInputChange('location_id', value)}}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem 
                          key={location.id} 
                          value={location.id.toString()}
                        >
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
              </div>

              {/* statuses Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="department">status  *</Label>
                {loadingStatuses ? (
                  <div className="flex items-center space-x-2 p-3 border rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">Loading statuses...</span>
                  </div>
                ) : (
                  <Select 
                    value={formData.status_id} 
                    onValueChange={(value) => {handleInputChange('status_id', value)}}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem 
                          key={status.id} 
                          value={status.id.toString()}
                        >
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.status_id && <p className="text-red-500 text-sm mt-1">{errors.status_id}</p>}
              </div>

              {/* employee Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="department">employee name </Label>
                {loadingEmployees ? (
                  <div className="flex items-center space-x-2 p-3 border rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">Loading employees...</span>
                  </div>
                ) : (
                  <Select 
                  disabled={inWarehouse}
                    value={formData.employee_id} 
                    onValueChange={(value) => {handleInputChange('employee_id', value)}}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem 
                          key={employee.id} 
                          value={employee.id.toString()}
                        >
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
              </div>
              </div>

              {/* note */}
              <div className="space-y-2">
                <Label htmlFor="description">note *</Label>
                <Textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={(e) =>{handleInputChange('note', e.target.value)}}
                  placeholder="Enter product note"
                  rows={4}
                />
                {errors.note && <p className="text-red-500 text-sm mt-1">{errors.note}</p>}
              </div>


              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                  className={"cursor-pointer"}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}