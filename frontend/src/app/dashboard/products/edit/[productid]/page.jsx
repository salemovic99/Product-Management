"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../../../components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Loader2, Save, CheckCircle, AlertCircle, ArrowLeft,CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "../../../../../lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover"
import { format } from "date-fns"
import { Checkbox } from "../../../../../components/ui/checkbox"
import { Calendar } from "../../../../../components/ui/calendar"
import { Skeleton } from "../../../../../components/ui/skeleton";
import { toast } from "sonner"

export default function EditProductPage() {
  const now = new Date();
const formattedDate = now.toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});
  const params = useParams();
  const productId = params?.productid ? parseInt(params.productid ) : null;


  const [formData, setFormData] = useState({
      id:"",
      name: "",
      serial_number: "",
      our_serial_number: "",
      location_id: "",
      employee_id: "",
      in_warehouse: "",
      purchasing_date: "",
      warranty_expire: "",
      note: "",
  });
  
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loading, setLoading] = useState(true);
  const [purchasingDate, setPurchasingDate] = useState();
  const [warrantyExpire, setWarrantyExpire] = useState();

  const [inWarehouse, setInWarehouse] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");


  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8000/employees/");
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

   // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/locations/");
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

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/products/${productId}`);
      if (response.ok) {
        const product = await response.json();
        setInWarehouse(product.in_warehouse)
        setPurchasingDate(product.purchasing_date)
        setWarrantyExpire(product.warranty_expire) 
        setFormData({
          id :product.id,
          name: product.name || "",
          serial_number: product.serial_number || "",
          our_serial_number: product.our_serial_number || "",
          location_id: product.location_id ? product.location_id.toString() : "",
          employee_id: product.employee_id ? product.employee_id.toString() : "",
          note: product.note ,
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

  // Fetch product data on component mount
  useEffect(() => {

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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
    if (!formData.location_id.trim()) return "location is required";
    return null;
  };

  const handleUpdate = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
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
      purchasing_date: purchasingDate ? purchasingDate: null,
      warranty_expire: warrantyExpire ? warrantyExpire: null,
      note: formData.note || null,
    };

    try {

      const response = await fetch(`http://localhost:8000/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

       if (!response.ok){
                        toast.error('Something went wrong : ' + (await response.json()).detail)                    
                        }

      setSuccess(true);
      
      toast.success('Product updated successfully',{
                          description : 'create at ' + formattedDate
                        });
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {      
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    
    window.history.back();
  };

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
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Product Information
            </CardTitle>
            <CardDescription>
              Modify the product details below and save your changes
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Product updated successfully!
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

              {/* Product id */}
              <div className="space-y-2">
                <Label htmlFor="name">Product id </Label>
                <Input
                  type="number"
                  readOnly 
                  id="id"
                  name="id"
                  value={formData.id}
                  className={'bg-gray-300'}                  
                />
              </div>
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
                <Label htmlFor="ourSerialNumber">our serial number *</Label>
                <Input
                  id="ourSerialNumber"
                  name="our_serial_number"
                  value={formData.our_serial_number}
                  onChange={handleInputChange}
                  placeholder="Enter product our serial number"
                />
              </div>

               
              <div className={'grid grid-cols-2'}>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="date-picker" >
                    Purchasing Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker" // important to link with the label
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
                    Warranty Expire Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker" 
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
              
              <div className={'grid grid-cols-2 gap-3'}>
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
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleUpdate}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Product
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={goBack}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}