import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  Stack,
  Typography,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Close as CloseIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';



const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Update user function
const updateUser = async ({ userId, userData }) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  
  return response.json();
};

const EditUser = ({ open, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const queryClient = useQueryClient();

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Show success message
      setShowSuccess(true);
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Close dialog after 1.5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    },
  });

  // Reset form when user changes or dialog opens
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return;
    }
    
    updateMutation.mutate({
      userId: user.id,
      userData: formData
    });
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      setShowSuccess(false);
      onClose();
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px 16px 0 0',
      }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon sx={{ fontSize: '1.5rem' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1.25rem', color: "white" }}>
              Edit User
            </Typography>
          </Box>
        <IconButton 
          onClick={handleClose} 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out'
          }}
          disabled={updateMutation.isPending}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <Stack spacing={3}>
            {showSuccess && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                User updated successfully!
              </Alert>
            )}
            
            {updateMutation.isError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                Error updating user: {updateMutation.error?.message}
              </Alert>
            )}
            
              <TextField
                name="name"
                label="Full Name"
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={updateMutation.isPending}
                error={!formData.name.trim() && formData.name !== ''}
                helperText={!formData.name.trim() && formData.name !== '' ? 'Name is required' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      transform: 'scale(1.02)',
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: 2,
                      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                    },
                  },
                }}
              />
            
              <TextField
                name="email"
                label="Email Address"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                disabled={updateMutation.isPending}
                error={formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
                helperText={
                  formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                    ? 'Please enter a valid email address'
                    : ''
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                      transform: 'scale(1.02)',
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: 2,
                      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                    },
                  },
                }}
              />
          </Stack>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 4, pt: 0 }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button
              onClick={handleClose}
              disabled={updateMutation.isPending}
              startIcon={<CancelIcon />}
              variant="outlined"
              sx={{ 
                flex: 1,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: 'error.main',
                color: 'error.main',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!isFormValid || updateMutation.isPending}
              startIcon={updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ 
                flex: 1,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 12px 24px rgba(99, 102, 241, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(99, 102, 241, 0.5)',
                },
              }}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EditUser;