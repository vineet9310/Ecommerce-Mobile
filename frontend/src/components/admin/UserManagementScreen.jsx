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
  Heading, // For the main heading
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiUserPlus } from 'react-icons/fi';
import {
  useGetUsersQuery, // RTK Query hook to fetch all users
  useDeleteUserMutation, // RTK Query hook to delete a user
  useUpdateUserMutation, // RTK Query hook to update a user
} from '../../slices/usersApiSlice';
// Correct Import: useRegisterUserMutation is imported from apiSlice.js
import { useRegisterUserMutation } from '../../slices/apiSlice';


const UserManagementScreen = () => {
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the user being edited
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control hooks
  const toast = useToast(); // Toast for notifications

  // Form state for the modal (Add/Edit User)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
    password: '', // Include password for creating new users
  });

  // ✅ Use useGetUsersQuery hook to fetch user data
  // data will contain the list of users, isLoading indicates fetching state, error for errors
  // refetch is a function to manually re-run the query (e.g., after mutations)
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();

  // ✅ useDeleteUserMutation hook
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // ✅ useUpdateUserMutation hook
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // ✅ Corrected hook declaration: Use the imported name useRegisterUserMutation
  const [createUser, { isLoading: isCreating }] = useRegisterUserMutation();


  // Handler for input field changes in the modal form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      // Handle checkbox input specifically for isAdmin
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to open the modal for editing a user
  const handleEdit = (user) => {
    setSelectedUser(user); // Set the user to be edited
    // Populate the form with the selected user's data
    setFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      password: '', // Password field should be empty when editing (password is usually updated separately)
    });
    onOpen(); // Open the modal
  };

  // Function to handle user deletion
  const handleDelete = async (userId) => {
    // Show a confirmation dialog before deleting
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Call the deleteUser mutation with the user ID
        await deleteUser(userId).unwrap();
        // Show a success toast notification
        toast({
          title: 'Success',
          description: 'User deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // ✅ Refetch the user list after successful deletion
        refetch();
      } catch (err) {
        // Show an error toast notification if deletion fails
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

  // Handler for submitting the form (Create or Update User)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        // If selectedUser exists, we are updating an existing user
        // Only send fields that are allowed to be updated (name, email, isAdmin)
        // Password update is typically a separate process
        await updateUser({ userId: selectedUser._id, userData: {
            name: formData.name,
            email: formData.email,
            isAdmin: formData.isAdmin,
            // Do NOT send password here unless your backend PUT allows it and you have a separate password field for updates
        }}).unwrap();
        toast({
          title: 'Success',
          description: 'User updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // If no selectedUser, we are creating a new user
        // Basic validation for new user creation
        if (!formData.name || !formData.email || !formData.password) {
             toast({
                title: 'Error',
                description: 'Please fill in all required fields (Name, Email, Password)',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return; // Stop submission if fields are empty
        }
        // Call the createUser mutation (assuming it's useRegisterUserMutation)
        await createUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            isAdmin: formData.isAdmin, // Include isAdmin status for new user
        }).unwrap();

        toast({
          title: 'Success',
          description: 'User created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose(); // Close the modal on success
      resetForm(); // Reset the form fields
      setSelectedUser(null); // Clear selected user
      // ✅ Refetch the user list after successful creation or update
      refetch();
    } catch (err) {
      // Show an error toast notification if save/create fails
      toast({
        title: 'Error',
        description: err?.data?.message || err.message || 'Failed to save user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to handle modal closing and reset form state
  const handleModalClose = () => {
    resetForm(); // Reset form fields
    setSelectedUser(null); // Clear selected user
    onClose(); // Close the modal
  };

  // Function to reset form state
  const resetForm = () => {
    setFormData({ name: '', email: '', isAdmin: false, password: '' });
  }

  // Show a spinner while loading data
  if (isLoading) return <Spinner size="xl" />;
  // Show an error message if fetching fails
  if (error) return <Alert status="error"><AlertIcon />{error?.data?.message || 'Failed to load users'}</Alert>;

  return (
    <Box p={4}>
      {/* Header with Add New User button */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h1" size="xl">User Management</Heading> {/* Main heading */}
        <Button leftIcon={<FiUserPlus />} colorScheme="green" onClick={() => {
            resetForm(); // Reset form for new user
            setSelectedUser(null); // Ensure no user is selected for edit
            onOpen(); // Open the modal
        }}>
          Add New User
        </Button>
      </Flex>

      {/* Table to display user data */}
      <Table variant="simple">
        <Thead>
          <Tr>
            {/* <Th>ID</Th> */}
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Map through the fetched users array */}
          {users.map((user) => (
            <Tr key={user._id}>
              {/* <Td>{user._id}</Td> */}
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                {/* Display Admin or User role using Badge */}
                <Badge colorScheme={user.isAdmin ? 'green' : 'blue'}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </Badge>
              </Td>
              <Td>
                {/* Edit Button */}
                <IconButton
                  icon={<FiEdit />}
                  aria-label="Edit user"
                  mr={2}
                  onClick={() => handleEdit(user)} // Call handleEdit on click
                />
                {/* Delete Button */}
                <IconButton
                  icon={<FiTrash2 />}
                  aria-label="Delete user"
                  colorScheme="red"
                  onClick={() => handleDelete(user._id)} // Call handleDelete on click
                  isLoading={isDeleting} // Show loading state while deleting
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for adding or editing users */}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser ? 'Edit User' : 'Add New User'} {/* Dynamic header */}
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
                    // Prevent changing email when editing? Depends on backend
                    // isDisabled={!!selectedUser}
                  />
                </FormControl>

                 {/* Password field only for adding new users */}
                 {!selectedUser && (
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                        />
                    </FormControl>
                 )}


                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Admin Status</FormLabel>
                  <Switch
                    name="isAdmin"
                    isChecked={formData.isAdmin}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                  />
                </FormControl>

                {/* Submit Button */}
                <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={isUpdating || isCreating} // Show loading state for update/create
                >
                  {selectedUser ? 'Update User' : 'Create User'} {/* Dynamic button text */}
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