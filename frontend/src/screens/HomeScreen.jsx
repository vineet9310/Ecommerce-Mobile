import { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Badge,
  Stack,
  Heading,
  Container,
  Input,
  Select,
  HStack,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');

  const { data: productsData, isLoading, error } = useGetProductsQuery();

  // Extract products array from the API response
  const products = productsData?.products ? productsData.products : [];

  const sortProducts = (products) => {
    if (!products) return [];
    switch (sortBy) {
      case 'price':
        return [...products].sort((a, b) => a.price - b.price);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };

  const filteredProducts = sortProducts(
    products?.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
  );

  return (
    <Container maxW='container.xl' py={8}>
      <Stack spacing={8}>
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
          </Box>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error?.data?.message || error.error}
          </Alert>
        ) : (
          <>
            <HStack spacing={4}>
          <Input
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value='price'>Sort by Price</option>
            <option value='rating'>Sort by Rating</option>
            <option value='name'>Sort by Name</option>
          </Select>
        </HStack>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filteredProducts.map((product) => (
            <Box
              key={product._id}
              maxW='sm'
              borderWidth='1px'
              borderRadius='lg'
              overflow='hidden'
              _hover={{
                transform: 'translateY(-5px)',
                transition: 'all 0.2s ease-in-out',
                shadow: 'lg',
              }}
              as={RouterLink}
              to={`/product/${product._id}`}
            >
              <Image src={product.image} alt={product.name} />

              <Box p='6'>
                <Box display='flex' alignItems='baseline' gap={2}>
                  <Badge borderRadius='full' px='2' colorScheme='blue'>
                    {product.brand}
                  </Badge>
                  <Badge borderRadius='full' px='2' colorScheme='purple'>
                    {product.category}
                  </Badge>
                </Box>

                <Heading
                  mt='1'
                  fontSize='lg'
                  lineHeight='tight'
                  noOfLines={2}
                  color={useColorModeValue('gray.700', 'white')}
                >
                  {product.name}
                </Heading>

                <Text fontSize='sm' color='gray.600' noOfLines={2} mt={2}>
                  {product.description}
                </Text>

                <Stack spacing={2} mt={3}>
                  <Text fontSize='sm' fontWeight='bold'>
                    Key Specifications:
                  </Text>
                  <SimpleGrid columns={2} spacing={2} fontSize='xs'>
                    <Text>• {product.specifications['Display']}</Text>
                    <Text>• {product.specifications['Processor']}</Text>
                  </SimpleGrid>
                </Stack>

                <Box mt={3}>
                  <Text fontSize='xl' fontWeight='bold' color={useColorModeValue('blue.600', 'blue.300')}>
                    ${product.price.toFixed(2)}
                  </Text>
                  <Box display='flex' alignItems='center' mt={1}>
                    {Array(5)
                      .fill('')
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          color={i < product.rating ? 'yellow.400' : 'gray.300'}
                          boxSize={3}
                        />
                      ))}
                    <Text color='gray.600' fontSize='sm' ml={2}>
                      ({product.numReviews} reviews)
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default HomeScreen;