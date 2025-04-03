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
  Stack,
  useToast,
  IconButton,
  Flex,
  Badge,
  Switch,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi';
import { 
  useGetUsersQuery, 
  useDeleteUserMutation, 
  useUpdateUserMutation 
} from '../../slices/usersApiSlice';

const UserManagementScreen = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
  });

  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    onOpen();
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast({
          title: 'Success',
          description: 'User deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: err?.data?.message || 'Failed to delete user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser({ userId: selectedUser._id, userData: formData }).unwrap();
        toast({
          title: 'Success',
          description: 'User updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Temporarily disable user creation or implement alternative
        toast({
          title: 'Error',
          description: 'User creation is currently unavailable',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      await createUser(formData).unwrap();

      toast({
        title: 'Success',
        description: `User ${selectedUser ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setFormData({ name: '', email: '', isAdmin: false });
      setSelectedUser(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.data?.message || err.message || 'Failed to save user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleModalClose = () => {
    setFormData({ name: '', email: '', isAdmin: false });
    setSelectedUser(null);
    onClose();
  };

  if (isLoading) return <Spinner size="xl" />;
  if (error) return <Alert status="error"><AlertIcon />{error?.data?.message || 'Failed to load users'}</Alert>;

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" mb={4}>
        <Button leftIcon={<FiUserPlus />} colorScheme="green" onClick={onOpen}>
          Add New User
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Badge colorScheme={user.isAdmin ? 'green' : 'blue'}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </Badge>
              </Td>
              <Td>
                <IconButton
                  icon={<FiEdit />}
                  aria-label="Edit user"
                  mr={2}
                  onClick={() => handleEdit(user)}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  aria-label="Delete user"
                  colorScheme="red"
                  onClick={() => handleDelete(user._id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser ? 'Edit User' : 'Add New User'}
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
                    placeholder="Enter user name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Admin Status</FormLabel>
                  <Switch
                    name="isAdmin"
                    isChecked={formData.isAdmin}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  {selectedUser ? 'Update' : 'Create'} User
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagementScreen;