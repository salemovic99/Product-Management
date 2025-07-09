import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Loader2, Building2, User, ArrowLeftRight  } from 'lucide-react';
import { Button } from '../components/ui/button';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth, useUser } from "@clerk/nextjs";
import employeesService, { employeeService } from '@/services/employeeService';
import productsService from '@/services/productService';

export default function ReassignEmployee({ product, onProductUpdate  }) {

  const { user } = useUser();

  const fullName = user?.fullName;
  const email = user?.emailAddresses[0]?.emailAddress;

    const now = new Date();
        const formattedDate = now.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "medium",
        });

    const [showReassignModal, setShowReassignModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [ReassignLoading, setReassignLoading] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);


const fetchEmployees = async () => {

  setLoadingEmployees(true);
  try {
    const result = await employeesService.getAllEmployees();
    if (!result) {
      setError("Failed to load employees");
      toast.error("Failed to load employees");
      return;
    }

    setEmployees(result);
  } catch (err) {
    setError("Error loading employees: " + err.message);
    toast.error("Error loading employees:",{
      description: err.message
    })
  } finally {
    setLoadingEmployees(false);
  }
};


const handleTransferLocation = async () => {
  if (!selectedEmployeeId) {
    toast.info('Please select an employee');
    return;
  }

  setReassignLoading(true);
 
  try {
    const data = {               
        employee_id:  parseInt(selectedEmployeeId),
        in_warehouse : false,
        changed_by: `${fullName} <${email}>`        
      }
    const result = await productsService.updateProduct(product.id,data)

    if (!result) {
      toast.error('Failed to Reassign Employee');
      return;
    } 

    setShowReassignModal(false);
    setSelectedEmployeeId('');
    const updatedProduct = await productsService.getProductById(product.id);
    onProductUpdate(updatedProduct);
    toast.success('Reassign Employee successfully!',{
                      description : 'updated Location at ' + formattedDate
                    }); 

  } 
  catch (err) {
    toast.error('Error Reassign Employee: ' + err.message);
  } finally {
    setReassignLoading(false);
  }
};


const openTransferModal = () => {
  setShowReassignModal(true);
  fetchEmployees();
};


return (

            <div>
                
           
            <Button 
            className="w-full justify-start cursor-pointer" 
            variant="outline"
            onClick={openTransferModal}
            >
            <User className="h-4 w-4 mr-2" />
            Reassign Employee
            </Button>

          
            <Dialog open={showReassignModal} onOpenChange={setShowReassignModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Reassign Employee</DialogTitle>
                <DialogDescription>
                    Select an employee for {product.name}
                </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="current-location">Current Employee</Label>
                    <div className="p-3 bg-gray-100 rounded-md">
                        {product.employee ? (
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{product.employee?.name}</span>
                            <span className="text-sm text-gray-500">ID: {product.employee?.id}</span>
                            </div>
                        ) : ( 
                        <span className="text-gray-500">No employee assigned</span>
                        )}
                    </div>
                </div>
               
                
                <div className="space-y-2 ">
                    <Label htmlFor="new-location">New Employee</Label>
                    {loadingEmployees ? (
                    <div className="flex items-center justify-center p-3">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading employees...
                    </div>
                    ) : (
                    <Select  value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                        {employees
                            .filter(employee => employee.id !== product.employee?.id)
                            .map((employee) => (
                            <SelectItem key={employee.id} value={employee?.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{employee.name}</span>
                                <span className="text-sm text-gray-500">ID: {employee.id}</span>
                            </div>
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    )}
                </div>
                </div>

                <DialogFooter>
                <Button 
                    variant="outline" 
                    onClick={() => {
                    setShowReassignModal(false);
                    setSelectedEmployeeId('');
                    }}
                    disabled={ReassignLoading}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleTransferLocation}
                    disabled={ReassignLoading || !selectedEmployeeId}
                >
                    {ReassignLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Reassign...
                    </>
                    ) : (
                    'Reassign Employee'
                    )}
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
            </div>

)

}