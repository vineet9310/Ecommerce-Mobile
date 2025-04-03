import { useState } from 'react';
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
  Grid,
  AspectRatio,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
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

  // RTK Query hooks
  const { data, isLoading, error } = useGetProductsQuery({ page: currentPage });
  const products = data?.products || [];
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
    images: [], // Array of image URLs
    specifications: {}, // Required by backend
    features: [], // Optional array of features
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);

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
      category: product.category,
      countInStock: product.countInStock.toString(),
      description: product.description,
      images: product.images || [], // Initialize as array
      specifications: product.specifications || {},
      features: product.features || []
    });
    onOpen();
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId).unwrap();
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
          status: 'success',
          duration: 3000,
        });
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
    
    // Validate that at least one image URL is provided
    if (!formData.images || formData.images.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one product image URL is required',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Filter out empty image URLs
    const validImages = formData.images.filter(url => url && url.trim().length > 0);
    
    const productData = {
      ...formData,
      price: Number(formData.price),
      countInStock: Number(formData.countInStock),
      specifications: formData.specifications || {}, // Ensure specifications is included
      features: formData.features || [], // Ensure features is included
      images: validImages // Use filtered image URLs
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
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="blue" 
              onClick={handleAddNew}
            >
              Add New Product
            </Button>
          </Flex>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Images</Th>
                <Th>Brand</Th>
                <Th>Category</Th>
                <Th>Stock</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product._id}>
                  <Td>{product.name}</Td>
                  <Td>${product.price.toFixed(2)}</Td>
                  <Td>
                    <Box display="flex" gap={2}>
                      {product.images && product.images.map((image, index) => (
                        <Box key={index} position="relative">
                          <Image
                            src={image}
                            alt={`${product.name} image ${index + 1}`}
                            boxSize="50px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        </Box>
                      ))}
                    </Box>
                  </Td>
                  <Td>{product.brand}</Td>
                  <Td>{product.category}</Td>
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

          {/* Pagination Controls */}
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

                    <FormControl isRequired>
                      <FormLabel>Category</FormLabel>
                      <Input
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
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
                              isDisabled={index > 0 && !formData.images[index - 1]}
                            />
                            {formData.images[index] && (
                              <Box mt={2}>
                                <Image
                                  src={formData.images[index]}
                                  alt={`Product image ${index + 1}`}
                                  maxH="100px"
                                  objectFit="contain"
                                />
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Specifications</FormLabel>
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
                            // Allow invalid JSON while typing
                            setFormData(prev => ({
                              ...prev,
                              specifications: {}
                            }));
                          }
                        }}
                        placeholder='{"key": "value"}'
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Features (Optional)</FormLabel>
                      <Textarea
                        name="features"
                        value={formData.features.join('\n')}
                        onChange={(e) => {
                          const features = e.target.value
                            .split('\n')
                            .filter(f => f.trim());
                          setFormData(prev => ({
                            ...prev,
                            features
                          }));
                        }}
                        placeholder="Enter features (one per line)"
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
        </>
      )}
    </Box>
  );
};

export default ProductManagementScreen;