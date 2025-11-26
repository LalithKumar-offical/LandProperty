import { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slice/authSlice";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

interface LoginFormProps {
  open: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const LoginPage = ({ open, onClose, onSwitchToSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await loginUser({ email, password });

      // Check if login was successful
      if (!data.Success) {
        toast.error(data.Message || "Invalid email or password");
        return;
      }

      const user = data?.User || data?.user;

      if (!user) {
        toast.error("Login failed: No user returned");
        return;
      }

      dispatch(loginSuccess(user));

      if (user.Role === "Admin") navigate("/admin/dashboard");
      else if (user.Role === "PropertyOwner") navigate("/owner/homes");
      else navigate("/user/homes");

      onClose();
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          overflow: 'hidden',
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '100vh', sm: '90vh' },
          width: { xs: '100%', sm: '500px' },
          maxWidth: { xs: '100%', sm: '500px' }
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Grid container sx={{ minHeight: { xs: '100vh', sm: '450px' } }}>
         
          <Grid size={{ xs: 12, sm: 0 }} sx={{ display: 'none' }}>
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
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <LoginIcon sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" mb={2}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Sign in to access your account and explore premium properties.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <Box sx={{ 
              p: { xs: 3, sm: 4 }, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Box sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', mb: 4 }}>
                <LoginIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold" mb={1}>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to your account
                </Typography>
              </Box>

              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" mb={1}>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to your account
                </Typography>
              </Box>

              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  width: '100%',
                  maxWidth: '350px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

    <TextField
  label="Password"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
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
          data-testid="toggle-password"   // 🔥 REQUIRED FOR TEST TO PASS
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
  sx={{
    mb: { xs: 3, sm: 4 },
    width: "100%",
    maxWidth: "350px",
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
  }}
/>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  py: { xs: 1.2, sm: 1.5 },
                  width: '100%',
                  maxWidth: '350px',
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
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Button 
                    variant="text" 
                    onClick={onSwitchToSignUp}
                    sx={{ 
                      textTransform: "none",
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPage;
