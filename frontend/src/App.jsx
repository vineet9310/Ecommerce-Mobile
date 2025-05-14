import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';

import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';

import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import the new AdminLayout
import AdminLayout from './components/admin/AdminLayout';
// Import specific Admin Screens
import AdminDashboard from './components/admin/AdminDashboard';
import ProductManagementScreen from './components/admin/ProductManagementScreen';
import UserManagementScreen from './components/admin/UserManagementScreen';
import ReviewManagementScreen from './components/admin/ReviewManagementScreen';

import PrivateRoute from './screens/PrivateRoute';
import NotFoundScreen from './screens/NotFoundScreen';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function App() {
  const userInfo = useSelector((state) => state.auth?.userInfo);

  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container maxW='container.xl'> {/* Keep Container for general page content */}
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomeScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />

            {/* Protected Routes (User Specific) */}
            {/* Cart route wrapped with PrivateRoute */}
            <Route path='/cart/:id?' element={<PrivateRoute><CartScreen /></PrivateRoute>} />
            <Route path='/cart' element={<PrivateRoute><CartScreen /></PrivateRoute>} />
            {/* Profile route wrapped with PrivateRoute */}
            <Route path='/profile' element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />

            {/* Protected Admin Routes - Wrapped with PrivateRoute AND AdminLayout */}
            {/* Admin Dashboard */}
            <Route
              path='/admin/dashboard'
              element={
                <PrivateRoute admin={true}>
                  <AdminLayout> {/* Use AdminLayout */}
                    <AdminDashboard /> {/* Pass the specific screen as children */}
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            {/* Product Management */}
            <Route
              path='/admin/products'
              element={
                <PrivateRoute admin={true}>
                   <AdminLayout> {/* Use AdminLayout */}
                    <ProductManagementScreen /> {/* Pass the specific screen as children */}
                  </AdminLayout>
                </PrivateRoute>
              }
            />
             {/* User Management */}
             <Route
              path='/admin/users'
              element={
                <PrivateRoute admin={true}>
                   <AdminLayout> {/* Use AdminLayout */}
                    <UserManagementScreen /> {/* Pass the specific screen as children */}
                  </AdminLayout>
                </PrivateRoute>
              }
            />
             {/* Review Management */}
             <Route
              path='/admin/reviews'
              element={
                <PrivateRoute admin={true}>
                   <AdminLayout> {/* Use AdminLayout */}
                    <ReviewManagementScreen /> {/* Pass the specific screen as children */}
                  </AdminLayout>
                </PrivateRoute>
              }
            />


            {/* 404 Page */}
            <Route path='*' element={<NotFoundScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
