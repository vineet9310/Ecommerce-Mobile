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
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../../slices/apiSlice';

const ProductManagementScreen = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brand: '',
    category: '',
    countInStock: '',
    description: '',
    image: ''
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
      image: product.image
    });
    onOpen();
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
          status: 'success',
          duration: 3000,
        });
        fetchProducts();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = selectedProduct
      ? `http://localhost:5000/api/products/${selectedProduct._id}`
      : 'http://localhost:5000/api/products';
    const method = selectedProduct ? 'PUT' : 'POST';

    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save product');

      toast({
        title: 'Success',
        description: `Product ${selectedProduct ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      onClose();
      fetchProducts();
      setFormData({
        name: '',
        price: '',
        brand: '',
        category: '',
        countInStock: '',
        description: '',
        image: ''
      });
      setSelectedProduct(null);
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
          setSelectedProduct(null);
          setFormData({
            name: '',
            price: '',
            brand: '',
            category: '',
            countInStock: '',
            description: '',
            image: ''
          });
          onOpen();
        }}>
          Add New Product
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Price</Th>
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
              <Td>${product.price}</Td>
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
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue">
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