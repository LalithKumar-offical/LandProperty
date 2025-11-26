import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminRoutes from "./routes/AdminRoutes";
import OwnerRoutes from "./routes/OwnerRoutes";
import UserRoutes from "./routes/UserRoutes";
import LandingPage from "./pages/LandingPage";

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();


  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/signup" element={<LandingPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/*"
          element={
            <ProtectedRoute allowedRoles={["PropertyOwner"]}>
              <OwnerRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <UserRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnFocusLoss={false}
      />
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
