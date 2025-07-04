import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  FileText, 
  Image, 
  File, 
  Download, 
  Eye, 
  Upload,
  X,
  Plus
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const AttachmentTab = (productId) => {

  
  const [error, setError] = useState("");
  const [loadingProductFiles, setLoadingProductFiles] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const [attachments, setAttachments] = useState([
    // {
    //   id: 1,
    //   name: 'Product_Specifications.pdf',
    //   size: '2.4 MB',
    //   type: 'pdf',
    //   uploadDate: '2024-06-20',
    //   category: 'Documentation'
    // },
    
  ]);


  const fetchProductHistory = async ()=>{

        try {
            
          const response = await fetch(`${API_BASE_URL}/products/${productId.productId}/files`);
          if (response.ok) {

            const data = await response.json();

            // console.log(data)
            setAttachments(data);

          } else {
            setError("Failed to load product files ");
          }
        } catch (err) {
          setError("Error loading product files: " + err.message);
        } finally {
          setLoadingProductFiles(false);  
          setTimeout(() => {
            setLoading(false)
          }, 200);       
        }
    }

  const getFileIcon = (type) => {
    switch (type) {
      case 'png':
        return <Image className="h-5 w-5 text-blue-600" />;
      case 'jpg':
        return <Image className="h-5 w-5 text-blue-600" />;
      case 'svg':
        return <Image className="h-5 w-5 text-blue-600" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

 

  const handleRemoveAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  const handleDownload = async (attachment) => {
     try {
            
      if (attachment.file_path) {
      const normalizedPath = attachment.file_path.replace(/\\/g, '/');
      const fileUrl = `${API_BASE_URL}/${normalizedPath}`;

      console.log(fileUrl)
      const response = await fetch(fileUrl);

      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = normalizedPath.split('/').pop(); // Get just the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl); // Clean up
    }

    
    } catch (error) {
      console.error('Download error:', error);
      // You can add a toast notification here
      alert('Failed to download file. Please try again.');
    }
  };

  const handlePreview = (attachment) => {
    try {
      // Construct the file URL - adjust path based on where your files are stored
      const fileUrl = `${API_BASE_URL}/${attachment.file_path}`;
      
      // Open file in new tab
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Preview error:', error);
      alert('Failed to open file preview. Please check if the file exists.');
    }
  };

  useEffect(() => {
      fetchProductHistory();
    }, [productId]);

  return (
    <div className="w-full max-w-4xl  p-6 space-y-6">

        <div className='flex items-center justify-between mb-4'>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Product Attachments</h2>
              <p className="text-gray-600 mt-1">all related files for product with ID: {productId.productId} </p> 
            </div>   
        </div>
      <Card>
        
        <CardContent>
          {attachments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attachments yet</h3>
              
             
            </div>
          ) : (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(attachment.file_path.slice(-3))}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {attachment.file_path.split(/[/\\]/).pop()}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {/* <span className="text-xs text-gray-500">{attachment.size}</span>
                        <span className="text-xs text-gray-400">•</span> */}
                        <span className="text-xs text-gray-500">{attachment.uploaded_at}</span>
                      </div>
                    </div>
                    
                    {/* <Badge className={getCategoryColor(attachment.category)}>
                      {attachment.category}
                    </Badge> */}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(attachment)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {attachments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{attachments.length} attachment{attachments.length > 1 ? 's' : ''} total</span>
                {/* <span>
                  Total size: {
                    attachments.reduce((total, att) => {
                      const sizeInMB = parseFloat(att.size.replace(/[^\d.]/g, ''));
                      return total + sizeInMB;
                    }, 0).toFixed(1)
                  } MB
                </span> */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttachmentTab;