import React from "react";
import { Link } from "react-router-dom";

const GuestNavbar: React.FC = () => {
  return (
    <nav style={navStyle}>
      <h2 style={titleStyle}>LandProperty Portal</h2>
      <div style={linksStyle}>
        <Link style={linkStyle} to="/" onFocus={(e) => e.target.style.background = '#e0e0e0'} onBlur={(e) => e.target.style.background = 'transparent'}>Home</Link>
        <Link style={linkStyle} to="/login" onFocus={(e) => e.target.style.background = '#e0e0e0'} onBlur={(e) => e.target.style.background = 'transparent'}>Login</Link>
        <Link style={linkStyle} to="/register" onFocus={(e) => e.target.style.background = '#e0e0e0'} onBlur={(e) => e.target.style.background = 'transparent'}>Register</Link>
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  background: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#333",
  fontWeight: 700,
};

const linksStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#007bff",
  fontWeight: 600,
  padding: "8px 12px",
  borderRadius: "6px",
  transition: "0.2s",
  outline: "none",
};

export default GuestNavbar;
