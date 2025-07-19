import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, Paper
} from '@mui/material';
import {
  Collections as CollectionsIcon, Person as PersonIcon, AttachMoney as MoneyIcon,
  Inventory as InventoryIcon, Description as DescriptionIcon, CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface CollectionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  collection: any;
}

export default function CollectionDetailsModal({ open, onClose, collection }: CollectionDetailsModalProps) {
  if (!collection) return null;
  
  const bids = Array.isArray(collection.bids) ? collection.bids : [];

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  const getStatusColor = (status: string) => 
    status === 'accepted' ? 'success' : status === 'rejected' ? 'error' : 'default';

  const getStockColor = (stocks: number) => 
    stocks > 50 ? 'success' : stocks > 20 ? 'warning' : 'error';

  const renderInfoSection = (icon: React.ReactNode, title: string, children: React.ReactNode) => (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" sx={{ color: '#d4af37', fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );

  const renderStatBox = (icon: React.ReactNode, title: string, value: React.ReactNode, subtitle?: string) => (
    <Box sx={{ minWidth: 200 }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" sx={{ color: '#d4af37', fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {value}
      {subtitle && (
        <Typography variant="body2" sx={{ color: '#ccc', mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  const renderBidItem = (bid: any) => (
    <Box key={bid.id} sx={{ 
      p: 2, mb: 1, backgroundColor: '#2d2d2d', borderRadius: 1, border: '1px solid #555'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
            <strong>Bid by:</strong> {bid.user?.name || `User ${bid.userId}`}
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc', fontSize: '0.8rem' }}>
            {formatDate(bid.createdAt)}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 700, fontSize: '1.1rem' }}>
            ${bid.price.toFixed(0)}
          </Typography>
          <Chip
            label={bid.status}
            color={getStatusColor(bid.status) as any}
            size="small"
            sx={{ 
              height: 20, fontSize: '0.7rem', fontWeight: 600,
              ...(bid.status === 'pending' && { backgroundColor: '#d4af37', color: '#1a1a1a' })
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  const paperStyle = { 
    p: 3, backgroundColor: '#1a1a1a', borderRadius: 2, border: '1px solid #444'
  };

  const iconStyle = { color: '#d4af37', fontSize: 20 };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { backgroundColor: '#2d2d2d', borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' } }}>
      
      <DialogTitle sx={{ 
        backgroundColor: '#1a1a1a', color: '#d4af37', borderBottom: '2px solid #d4af37',
        display: 'flex', alignItems: 'center', gap: 2
      }}>
        <CollectionsIcon sx={{ fontSize: 28, color: '#d4af37' }} />
        <Typography variant="h2" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>{collection.name}</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Main Info */}
          <Paper sx={paperStyle}>
            <Typography variant="h5" sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
              Collection Information
            </Typography>
            
            {renderInfoSection(
              <DescriptionIcon sx={iconStyle} />,
              'Description',
              <Typography variant="body1" sx={{ color: '#ccc', lineHeight: 1.6 }}>
                {collection.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {renderStatBox(
                <MoneyIcon sx={{ color: '#4caf50', fontSize: 20 }} />,
                'Price',
                              <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700, fontSize: '1.5rem' }}>
                ${collection.price.toFixed(0)}
              </Typography>
              )}

              {renderStatBox(
                <InventoryIcon sx={iconStyle} />,
                'Available Stock',
                <Chip 
                  label={collection.stocks} 
                  color={getStockColor(collection.stocks) as any}
                  size="medium"
                  sx={{ height: 32, fontSize: '1rem', fontWeight: 700, minWidth: 60 }}
                />
              )}
            </Box>
          </Paper>

          {/* Owner and Bids Summary */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Paper sx={{ ...paperStyle, flex: 1, minWidth: 250 }}>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <PersonIcon sx={{ color: '#d4af37', fontSize: 24 }} />
                <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 600 }}>Owner</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 600 }}>
                {collection.owner.name}
              </Typography>
            </Paper>

            <Paper sx={{ ...paperStyle, flex: 1, minWidth: 250 }}>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <CalendarIcon sx={{ color: '#d4af37', fontSize: 24 }} />
                <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 600 }}>Bids Summary</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 600, mb: 1 }}>
                {collection.bidCount || bids.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#ccc' }}>Total bids received</Typography>
              {bids.filter((b: any) => b.status === 'accepted').length > 0 && (
                <Chip label="Has Accepted Bid" color="success" size="small" sx={{ mt: 1, height: 24, fontSize: '0.75rem' }} />
              )}
            </Paper>
          </Box>

          {/* Bids List */}
          {bids.length > 0 && (
            <Paper sx={paperStyle}>
              <Typography variant="h5" sx={{ color: '#d4af37', mb: 2, fontWeight: 600 }}>
                Recent Bids
              </Typography>
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {bids
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map(renderBidItem)}
              </Box>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: '#1a1a1a', p: 2, borderTop: '1px solid #444' }}>
        <Button onClick={onClose} variant="outlined" sx={{ 
          borderColor: '#d4af37', color: '#d4af37',
          '&:hover': { borderColor: '#e6c547', color: '#e6c547' }
        }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 