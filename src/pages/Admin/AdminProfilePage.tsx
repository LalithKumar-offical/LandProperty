import React, { useState, useEffect } from "react";
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
  Divider,
  CircularProgress
} from '@mui/material';
import { Person, Email, Phone, AccountBalance, Edit, Save, Cancel, AdminPanelSettings } from '@mui/icons-material';
import AdminNavbar from "../../components/AdminNavbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from '../../slice/store';
import { loginSuccess } from "../../slice/authSlice";
import { fetchProfile, updateProfile, checkUserChange } from "../../slice/profileSlice";
import { toast } from 'react-toastify';

const AdminProfilePage: React.FC = () => {
  const tokenUser = useSelector((s: RootState) => s.auth.user);
  const { profile, loading, initialized } = useSelector((s: RootState) => s.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const userId = tokenUser?.UserId;
    if (userId) {
      dispatch(checkUserChange(userId));
      if (!initialized && !loading) {
        dispatch(fetchProfile(userId));
      }
    } else {
      setUser(tokenUser);
      setFormData({
        name: tokenUser?.UserName || '',
        email: tokenUser?.UserEmail || '',
        phone: tokenUser?.UserPhoneNo || ''
      });
    }
  }, [dispatch, tokenUser, initialized, loading]);

  useEffect(() => {
    const currentUser = profile || tokenUser;
    setUser(currentUser);
    setFormData({
      name: currentUser?.UserName || '',
      email: currentUser?.UserEmail || '',
      phone: currentUser?.UserPhoneNo || ''
    });
  }, [profile, tokenUser]);

  const handleSave = async () => {
    try { 
      const userDto = {
        userId: user.UserId,
        userName: formData.name,
        userEmail: formData.email,
        userPhoneNo: formData.phone,
        userBalance: user.UserBalance,
        roleId: user.RoleId || (user.RoleName === 'Admin' ? 1 : user.RoleName === 'PropertyOwner' ? 2 : 3)
      };
   
      await dispatch(updateProfile(userDto)).unwrap();
    
      const updatedUser = {
        ...user,
        UserName: formData.name,
        UserEmail: formData.email,
        UserPhoneNo: formData.phone
      };
      
      dispatch(loginSuccess(updatedUser));
      setEditing(false);
      toast.success('Profile updated successfully!');
      
    } catch (error: any) {
      toast.error('Failed to update profile: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.UserName || '',
      email: user?.UserEmail || '',
      phone: user?.UserPhoneNo || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', bgcolor: '#f0f4f8', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Admin Profile
        </Typography>
        
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid size={12}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#e8f0f5', border: '1px solid #d1dce5' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'error.main' }}>
                <AdminPanelSettings sx={{ fontSize: 40 }} />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight="bold">
                  {user?.UserName || 'Administrator'}
                </Typography>
                <Chip 
                  label={user?.RoleName || user?.Role || 'Admin'} 
                  color="error" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ID: {user?.UserId}
                </Typography>
              </Box>
              <Button
                variant={editing ? 'outlined' : 'contained'}
                startIcon={editing ? <Cancel /> : <Edit />}
                onClick={() => editing ? handleCancel() : setEditing(true)}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ bgcolor: '#e8f0f5', border: '1px solid #d1dce5' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person /> Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {!editing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Person color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Name</Typography>
                        <Typography variant="body1">{user?.UserName || 'N/A'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Email color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{user?.UserEmail || 'N/A'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{user?.UserPhoneNo || 'Not provided'}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      fullWidth
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      fullWidth
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                    <TextField
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      fullWidth
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
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
            <Card sx={{ bgcolor: '#3b82f6', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AccountBalance /> Account Balance
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ₹{user?.UserBalance ?? 0}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  Admin account
                </Typography>
              </CardContent>
            </Card>
          </Grid>


        </Grid>
      </Box>
    </>
  );
};

export default AdminProfilePage;
