import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import EditUser from './EditUser';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Fetch users function
const fetchUsers = async (searchName = '') => {
  let url = `${API_BASE_URL}/users`;
  if (searchName.trim()) {
    url += `?name=${encodeURIComponent(searchName)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

// Delete user function
const deleteUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
};

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const queryClient = useQueryClient();

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users query with debounced search term
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', debouncedSearchTerm],
    queryFn: () => fetchUsers(debouncedSearchTerm),
    enabled: true,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Use users directly since filtering is done server-side
  const filteredUsers = users;
  
  // Calculate pagination
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditUser(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading users: {error.message}
        <Button onClick={() => refetch()} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'primary.main' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'primary.main',
                borderWidth: 2,
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
              },
            },
            '& .MuiInputBase-input': {
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px' }}>User</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px' }}>Company</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.5px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(99, 102, 241, 0.08)',
                        transform: 'translateX(4px)',
                        transition: 'all 0.3s ease-in-out',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: 'rgba(248, 250, 252, 0.5)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ 
                          bgcolor: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
                          width: 45, 
                          height: 45,
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Box sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem' }}>
                            {user.name}
                          </Box>
                          <Chip 
                            label={`ID: ${user.id}`} 
                            size="small" 
                            variant="outlined" 
                            sx={{ 
                              mt: 0.5, 
                              fontSize: '0.75rem',
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.company?.name || 'No Company'} 
                        sx={{ 
                          background: user.company?.name ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(156, 163, 175, 0.2)',
                          color: user.company?.name ? 'white' : 'text.secondary',
                          fontWeight: 600,
                          borderRadius: 3,
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s ease-in-out',
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(user)}
                          sx={{ 
                            borderRadius: 3,
                            minWidth: 80,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                              color: 'white',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(user)}
                          disabled={deleteMutation.isPending}
                          sx={{ 
                            borderRadius: 3,
                            minWidth: 80,
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                              color: 'white',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                            },
                          }}
                        >
                          {deleteMutation.isPending && deleteMutation.variables === user.id
                            ? 'Deleting...'
                            : 'Delete'
                          }
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {filteredUsers.length === 0 && searchTerm && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No users found matching "{searchTerm}"
        </Alert>
      )}
      
      <EditUser
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        user={editUser}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            minWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.25rem',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon />
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <DialogContentText sx={{ 
            fontSize: '1rem',
            color: 'text.primary',
            fontWeight: 500,
            mb: 2,
            pt: 3
          }}>
            Are you sure you want to delete this user?
          </DialogContentText>
          {userToDelete && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {userToDelete.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {userToDelete.email}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ 
            color: 'text.secondary',
            mt: 2,
            fontStyle: 'italic'
          }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 100,
              borderColor: 'grey.400',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'grey.600',
                backgroundColor: 'grey.50',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 100,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              },
              '&:disabled': {
                background: 'rgba(156, 163, 175, 0.5)',
              }
            }}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;