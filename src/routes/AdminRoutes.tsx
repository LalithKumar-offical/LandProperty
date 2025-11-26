import { Routes, Route } from "react-router-dom";

import AdminDashboardPage from "../pages/Dashboard/AdminDashboardPage";
import AdminApprovalsPage from "../pages/Admin/AdminApprovalsPage";
import ManageUsersPage from "../pages/Admin/ManageUsersPage";
import AdminLogsPage from "../pages/Admin/AdminLogsPage";
import AdminFilterPage from "../pages/Admin/AdminFilterPage";
import AdminProfilePage from "../pages/Admin/AdminProfilePage";
    
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboardPage />} />
      <Route path="approvals" element={<AdminApprovalsPage />} />
      <Route path="users" element={<ManageUsersPage />} />
      <Route path="Logger" element={<AdminLogsPage />} />
      <Route path="filter" element={<AdminFilterPage />} />
      <Route path="profile" element={<AdminProfilePage />} />
      
    </Routes>
  );
};

export default AdminRoutes;
