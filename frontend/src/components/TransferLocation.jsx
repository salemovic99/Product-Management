import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Loader2, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import React, { useState } from 'react';
import { toast } from 'sonner';


export default function TransferLocation({ product, onProductUpdate  }) {


    
    const now = new Date();
        const formattedDate = now.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "medium",
        });
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);


const fetchLocations = async () => {



     

  setLoadingLocations(true);
  try {
    const response = await fetch('http://localhost:8000/locations');
    if (response.ok) {
      const locationsData = await response.json();
      setLocations(locationsData);
    } else {
      setError("Failed to load locations");
    }
  } catch (err) {
    setError("Error loading locations: " + err.message);
  } finally {
    setLoadingLocations(false);
  }
};


const handleTransferLocation = async () => {
  if (!selectedLocationId) {
    alert('Please select a location');
    return;
  }

  setTransferLoading(true);
  console.log('Transferring product to location:', selectedLocationId);
  
  try {
    const response = await fetch(`http://localhost:8000/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: product.name,
        serial_number: product.serial_number,
        our_serial_number: product.our_serial_number,
        location_id:  parseInt(selectedLocationId),
        employee_id:  parseInt(product.employee_id),
        in_warehouse: product.in_warehouse,
        purchasing_date: product.purchasing_date,
        warranty_expire: product.warranty_expire,
        note: product.note,
        dynamic_qr_code: product.dynamic_qr_code,
        id: product.id,
        
      }),
    });

    if (response.ok) {
    
      setShowTransferModal(false);
      setSelectedLocationId('');
    const updatedProduct = await fetch(`http://localhost:8000/products/${product.id}`).then(res => res.json());
      onProductUpdate(updatedProduct);
      
      toast.success('Location transferred successfully!',{
                          description : 'updated Location at ' + formattedDate
                        }); 
        
       
    } else {
      
      toast.error('Failed to transfer location');
    }

  } 
  catch (err) {
    toast.error('Error transferring location: ' + err.message);
  } finally {
    setTransferLoading(false);
  }
};

// Add this function to open the modal
const openTransferModal = () => {
  setShowTransferModal(true);
  fetchLocations();
};


return (

            <div>
                
           
            <Button 
            className="w-full justify-start cursor-pointer" 
            variant="outline"
            onClick={openTransferModal}
            >
            <Building2 className="h-4 w-4 mr-2" />
            Transfer Location
            </Button>

          
            <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Transfer Location</DialogTitle>
                <DialogDescription>
                    Select a new location for {product.name}
                </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="current-location">Current Location</Label>
                    <div className="p-3 bg-gray-100 rounded-md">
                        <p className="font-medium">{product.location?.name}</p>
                        <p className="text-sm text-gray-600">ID: {product.location?.id}</p>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="new-location">New Location</Label>
                    {loadingLocations ? (
                    <div className="flex items-center justify-center p-3">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading locations...
                    </div>
                    ) : (
                    <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                        {locations
                            .filter(location => location.id !== product.location?.id)
                            .map((location) => (
                            <SelectItem key={location.id} value={location?.id}>
                            <div className="flex flex-col">
                                <span className="font-medium">{location.name}</span>
                                <span className="text-sm text-gray-500">ID: {location.id}</span>
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
                    setShowTransferModal(false);
                    setSelectedLocationId('');
                    }}
                    disabled={transferLoading}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleTransferLocation}
                    disabled={transferLoading || !selectedLocationId}
                >
                    {transferLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Transferring...
                    </>
                    ) : (
                    'Transfer Location'
                    )}
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
            </div>

)

}