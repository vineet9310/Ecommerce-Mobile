import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Heading, Text, Button, Stack, Input, FormControl, FormLabel } from '@chakra-ui/react';

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  
  const updateProfileHandler = () => {
    alert('Profile update functionality will be implemented soon.');
  };

  return (
    <Box maxW="lg" mx="auto" mt={10} p={5} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading as="h2" size="xl" mb={5}>Profile</Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} isReadOnly />
        </FormControl>
        <Button colorScheme="blue" onClick={updateProfileHandler}>Update Profile</Button>
      </Stack>
    </Box>
  );
};

export default ProfileScreen;
