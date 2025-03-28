import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCartQuery, useAddToCartMutation, useUpdateCartMutation, useRemoveFromCartMutation } from '../slices/cartApiSlice';
import { setCartItems } from '../slices/cartSlice';
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
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

  // Fetch cart from backend
  const { data: cartData, isLoading, error } = useGetCartQuery();
  console.log('Cart Data from API:', cartData); // Debugging

  // Set cart in Redux
  useEffect(() => {
    if (cartData && cartData.cartItems && cartData.cartItems.length > 0) {
      dispatch(setCartItems(cartData.cartItems)); // Use cartItems from API response
    } else {
      console.warn('Cart data is empty or undefined:', cartData); // Debugging
      dispatch(setCartItems([])); // Ensure Redux state is cleared if no data
    }
  }, [cartData, dispatch]);

  const { cartItems = [] } = useSelector((state) => state.cart);
  console.log('Cart Items in Redux:', cartItems); // Debugging

  // Remove item from cart
  const removeItemFromCart = async (id) => {
    try {
      await removeFromCart(id).unwrap();
      dispatch(setCartItems(cartItems.filter((item) => item._id !== id)));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  // Update quantity in cart
  const updateQty = async (id, qty) => {
    const item = cartItems.find((x) => x._id === id);
    if (item) {
      try {
        await updateCart({ productId: id, quantity: Number(qty) }).unwrap();
        dispatch(setCartItems(cartItems.map((x) => (x._id === id ? { ...x, qty: Number(qty) } : x))));
      } catch (error) {
        console.error('Error updating item quantity in cart:', error);
        alert('Failed to update item quantity. Please try again.');
      }
    } else {
      console.warn('Item not found in cart:', id); // Debugging
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && (!cartItems || cartItems.length === 0)) {
      console.warn('Cart is empty. Redirecting to home page.'); // Debugging
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [cartItems, isLoading, navigate]);

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

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
            Shopping Cart ({cartItems ? cartItems.length : 0} items)
          </Heading>
          {(!cartItems || cartItems.length === 0) ? (
            <Text>Your cart is empty. Redirecting...</Text>
          ) : (
            <Stack spacing={6} divider={<StackDivider />}>
              {cartItems.map((item) => (
                <Flex key={item._id} align={'center'} justify={'space-between'}>
                  <Stack direction={'row'} spacing={5} align={'center'} flex={1}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={'100px'}
                      height={'100px'}
                      objectFit={'cover'}
                    />
                    <Box flex={1}>
                      <Text
                        fontSize={'lg'}
                        fontWeight={'medium'}
                        as={RouterLink}
                        to={`/product/${item._id}`}
                        _hover={{ color: 'blue.500' }}
                      >
                        {item.name}
                      </Text>
                      <Text color={'gray.600'}>${item.price.toFixed(2)}</Text>
                    </Box>
                    <NumberInput
                      size='sm'
                      maxW={20}
                      min={1}
                      max={item.countInStock}
                      value={item.qty}
                      onChange={(valueString) => updateQty(item._id, Number(valueString))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <IconButton
                      icon={<DeleteIcon />}
                      variant={'ghost'}
                      colorScheme={'red'}
                      onClick={() => removeItemFromCart(item._id)}
                    />
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
              <Text>${cartItems ? getCartTotal().toFixed(2) : '0.00'}</Text>
            </Flex>
            <Flex justify={'space-between'}>
              <Text>Shipping</Text>
              <Text>Free</Text>
            </Flex>
            <Flex justify={'space-between'} fontWeight={'bold'}>
              <Text>Total</Text>
              <Text>${cartItems ? getCartTotal().toFixed(2) : '0.00'}</Text>
            </Flex>
            <Button
              colorScheme={'blue'}
              size={'lg'}
              isDisabled={!cartItems || cartItems.length === 0 || isLoading} // Disable during loading
            >
              Proceed to Checkout
            </Button>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default CartScreen;
