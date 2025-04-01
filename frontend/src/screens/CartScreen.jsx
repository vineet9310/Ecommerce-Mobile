import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetCartQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
} from '../slices/cartApiSlice';
import { setCartItems } from '../slices/cartSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Link,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: cartData, isLoading, error, refetch } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const cartItems = useSelector((state) => state.cart.cartItems) || [];

  const [quantities, setQuantities] = useState({});

  // ✅ Initialize quantity state ONCE when cart loads
  useEffect(() => {
    if (cartData?.items) {
      dispatch(setCartItems(cartData.items));

      setQuantities((prev) => {
        const newQuantities = { ...prev };
        cartData.items.forEach((item) => {
          if (newQuantities[item.product._id] === undefined) {
            newQuantities[item.product._id] = item.quantity;
          }
        });
        return newQuantities;
      });
    } else if (error) {
      console.error('Cart fetch error:', error);
    }
  }, [cartData, error, dispatch]);

  const removeItemFromCart = async (productId) => {
    try {
      await removeFromCart(productId).unwrap();
      refetch();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item. Try again.');
    }
  };

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCart({ productId, quantity }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity.');
    }
  };

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) =>
        total +
        (item?.product?.price || 0) *
          (quantities[item.product._id] !== undefined
            ? quantities[item.product._id]
            : item.quantity),
      0
    );

  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      const timer = setTimeout(() => navigate('/'), 1500);
      return () => clearTimeout(timer);
    }
  }, [cartItems, isLoading, navigate]);

  if (isLoading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );

  if (error) {
    if (error.status === 401) {
      return (
        <Alert status="warning">
          <AlertIcon />
          Please{' '}
          <Link as={RouterLink} to="/login" color={'blue.400'}>
            login
          </Link>{' '}
          to view your cart
        </Alert>
      );
    }
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
          <Heading fontSize={'2xl'}>Shopping Cart ({cartItems.length} items)</Heading>
          {cartItems.length === 0 ? (
            <Text>Your cart is empty. Redirecting...</Text>
          ) : (
            <Stack spacing={6} divider={<StackDivider />}>
              {cartItems.map((item) => (
                <Flex key={item._id} align={'center'} justify={'space-between'}>
                  <Stack direction={'row'} spacing={5} align={'center'} flex={1}>
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={'100px'}
                      height={'100px'}
                      objectFit={'cover'}
                    />
                    <Box flex={1}>
                      <Text
                        fontSize={'lg'}
                        fontWeight={'medium'}
                        as={RouterLink}
                        to={`/product/${item.product._id}`}
                        _hover={{ color: 'blue.500' }}
                      >
                        {item.product.name}
                      </Text>
                      <Text color={'gray.600'}>${(item?.product?.price || 0).toFixed(2)}</Text>
                    </Box>

                    <NumberInput
                      size="sm"
                      maxW={20}
                      min={1}
                      max={item?.product?.countInStock || 0}
                      value={quantities[item.product._id] ?? item.quantity}
                      onChange={(_, valueAsNumber) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.product._id]: valueAsNumber,
                        }))
                      }
                      onBlur={() => {
                        const newQty = quantities[item.product._id];
                        const oldQty = item.quantity;
                        if (newQty && newQty !== oldQty) {
                          updateQty(item.product._id, newQty);
                        }
                      }}
                      clampValueOnBlur={false}
                      keepWithinRange={false}
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
                      onClick={() => removeItemFromCart(item.product._id)}
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
