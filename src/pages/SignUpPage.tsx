import { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  AccountCircle,
  CheckCircle,
} from "@mui/icons-material";
import { addUser } from "../api/userApi";
import { useDispatch } from 'react-redux';
import { invalidateCache } from '../slice/dashboardSlice';
import type { AppDispatch } from '../slice/store';
import { toast } from 'react-toastify';

interface SignUpFormProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignUpPage = ({ open, onClose, onSwitchToLogin }: SignUpFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhoneNo: "",
    userPassword: "",
    confirmPassword: "",
    roleId: 3, // Default to User role
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = "Email is invalid";
    }

    if (!formData.userPhoneNo.trim()) {
      newErrors.userPhoneNo = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.userPhoneNo.replace(/\D/g, ""))) {
      newErrors.userPhoneNo = "Phone number must be 10 digits";
    }

    if (!formData.userPassword) {
      newErrors.userPassword = "Password is required";
    } else if (formData.userPassword.length < 6) {
      newErrors.userPassword = "Password must be at least 6 characters";
    }

    if (formData.userPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registrationData = {
        UserName: formData.userName,
        UserEmail: formData.userEmail,
        UserPhoneNo: formData.userPhoneNo,
        UserPassword: formData.userPassword,
        RoleId: formData.roleId
      };
      
      await addUser(registrationData);
      
      // Invalidate dashboard cache since user count changed
      dispatch(invalidateCache());
      
      toast.success("Registration successful! Please login with your credentials.");
      onClose();
      onSwitchToLogin();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, md: 3 },
          overflow: 'hidden',
          m: { xs: 0, md: 2 },
          maxHeight: { xs: '100vh', md: '90vh' },
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Grid container sx={{ minHeight: { xs: '100vh', md: '600px' } }}>
          {/* Left Side - Branding */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                p: 4,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3,
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <AccountCircle sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
                  Join Us Today
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6, textAlign: 'center', maxWidth: '300px' }}>
                  Create your account and start exploring premium properties.
                  Connect with property owners and find your dream home.
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 20 }} />
                  <Typography variant="body2" textAlign="center">Secure & Trusted Platform</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              height: '100%', 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: { xs: 'flex-start', md: 'center' }, 
              alignItems: 'center',
              pt: { xs: 2, sm: 3, md: 4 },
              overflow: 'auto'
            }}>
              {/* Mobile Header */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 2 }}>
                <AccountCircle sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" mb={1}>
                  Join Us Today
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your account
                </Typography>
              </Box>

              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 'auto' }}>

              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="h4" fontWeight="bold" mb={1} textAlign="center" sx={{ color: 'rgba(0,0,0,0.7)' }}>
                  Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
                  Fill in your details to get started
                </Typography>
              </Box>

              <TextField
                label="Full Name *"
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                error={!!errors.userName}
                helperText={errors.userName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: '320px', md: '350px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <TextField
                label="Email Address *"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange("userEmail", e.target.value)}
                error={!!errors.userEmail}
                helperText={errors.userEmail}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: '320px', md: '350px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <TextField
                label="Phone Number *"
                value={formData.userPhoneNo}
                onChange={(e) => handleInputChange("userPhoneNo", e.target.value)}
                error={!!errors.userPhoneNo}
                helperText={errors.userPhoneNo}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: '320px', md: '350px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <FormControl sx={{ mb: { xs: 1.5, sm: 2 }, width: { xs: '100%', sm: '320px', md: '350px' } }}>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.roleId}
                  label="Account Type"
                  onChange={(e) => handleInputChange("roleId", e.target.value as number)}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      User (Buyer)
                    </Box>
                  </MenuItem>
                  <MenuItem value={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircle fontSize="small" />
                      Property Owner (Seller)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Password *"
                type={showPassword ? "text" : "password"}
                value={formData.userPassword}
                onChange={(e) => handleInputChange("userPassword", e.target.value)}
                error={!!errors.userPassword}
                helperText={errors.userPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: '320px', md: '350px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <TextField
                label="Confirm Password *"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: { xs: 2, sm: 2.5 },
                  width: { xs: '100%', sm: '320px', md: '350px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  py: { xs: 1.2, sm: 1.5 },
                  width: { xs: '100%', sm: '320px', md: '350px' },
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  }
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ mb: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: '320px', md: '350px' } }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Button 
                    variant="text" 
                    onClick={onSwitchToLogin}
                    sx={{ 
                      textTransform: "none",
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpPage;
