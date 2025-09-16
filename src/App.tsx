// src/App.jsx

import { AuthProvider, useAuth } from "./contexts/authContext";
import { FilterProvider } from "./contexts/FilterContext"; // <-- Import the FilterProvider
import PrelineInitializer from "./utils/PrelineInitializer";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LayoutProvider } from "./contexts/layoutContext";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Admin from "./pages/Admin";
import Inventory from "./pages/Inventory";
import ItemDetails from "./pages/Inventory/ItemDetails";
import AddItem from "./pages/Inventory/AddItem";
import SalesDB from "./pages/SalesDB";
import SetUpPassword from "./pages/auth/SetUpPassword";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LayoutProvider>
          <FilterProvider> 
            <PrelineInitializer />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<RedirectIfLoggedIn />} />
              <Route path="/set-password" element={<SetUpPassword />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  {/* Dashboard */}
                  <Route index element={<Dashboard />} />

                  {/* Inventory Routes */}
                  <Route element={<ProtectedRoute page="inventory" />}>
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="inventory/:itemId" element={<ItemDetails />} />
                  </Route>

                  <Route element={<ProtectedRoute page="inventory" />}>
                    <Route path="inventory/add" element={<AddItem />} />
                  </Route>

                  {/* Sales Routes */}
                  <Route element={<ProtectedRoute page="sales" />}>
                    <Route path="sales-database" element={<SalesDB />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute page="admin" />}>
                    <Route path="admin" element={<Admin />} />
                  </Route>
                </Route>
              </Route>

              {/* Redirect all other paths to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
          </FilterProvider>
        </LayoutProvider>
      </AuthProvider>
    </Router>
  );
}

function RedirectIfLoggedIn() {
  const { userLoggedIn, loading } = useAuth();

  if (loading) return null;

  return userLoggedIn ? <Navigate to="/" replace /> : <Login />;
}

export default App;