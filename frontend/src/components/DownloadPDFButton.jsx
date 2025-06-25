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

import { Button } from '../components/ui/button'; 
import { toast } from 'sonner';
import  { useState } from 'react';
export default function DownloadPDFButton({ data, onProductUpdate }) {
  const now = new Date();
  const formattedDate = now.toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
  });

  const [showModal, setShowModal] = useState(false);
  

  const downloadPDF = async () => {
    const res = await fetch('/api/delivery-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {     
      // alert(`Failed to download PDF: ${res.statusText}`);
      toast.error(`Failed to download PDF: ${res.statusText}`);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-form-${data?.id}-${data.employee?.name}.pdf`;
    a.click();

    handleUpdate(data.id);

  };

  const handleUpdate = async (productID) => {
  
     const data = {      
      in_warehouse: true,
      employee_id: null
    };

    try {

      const response = await fetch(`http://localhost:8000/products/${productID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

       if (!response.ok){
          toast.error(`Failed to update product: ${response.statusText}`)           
          return;                   
        }

     
      toast.success('Product updated successfully',{
                          description : 'create at ' + formattedDate
                        });

      const updatedProduct = await fetch(`http://localhost:8000/products/${productID}`).then(res => res.json());
        onProductUpdate(updatedProduct);
     
    } catch (err) {      
      toast.error(err.message || "Something went wrong")
      
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
  
        <AlertDialog open={showModal} onOpenChange={setShowModal}>
          <AlertDialogTrigger asChild>  
            <Button variant={`outline`} className={`cursor-pointer`}  disabled={data === null || data === undefined || data.in_warehouse}>
              Download PDF    
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Download Delivery PDF</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to download the delivery PDF? This will update the product status to "in warehouse".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowModal(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={downloadPDF} className={`cursor-pointer`}>Download</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
      
    
    </>
   
  );
}
