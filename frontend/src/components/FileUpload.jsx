import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import productsFilesService from '@/services/productFilesService';

const FileUpload = ({ productId }) => {
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, [attachments]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      
      return true;
    });

    const newAttachments = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const attachment = prev.find(att => att.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter(att => att.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!attachments.length) return;

    setUploading(true);
    const formData = new FormData();

    attachments.forEach(attachment => {
      formData.append("files", attachment.file);
    });

    try {
      await productsFilesService.uploadProductFiles(productId, formData);
      toast.success("Files uploaded successfully");
      setAttachments([]);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed', {
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Upload;
    if (type === 'application/pdf') return FileText;
    return FileText;
  };

  return (
    <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Paperclip className="h-5 w-5 text-blue-600" />
          <span>Attachments</span>
          <Badge variant="secondary" className="ml-2">
            {attachments.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Upload images or PDF files related to this product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
              <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-slate-500'}`} />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900">
                {isDragging ? 'Drop files here' : 'Drop files here or click to browse'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Supports JPG, PNG, PDF files (max 10MB each)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-upload').click()}
              className="mt-2 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>

        <div className='m-2'>
          <Button 
            disabled={!attachments.length || uploading} 
            onClick={handleUpload} 
            className="w-full cursor-pointer"
          >
            {uploading ? 'Uploading...' : `Upload ${attachments.length} file(s)`}
          </Button>
        </div>

        {/* Attachments List */}
        {attachments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Files to Upload</h4>
            <div className="grid grid-cols-1 gap-3">
              {attachments.map((attachment) => {
                const FileIcon = getFileIcon(attachment.type);
                return (
                  <div 
                    key={attachment.id}
                    className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    {attachment.preview ? (
                      <img 
                        src={attachment.preview} 
                        alt={attachment.name}
                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center">
                        <FileIcon className="h-6 w-6 text-slate-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(attachment.size)} • {attachment.type.split('/')[1].toUpperCase()}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
