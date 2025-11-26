import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

const LandingPage = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);
  const switchToSignUp = () => {
    setOpenLogin(false);
    setOpenSignUp(true);
  };
  const switchToLogin = () => {
    setOpenSignUp(false);
    setOpenLogin(true);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/landing-video.mp4" type="video/mp4" />
      </video>
      <Box
        sx={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          px: { xs: 2, sm: 4 },
        }}
      >
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          mb={2}
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textAlign: 'center'
          }}
        >
          Explore Premium Properties
        </Typography>

        <Typography 
          variant="h6" 
          mb={4}
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textAlign: 'center',
            px: { xs: 1, sm: 0 }
          }}
        >
          Luxury Homes | Land | Real Estate Deals
        </Typography>

        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '300px', sm: 'none' }
        }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleOpenLogin}
           onBlur={(e) => e.target.blur()}
            sx={{ 
              color: "white", 
              borderColor: "white",
              py: { xs: 1.5, sm: 1 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.1)"
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none'
              }
            }}
          >
            Login
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={handleOpenSignUp}
            onBlur={(e) => e.target.blur()}
            sx={{ 
              color: "white", 
              borderColor: "white",
              py: { xs: 1.5, sm: 1 },
              fontSize: { xs: '1.1rem', sm: '1rem' },
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255,255,255,0.1)"
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none'
              }
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

      <LoginPage open={openLogin} onClose={handleCloseLogin} onSwitchToSignUp={switchToSignUp} />
      <SignUpPage open={openSignUp} onClose={handleCloseSignUp} onSwitchToLogin={switchToLogin} />
    </Box>
  );
};

export default LandingPage;
