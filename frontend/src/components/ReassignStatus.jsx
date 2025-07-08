import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Loader2, Building2, User, ArrowLeftRight, Route  } from 'lucide-react';
import { Button } from '../components/ui/button';
import React, { useState } from 'react';
import { toast } from 'sonner';
import statusesService from '@/services/statusService';
import productsService from '@/services/productService';


export default function ReassignStatus({ product, onProductUpdate  }) {


    
    const now = new Date();
        const formattedDate = now.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "medium",
        });

    const [showReassignModal, setShowReassignModal] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [selectedStatusId, setSelectedStatusId] = useState('');
    const [ReassignLoading, setReassignLoading] = useState(false);
    const [loadingStatuses, setLoadingStatuses] = useState(false);


const fetchStatuses = async () => {

  setLoadingStatuses(true);
  try {
    const result = await statusesService.getAllStatuses();
    if (!result) {      
      setError("Failed to load statuses");
      toast.error("Failed to load statuses");
      return;
    } 
    setStatuses(result);
  } catch (err) {
    setError("Error loading statuses: " + err.message);
    toast.error("Error loading statuses:",{
      description:err.message
    })
  } finally {
    setLoadingStatuses(false);
  }
};


const handleTransferLocation = async () => {
  if (!selectedStatusId) {
    toast.error('Please select an statuses');
    return;
  }

  setReassignLoading(true);

  try {
    const data = {
       status_id:  parseInt(selectedStatusId)
    }

    const result = await productsService.updateProduct(product.id, data);

    if (!result) {
      toast.error('Failed to Update Status');
      return;  
    } 

    setShowReassignModal(false);
    setSelectedStatusId('');
    const updatedProduct = await productsService.getProductById(product.id);
    onProductUpdate(updatedProduct);
    
    toast.success('Update Statues Successfully!',{
                    description : 'updated status at ' + formattedDate
                  }); 

  } 
  catch (err) {
    toast.error('Error Update Status: ' + err.message);
  } finally {
    setReassignLoading(false);
  }
};


const openTransferModal = () => {
  setShowReassignModal(true);
  fetchStatuses();
};


return (

        <div>
                
           
            <Button 
            className="w-full justify-start cursor-pointer" 
            variant="outline"
            onClick={openTransferModal}
            >
                <Route className="h-4 w-4 mr-2" />
               
                Update Status
            </Button>

          
            <Dialog open={showReassignModal} onOpenChange={setShowReassignModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Update Status</DialogTitle>
                <DialogDescription>
                    Select a status for {product.name}
                </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="current-location">Current Status</Label>
                    <div className="p-3 bg-gray-100 rounded-md">
                        {product.status ? (
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{product.status?.name}</span>
                            <span className="text-sm text-gray-500">ID: {product.status?.id}</span>
                            </div>
                        ) : ( 
                        <span className="text-gray-500">No status assigned</span>
                        )}
                    </div>
                </div>
               
                
                <div className="space-y-2 ">
                    <Label htmlFor="new-location">New Status</Label>
                    {loadingStatuses? (
                    <div className="flex items-center justify-center p-3">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading statuses...
                    </div>
                    ) : (
                    <Select  value={selectedStatusId} onValueChange={setSelectedStatusId}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                        {statuses
                            .filter(status => status.id !== product.status?.id)
                            .map((status) => (
                            <SelectItem key={status.id} value={status?.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{status.name}</span>
                                <span className="text-sm text-gray-500">ID: {status.id}</span>
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
                    setSelectedStatusId('');
                    }}
                    disabled={ReassignLoading}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleTransferLocation}
                    disabled={ReassignLoading || !selectedStatusId}
                >
                    {ReassignLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Reassign...
                    </>
                    ) : (
                    'Update Status'
                    )}
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>

)

}