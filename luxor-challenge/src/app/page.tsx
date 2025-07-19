'use client';

import React, { useState, useEffect } from 'react';
import { theme, styleHelpers } from './theme/theme';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, CircularProgress, FormControl, InputLabel, Select, MenuItem, Tooltip,
  Snackbar, Alert, TablePagination
} from '@mui/material';
import {
  Collections as CollectionsIcon, Person as PersonIcon, Add as AddIcon, Edit as EditIcon,
  Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, CheckCircle as AcceptIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import CollectionForm from './components/CollectionForm';
import BidForm from './components/BidForm';
import BidEditForm from './components/BidEditForm';
import CollectionDetailsModal from './components/CollectionDetailsModal';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Bid {
  id: number;
  price: number;
  status: 'pending' | 'accepted' | 'rejected';
  user: User;
  userId: number;
  createdAt: string;
}

interface Collection {
  id: number;
  name: string;
  description: string;
  stocks: number;
  price: number;
  owner: User;
  ownerId: number;
  bidCount?: number;
  bids?: Bid[];
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Home() {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<string>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<Set<number>>(new Set());
  const [loadingBids, setLoadingBids] = useState<Set<number>>(new Set());
  const [collectionFormOpen, setCollectionFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [bidFormOpen, setBidFormOpen] = useState(false);
  const [bidEditFormOpen, setBidEditFormOpen] = useState(false);
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionDetailsOpen, setCollectionDetailsOpen] = useState(false);
  const [selectedCollectionForDetails, setSelectedCollectionForDetails] = useState<Collection | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  // Computed values
  const totalCollections = paginationInfo?.total || collections.length;
  const totalValue = collections.reduce((sum, c) => sum + c.price, 0);
  const totalBids = collections.reduce((sum, c) => sum + (c.bidCount || 0), 0);

  // Effects
  useEffect(() => {
    const savedUser = localStorage.getItem('selectedUser');
    if (savedUser) setSelectedUser(Number(savedUser));
    fetchUsers();
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedUser) localStorage.setItem('selectedUser', selectedUser.toString());
  }, [selectedUser]);

  useEffect(() => {
    fetchCollections();
  }, [page, rowsPerPage, orderBy, order]);

  // API calls
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showNotification('Failed to fetch users', 'error');
    }
  };

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        sortBy: orderBy,
        sortOrder: order
      });
      const response = await fetch(`/api/collections?${params}`);
      const data = await response.json();
      setCollections(data.collections);
      setPaginationInfo(data.pagination);
    } catch (error) {
      showNotification('Failed to fetch collections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async (collectionId: number) => {
    setLoadingBids(prev => new Set(prev).add(collectionId));
    try {
      const response = await fetch(`/api/bids?collection_id=${collectionId}`);
      const data = await response.json();
      const bids = data.bids || [];
      setCollections(prev => prev.map(c => 
        c.id === collectionId ? { ...c, bids } : c
      ));
    } catch (error) {
      showNotification('Failed to fetch bids', 'error');
    } finally {
      setLoadingBids(prev => {
        const newSet = new Set(prev);
        newSet.delete(collectionId);
        return newSet;
      });
    }
  };

  const refreshExpandedBids = async () => {
    const expandedIds = Array.from(expandedCollections);
    for (const collectionId of expandedIds) {
      await fetchBids(collectionId);
    }
  };

  // Event handlers
  const updateSelectedUser = (userId: number) => setSelectedUser(userId);
  const showNotification = (message: string, severity: any = 'success') => 
    setSnackbar({ open: true, message, severity });

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage + 1);
  const handleTableRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const toggleBidExpansion = (collectionId: number) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId);
    } else {
      newExpanded.add(collectionId);
      fetchBids(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  const openCollectionForm = (collection?: Collection) => {
    setEditingCollection(collection || null);
    setCollectionFormOpen(true);
  };

  const openBidForm = (collection: Collection) => {
    setSelectedCollection(collection);
    setBidFormOpen(true);
  };

  const openBidEditForm = (bid: Bid, collection: Collection) => {
    setEditingBid(bid);
    setSelectedCollection(collection);
    setBidEditFormOpen(true);
  };

  const openCollectionDetails = (collection: Collection) => {
    setSelectedCollectionForDetails(collection);
    setCollectionDetailsOpen(true);
  };

  // CRUD operations
  const handleSaveCollection = async (data: Partial<Collection>) => {
    try {
      const method = editingCollection ? 'PUT' : 'POST';
      const requestData = editingCollection ? { ...data, id: editingCollection.id } : data;
      const response = await fetch('/api/collections', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (response.ok) {
        showNotification(`Collection ${editingCollection ? 'updated' : 'created'} successfully`);
        setCollectionFormOpen(false);
        // Refresh collections and then refresh bids for expanded collections
        await fetchCollections();
        await refreshExpandedBids();
      }
    } catch (error) {
      showNotification('Failed to save collection', 'error');
    }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      const response = await fetch('/api/collections', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        showNotification('Collection deleted successfully');
        // Refresh collections and then refresh bids for expanded collections
        await fetchCollections();
        await refreshExpandedBids();
      }
    } catch (error) {
      showNotification('Failed to delete collection', 'error');
    }
  };

  const handleSaveBid = async (data: Partial<Bid>) => {
    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        showNotification('Bid placed successfully');
        setBidFormOpen(false);
        // Refresh collections and then refresh bids for expanded collections
        await fetchCollections();
        await refreshExpandedBids();
      }
    } catch (error) {
      showNotification('Failed to place bid', 'error');
    }
  };

  const handleEditBid = async (bidId: number, newPrice: number) => {
    try {
      const response = await fetch('/api/bids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bidId, price: newPrice })
      });
      if (response.ok) {
        showNotification('Bid updated successfully');
        setBidEditFormOpen(false);
        // Refresh collections and then refresh bids for expanded collections
        await fetchCollections();
        await refreshExpandedBids();
      }
    } catch (error) {
      showNotification('Failed to update bid', 'error');
    }
  };

  const handleDeleteBid = async (id: number) => {
    try {
      const response = await fetch('/api/bids', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        showNotification('Bid deleted successfully');
        // Refresh collections and then refresh bids for expanded collections
        await fetchCollections();
        await refreshExpandedBids();
      }
    } catch (error) {
      showNotification('Failed to delete bid', 'error');
    }
  };

  const handleAcceptBid = async (id: number) => {
    try {
      const response = await fetch('/api/bids/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId: id })
      });
      if (response.ok) {
        showNotification('Bid accepted successfully');
        // Refresh collections and then refresh bids for expanded collections
        await fetchCollections();
        await refreshExpandedBids();
      }
    } catch (error) {
      showNotification('Failed to accept bid', 'error');
    }
  };

  const handleRejectBid = async (id: number) => {
    try {
      const response = await fetch('/api/bids/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId: id })
      });
      if (response.ok) {
        showNotification('Bid rejected successfully');
        // Refresh collections and then refresh bids for expanded collections
        await fetchCollections();
        await refreshExpandedBids();
      }
    } catch (error) {
      showNotification('Failed to reject bid', 'error');
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStockColor = (stocks: number) => stocks > 50 ? 'success' : stocks > 20 ? 'warning' : 'error';

  const renderSortableHeader = (field: string, label: string) => (
    <TableCell 
      sx={styleHelpers.getTableHeaderStyles()}
      onClick={() => handleRequestSort(field)}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <span>{label}</span>
        <Box component="span" sx={{ ml: 1, opacity: orderBy === field ? 1 : 0.3 }}>
          {orderBy === field ? (order === 'desc' ? '↓' : '↑') : '↕'}
        </Box>
      </Box>
    </TableCell>
  );

  const renderBidRow = (bid: Bid, collection: Collection, isOwner: boolean) => (
    <TableRow key={`bid-${bid.id}`} sx={{ backgroundColor: '#3d3d3d' }}>
      <TableCell sx={{ py: 1, pl: 4, borderBottom: '1px solid #555' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" sx={{ color: '#ccc' }}>Bid by:</Typography>
          <Box display="flex" alignItems="center">
            <PersonIcon sx={{ mr: 0.5, fontSize: 14, color: '#d4af37' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#d4af37' }}>
              {bid.user?.name || bid.userId}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell sx={{ py: 1, borderBottom: '1px solid #555' }}>
        <Typography variant="body2" sx={{ color: '#ccc' }}>Bid on {collection.name}</Typography>
      </TableCell>
      <TableCell sx={{ py: 1, borderBottom: '1px solid #555' }}>
        <Typography variant="body2" sx={{ color: '#ccc' }}>-</Typography>
      </TableCell>
      <TableCell sx={{ py: 1, borderBottom: '1px solid #555' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#4caf50' }}>
          ${bid.price.toFixed(0)}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1, borderBottom: '1px solid #555' }}>
        <Typography variant="body2" sx={{ color: '#ccc' }}>-</Typography>
      </TableCell>
      <TableCell sx={{ py: 1, borderBottom: '1px solid #555' }}>
        <Chip
          label={bid.status}
          color={getStatusColor(bid.status) as any}
          size="small"
          sx={{ 
            height: 20, 
            fontSize: '0.7rem', 
            fontWeight: 600,
            ...(bid.status === 'pending' && {
              backgroundColor: '#d4af37',
              color: '#1a1a1a',
            })
          }}
        />
      </TableCell>
      <TableCell sx={{ py: 1, borderBottom: '1px solid #555' }}>
        {isOwner && bid.status === 'pending' ? (
          <Box display="flex" gap={0.5}>
            <Tooltip title={collection.stocks > 0 ? "Accept bid" : "Out of stock"}>
              <span>
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleAcceptBid(bid.id)}
                  disabled={collection.stocks <= 0}
                  sx={{ p: 0.5 }}
                >
                  <AcceptIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Reject bid">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRejectBid(bid.id)}
                sx={{ p: 0.5 }}
              >
                <RejectIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : bid.userId === selectedUser && bid.status === 'pending' ? (
          <Box display="flex" gap={0.5}>
            <Tooltip title="Edit bid">
              <IconButton
                size="small"
                color="primary"
                onClick={() => openBidEditForm(bid, collection)}
                sx={{ p: 0.5, color: '#d4af37' }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete bid">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteBid(bid.id)}
                sx={{ p: 0.5 }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: '#ccc' }}>-</Typography>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: theme.colors.background.main, minHeight: '100vh' }}>
      <Box sx={theme.components.header}>
        <Box sx={theme.components.layout.headerContainer}>
          <CollectionsIcon sx={{ ...styleHelpers.getIconStyles('small'), color: theme.colors.primary.main }} />
          <Typography variant="h1" sx={{ flexGrow: 1, ...styleHelpers.getTypographyStyles('heading'), fontSize: '1.5rem' }}>
            Luxor Bidding System
          </Typography>
          <FormControl size="small" sx={theme.components.layout.formControl}>
            <InputLabel sx={{ color: theme.colors.primary.main }}>Mock User</InputLabel>
            <Select
              value={selectedUser ?? ''}
              label="Mock User"
              onChange={(e) => updateSelectedUser(Number(e.target.value))}
              sx={styleHelpers.getInputStyles()}
            >
              {users
                .sort((a, b) => {
                  // Extract numeric part from user names (e.g., "User 1" -> 1, "User 10" -> 10)
                  const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0');
                  const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0');
                  return aNum - bNum;
                })
                .map((user) => (
                <MenuItem key={user.id} value={user.id} sx={{ 
                  color: theme.colors.text.dark,
                  backgroundColor: theme.colors.text.white,
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  '&.Mui-selected': {
                    backgroundColor: theme.colors.primary.main,
                    color: theme.colors.text.dark,
                    '&:hover': { backgroundColor: theme.colors.primary.light }
                  }
                }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openCollectionForm()}
            size="small"
            sx={styleHelpers.getButtonStyles('primary')}
          >
            New Collection
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={theme.components.layout.container}>
        {/* Stats */}
        <Box sx={theme.components.layout.statsContainer}>
          {[
            { value: totalCollections, label: 'Collections' },
            { value: `$${totalValue.toFixed(0)}`, label: 'Total Value' },
            { value: totalBids, label: 'Total Bids' },
            { value: users.length, label: 'Users' }
          ].map((stat, index) => (
            <Paper key={index} sx={theme.components.paper.stats}>
              <Typography variant="h5" sx={styleHelpers.getTypographyStyles('heading')}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={styleHelpers.getTypographyStyles('body')}>
                {stat.label}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Table */}
        <Typography variant="h6" sx={{ ...styleHelpers.getTypographyStyles('heading'), mb: 2 }}>
          Collections ({totalCollections})
        </Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: theme.colors.background.secondary }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {renderSortableHeader('name', 'Name')}
                  <TableCell sx={styleHelpers.getTableHeaderStyles()}>
                    Description
                  </TableCell>
                  {renderSortableHeader('stocks', 'Stock')}
                  {renderSortableHeader('price', 'Price')}
                  {renderSortableHeader('owner', 'Owner')}
                  <TableCell sx={styleHelpers.getTableHeaderStyles()}>
                    Bids
                  </TableCell>
                  <TableCell sx={styleHelpers.getTableHeaderStyles()}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && collections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, backgroundColor: '#2d2d2d' }}>
                      <CircularProgress size={40} sx={{ color: '#d4af37' }} />
                    </TableCell>
                  </TableRow>
                ) : (
                  collections.map((collection) => {
                    const isOwner = selectedUser === collection.ownerId;
                    const bids = Array.isArray(collection.bids) ? collection.bids : [];
                    const hasBid = bids.some(bid => bid.userId === selectedUser);
                    
                    return (
                      <React.Fragment key={collection.id}>
                        <TableRow hover sx={styleHelpers.getTableRowStyles()}>
                          <TableCell 
                            sx={{ 
                              fontWeight: 600, 
                              py: 1.5, 
                              color: theme.colors.primary.main, 
                              borderBottom: `1px solid ${theme.colors.border.primary}`,
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: theme.colors.primary.light
                              }
                            }}
                            onClick={() => openCollectionDetails(collection)}
                          >
                            {collection.name}
                          </TableCell>
                          <TableCell sx={{ py: 1.5, maxWidth: 200, borderBottom: '1px solid #444' }}>
                            <Typography variant="body2" noWrap sx={{ color: '#ccc' }}>
                              {collection.description}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #444' }}>
                            <Chip 
                              label={collection.stocks} 
                              color={getStockColor(collection.stocks) as any}
                              size="small"
                              sx={{ height: 24, fontSize: '0.8rem', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#4caf50', py: 1.5, borderBottom: '1px solid #444' }}>
                            ${collection.price.toFixed(0)}
                          </TableCell>
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #444' }}>
                            <Box display="flex" alignItems="center">
                              <PersonIcon sx={{ mr: 1, fontSize: 16, color: '#d4af37' }} />
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#d4af37' }}>
                                {collection.owner.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #444' }}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip 
                                label={collection.bidCount || bids.length} 
                                sx={{ 
                                  height: 24, 
                                  fontSize: '0.8rem', 
                                  fontWeight: 600,
                                  backgroundColor: '#d4af37',
                                  color: '#1a1a1a'
                                }}
                                size="small"
                              />
                              {bids.filter(b => b.status === 'accepted').length > 0 && (
                                <Chip 
                                  label="✓" 
                                  color="success" 
                                  size="small"
                                  sx={{ height: 24, fontSize: '0.8rem', fontWeight: 600 }}
                                />
                              )}
                              {(collection.bidCount || bids.length) > 0 && (
                                <Tooltip title={expandedCollections.has(collection.id) ? "Collapse bids" : "Expand bids"}>
                                  <IconButton
                                    size="small"
                                    onClick={() => toggleBidExpansion(collection.id)}
                                    disabled={loadingBids.has(collection.id)}
                                    sx={{ 
                                      p: 0.5,
                                      transform: expandedCollections.has(collection.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                                      transition: 'transform 0.2s',
                                      color: expandedCollections.has(collection.id) ? '#d4af37' : '#ccc'
                                    }}
                                  >
                                    {loadingBids.has(collection.id) ? (
                                      <CircularProgress size={16} sx={{ color: '#d4af37' }} />
                                    ) : (
                                      <ExpandMoreIcon sx={{ fontSize: 18 }} />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1.5, borderBottom: '1px solid #444' }}>
                            <Box display="flex" gap={0.5}>
                              {isOwner ? (
                                <>
                                  <Tooltip title="Edit collection">
                                    <IconButton
                                      size="small"
                                      onClick={() => openCollectionForm(collection)}
                                      sx={{ p: 0.5, color: '#d4af37' }}
                                    >
                                      <EditIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete collection">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteCollection(collection.id)}
                                      sx={{ p: 0.5 }}
                                    >
                                      <DeleteIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : !hasBid ? (
                                <Tooltip title="Place bid">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => openBidForm(collection)}
                                    sx={{ 
                                      fontSize: '0.75rem', 
                                      py: 0.5, 
                                      px: 1.5,
                                      borderColor: '#d4af37',
                                      color: '#d4af37',
                                      '&:hover': {
                                        borderColor: '#e6c547',
                                        color: '#e6c547',
                                      }
                                    }}
                                  >
                                    Bid
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Chip 
                                  label="Bid Placed" 
                                  sx={{ 
                                    height: 24, 
                                    fontSize: '0.75rem', 
                                    fontWeight: 600,
                                    backgroundColor: '#d4af37',
                                    color: '#1a1a1a'
                                  }} 
                                  size="small"
                                />
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                        
                        {/* Nested bid rows */}
                        {expandedCollections.has(collection.id) && (
                          <>
                            {loadingBids.has(collection.id) ? (
                              <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3, backgroundColor: '#3d3d3d' }}>
                                  <CircularProgress size={24} sx={{ color: '#d4af37' }} />
                                  <Typography variant="body2" sx={{ mt: 1, color: '#ccc' }}>
                                    Loading bids...
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : bids.length > 0 ? (
                              bids.map((bid) => renderBidRow(bid, collection, isOwner))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3, backgroundColor: '#3d3d3d' }}>
                                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                                    No bids found
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={paginationInfo?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleTableRowsPerPageChange}
            sx={theme.components.pagination}
          />
        </Paper>
      </Container>

      {/* Modals */}
      <CollectionForm
        open={collectionFormOpen}
        onClose={() => setCollectionFormOpen(false)}
        onSave={handleSaveCollection}
        collection={editingCollection}
        users={users}
        currentUserId={selectedUser || undefined}
      />

      {selectedCollection && (
        <BidForm
          open={bidFormOpen}
          onClose={() => setBidFormOpen(false)}
          collection={selectedCollection}
          userId={selectedUser || 0}
          onSave={handleSaveBid}
        />
      )}

      {editingBid && selectedCollection && (
        <BidEditForm
          open={bidEditFormOpen}
          onClose={() => setBidEditFormOpen(false)}
          bid={editingBid}
          collection={selectedCollection}
          onSave={handleEditBid}
        />
      )}

      <CollectionDetailsModal
        open={collectionDetailsOpen}
        onClose={() => setCollectionDetailsOpen(false)}
        collection={selectedCollectionForDetails}
      />

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            backgroundColor: styleHelpers.getSnackbarColor(snackbar.severity),
            color: theme.colors.text.white,
            fontWeight: 500,
            '& .MuiAlert-icon, & .MuiAlert-message, & .MuiAlert-action': {
              color: theme.colors.text.white
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
