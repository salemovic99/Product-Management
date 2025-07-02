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


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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
    in_warehouse: "",
    purchasing_date: purchasingDate,
    warranty_expire: warrantyExpire,
    note: "",

  });


  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/locations/?skip=0&limit=100`);
        if (response.ok) {
          const data = await response.json();
          
          setLocations(data);
        } else {
          console.error("Failed to fetch locations");
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        if (response.ok) {
          const data = await response.json();
          
          setEmployees(data);
        } else {
          console.error("Failed to fetch employees");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
    setTimeout(() => {
      setLoading(false)
    }, 200);
  }, []);


  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/statuses`);
        if (response.ok) {
          const data = await response.json();
          
          setStatuses(data);
        } else {
          console.error("Failed to fetch statuses");
        }
      } catch (err) {
        console.error("Error fetching statuses:", err);
      } finally {
        setLoadingStatuses(false);
      }
    };

    fetchStatuses();
    setTimeout(() => {
      setLoading(false)
    }, 200);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

  const validateForm = () => {

    if (!formData.name.trim()) return "Product name is required";
    if (!formData.serial_number.trim()) return "serial number is required";
    if (!formData.our_serial_number.trim()) return "our serial number is required";
    if (!purchasingDate || isNaN(purchasingDate.getTime())) return "Invalid purchasing date";
    if (!formData.location_id.trim()) return "location is required";
    if (!formData.note.trim()) return "note is required";
    if (!inWarehouse && !formData.employee_id) return "Employee is required when not in warehouse";
    if (inWarehouse && formData.employee_id) return "Employee should not be selected when in warehouse";
    if (warrantyExpire && isNaN(warrantyExpire.getTime())) return "Invalid warranty expire date";
    if (warrantyExpire  < purchasingDate) {
      return "Warranty expire date cannot be before purchasing date";
    }
    if (!formData.note || formData.note.length < 10) {
      return "Note cannot be less than 10 characters";
    }
    if (formData.serial_number.length < 15) {
      return "serial number cannot be less than 15 characters";
    }
    if (formData.our_serial_number.length < 15) {
      return "our serial cannot be less than 15 characters";
    }
    if (formData.name.length < 4) {
      return "Product name cannot be less than 4 characters";
    }
 
    return null;
  };

  const handleSubmit = async () => {

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const data = {
    name: formData.name,
    serial_number: formData.serial_number,
    our_serial_number: formData.our_serial_number,
    location_id: parseInt(formData.location_id), // ensure int
    employee_id: inWarehouse ? null : formData.employee_id ? parseInt(formData.employee_id) : null,
    in_warehouse: inWarehouse,
    purchasing_date: purchasingDate ? purchasingDate.toISOString().split("T")[0] : null,
    warranty_expire: warrantyExpire ? warrantyExpire.toISOString().split("T")[0] : null,
    note: formData.note || null,
    status_id: formData.status_id ? formData.status_id  : 1
  };

    try {
      const response = await fetch(`${API_BASE_URL}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok){
        toast.error('Something went wrong : ' + (await response.json()).detail)  ;
        return;               
        }

      setSuccess(true);
      toast.success('Product created successfully',{
                    description : 'create at ' + formattedDate
                  });
      // Reset form
      setFormData({
          name: "",
          serial_number: "",
          our_serial_number: "",
          location_id: "",
          employee_id: "",
          status_id: "",
          in_warehouse: "",
          purchasing_date: null,
          warranty_expire: warrantyExpire,
          note: ""
      });
      
      //return to the previous page after successful update
      goBack()

    } catch (err) {
      setError(err.message || "Something went wrong");
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
    setWarrantyExpire(null);
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
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>

              {/* Product serial number */}
              <div className="space-y-2">
                <Label htmlFor="name">serial number *</Label>
                <Input
                  id="serialNumber"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  placeholder="Enter product serial number"
                />
              </div>

              {/* Product our serial number */}
              <div className="space-y-2">
                <Label htmlFor="name">our serial number *</Label>
                <Input
                  id="ourSerialNumber"
                  name="our_serial_number"
                  value={formData.our_serial_number}
                  onChange={handleInputChange}
                  placeholder="Enter product our serial number"
                />
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, location_id: value }))}
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status_id: value }))}
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, employee_id: value }))}
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
                  onChange={handleInputChange}
                  placeholder="Enter product note"
                  rows={4}
                />
                <span className={`text-sm text-gray-500`}>Note must be at least 10 characters</span>
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