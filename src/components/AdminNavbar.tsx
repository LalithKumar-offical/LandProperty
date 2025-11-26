import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slice/authSlice";

const AdminNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        background: "#faf7f2",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        boxSizing: "border-box",
        overflowX: "hidden",
        borderBottom: "1px solid #e6e0d9",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#4a4a4a",
          fontWeight: 700,
          fontSize: "1.3rem",
          flexShrink: 0,
        }}
      >
        Admin Dashboard
      </h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "10px",
          maxWidth: "100%",
        }}
      >
        <Link style={linkStyle} to="/admin/dashboard" onFocus={(e) => e.target.style.background = '#e6dcc9'} onBlur={(e) => e.target.style.background = 'transparent'}>Dashboard</Link>
        <Link style={linkStyle} to="/admin/approvals" onFocus={(e) => e.target.style.background = '#e6dcc9'} onBlur={(e) => e.target.style.background = 'transparent'}>Approvals</Link>
        <Link style={linkStyle} to="/admin/users" onFocus={(e) => e.target.style.background = '#e6dcc9'} onBlur={(e) => e.target.style.background = 'transparent'}>Manage Users</Link>
        <Link style={linkStyle} to="/admin/Logger" onFocus={(e) => e.target.style.background = '#e6dcc9'} onBlur={(e) => e.target.style.background = 'transparent'}>View Logs</Link>
        <Link style={linkStyle} to="/admin/filter" onFocus={(e) => e.target.style.background = '#e6dcc9'} onBlur={(e) => e.target.style.background = 'transparent'}>Filter</Link>
        <Link style={linkStyle} to="/admin/profile" onFocus={(e) => e.target.style.background = '#e6dcc9'} onBlur={(e) => e.target.style.background = 'transparent'}>Profile</Link>

        <button style={logoutBtnStyle} onClick={handleLogout} onFocus={(e) => e.target.style.transform = 'scale(1.05)'} onBlur={(e) => e.target.style.transform = 'scale(1)'}>
          Logout
        </button>
      </div>
    </nav>
  );
};


const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#6b4f2a",
  fontWeight: 600,
  padding: "8px 12px",
  borderRadius: "10px",
  transition: "0.2s",
  whiteSpace: "nowrap",
  outline: "none",
};

const logoutBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontWeight: 600,
  background: "linear-gradient(135deg, #b78a62, #8c6b42)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "0.2s",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
  whiteSpace: "nowrap",
  outline: "none",
};

export default AdminNavbar;
