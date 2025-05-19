import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import { Container, Box, Flex } from "@chakra-ui/react";
import Header from "./components/Header"; // Ensure this path is correct
import Footer from "./components/Footer"; // Ensure this path is correct

import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";

import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProductManagementScreen from "./components/admin/ProductManagementScreen";
import UserManagementScreen from "./components/admin/UserManagementScreen";
import ReviewManagementScreen from "./components/admin/ReviewManagementScreen";

import PrivateRoute from "./screens/PrivateRoute";
import NotFoundScreen from "./screens/NotFoundScreen";
import Accessories from './components/user/Accessories'; // Import Accessories component

// Main App component that now includes logic to hide footer on admin pages
function AppContent() {
  const location = useLocation(); // Get current location
  const headerHeight = "60px"; // Define header height, matches minH in Header

  // Check if the current path starts with /admin
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Box as="main" flexGrow={1} pt={headerHeight} className="py-3">
        <Container maxW="container.xl" pb={isAdminPage ? 0 : 6}> {/* Adjust bottom padding based on footer visibility */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/accessories" element={<Accessories />} />

            {/* Protected Routes (User Specific) */}
            <Route
              path="/cart/:id?"
              element={
                <PrivateRoute>
                  <CartScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileScreen />
                </PrivateRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute admin={true}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <PrivateRoute admin={true}>
                  <AdminLayout>
                    <ProductManagementScreen />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute admin={true}>
                  <AdminLayout>
                    <UserManagementScreen />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <PrivateRoute admin={true}>
                  <AdminLayout>
                    <ReviewManagementScreen />
                  </AdminLayout>
                </PrivateRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </Container>
      </Box>
      {/* Conditionally render Footer */}
      {!isAdminPage && <Footer />}
    </Flex>
  );
}

// Wrap AppContent with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;