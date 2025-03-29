import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCartQuery, useUpdateCartMutation, useRemoveFromCartMutation } from '../slices/cartApiSlice';
import { setCartItems } from '../slices/cartSlice';
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: cartData, isLoading, error, refetch } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  useEffect(() => {
    if (cartData?.items) {
      dispatch(setCartItems(cartData.items));
    }
  }, [cartData, dispatch]);

  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const removeItemFromCart = async (id) => {
    try {
      await removeFromCart(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item. Try again.');
    }
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await updateCart({ id, qty }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity.');
    }
  };

  const getCartTotal = () => cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      const timer = setTimeout(() => navigate('/'), 1500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, isLoading, navigate]);

  if (isLoading) return <Box textAlign="center" py={10}><Spinner size="xl" /></Box>;

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error?.data?.message || 'Failed to load cart'}
      </Alert>
    );
  }

  return (
    <Container maxW={'7xl'} py={12}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <Stack spacing={6}>
          <Heading fontSize={'2xl'}>
            Shopping Cart ({cartItems.length} items)
          </Heading>
          {cartItems.length === 0 ? (
            <Text>Your cart is empty. Redirecting...</Text>
          ) : (
            <Stack spacing={6} divider={<StackDivider />}>
              {cartItems.map((item) => (
                <Flex key={item._id} align={'center'} justify={'space-between'}>
                  <Stack direction={'row'} spacing={5} align={'center'} flex={1}>
                    <Image src={item.image} alt={item.name} width={'100px'} height={'100px'} objectFit={'cover'} />
                    <Box flex={1}>
                      <Text fontSize={'lg'} fontWeight={'medium'} as={RouterLink} to={`/product/${item._id}`} _hover={{ color: 'blue.500' }}>
                        {item.name}
                      </Text>
                      <Text color={'gray.600'}>${item.price.toFixed(2)}</Text>
                    </Box>
                    <NumberInput size='sm' maxW={20} min={1} max={item.countInStock} value={item.qty}
                      onChange={(value) => updateQty(item._id, Number(value))}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <IconButton icon={<DeleteIcon />} variant={'ghost'} colorScheme={'red'} onClick={() => removeItemFromCart(item._id)} />
                  </Stack>
                </Flex>
              ))}
            </Stack>
          )}
        </Stack>

        <Stack spacing={6}>
          <Heading fontSize={'2xl'}>Order Summary</Heading>
          <Stack spacing={4}>
            <Flex justify={'space-between'}>
              <Text>Subtotal</Text>
              <Text>${getCartTotal().toFixed(2)}</Text>
            </Flex>
            <Flex justify={'space-between'}>
              <Text>Shipping</Text>
              <Text>Free</Text>
            </Flex>
            <Flex justify={'space-between'} fontWeight={'bold'}>
              <Text>Total</Text>
              <Text>${getCartTotal().toFixed(2)}</Text>
            </Flex>
            <Button colorScheme={'blue'} size={'lg'} isDisabled={cartItems.length === 0 || isLoading}>
              Proceed to Checkout
            </Button>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default CartScreen;
