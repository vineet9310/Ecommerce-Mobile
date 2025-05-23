import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginUserMutation } from '../slices/apiSlice';
import { setCredentials } from '../slices/authSlice';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  InputGroup,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); // Existing Redux state access

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/'; // Default redirect for regular users

  const [loginUser, { isLoading }] = useLoginUserMutation();

  useEffect(() => {
    // This useEffect handles redirection if user is *already* logged in
    // It should also consider admin status
    if (userInfo) {
        // Check if already logged in and is admin
        if (userInfo.isAdmin) {
            navigate('/admin/dashboard'); // Redirect admin to dashboard if already logged in
        } else {
            navigate(redirect); // Redirect regular user to default redirect if already logged in
        }
    }
  }, [navigate, redirect, userInfo]); // Added userInfo to dependency array

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginUser({ email, password }).unwrap();

      if (!res.token) {
        throw new Error('Invalid response, token missing!');
      }

      // ✅ Redux store update with token expiry
      // setCredentials expects { user, token, expiresIn }
      // Assuming backend response 'res' contains { user: { ... }, token: '...' }
      // Or sometimes the user object directly if no separate 'user' key
      const userData = res.user || res; // Adjust based on actual backend response structure

      dispatch(setCredentials({
        user: userData, // Use extracted user data
        token: res.token,
        expiresIn: 24 * 60 * 60 // 24 hours expiry
      }));

      // Log login success
      console.log('Login successful!', userData);

      // ✅ Check isAdmin status from the response data and navigate accordingly
      if (userData.isAdmin) {
        navigate('/admin/dashboard'); // Redirect admin to admin dashboard
      } else {
        navigate(redirect); // Redirect regular user to the intended page or home
      }

    } catch (err) {
      console.error('Login Error:', err);
      setError(err?.data?.message || err?.message || 'Invalid email or password');
    }
  };

  return (
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Stack align={'center'}>
        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          to enjoy all of our cool features ✌️
        </Text>
      </Stack>
      <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
        {error && (
          <Alert status='error' mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={submitHandler}>
          <Stack spacing={4}>
            {/* ✅ Email Input */}
            <FormControl id='email' isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && submitHandler(e)}
              />
            </FormControl>

            {/* ✅ Password Input with Toggle */}
            <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && submitHandler(e)}
                />
                <InputRightElement h={'full'}>
                  <Button variant={'ghost'} onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={10}>
              <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'space-between'}>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              {/* ✅ Login Button */}
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
                type='submit'
                isLoading={isLoading}
                isDisabled={!email || !password}
              >
                Sign in
              </Button>
            </Stack>

            {/* ✅ Register Link */}
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <Link as={RouterLink} to='/register' color={'blue.400'}>
                  Register
                </Link>
              </Text>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
};

export default LoginScreen;