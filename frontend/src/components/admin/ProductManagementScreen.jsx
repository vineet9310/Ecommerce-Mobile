import { useState, useMemo } from 'react';
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
  Spinner,
  ButtonGroup,
  Image,
  Text,
  Heading,
  Divider,
  Collapse, // Import Collapse component
  useColorModeValue, // Import useColorModeValue for styling
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'; // Import icons for toggle
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';

const ProductManagementScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // ✅ State to manage the visibility of each category section
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // RTK Query hook to fetch products with pagination
  const { data, isLoading, error, refetch } = useGetProductsQuery({ page: currentPage });
  // Extract products array from the API response
  const products = data?.products || [];

  // RTK Query mutations
  const [updateProduct] = useUpdateProductMutation();
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const initialFormState = {
    name: '',
    price: '',
    brand: '',
    category: '',
    countInStock: '',
    description: '',
    images: [],
    specifications: {},
    features: [],
  };

  // Form state for the modal
  const [formData, setFormData] = useState(initialFormState);

  // ✅ Group products by category using useMemo for performance
  const productsByCategory = useMemo(() => {
    const grouped = {};
    products.forEach(product => {
      const category = product.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [products]);

  // ✅ Function to toggle collapse state for a category
  const toggleCategoryCollapse = (category) => {
    setCollapsedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category], // Toggle the boolean value
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      brand: product.brand,
      category: product.category || '',
      countInStock: product.countInStock.toString(),
      description: product.description,
      images: product.images || [],
      specifications: product.specifications || {},
      features: product.features || []
    });
    onOpen();
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this user?')) { // Corrected confirmation message
      try {
        await deleteProduct(productId).unwrap();
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
          status: 'success',
          duration: 3000,
        });
        refetch(); // Refetch products after deletion
      } catch (err) {
        toast({
          title: 'Error',
          description: err?.data?.message || 'Failed to delete product',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.images || formData.images.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one product image URL is required',
        status: 'error',
        duration: 3000,
      });
      return;
    }

     if (!formData.category || formData.category.trim() === '') {
        toast({
            title: 'Error',
            description: 'Product category is required',
            status: 'error',
            duration: 3000,
        });
        return;
    }

    const validImages = formData.images.filter(url => url && url.trim().length > 0);

    const productData = {
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
      specifications: formData.specifications || {},
      features: formData.features || [],
      images: validImages
    };

    try {
      if (selectedProduct) {
        await updateProduct({
          id: selectedProduct._id,
          updatedProduct: productData
        }).unwrap();
      } else {
        await createProduct(productData).unwrap();
      }

      toast({
        title: 'Success',
        description: `Product ${selectedProduct ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      onClose();
      resetForm();
      refetch(); // Refetch products after creation/update
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.data?.message || 'Failed to save product',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddNew = () => {
    resetForm();
    onOpen();
  };

  return (
    <Box p={4}>
      {isLoading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Box color="red.500" textAlign="center">
          {error?.data?.message || 'Error loading products'}
        </Box>
      ) : (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading as="h1" size="xl">Product Management</Heading>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleAddNew}
            >
              Add New Product
            </Button>
          </Flex>

          {/* ✅ Render sections for each category */}
          {Object.keys(productsByCategory).length === 0 ? (
              <Text>No products found for the current page or categories.</Text> 
          ) : (
            Object.keys(productsByCategory).map(category => (
              <Box key={category} mb={10}>
                {/* ✅ Category Header with Toggle Button */}
                <Flex
                  align="center"
                  justify="space-between"
                  mb={4}
                  cursor="pointer" // Indicate it's clickable
                  onClick={() => toggleCategoryCollapse(category)} // Toggle collapse on click
                  p={2} // Add padding for click area
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }} // Hover effect
                  borderRadius="md" // Rounded corners
                >
                  <Heading as="h2" size="lg">
                    {category} ({productsByCategory[category].length})
                  </Heading>
                   {/* ✅ Show appropriate icon based on collapse state */}
                  {collapsedCategories[category] ? <ChevronDownIcon boxSize={6} /> : <ChevronUpIcon boxSize={6} />}
                </Flex>

                {/* ✅ Wrap the table in Collapse */}
                <Collapse in={!collapsedCategories[category]} animateOpacity> {/* 'in' prop controls visibility */}
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Price</Th>
                        <Th>Images</Th>
                        <Th>Brand</Th>
                        <Th>Stock</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {productsByCategory[category].map((product) => (
                        <Tr key={product._id}>
                          <Td>{product._id}</Td>
                          <Td>{product.name}</Td>
                          <Td>${product.price.toFixed(2)}</Td>
                          <Td>
                            <Box display="flex" gap={2}>
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={product.images[0]}
                                  alt={`${product.name} image`}
                                  boxSize="50px"
                                  objectFit="cover"
                                  borderRadius="md"
                                  onError={(e) => e.target.src = 'https://placehold.co/50x50/E2E8F0/A0AEC0?text=No+Image'}
                                />
                              ) : (
                                <Box boxSize="50px" bg="gray.200" display="flex" alignItems="center" justifyContent="center" borderRadius="md">
                                  <Text fontSize="xs" textAlign="center">No Image</Text>
                                </Box>
                              )}
                            </Box>
                          </Td>
                          <Td>{product.brand}</Td>
                          <Td>{product.countInStock}</Td>
                          <Td>
                            <IconButton
                              icon={<FiEdit />}
                              aria-label="Edit product"
                              mr={2}
                              onClick={() => handleEdit(product)}
                            />
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label="Delete product"
                              colorScheme="red"
                              onClick={() => handleDelete(product._id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Collapse>

                {/* Optional: Add a divider between categories */}
                {/* Only add divider if it's not the last category */}
                {Object.keys(productsByCategory).indexOf(category) < Object.keys(productsByCategory).length - 1 && (
                    <Divider mt={8} />
                )}
              </Box>
            ))
          )}


          {/* Pagination Controls - Applies to the fetched page, not individual categories */}
          {data && data.pages > 1 && (
            <ButtonGroup spacing={2} justifyContent="center" mt={8}>
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(data.pages).keys()].map(x => (
                <Button
                  key={x + 1}
                  onClick={() => setCurrentPage(x + 1)}
                  colorScheme={currentPage === x + 1 ? "blue" : "gray"}
                >
                  {x + 1}
                </Button>
              ))}
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.pages))}
                isDisabled={currentPage === data.pages}
              >
                Next
              </Button>
            </ButtonGroup>
          )}
        </>
      )}

      {/* Modal for Add/Edit Product */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? 'Edit Product' : 'Add New Product'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Price</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Brand</FormLabel>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </FormControl>

                {/* ✅ Category Input */}
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                     placeholder="e.g., Smartphones, Accessories"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Stock</FormLabel>
                  <Input
                    name="countInStock"
                    type="number"
                    min="0"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Image URLs (Max 6)</FormLabel>
                  <Stack spacing={2}>
                    {[...Array(6)].map((_, index) => (
                      <Box key={index} position="relative">
                        <Input
                          name={`images[${index}]`}
                          value={formData.images[index] || ''}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              images: newImages
                            }));
                          }}
                          placeholder={`Enter product image URL ${index + 1}`}
                          isDisabled={index > 0 && (!formData.images[index - 1] || formData.images[index - 1].trim() === '')}
                        />
                        {formData.images[index] && (
                          <Box mt={2}>
                            <Image
                              src={formData.images[index]}
                              alt={`Product image ${index + 1}`}
                              maxH="100px"
                              objectFit="contain"
                               onError={(e) => e.target.src = 'https://placehold.co/100x100/E2E8F0/A0AEC0?text=Invalid+URL'}
                            />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Specifications (JSON format)</FormLabel>
                  <Textarea
                    name="specifications"
                    value={JSON.stringify(formData.specifications, null, 2)}
                    onChange={(e) => {
                      try {
                        const specs = JSON.parse(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          specifications: specs
                        }));
                      } catch (err) {
                        console.error("Invalid JSON for specifications:", err);
                      }
                    }}
                    placeholder='{"Display": "6.5 inch", "Processor": "Snapdragon 8 Gen 1"}'
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Features (Optional - one per line)</FormLabel>
                  <Textarea
                    name="features"
                    value={formData.features.join('\n')}
                    onChange={(e) => {
                      const features = e.target.value
                        .split('\n')
                        .map(f => f.trim())
                        .filter(f => f.length > 0);
                      setFormData(prev => ({
                        ...prev,
                        features
                      }));
                    }}
                    placeholder="Feature 1\nFeature 2\nFeature 3"
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" mt={4}>
                  {selectedProduct ? 'Update' : 'Create'} Product
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductManagementScreen;
