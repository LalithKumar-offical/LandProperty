import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import { Person, Email, Phone, AccountBalance, Edit, Save, Cancel } from '@mui/icons-material';
import { formatCurrencyWithText } from '../../utils/currencyFormatter';
import { fetchProfile, updateProfile, checkUserChange } from '../../slice/profileSlice';
import { toast } from 'react-toastify';

import UserNavbar from '../../components/UserNavbar';

import type { RootState, AppDispatch } from '../../slice/store';

const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, loading, initialized } = useSelector((state: RootState) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhoneNo: ''
  });

  useEffect(() => {
    const userId = user?.UserId || user?.userId;
    if (userId) {
      dispatch(checkUserChange(userId));
      if (!initialized && !loading) {
        dispatch(fetchProfile(userId));
      }
    }
  }, [dispatch, user, initialized, loading]);

  useEffect(() => {
    if (profile) {
      setFormData({
        userName: profile.UserName || '',
        userEmail: profile.UserEmail || '',
        userPhoneNo: profile.UserPhoneNo || ''
      });
    }
  }, [profile]);

  const handleUpdate = async () => {
    const userId = user?.UserId || user?.userId;
    if (!userId) return;
    
    try {
      await dispatch(updateProfile({
        userId,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhoneNo: formData.userPhoneNo
      })).unwrap();
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Box sx={{ bgcolor: '#E3F2FD', height: '100vh', overflow: 'hidden' }}>
      <UserNavbar />
      <Box sx={{ p: 3, width: '100%', boxSizing: 'border-box', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
          My Profile
        </Typography>
        
        {profile ? (
          <Grid container spacing={3} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Profile Header */}
            <Grid size={12}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#BBDEFB', border: '1px solid #90CAF9', borderRadius: 2 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'secondary.main' }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {profile.UserName || 'User'}
                  </Typography>
                  <Chip 
                    label={profile.RoleName || 'User'} 
                    color="secondary"
                    size="small"
                  />
                </Box>
                <Button
                  variant={isEditing ? 'outlined' : 'contained'}
                  startIcon={isEditing ? <Cancel /> : <Edit />}
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{ 
                    bgcolor: isEditing ? 'transparent' : '#90CAF9',
                    borderColor: '#90CAF9',
                    color: isEditing ? '#90CAF9' : 'white',
                    '&:hover': { bgcolor: isEditing ? 'rgba(21, 101, 192, 0.1)' : '#1976d2' }
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ bgcolor: '#BBDEFB', border: '1px solid #90CAF9', borderRadius: 2, height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {!isEditing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(144, 202, 249, 0.3)', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Person color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="bold">Name</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="500">{profile.UserName || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(144, 202, 249, 0.3)', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Email color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="bold">Email</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="500">{profile.UserEmail || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'rgba(144, 202, 249, 0.3)', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Phone color="primary" />
                          <Typography variant="body2" color="text.secondary" fontWeight="bold">Phone</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="500">{profile.UserPhoneNo || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Name"
                        value={formData.userName}
                        onChange={(e) => setFormData({...formData, userName: e.target.value})}
                        fullWidth
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: '#64b5f6' }} />
                        }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#e3f2fd' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: '#90CAF9' },
                            '&:hover fieldset': { borderColor: '#64b5f6' }
                          }
                        }}
                      />
                      <TextField
                        label="Email"
                        type="email"
                        value={formData.userEmail}
                        onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                        fullWidth
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: '#64b5f6' }} />
                        }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#e3f2fd' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: '#90CAF9' },
                            '&:hover fieldset': { borderColor: '#64b5f6' }
                          }
                        }}
                      />
                      <TextField
                        label="Phone"
                        value={formData.userPhoneNo}
                        onChange={(e) => setFormData({...formData, userPhoneNo: e.target.value})}
                        fullWidth
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: '#64b5f6' }} />
                        }}
                        sx={{ 
                          '& .MuiInputLabel-root': { color: '#e3f2fd' },
                          '& .MuiOutlinedInput-root': { 
                            color: 'white',
                            '& fieldset': { borderColor: '#3949ab' },
                            '&:hover fieldset': { borderColor: '#64b5f6' }
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleUpdate}
                        sx={{ 
                          mt: 2,
                          bgcolor: '#90CAF9',
                          '&:hover': { bgcolor: '#1976d2' }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Account Balance */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ bgcolor: '#42cef5ff', color: 'white', borderRadius: 2, height: 'fit-content' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
                    <AccountBalance /> Account Balance
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                    {formatCurrencyWithText(profile.UserBalance)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Available for bidding
                  </Typography>
                </CardContent>
              </Card>
            </Grid>


          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography variant="h6" color="text.secondary">Loading profile...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserProfilePage;
