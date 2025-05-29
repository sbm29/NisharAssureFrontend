
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProfileAvatarProps {
  imageUrl?: string;
  name: string;
  onImageChange: (imageUrl: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ imageUrl, name, onImageChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    // For now, we'll use a mock URL since we don't have actual file upload
    // In a real application, you would upload this to your server or a storage service
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result);
      setIsUploading(false);
      toast({
        title: 'Profile image updated',
        description: 'Your profile image has been updated successfully',
      });
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative flex flex-col items-center">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-border">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
      </Avatar>
      
      <div className="mt-4">
        <label htmlFor="profile-upload">
          <Button 
            variant="outline" 
            className="cursor-pointer" 
            disabled={isUploading} 
            type="button"
          >
            <Camera className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </Button>
        </label>
        <input 
          type="file" 
          id="profile-upload" 
          accept="image/*" 
          className="hidden"
          onChange={handleImageUpload} 
          disabled={isUploading} 
        />
      </div>
    </div>
  );
};

export default ProfileAvatar;
