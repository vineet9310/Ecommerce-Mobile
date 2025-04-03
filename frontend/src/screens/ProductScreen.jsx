import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductQuery } from '../slices/productsApiSlice';
import { useAddToCartMutation } from '../slices/cartApiSlice';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons';

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
  List,
  ListItem,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  IconButton,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [addToCart] = useAddToCartMutation();
  const [qty, setQty] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data: product, isLoading, error } = useGetProductQuery(productId, {
    skip: !productId, // ✅ Ensure valid API call
  });

  const [selectedImage, setSelectedImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
      setImageError(false);
    } else if (product?.image) {
      setSelectedImage(product.image);
      setImageError(false);
    }
  }, [product]);

  const handleImageError = () => {
    setImageError(true);
    // Set a fallback image URL or handle the error state
    setSelectedImage('/images/fallback.png');
  };

  const handlePrevImage = () => {
    const currentIndex = product.images.indexOf(selectedImage);
    const newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setSelectedImage(product.images[newIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = product.images.indexOf(selectedImage);
    const newIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(product.images[newIndex]);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };


  const addToCartHandler = async () => {
    try {
      await addToCart({ product: productId, quantity: qty }).unwrap(); // ✅ Fixed payload format
      navigate('/cart');
    } catch (err) {
      setErrorMessage(err?.data?.message || err?.message || 'Something went wrong!');
    }
  };
  

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
        {error?.data?.message || error.error}
      </Alert>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Container maxW={'7xl'} py={12}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <Flex direction="column">
          <Flex>
            <Box w="100px" mr={4}>
              <VStack spacing={2} align="stretch">
                {product.images?.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    w="100%"
                    h="100px"
                    objectFit="cover"
                    cursor="pointer"
                    onClick={() => setSelectedImage(img)}
                    borderWidth={2}
                    borderColor={selectedImage === img ? 'blue.500' : 'transparent'}
                    borderRadius="md"
                    _hover={{ borderColor: 'blue.300' }}
                    onError={handleImageError}
                    fallback={<Box w="100%" h="100%" bg="gray.200" display="flex" alignItems="center" justifyContent="center"><Text>Image not available</Text></Box>}
                  />
                ))}
              </VStack>
            </Box>
            <Box flex={1}>
              <Image
                rounded={'md'}
                alt={product.name}
                src={selectedImage || product.image}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                h={{ base: '100%', sm: '400px', lg: '500px' }}
                cursor="pointer"
                onClick={() => setIsModalOpen(true)}
                onError={handleImageError}
                fallback={<Box w="100%" h="100%" bg="gray.200" display="flex" alignItems="center" justifyContent="center"><Text>Image not available</Text></Box>}
              />

              {/* Lightbox Modal */}
              {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="full" isCentered>
                  <ModalOverlay />
                  <ModalContent bg="rgba(0, 0, 0, 0.9)" position="relative">
                    <ModalCloseButton color="white" size="lg" position="absolute" right={4} top={4} zIndex={2} />
                    <ModalBody display="flex" alignItems="center" justifyContent="center" position="relative" p={0}>
                      {product.images && product.images.length > 1 && (
                        <>
                          <IconButton
                            aria-label="Previous image"
                            icon={<ChevronLeftIcon boxSize={8} />}
                            position="absolute"
                            left={4}
                            onClick={handlePrevImage}
                            colorScheme="whiteAlpha"
                            size="lg"
                            zIndex={2}
                          />
                          <IconButton
                            aria-label="Next image"
                            icon={<ChevronRightIcon boxSize={8} />}
                            position="absolute"
                            right={4}
                            onClick={handleNextImage}
                            colorScheme="whiteAlpha"
                            size="lg"
                            zIndex={2}
                          />
                        </>
                      )}
                      <Image
                        src={selectedImage}
                        alt={product.name}
                        maxH="90vh"
                        maxW="90vw"
                        objectFit="contain"
                      />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              )}
            </Box>
          </Flex>
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}
            >
              {product.name}
            </Heading>
            <Text
              color={useColorModeValue('gray.900', 'gray.400')}
              fontWeight={300}
              fontSize={'2xl'}
              mt={4}
            >
              ${product.price.toFixed(2)}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              />
            }
          >
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text fontSize={'lg'}>{product.description}</Text>
            </VStack>

            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Features
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <List spacing={2}>
                  {product.features?.map((feature, index) => (
                    <ListItem key={index}>{feature}</ListItem>
                  ))}
                </List>
              </SimpleGrid>
            </Box>

            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Specifications
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {Object.entries(product.specifications ?? {}).map(([key, value]) => (
                  <Box key={key}>
                    <Text fontWeight={'bold'}>{key}:</Text>
                    <Text>{value}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}
              >
                Product Details
              </Text>

              <Stack spacing={4}>
                <Box display='flex' alignItems='center'>
                  <Text fontWeight={'bold'} mr={2}>
                    Rating:
                  </Text>
                  <Box display='flex' alignItems='center'>
                    {Array(5)
                      .fill('')
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          color={i < product.rating ? 'yellow.400' : 'gray.300'}
                        />
                      ))}
                    <Text ml={2}>({product.numReviews} reviews)</Text>
                  </Box>
                </Box>
                <Box>
                  <Text fontWeight={'bold'} mb={2}>
                    Stock Status:
                  </Text>
                  <Text
                    color={
                      product.countInStock > 0 ? 'green.500' : 'red.500'
                    }
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </Box>
                {product.countInStock > 0 && (
                  <Box>
                    <Text fontWeight={'bold'} mb={2}>
                      Quantity:
                    </Text>
                    <NumberInput
                      max={product.countInStock}
                      min={1}
                      value={qty}
                      onChange={(value) => setQty(Number(value) || 1)}
                      >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>

          <Button
            rounded={'none'}
            w={'full'}
            mt={8}
            size={'lg'}
            py={'7'}
            bg={useColorModeValue('gray.900', 'gray.50')}
            color={useColorModeValue('white', 'gray.900')}
            textTransform={'uppercase'}
            _hover={{
              transform: 'translateY(2px)',
              boxShadow: 'lg',
            }}
            isDisabled={!product?.countInStock || product?.countInStock <= 0}
            onClick={addToCartHandler}
          >
            Add to cart
          </Button>

          <Stack
            direction='column'
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              />
            }
          >
            <Text
              fontSize={{ base: '16px', lg: '18px' }}
              color={useColorModeValue('yellow.500', 'yellow.300')}
              fontWeight={'500'}
              textTransform={'uppercase'}
              mb={'4'}
            >
              Reviews
            </Text>
            {product.reviews?.map((review, index) => (
              <Box key={index}>
                <Stack direction='row' spacing={2} mb={2}>
                  <Text fontWeight='bold'>{review.name}</Text>
                  <Text color='gray.500'>{review.date}</Text>
                </Stack>
                <Box display='flex' alignItems='center' mb={2}>
                  {Array(5)
                    .fill('')
                    .map((_, i) => (
                      <StarIcon
                        key={i}
                        color={i < review.rating ? 'yellow.400' : 'gray.300'}
                      />
                    ))}
                </Box>
                <Text>{review.comment}</Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default ProductScreen;