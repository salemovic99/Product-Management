import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { toast } from 'sonner';

const PrintQRCode = ({ product }) => {

  const printQRCode = async () => {

    if (!product?.dynamic_qr_code) {
      toast.warning("No QR code available to print");
      return;
    }

    try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const qrImageUrl = `${baseUrl}/${product.dynamic_qr_code}`;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>QR Code Print - 4" x 6"</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    background: white;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }
                
                .page {
                    width: 6in;
                    height: 4in;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    background: white;
                }
                
                .qr-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    width: 100%;
                    padding-left: 1.25in; /* Center the 3.5" QR code on 6" paper: (6-3.5)/2 = 1.25" */
                }
                
                .qr-image {
                    /* Maximum size while maintaining aspect ratio and leaving some margin */
                    width: 2.5in;
                    height: 2.5in;
                    object-fit: contain;
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: crisp-edges;
                    image-rendering: pixelated;
                    /* Ensure crisp rendering for QR codes */
                }
                
                @media print {
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    .page {
                        margin: 0;
                        padding: 5px;
                        page-break-after: always;
                        box-shadow: none;
                        border: none;
                    }
                    
                    .qr-image {
                        /* Ensure maximum quality for printing */
                        image-rendering: -webkit-optimize-contrast;
                        image-rendering: crisp-edges;
                        image-rendering: pixelated;
                    }
                    
                    /* Hide everything except the page content when printing */
                    @page {
                        size: 6in 4in;
                        margin: 0;
                    }
                }
                
                /* Optional: Show page boundaries in browser for preview */
                @media screen {
                    body {
                        background: #f0f0f0;
                        padding: 20px;
                    }
                    
                    .page {
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        border: 1px solid #ddd;
                    }
                }
            </style>
        </head>
        <body>
            <div class="page">
                <div class="qr-container">
                    <img src="${qrImageUrl}" alt="QR Code" class="qr-image" />
                </div>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
   
    printWindow.onload = () => {
    const img = printWindow.document.querySelector("img");
        img.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 200);
        };
    };

    } catch (error) {
      toast.error("Failed to print QR code", {
        description: error.message
      });
    }
  };

  return (
    <Button 
      className="w-full justify-start cursor-pointer" 
      variant="outline" 
      onClick={printQRCode} 
      disabled={!product?.dynamic_qr_code}
    >
      <QrCode className="h-4 w-4 mr-2" />
      Print QR Code
    </Button>
  );
};

export default PrintQRCode;