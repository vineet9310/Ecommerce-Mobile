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
  Stack,
  useToast,
  IconButton,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useCreateUserMutation } from '../../slices/apiSlice';

const UserManagementScreen = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
  });

  // RTK Query hooks
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error?.data?.message || 'Failed to delete user',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await updateUser({ userId: selectedUser._id, userData: formData }).unwrap();
      } else {
        await createUser(formData).unwrap();
      }

      toast({
        title: 'Success',
        description: `User ${selectedUser ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      onClose();
      setFormData({
        name: '',
        email: '',
        isAdmin: false,
      });
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.data?.message || error.message || 'Failed to save user',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={4}>
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

      <Modal isOpen={isOpen} onClose={onClose}>
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
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Admin Status</FormLabel>
                  <Input
                    name="isAdmin"
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue">
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