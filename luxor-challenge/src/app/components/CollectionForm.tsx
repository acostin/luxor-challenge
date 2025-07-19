"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography
} from '@mui/material';
import { theme, styleHelpers } from '../theme/theme';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Collection {
  id?: number;
  name: string;
  description: string;
  stocks: number;
  price: number;
  ownerId: number;
}

interface CollectionFormProps {
  open: boolean;
  onClose: () => void;
  collection?: Collection | null;
  users: User[];
  currentUserId?: number;
  onSave: (data: Partial<Collection>) => Promise<void>;
}

export default function CollectionForm({ open, onClose, collection, users, currentUserId, onSave }: CollectionFormProps) {
  const [formData, setFormData] = useState({
    name: '', description: '', stocks: 0, price: 0, ownerId: collection?.ownerId || 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const isEditing = !!collection;

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description,
        stocks: collection.stocks,
        price: collection.price,
        ownerId: collection.ownerId
      });
    } else {
      setFormData({
        name: '', description: '', stocks: 0, price: 0,
        ownerId: currentUserId || (users.length > 0 ? users[0].id : 0)
      });
    }
  }, [collection, users, currentUserId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.stocks < 1) newErrors.stocks = 'Stocks must be at least 1';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!isEditing && !formData.ownerId) newErrors.ownerId = 'Owner is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Collection, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const renderTextField = (field: keyof Collection, label: string, type = 'text', multiline = false, rows = 1) => (
    <TextField
      fullWidth
      label={label}
      type={type}
      value={formData[field as keyof typeof formData]}
      onChange={(e) => handleChange(field, type === 'number' ? 
        (field === 'stocks' ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0) : 
        e.target.value)}
      error={!!errors[field]}
      helperText={errors[field]}
      multiline={multiline}
      rows={rows}
      sx={{ mb: 2 }}
      InputProps={{ sx: styleHelpers.getInputStyles() }}
      InputLabelProps={{ sx: { color: theme.colors.primary.main } }}
      FormHelperTextProps={{ sx: { color: theme.colors.status.error } }}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={theme.components.dialog.title}>
        {isEditing ? 'Edit Collection' : 'Create New Collection'}
      </DialogTitle>
      <DialogContent sx={theme.components.dialog.content}>
        <Box sx={{ pt: 1 }}>
          {renderTextField('name', 'Name')}
          {renderTextField('description', 'Description', 'text', true, 3)}
          {renderTextField('stocks', 'Stocks', 'number')}
          {renderTextField('price', 'Price', 'number')}
          
          {!isEditing && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: theme.colors.background.main, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: theme.colors.primary.main, fontWeight: 500 }}>
                Collection will be owned by: {users.find(u => u.id === formData.ownerId)?.name || 'Unknown User'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={theme.components.dialog.actions}>
        <Button onClick={onClose} disabled={loading} sx={styleHelpers.getButtonStyles('text')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={styleHelpers.getButtonStyles('primary')}>
          {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 