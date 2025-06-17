import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Loader2, Building2, User, ArrowLeftRight  } from 'lucide-react';
import { Button } from '../components/ui/button';
import React, { useState } from 'react';
import { toast } from 'sonner';


export default function ReassignEmployee({ product, onProductUpdate  }) {


    
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
    const response = await fetch('http://localhost:8000/employees');
    if (response.ok) {
      const employeesData = await response.json();
      setEmployees(employeesData);
    } else {
      setError("Failed to load employees");
    }
  } catch (err) {
    setError("Error loading employees: " + err.message);
  } finally {
    setLoadingEmployees(false);
  }
};


const handleTransferLocation = async () => {
  if (!selectedEmployeeId) {
    alert('Please select an employee');
    return;
  }

  setReassignLoading(true);
  console.log('reassign product to employee:', selectedEmployeeId);
  
  try {
    const response = await fetch(`http://localhost:8000/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: product.name,               
        employee_id:  parseInt(selectedEmployeeId),
        in_warehouse : false,
        id: product.id,        
      }),
    });

    if (response.ok) {
    
        setShowReassignModal(false);
        setSelectedEmployeeId('');
        const updatedProduct = await fetch(`http://localhost:8000/products/${product.id}`).then(res => res.json());
        onProductUpdate(updatedProduct);
      
      toast.success('Reassign Employee successfully!',{
                          description : 'updated Location at ' + formattedDate
                        }); 
        
       
    } else {
      
      toast.error('Failed to Reassign Employee');
    }

  } 
  catch (err) {
    toast.error('Error Reassign Employee: ' + err.message);
  } finally {
    setReassignLoading(false);
  }
};

// Add this function to open the modal
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
                    <Label htmlFor="current-location">Current employee info</Label>
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
                <div className="flex items-center justify-center">
                  <ArrowLeftRight className="w-8 h-8 text-slate-600" />
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
                            .filter(employee => employee.id !== product.employees?.id)
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