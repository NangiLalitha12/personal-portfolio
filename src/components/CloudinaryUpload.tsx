
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface CloudinaryUploadProps {
  onImageUpload: (imageUrl: string) => void;
  children?: React.ReactNode;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onImageUpload, children }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'personal portofolio');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/djwyomtbo/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      onImageUpload(data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="cloudinary-upload"
        disabled={uploading}
      />
      <label htmlFor="cloudinary-upload">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          disabled={uploading}
          asChild
        >
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : children || 'Upload Image'}
          </div>
        </Button>
      </label>
    </div>
  );
};

export default CloudinaryUpload;
