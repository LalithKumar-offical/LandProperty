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
import OwnerNavbar from '../../components/OwnerNavbar';
import { formatCurrencyWithText } from '../../utils/currencyFormatter';

import { fetchAllProperties } from '../../slice/propertiesSlice';
import { fetchProfile, updateProfile } from '../../slice/profileSlice';
import { toast } from 'react-toastify';

import type { RootState, AppDispatch } from '../../slice/store';

const OwnerProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { homes, lands } = useSelector((state: RootState) => state.properties);
  const { profile: ownerProfile, loading: profileLoading } = useSelector((state: RootState) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhoneNo: ''
  });

  useEffect(() => {
    const userId = user?.userId || user?.UserId || user?.id || user?.Id;
    if (userId) {
      // Only fetch profile if not already loaded
      if (!ownerProfile) {
        dispatch(fetchProfile(userId));
      }
      
      // Only fetch if store is empty
      if (homes.length === 0 && lands.length === 0) {
        dispatch(fetchAllProperties());
      }
    }
  }, [user, dispatch, ownerProfile, homes.length, lands.length]);

  useEffect(() => {
    if (ownerProfile) {
      setFormData({
        userName: ownerProfile.UserName || '',
        userEmail: ownerProfile.UserEmail || '',
        userPhoneNo: ownerProfile.UserPhoneNo || ''
      });
    }
  }, [ownerProfile]);

  const handleUpdate = async () => {
    const userId = user?.userId || user?.UserId || user?.id || user?.Id;
    if (!userId) return;
    
    try {
      await dispatch(updateProfile({
        userId,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhoneNo: formData.userPhoneNo
      }));
      
      setIsEditing(false); 
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <>
      <OwnerNavbar />
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          My Profile
        </Typography>
        
        {ownerProfile ? (
          <Grid container spacing={3}>
            {/* Profile Header */}
            <Grid size={12}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {ownerProfile.UserName || 'Property Owner'}
                  </Typography>
                  <Chip 
                    label={ownerProfile.RoleName || 'Property Owner'} 
                    color="primary" 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Button
                  variant={isEditing ? 'outlined' : 'contained'}
                  startIcon={isEditing ? <Cancel /> : <Edit />}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Paper>
            </Grid>

            {/* Contact Information */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {!isEditing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Person color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Name</Typography>
                          <Typography variant="body1">{ownerProfile.UserName || 'N/A'}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Email color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Email</Typography>
                          <Typography variant="body1">{ownerProfile.UserEmail || 'N/A'}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Phone color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Phone</Typography>
                          <Typography variant="body1">{ownerProfile.UserPhoneNo || 'N/A'}</Typography>
                        </Box>
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
                          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                      <TextField
                        label="Email"
                        type="email"
                        value={formData.userEmail}
                        onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                        fullWidth
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                      <TextField
                        label="Phone"
                        value={formData.userPhoneNo}
                        onChange={(e) => setFormData({...formData, userPhoneNo: e.target.value})}
                        fullWidth
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleUpdate}
                        sx={{ mt: 2 }}
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
              <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AccountBalance /> Account Balance
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatCurrencyWithText(ownerProfile.UserBalance)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Available for transactions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>{profileLoading ? 'Loading profile...' : 'No profile data'}</Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default OwnerProfilePage;
