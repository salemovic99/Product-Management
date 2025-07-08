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
import { FileDown  } from 'lucide-react';
import { Button } from '../components/ui/button'; 
import { toast } from 'sonner';
import  { useState } from 'react';
import productsService from "@/services/productService";

export default function DownloadPDFButton({ data }) {

  const [showModal, setShowModal] = useState(false);
  
  const downloadPDF = async () => {

    try {
        const res = await fetch('/api/handover-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {     
        toast.error(`Failed to download PDF:`,{
          description:res.statusText
        });
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `handover-form-${data?.id}-${data.employee?.name}.pdf`;
      a.click();
    } catch (error) {
      toast.error("Failed to download PDF:",{
        description:error.message
      })
    }
    
  };


  return (
    <>
  
        <AlertDialog open={showModal} onOpenChange={setShowModal}>
          <AlertDialogTrigger asChild>  
            <Button variant={`outline`} className={`cursor-pointer  w-full justify-start`}  disabled={data === null || data === undefined || data.in_warehouse}>
              <FileDown className="h-4 w-4 mr-2" />
              Download Asset Handover PDF    
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Download Handover PDF</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to download the Handover PDF? .
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
