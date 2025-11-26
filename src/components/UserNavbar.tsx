import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import { logout } from "../slice/authSlice";
const UserNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <div style={brandStyle}>
        <div style={logoStyle}>🏠</div>
        <h2 style={titleStyle}>Property Explorer</h2>
      </div>

      <div style={linksContainerStyle}>
        <Link style={linkStyle} to="/user/homes" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}>Browse Homes</Link>
        <Link style={linkStyle} to="/user/lands" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}>Browse Lands</Link>
        <Link style={linkStyle} to="/user/bids" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}>
          My Bids
        </Link>
        <Link style={linkStyle} to="/user/profile" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}>Profile</Link>
        <button style={logoutBtnStyle} onClick={handleLogout} onFocus={(e) => e.target.style.transform = 'scale(1.05)'} onBlur={(e) => e.target.style.transform = 'scale(1)'}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  boxSizing: "border-box",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

const brandStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoStyle: React.CSSProperties = {
  fontSize: "2rem",
  background: "rgba(255,255,255,0.2)",
  borderRadius: "12px",
  padding: "8px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "white",
  fontWeight: 700,
  fontSize: "1.4rem",
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
};

const linksContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  fontWeight: 600,
  padding: "10px 16px",
  borderRadius: "25px",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap",
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  outline: "none",
};

const logoutBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontWeight: 600,
  background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
  color: "white",
  border: "none",
  borderRadius: "25px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(238, 90, 36, 0.4)",
  whiteSpace: "nowrap",
  outline: "none",
};



export default UserNavbar;
