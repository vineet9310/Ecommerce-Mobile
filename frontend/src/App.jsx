import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboard from './screens/AdminDashboard';
import PrivateRoute from './screens/PrivateRoute';
import NotFoundScreen from './screens/NotFoundScreen';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './slices/cartSlice';

function App() {

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    }
  }, [userInfo, dispatch]);

  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container maxW='container.xl'>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart/:id?' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            
            {/* Protected Routes */}
            <Route path='/profile' element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
            <Route path='/admin/dashboard' element={<PrivateRoute admin><AdminDashboard /></PrivateRoute>} />

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
