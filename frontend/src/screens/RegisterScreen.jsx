import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterUserMutation } from '../slices/apiSlice'; // ✅ Corrected API Slice
import { setCredentials } from '../slices/authSlice';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
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

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const [registerUser, { isLoading }] = useRegisterUserMutation(); // ✅ RTK Query call

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const res = await registerUser({ name, email, password }).unwrap();
      // console.log('✅ API Response (Register):', res);
  
      dispatch(setCredentials(res)); // ✅ Save user to Redux
      localStorage.setItem('userInfo', JSON.stringify(res)); // ✅ Save to localStorage
  
      navigate(redirect);
    } catch (err) {
      console.error('❌ Registration Failed:', err);
      setError(err?.data?.message || err.error || 'An error occurred');
    }
  };
  
  
  

  return (
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
      <Stack align={'center'}>
        <Heading fontSize={'4xl'}>Create your account</Heading>
        <Text fontSize={'lg'} color={'gray.600'}>
          to enjoy all of our cool features ✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}
      >
        {error && (
          <Alert status='error' mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={submitHandler}>
          <Stack spacing={4}>
            <FormControl id='name'>
              <FormLabel>Name</FormLabel>
              <Input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <FormControl
              id='confirmPassword'
              isInvalid={password !== confirmPassword && confirmPassword.length > 0}
            >
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {password !== confirmPassword && confirmPassword.length > 0 && (
                <Text color='red.500' fontSize='sm'>Passwords do not match</Text>
              )}
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{ bg: 'blue.500' }}
                type='submit'
                isLoading={isLoading} // ✅ Loading state
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already have an account?{' '}
                <Link as={RouterLink} to='/login' color={'blue.400'}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
};

export default RegisterScreen;
