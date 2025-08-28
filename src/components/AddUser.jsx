import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Add user function
const addUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add user');
  }
  
  return response.json();
};

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const queryClient = useQueryClient();

  // Add user mutation
  const addMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({ name: '', email: '' });
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

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
    
    addMutation.mutate(formData);
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              variant="outlined"
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
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
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
          
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={addMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              disabled={!isFormValid || addMutation.isPending}
              sx={{ 
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(99, 102, 241, 0.4)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
              }}
            >
              {addMutation.isPending ? 'Adding User...' : 'Add User'}
            </Button>
          
          {addMutation.isError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              Error adding user: {addMutation.error?.message}
            </Alert>
          )}
          
          {showSuccess && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              User added successfully!
            </Alert>
          )}
        </Stack>
      </Box>
  );
};

export default AddUser;