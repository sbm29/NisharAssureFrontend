
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Save, Check } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  type?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  editable = true,
  type = 'text'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  
  const handleEdit = () => {
    if (!editable) return;
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    onChange(fieldValue);
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        {editable && (
          isEditing ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSave} 
              className="h-7 w-7 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEdit} 
              className="h-7 w-7 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
      
      {isEditing ? (
        <Input
          type={type}
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="max-w-full"
        />
      ) : (
        <div className="text-base font-medium">{value || <span className="text-muted-foreground italic">Not provided</span>}</div>
      )}
    </div>
  );
};

export default EditableField;
