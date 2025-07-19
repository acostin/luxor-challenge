"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, InputAdornment
} from '@mui/material';

interface Collection {
  id: number;
  name: string;
  price: number;
  description: string;
  stocks: number;
}

interface Bid {
  id?: number;
  collectionId: number;
  price: number;
  userId: number;
}

interface BidFormProps {
  open: boolean;
  onClose: () => void;
  collection: Collection;
  userId: number;
  onSave: (bid: Bid) => void;
}

export default function BidForm({ open, onClose, collection, userId, onSave }: BidFormProps) {
  const [formData, setFormData] = useState<Bid>({
    collectionId: collection.id, price: collection.price, userId: userId
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({ collectionId: collection.id, price: collection.price, userId: userId });
    setErrors({});
  }, [collection, userId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.price < collection.price * 0.8) {
      newErrors.price = `Price should be at least 80% of collection price ($${collection.price * 0.8})`;
    }
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
      console.error('Error saving bid:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Bid, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const inputStyle = {
    color: '#d4af37',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e6c547' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#2d2d2d', color: '#d4af37' }}>
        Place Bid on {collection.name}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#2d2d2d', pt: 2 }}>
        <Box sx={{ pt: 1 }}>
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#1a1a1a', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#d4af37', mb: 1 }}>Collection Details:</Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
              <strong>Name:</strong> {collection.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
              <strong>Description:</strong> {collection.description}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
              <strong>Current Price:</strong> ${collection.price.toFixed(0)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              <strong>Available Stock:</strong> {collection.stocks}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            label="Bid Amount"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            error={!!errors.price}
            helperText={errors.price}
            InputProps={{
              startAdornment: <InputAdornment position="start" sx={{ color: '#d4af37' }}>$</InputAdornment>,
              sx: inputStyle
            }}
            InputLabelProps={{ sx: { color: '#d4af37' } }}
            FormHelperTextProps={{ sx: { color: '#ff6b6b' } }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#2d2d2d' }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: '#ccc' }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ 
          backgroundColor: '#d4af37', color: '#1a1a1a', '&:hover': { backgroundColor: '#e6c547' }
        }}>
          {loading ? 'Placing Bid...' : 'Place Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 