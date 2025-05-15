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
  Spinner, // Added for loading state
  Alert,   // Added for error display
  AlertIcon // Added for error display
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux'; // Import useSelector to get user token

// TODO: Consider refactoring to use RTK Query for consistency
// For now, we'll fix the direct fetch calls.

const ReviewManagementScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Get user info from Redux state to access the token
  const { userInfo } = useSelector((state) => state.auth);

  // Loading and error states for fetching
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [fetchError, setFetchError] = useState(null);


  // Form state
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    productId: '', // This will be used in the URL for creation
    // userName: '', // Backend uses req.user.name, so this might be for display or if backend changes
  });

  // Fetch products (for the dropdown)
  useEffect(() => {
    const fetchProductsForDropdown = async () => {
      try {
        // Assuming your productsApiSlice can be used or you have a direct fetch
        const response = await fetch('http://localhost:5000/api/products'); // Adjust if paginated
        if (!response.ok) {
          throw new Error('Failed to fetch products for dropdown');
        }
        const data = await response.json();
        setProducts(data.products || []); // Ensure it handles if data.products is not an array
      } catch (error) {
        console.error('Error fetching products for dropdown:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products for selection.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchProductsForDropdown();
  }, [toast]);


  // Fetch reviews (This will also 404 if /api/reviews GET doesn't exist)
  // For now, focusing on the POST issue. You'll need a backend endpoint for GET /api/reviews
  // or adjust this to fetch reviews per product or all reviews via a different mechanism.
  useEffect(() => {
    const fetchAllReviews = async () => {
      setIsLoadingReviews(true);
      setFetchError(null);
      try {
        // Placeholder: You need a backend endpoint that provides all reviews.
        // For example, GET /api/admin/reviews (if you create one)
        // Or iterate through all products and their reviews (less efficient).
        // This is a common issue if you don't have a dedicated "all reviews" endpoint.
        // For now, this might fail if GET /api/reviews isn't implemented.
        // const response = await fetch('http://localhost:5000/api/reviews', { // THIS WILL LIKELY 404
        //   headers: {
        //     'Authorization': `Bearer ${userInfo?.token}`,
        //   },
        // });
        // if (!response.ok) throw new Error('Failed to fetch reviews');
        // const data = await response.json();
        // setReviews(data);

        // TEMPORARY: Simulate empty reviews until GET endpoint is fixed/created
        console.warn("Review fetching at /api/reviews is likely to fail. Implement backend or adjust fetch logic.");
        setReviews([]);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setFetchError(error.message);
        toast({
          title: 'Error',
          description: 'Failed to fetch reviews. Ensure backend endpoint exists for GET /api/reviews or similar.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingReviews(false);
      }
    };
    if (userInfo?.token) { // Only fetch if logged in
        fetchAllReviews();
    }
  }, [toast, userInfo?.token]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (valueAsString, valueAsNumber) => {
    setFormData(prev => ({
      ...prev,
      rating: valueAsNumber
    }));
  };

  const handleEdit = (review) => {
    // This part assumes review object structure includes product._id and user.name
    // This might need adjustment based on how reviews are fetched/structured
    setSelectedReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment,
      productId: review.product?._id || review.productId || '', // Ensure productId is correctly populated
      // userName: review.user?.name || review.userName || ''
    });
    onOpen();
  };

  const handleDelete = async (reviewId, productId) => {
    // Deleting a review typically requires knowing which product it belongs to,
    // as reviews are often sub-documents. The backend route would be like DELETE /api/products/:productId/reviews/:reviewId
    // This current ReviewManagementScreen doesn't seem to have a route for this.
    if (window.confirm('Are you sure you want to delete this review? This functionality requires a specific backend endpoint (e.g., for deleting a review from a product).')) {
      try {
        // Example: await fetch(`http://localhost:5000/api/products/${productId}/reviews/${reviewId}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${userInfo?.token}`,
        //   }
        // });
        toast({
          title: 'Info',
          description: 'Review deletion endpoint not yet fully implemented on backend for this screen.',
          status: 'info',
          duration: 3000,
        });
        // fetchAllReviews(); // Call the corrected fetch function
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

    if (!formData.productId && !selectedReview) {
        toast({
            title: 'Error',
            description: 'Product ID is required to create a review.',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    // Construct URL based on whether it's a create or update
    // For CREATE (POST): /api/products/:productId/reviews
    // For UPDATE (PUT): /api/products/:productId/reviews/:reviewId (Backend needs this route)
    let url;
    let method;
    let body;

    if (selectedReview) {
      // UPDATE Review (Backend route for this needs to be defined, e.g., PUT /api/products/:productId/reviews/:reviewId)
      // url = `http://localhost:5000/api/products/${selectedReview.product._id}/reviews/${selectedReview._id}`; // Example
      // method = 'PUT';
      // body = JSON.stringify({ rating: formData.rating, comment: formData.comment }); // Only send what can be updated
      toast.info("Review update functionality not yet fully implemented on the backend for this screen.");
      return; // Prevent submission for now
    } else {
      // CREATE Review
      url = `http://localhost:5000/api/products/${formData.productId}/reviews`;
      method = 'POST';
      // The backend createProductReview expects { rating, comment }
      // It gets user info from req.user.
      body = JSON.stringify({ rating: formData.rating, comment: formData.comment });
    }

    if (!userInfo || !userInfo.token) {
        toast({ title: "Authentication Error", description: "You must be logged in.", status: "error", duration: 3000 });
        return;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`, // ✅ ADDED Authorization header
        },
        body: body
      });

      const responseData = await response.json(); // Attempt to parse JSON regardless of status for error messages

      if (!response.ok) {
        // Use message from backend if available, otherwise throw generic error
        throw new Error(responseData.message || `Failed to ${selectedReview ? 'update' : 'create'} review. Status: ${response.status}`);
      }

      toast({
        title: 'Success',
        description: `Review ${selectedReview ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      // fetchAllReviews(); // Call the corrected fetch function for all reviews
      setFormData({ rating: 5, comment: '', productId: '', userName: '' }); // Reset form
      setSelectedReview(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Render logic
  if (isLoadingReviews) return <Flex justify="center" align="center" minH="200px"><Spinner size="xl" /></Flex>;
  if (fetchError && reviews.length === 0) return <Alert status="error"><AlertIcon />{fetchError}</Alert>;


  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => {
          setSelectedReview(null);
          setFormData({ rating: 5, comment: '', productId: '', userName: '' });
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
          {reviews.length === 0 && !isLoadingReviews && (
            <Tr><Td colSpan={5} textAlign="center">No reviews found. (Note: GET /api/reviews might not be implemented on backend)</Td></Tr>
          )}
          {reviews.map((review) => (
            <Tr key={review._id}>
              {/* Adjust based on actual review object structure */}
              <Td>{review.product?.name || 'N/A'}</Td>
              <Td>{review.user?.name || review.name || 'N/A'}</Td> 
              <Td>{review.rating}</Td>
              <Td>{review.comment}</Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  aria-label="Edit review"
                  mr={2}
                  onClick={() => handleEdit(review)}
                  isDisabled // Update functionality is placeholder
                />
                <IconButton
                  icon={<FiTrash2 />}
                  aria-label="Delete review"
                  colorScheme="red"
                  onClick={() => handleDelete(review._id, review.product?._id)}
                  isDisabled // Delete functionality placeholder
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
                {!selectedReview && ( // Only show product selection when creating
                  <FormControl isRequired>
                    <FormLabel>Product</FormLabel>
                    <Select
                      name="productId"
                      value={formData.productId}
                      onChange={handleInputChange}
                      placeholder="Select a product"
                    >
                      {products.map(product => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <FormControl isRequired>
                  <FormLabel>Rating</FormLabel>
                  <NumberInput
                    max={5}
                    min={1}
                    value={formData.rating}
                    onChange={handleRatingChange} // Use the updated handler
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