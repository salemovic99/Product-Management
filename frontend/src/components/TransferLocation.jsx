import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Loader2, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useAuth, useUser } from "@clerk/nextjs";
import locationsService from '@/services/locationService';
import productsService, { productService } from '@/services/productService';


export default function TransferLocation({ product, onProductUpdate  }) {

    const { user } = useUser();
  
    const fullName = user?.fullName;
    const email = user?.emailAddresses[0]?.emailAddress;
    
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
    const result = await locationsService.getAllLocations();

    if (!result) {
      setError("Failed to load locations");
      toast.error("Failed to load locations");
      return;
    }

    setLocations(result);
  } catch (err) {
    setError("Error loading locations: " + err.message);
    toast.error("Error loading locations: ",{
      description:err.message
    })
  } finally {
    setLoadingLocations(false);
  }
};


const handleTransferLocation = async () => {
  if (!selectedLocationId) {
    toast.info('Please select a location');
    return;
  }

  setTransferLoading(true);
 
  try {
    const data = {
      location_id:  parseInt(selectedLocationId),
      changed_by: `${fullName} <${email}>`  
    }
    const result = await productsService.updateProduct(product.id,data);

    if (!result) {
      toast.error('Failed to transfer location');
      return;
    } 
    setShowTransferModal(false);
    setSelectedLocationId('');
    const updatedProduct = await productsService.getProductById(product.id);
    onProductUpdate(updatedProduct);
    toast.success('Location transferred successfully!',{
                        description : 'updated Location at ' + formattedDate
                      });       
  } 
  catch (err) {
    toast.error('Error transferring location: ' + err.message);
  } finally {
    setTransferLoading(false);
  }
};

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