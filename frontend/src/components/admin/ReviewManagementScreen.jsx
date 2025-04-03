import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  useToast,
  IconButton,
  Flex,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

const ReviewManagementScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    productId: '',
    userName: '',
  });

  // Fetch reviews and products
  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment,
      productId: review.product._id,
      userName: review.user.name
    });
    onOpen();
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header here
          }
        });
        toast({
          title: 'Success',
          description: 'Review deleted successfully',
          status: 'success',
          duration: 3000,
        });
        fetchReviews();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete review',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = selectedReview
      ? `http://localhost:5000/api/reviews/${selectedReview._id}`
      : 'http://localhost:5000/api/reviews';
    const method = selectedReview ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header here
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save review');

      toast({
        title: 'Success',
        description: `Review ${selectedReview ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      onClose();
      fetchReviews();
      setFormData({
        rating: 5,
        comment: '',
        productId: '',
        userName: ''
      });
      setSelectedReview(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => {
          setSelectedReview(null);
          setFormData({
            rating: 5,
            comment: '',
            productId: '',
            userName: ''
          });
          onOpen();
        }}>
          Add New Review
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>User</Th>
            <Th>Rating</Th>
            <Th>Comment</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviews.map((review) => (
            <Tr key={review._id}>
              <Td>{review.product.name}</Td>
              <Td>{review.user.name}</Td>
              <Td>{review.rating}</Td>
              <Td>{review.comment}</Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  aria-label="Edit review"
                  mr={2}
                  onClick={() => handleEdit(review)}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  aria-label="Delete review"
                  colorScheme="red"
                  onClick={() => handleDelete(review._id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedReview ? 'Edit Review' : 'Add New Review'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Product</FormLabel>
                  <Select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Rating</FormLabel>
                  <NumberInput
                    max={5}
                    min={1}
                    value={formData.rating}
                    onChange={handleRatingChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>User Name</FormLabel>
                  <Input
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue">
                  {selectedReview ? 'Update' : 'Create'} Review
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReviewManagementScreen;