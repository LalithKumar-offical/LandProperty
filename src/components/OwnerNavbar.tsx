import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slice/authSlice";

const OwnerNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());  
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <div style={brandStyle}>
        <div style={logoStyle}>🏢</div>
        <h2 style={titleStyle}>Property Manager</h2>
      </div>

      <div style={linksContainerStyle}>
        <Link style={linkStyle} to="/owner/dashboard" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}>Dashboard</Link>
        <Link style={linkStyle} to="/owner/homes" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}>My Homes</Link>
        <Link style={linkStyle} to="/owner/lands" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}>My Lands</Link>
        <Link style={linkStyle} to="/owner/bids" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}>Bids Received</Link>
        <Link style={linkStyle} to="/owner/profile" onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'} onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}>Profile</Link>
        <button style={logoutBtnStyle} onClick={handleLogout} onFocus={(e) => e.target.style.transform = 'scale(1.05)'} onBlur={(e) => e.target.style.transform = 'scale(1)'}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  minHeight: "70px",
};

const brandStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoStyle: React.CSSProperties = {
  fontSize: "2rem",
  background: "rgba(255,255,255,0.1)",
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
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ecf0f1",
  fontWeight: 600,
  padding: "10px 16px",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
};

const logoutBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontWeight: 600,
  background: "linear-gradient(135deg, #e74c3c, #c0392b)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
  whiteSpace: "nowrap",
  outline: "none",
};

const badgeStyle: React.CSSProperties = {
  background: "#e74c3c",
  color: "white",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "12px",
  marginLeft: "8px",
  minWidth: "18px",
  textAlign: "center",
  display: "inline-block",
};

export default OwnerNavbar;
