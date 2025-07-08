'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Printer  } from 'lucide-react';
import { Button } from '../components/ui/button'; 
import { toast } from 'sonner';
import  { useState } from 'react';
import productsService from "@/services/productService";

export default function PrintHandoverPdf({ data, onProductUpdate }) {
  const now = new Date();
  const formattedDate = now.toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
  });

  const [showModal, setShowModal] = useState(false);
  
  const printPDF = async () => {
    try {

        if(data.id === null || data.id === undefined || data.id <= 0)
            {
                toast.error("invalid productId!");
                return ;
            } 
            
        const res = await fetch('/api/handover-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            toast.error(`Failed to fetch PDF: ${res.statusText}`);
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const printWindow = window.open(url);

        if (!printWindow) {
            toast.error("Popup blocked! Please allow popups for this site.");
            return;
        }

        printWindow.addEventListener('load', () => {
            printWindow.focus();
            printWindow.print();
        });

        await handleUpdate(data.id);

    } catch (error) {
      toast.error("An error occurred while printing the PDF", {
        description: error.message,
      });
    }
  };

  const handleUpdate = async (productID) => {

    try {
        
        const data = {      
            in_warehouse: true,
            employee_id: null
        };

        const result = await productsService.updateProduct(productID, data);

        if (!result){
            toast.error(`Failed to update product!`)           
            return;                   
            }
 
        toast.success('Product updated successfully',{
                            description : 'updated at ' + formattedDate
                            });

        const updatedProduct = await productsService.getProductById(productID);
        onProductUpdate(updatedProduct);
     
    } catch (err) {      
      toast.error("Something went wrong", {
        description: err.message
      })
      
    } 
  };

  return (
    <>

        <AlertDialog open={showModal} onOpenChange={setShowModal}>
          <AlertDialogTrigger asChild>  
            <Button variant={`outline`} className={`cursor-pointer  w-full justify-start`}  disabled={data === null || data === undefined || data.in_warehouse}>            
              <Printer className="h-4 w-4 mr-2"/>
              Print Asset Handover PDF    
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Print Handover PDF</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to print the handover PDF? This will update the product status to "in warehouse".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowModal(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={printPDF} className={`cursor-pointer`}>Print</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
            
    </>
   
  );
}
