import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import EditableField from '@/components/profile/EditableField';
import { Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
  });
  
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Update form data when user data changes
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);
  
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call to your backend
      // For now, we'll simulate a successful response
      console.log('Saving profile data:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button 
            disabled={!isDirty || isLoading} 
            onClick={handleSaveProfile}
            className="mt-4 md:mt-0"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile Image */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Profile Image</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ProfileAvatar 
                imageUrl={formData.profileImage}
                name={formData.name}
                onImageChange={(imageUrl) => handleFieldChange('profileImage', imageUrl)}
              />
            </CardContent>
          </Card>
          
          {/* Right column - Profile Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EditableField 
                label="Full Name" 
                value={formData.name} 
                onChange={(value) => handleFieldChange('name', value)}
              />
              
              <EditableField 
                label="Email" 
                value={formData.email} 
                onChange={() => {}} // Email is not editable
                editable={false}
                type="email"
              />
              
              <Separator className="my-4" />
              
              <EditableField 
                label="Bio" 
                value={formData.bio} 
                onChange={(value) => handleFieldChange('bio', value)}
              />
              
              <EditableField 
                label="Location" 
                value={formData.location} 
                onChange={(value) => handleFieldChange('location', value)}
              />
              
              <EditableField 
                label="Phone" 
                value={formData.phone} 
                onChange={(value) => handleFieldChange('phone', value)}
                type="tel"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
