import { useState } from 'react';
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
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const cartItems = [
  {
    id: 1,
    name: 'iPhone 13 Pro',
    image: 'https://placehold.co/300x400',
    price: 999.99,
    qty: 1,
    countInStock: 10,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S21',
    image: 'https://placehold.co/300x400',
    price: 799.99,
    qty: 2,
    countInStock: 5,
  },
];

const CartScreen = () => {
  const [items, setItems] = useState(cartItems);

  const removeFromCart = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQty = (id, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, qty: parseInt(value) } : item
      )
    );
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.qty, 0);
  };

  return (
    <Container maxW={'7xl'} py={12}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <Stack spacing={6}>
          <Heading fontSize={'2xl'}>Shopping Cart ({items.length} items)</Heading>
          {items.length === 0 ? (
            <Text>Your cart is empty</Text>
          ) : (
            <Stack spacing={6} divider={<StackDivider />}>
              {items.map((item) => (
                <Flex key={item.id} align={'center'} justify={'space-between'}>
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
                        to={`/product/${item.id}`}
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
                      onChange={(value) => updateQty(item.id, value)}
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
                      onClick={() => removeFromCart(item.id)}
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
              <Text>${itemsPrice.toFixed(2)}</Text>
            </Flex>
            <Flex justify={'space-between'}>
              <Text>Shipping</Text>
              <Text>Free</Text>
            </Flex>
            <Flex justify={'space-between'} fontWeight={'bold'}>
              <Text>Total</Text>
              <Text>${itemsPrice.toFixed(2)}</Text>
            </Flex>
            <Button
              colorScheme={'blue'}
              size={'lg'}
              isDisabled={items.length === 0}
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